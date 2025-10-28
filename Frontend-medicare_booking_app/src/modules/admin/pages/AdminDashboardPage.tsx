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
} from "../services/admin.api";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [usersRes, doctorsRes, patientsRes, specialtiesRes] =
        await Promise.all([
          getAllUsers("current=1&pageSize=1"),
          getAllDoctorsProfile("current=1&pageSize=10"),
          getAllPatientsProfile("current=1&pageSize=1"),
          getAllSpecialties("current=1&pageSize=1"),
        ]);

      // Calculate stats
      const doctorsData = doctorsRes.data?.result || [];
      const pendingCount = doctorsData.filter(
        (d: any) => d.status === "pending"
      ).length;
      const activeCount = doctorsData.filter(
        (d: any) => d.status === "approved"
      ).length;

      setStats({
        totalUsers: usersRes.data?.meta?.total || 0,
        totalDoctors: doctorsRes.data?.meta?.total || 0,
        totalPatients: patientsRes.data?.meta?.total || 0,
        totalSpecialties: specialtiesRes.data?.meta?.total || 0,
        pendingDoctors: pendingCount,
        activeDoctors: activeCount,
      });

      // Format recent doctors data
      const formattedDoctors: RecentDoctor[] = doctorsData
        .slice(0, 5)
        .map((doctor: any, index: number) => ({
          key: doctor.doctor_id || index.toString(),
          name:
            `${doctor.user?.first_name || ""} ${
              doctor.user?.last_name || ""
            }`.trim() || "N/A",
          specialty: doctor.specialty?.specialty_name || "N/A",
          status: doctor.status || "pending",
          joinDate: doctor.createdAt
            ? new Date(doctor.createdAt).toLocaleDateString("vi-VN")
            : "N/A",
        }));

      setRecentDoctors(formattedDoctors);
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

        switch (status) {
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
                  {Math.floor(stats.totalUsers * 0.75)}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Lịch hẹn hôm nay:</Text>
                <Text strong className="text-lg text-blue-600">
                  24
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Đánh giá mới:</Text>
                <Text strong className="text-lg text-purple-600">
                  18
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Thông báo chưa đọc:</Text>
                <Text strong className="text-lg text-orange-600">
                  5
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
