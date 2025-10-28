import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Progress,
  Badge,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCurrentApp } from "@/components/contexts/app.context";
import type { ColumnsType } from "antd/es/table";
import {
  getAllAppointmentsByUserIdDoctor,
  fetchRatingByDoctorIdAPI,
  getDoctorProfileByUserId,
} from "../services/doctor.api";
import type { IAppointment } from "@/types";

const { Title, Text } = Typography;

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  averageRating: number;
  totalReviews: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentAppointment extends IAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  appointmentTime: string;
  status: string;
  reason: string;
}

const DoctorDashboardPage = () => {
  const { user } = useCurrentApp();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    averageRating: 0,
    totalReviews: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<
    RecentAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // First, get doctor profile to get doctorId
        const doctorProfileRes = await getDoctorProfileByUserId(user.id);
        const doctorId = doctorProfileRes.data?.id;

        if (!doctorId) {
          throw new Error("Cannot get doctor profile");
        }

        // Fetch appointments and ratings in parallel
        const [appointmentsRes, ratingRes] = await Promise.all([
          getAllAppointmentsByUserIdDoctor(`${user.id}?page=1&pageSize=100`),
          fetchRatingByDoctorIdAPI(doctorId),
        ]);

        // Process appointments
        const appointments = appointmentsRes.data?.result || [];

        // Calculate statistics
        const totalAppointments = appointments.length;

        // Get today's date for filtering
        const today = new Date().toISOString().split("T")[0];

        const todayAppointments = appointments.filter((apt) => {
          const aptDate = new Date(apt.appointmentDateTime)
            .toISOString()
            .split("T")[0];
          return aptDate === today;
        }).length;

        const pendingAppointments = appointments.filter(
          (apt) => apt.status?.toUpperCase() === "PENDING"
        ).length;

        const completedAppointments = appointments.filter(
          (apt) => apt.status?.toUpperCase() === "COMPLETED"
        ).length;

        // Get rating stats
        const averageRating = ratingRes.data?.ratingStats || {
          avgScore: 0,
          totalReviews: 0,
        };

        // Update stats
        setStats({
          totalAppointments,
          todayAppointments,
          pendingAppointments,
          completedAppointments,
          averageRating: (averageRating?.avgScore as number) || 0,
          totalReviews: (averageRating?.totalReviews as number) || 0,
          totalMessages: 0, // TODO: Get from message API
          unreadMessages: 0, // TODO: Get from message API
        });

        // Get recent appointments (last 10)
        const recent = appointments
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 10)
          .map((apt) => ({
            ...apt,
            id: apt.id,
            patientName: apt.patient?.patientName || "N/A",
            patientPhone: apt.patient?.patientPhone || "N/A",
            appointmentTime: apt.appointmentDateTime,
            status: apt.status || "PENDING",
            reason: apt.patient?.reason || "N/A",
          }));

        setRecentAppointments(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const appointmentColumns: ColumnsType<RecentAppointment> = [
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.patientPhone}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {new Date(time).toLocaleString("vi-VN")}
        </Space>
      ),
    },
    {
      title: "Lý do khám",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) {
          return <Tag color="default">N/A</Tag>;
        }

        // Convert to lowercase for matching
        const statusLower = status.toLowerCase();

        const statusConfig: Record<string, { color: string; text: string }> = {
          pending: { color: "orange", text: "Chờ xác nhận" },
          confirmed: { color: "blue", text: "Đã xác nhận" },
          completed: { color: "green", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
          no_show: { color: "volcano", text: "Không đến" },
        };

        const config = statusConfig[statusLower] || {
          color: "default",
          text: status,
        };

        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          Chào mừng trở lại, Dr. {user?.email?.split("@")[0] || "Bác sĩ"}
        </Title>
        <Text type="secondary">
          Đây là tổng quan về hoạt động của bạn hôm nay
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng cuộc hẹn"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={Math.round(
                  (stats.pendingAppointments / stats.totalAppointments) * 100
                )}
                size="small"
                showInfo={false}
                strokeColor="#faad14"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cuộc hẹn chờ xác nhận"
              value={stats.pendingAppointments}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={Math.round(
                  (stats.pendingAppointments / stats.totalAppointments) * 100
                )}
                size="small"
                showInfo={false}
                strokeColor="#faad14"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đánh giá trung bình"
              value={stats.averageRating}
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix="/ 5.0"
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">
                {stats.averageRating > 0
                  ? `Từ ${stats.totalReviews} đánh giá`
                  : "Chưa có đánh giá"}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin nhắn"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Badge count={stats.unreadMessages} size="small">
                <Text type="secondary">Chưa đọc: {stats.unreadMessages}</Text>
              </Badge>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Hành động nhanh" style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Link to="/doctor/schedule">
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                block
                style={{ height: "60px" }}
              >
                Quản lý lịch trình
              </Button>
            </Link>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Link to="/doctor/appointments">
              <Button icon={<UserOutlined />} block style={{ height: "60px" }}>
                Xem cuộc hẹn
              </Button>
            </Link>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Link to="/doctor/messages">
              <Button
                icon={<MessageOutlined />}
                block
                style={{ height: "60px" }}
              >
                Tin nhắn
              </Button>
            </Link>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Link to="/doctor/ratings">
              <Button icon={<StarOutlined />} block style={{ height: "60px" }}>
                Đánh giá
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      {/* Recent Appointments */}
      <Card
        title="Cuộc hẹn gần đây"
        extra={
          <Link to="/doctor/appointments">
            <Button type="link">Xem tất cả</Button>
          </Link>
        }
      >
        <Table
          columns={appointmentColumns}
          dataSource={recentAppointments}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
        />
      </Card>

      {/* Today's Schedule Preview */}
      <Card title="Lịch trình hôm nay" style={{ marginTop: "24px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CalendarOutlined
                style={{ fontSize: "48px", color: "#1890ff" }}
              />
              <div style={{ marginTop: "12px" }}>
                <Title level={4}>Cuộc hẹn sắp tới</Title>
                <Text type="secondary">
                  Bạn có {stats.todayAppointments} cuộc hẹn hôm nay
                </Text>
              </div>
              <Link to="/doctor/schedule">
                <Button type="primary" style={{ marginTop: "12px" }}>
                  Xem lịch trình
                </Button>
              </Link>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <MessageOutlined style={{ fontSize: "48px", color: "#722ed1" }} />
              <div style={{ marginTop: "12px" }}>
                <Title level={4}>Tin nhắn mới</Title>
                <Text type="secondary">
                  Bạn có {stats.unreadMessages} tin nhắn chưa đọc
                </Text>
              </div>
              <Link to="/doctor/messages">
                <Button type="primary" style={{ marginTop: "12px" }}>
                  Xem tin nhắn
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;
