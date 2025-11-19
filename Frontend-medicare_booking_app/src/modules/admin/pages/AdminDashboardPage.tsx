import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Space, Typography } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getAllUsers,
  getAllDoctorsProfile,
  getAllPatientsProfile,
  getAllSpecialties,
  getNotificationByUserId,
} from "../services/admin.api";
import axios from "services/axios.customize";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalSpecialties: number;
  pendingDoctors: number;
  activeDoctors: number;
}

interface RecentDoctor {
  key: string;
  name: string;
  specialty: string;
  status: string;
  joinDate: string;
}

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalSpecialties: 0,
    pendingDoctors: 0,
    activeDoctors: 0,
  });
  const [recentDoctors, setRecentDoctors] = useState<RecentDoctor[]>([]);
  const currentApp = useCurrentApp();

  // derived quick stats (computed from additional endpoints)
  const [derivedQuickStats, setDerivedQuickStats] = useState({
    activeUsersCount: 0,
    todayAppointments: 0,
    recentRatings: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      // request more users so we can compute active users count
      const [usersRes, doctorsRes, patientsRes, specialtiesRes] =
        await Promise.all([
          getAllUsers("current=1&pageSize=1000"),
          getAllDoctorsProfile("current=1&pageSize=100"),
          getAllPatientsProfile("current=1&pageSize=1000"),
          getAllSpecialties("current=1&pageSize=1000"),
        ]);

      // Calculate stats
      const doctorsData = doctorsRes.data?.result || [];

      const pendingCount = doctorsData.filter(
        (d: any) => d.approvalStatus === "Pending" || d.status === "pending"
      ).length;
      const activeCount = doctorsData.filter(
        (d: any) => d.approvalStatus === "Approved" || d.status === "approved"
      ).length;

      setStats({
        totalUsers: usersRes.data?.meta?.total || 0,
        totalDoctors: doctorsRes.data?.meta?.total || 0,
        totalPatients: patientsRes.data?.meta?.total || 0,
        totalSpecialties: specialtiesRes.data?.meta?.total || 0,
        pendingDoctors: pendingCount,
        activeDoctors: activeCount,
      });

      // Format recent doctors data - Sắp xếp theo ngày tạo mới nhất
      const sortedDoctors = [...doctorsData].sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
        const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });

      const formattedDoctors: RecentDoctor[] = sortedDoctors
        .slice(0, 5)
        .map((doctor: any, index: number) => {
          // Lấy tên bác sĩ - thử nhiều trường hợp khác nhau
          let fullName = "";
          
          // Trường hợp 1: fullName đã có sẵn
          if (doctor.fullName) {
            fullName = doctor.fullName;
          }
          // Trường hợp 2: Lấy từ userInfo
          else if (doctor.userInfo) {
            const firstName = doctor.userInfo.first_name || doctor.userInfo.firstName || "";
            const lastName = doctor.userInfo.last_name || doctor.userInfo.lastName || "";
            fullName = `${firstName} ${lastName}`.trim();
          }
          // Trường hợp 3: Lấy từ user
          else if (doctor.user) {
            const firstName = doctor.user.first_name || doctor.user.firstName || "";
            const lastName = doctor.user.last_name || doctor.user.lastName || "";
            fullName = `${firstName} ${lastName}`.trim();
          }
          // Trường hợp 4: Lấy trực tiếp
          else {
            const firstName = doctor.first_name || doctor.firstName || "";
            const lastName = doctor.last_name || doctor.lastName || "";
            fullName = `${firstName} ${lastName}`.trim();
          }

          // Lấy tên chuyên khoa
          let specialtyName = "Chưa cập nhật";
          if (doctor.specialty?.specialtyName) {
            specialtyName = doctor.specialty.specialtyName;
          } else if (doctor.specialty?.specialty_name) {
            specialtyName = doctor.specialty.specialty_name;
          } else if (doctor.specialtyName) {
            specialtyName = doctor.specialtyName;
          }

          // Format ngày tham gia
          let joinDate = "N/A";
          const dateField = doctor.createdAt || doctor.created_at;
          if (dateField) {
            try {
              const date = new Date(dateField);
              joinDate = date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            } catch (e) {
              joinDate = "N/A";
            }
          }

          // Xử lý status
          let status = "pending";
          if (doctor.approvalStatus) {
            status = doctor.approvalStatus.toLowerCase();
          } else if (doctor.status) {
            status = doctor.status.toLowerCase();
          }

          return {
            key: doctor.id || doctor.doctor_id || index.toString(),
            name: fullName || "Chưa cập nhật",
            specialty: specialtyName,
            status: status,
            joinDate: joinDate,
          };
        });

      setRecentDoctors(formattedDoctors);

      // Additional quick-stats: active users, today's appointments, recent ratings, unread notifications
      try {
        // active users: count isActive from usersRes
        const usersList = usersRes.data?.result || [];
        const activeUsersCount = usersList.filter(
          (u: any) => u.isActive
        ).length;

        // today's appointments: try backend filter by date (fall back to 0 on error)
        let todayAppointments = 0;
        try {
          const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
          const apptRes = await axios.get(
            `/api/appointment/appointments?date=${today}&current=1&pageSize=1`
          );
          todayAppointments = apptRes.data?.meta?.total || 0;
        } catch (err) {
          // backend may not support date filter; ignore silently
          todayAppointments = 0;
        }

        // recent ratings: try a generic ratings list endpoint
        let recentRatings = 0;
        try {
          const ratingRes = await axios.get(
            `/api/rating?current=1&pageSize=10`
          );
          recentRatings =
            ratingRes.data?.meta?.total || ratingRes.data?.data?.length || 0;
        } catch (err) {
          recentRatings = 0;
        }

        // unread notifications for current admin user
        let unreadNotifications = 0;
        try {
          const currentUser = currentApp?.user;
          if (currentUser?.id) {
            const notiRes = await getNotificationByUserId(currentUser.id);
            const notis = notiRes.data || [];
            unreadNotifications = notis.filter((n: any) => !n.isRead).length;
          }
        } catch (err) {
          unreadNotifications = 0;
        }

        // set small derived values into UI areas that previously used hardcoded numbers
        setDerivedQuickStats({
          activeUsersCount,
          todayAppointments,
          recentRatings,
          unreadNotifications,
        });
      } catch (err) {
        console.warn("Could not compute some quick-stats:", err);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<RecentDoctor> = [
    {
      title: "Tên Bác Sĩ",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Chuyên Khoa",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let text = status;

        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
          case "approved":
            color = "success";
            text = "Đã Duyệt";
            break;
          case "pending":
            color = "warning";
            text = "Chờ Duyệt";
            break;
          case "rejected":
            color = "error";
            text = "Từ Chối";
            break;
          default:
            color = "default";
            text = status || "Không xác định";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Ngày Tham Gia",
      dataIndex: "joinDate",
      key: "joinDate",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-2">
          Dashboard Quản Trị
        </Title>
        <Text type="secondary">Tổng quan hệ thống Medicare Booking</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Tổng Người Dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: "#1890ff" }}
              loading={loading}
            />
            <div className="mt-2">
              <Space>
                <RiseOutlined className="text-green-500" />
                <Text type="secondary" className="text-xs">
                  +12% so với tháng trước
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Bác Sĩ Hoạt Động"
              value={stats.activeDoctors}
              prefix={<MedicineBoxOutlined className="text-green-500" />}
              valueStyle={{ color: "#52c41a" }}
              loading={loading}
            />
            <div className="mt-2">
              <Space>
                <RiseOutlined className="text-green-500" />
                <Text type="secondary" className="text-xs">
                  {stats.pendingDoctors} bác sĩ chờ duyệt
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Bệnh Nhân"
              value={stats.totalPatients}
              prefix={<TeamOutlined className="text-purple-500" />}
              valueStyle={{ color: "#722ed1" }}
              loading={loading}
            />
            <div className="mt-2">
              <Space>
                <RiseOutlined className="text-green-500" />
                <Text type="secondary" className="text-xs">
                  +8% so với tháng trước
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Chuyên Khoa"
              value={stats.totalSpecialties}
              prefix={<CalendarOutlined className="text-orange-500" />}
              valueStyle={{ color: "#fa8c16" }}
              loading={loading}
            />
            <div className="mt-2">
              <Space>
                <FallOutlined className="text-red-500" />
                <Text type="secondary" className="text-xs">
                  Không đổi
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Doctors Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <MedicineBoxOutlined />
                <span>Bác Sĩ Đăng Ký Gần Đây</span>
              </Space>
            }
            bordered={false}
            className="shadow-sm"
          >
            <Table
              columns={columns}
              dataSource={recentDoctors}
              loading={loading}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card title="Thống Kê Nhanh" bordered={false} className="shadow-sm">
            <Space direction="vertical" className="w-full" size="large">
              <div className="flex justify-between items-center">
                <Text>Tổng số bác sĩ:</Text>
                <Text strong className="text-lg">
                  {stats.totalDoctors}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Bác sĩ đã duyệt:</Text>
                <Text strong className="text-lg text-green-600">
                  {stats.activeDoctors}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Bác sĩ chờ duyệt:</Text>
                <Text strong className="text-lg text-orange-600">
                  {stats.pendingDoctors}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Tỷ lệ duyệt:</Text>
                <Text strong className="text-lg text-blue-600">
                  {stats.totalDoctors > 0
                    ? `${(
                        (stats.activeDoctors / stats.totalDoctors) *
                        100
                      ).toFixed(1)}%`
                    : "0%"}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Hoạt Động Hệ Thống"
            bordered={false}
            className="shadow-sm"
          >
            <Space direction="vertical" className="w-full" size="large">
              <div className="flex justify-between items-center">
                <Text>Người dùng hoạt động:</Text>
                <Text strong className="text-lg text-green-600">
                  {derivedQuickStats.activeUsersCount ||
                    Math.floor(stats.totalUsers * 0.75)}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Lịch hẹn hôm nay:</Text>
                <Text strong className="text-lg text-blue-600">
                  {derivedQuickStats.todayAppointments || 0}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Đánh giá mới:</Text>
                <Text strong className="text-lg text-purple-600">
                  {derivedQuickStats.recentRatings || 0}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Thông báo chưa đọc:</Text>
                <Text strong className="text-lg text-orange-600">
                  {derivedQuickStats.unreadNotifications || 0}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
