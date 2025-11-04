import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Typography,
  Tag,
  Flex,
  Button,
  Skeleton,
  Empty,
  Avatar,
  message,
  ConfigProvider,
  theme as antdTheme,
  type ThemeConfig,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { IAppointmentFullDetail } from "@/types/appointment";
import { getMyAppointmentByIdAPI } from "@/modules/client/services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<IAppointmentFullDetail | null>(
    null
  );

  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getMyAppointmentByIdAPI(id);
        setAppointment(res?.data ?? null);
      } catch {
        message.error("Không thể tải chi tiết lịch hẹn");
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const statusTag = useMemo(() => {
    const s = (appointment?.status || "").toLowerCase();
    switch (s) {
      case "confirmed":
        return <Tag color="green">Đã xác nhận</Tag>;
      case "pending":
        return <Tag color="gold">Chờ xác nhận</Tag>;
      case "cancelled":
      case "canceled":
        return <Tag color="red">Đã hủy</Tag>;
      case "completed":
        return <Tag color="blue">Hoàn tất</Tag>;
      default:
        return <Tag>Trạng thái</Tag>;
    }
  }, [appointment?.status]);

  const apptTimeVN = appointment
    ? dayjs.utc(appointment.appointmentDateTime).tz("Asia/Ho_Chi_Minh")
    : null;

  const startTimeVN = appointment?.schedule?.timeSlots?.[0]?.timeSlot?.startTime
    ? dayjs
        .utc(appointment.schedule.timeSlots[0].timeSlot.startTime)
        .format("HH:mm")
    : "";

  const endTimeVN = appointment?.schedule?.timeSlots?.[0]?.timeSlot?.endTime
    ? dayjs
        .utc(appointment.schedule.timeSlots[0].timeSlot.endTime)
        .format("HH:mm")
    : "";

  // ✅ Ant Design theme override để đồng bộ dark mode
  const localTheme: ThemeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorBgBase: isDark ? "#0D1224" : "#ffffff",
      colorBgContainer: isDark ? "#0f1b2d" : "#ffffff",
      colorText: isDark ? "#e5e7eb" : "#0f172a",
      colorTextSecondary: isDark ? "#9ca3af" : "#64748b",
      colorBorder: isDark ? "#1f2a3a" : "#e5e7eb",
      borderRadiusLG: 12,
      colorPrimary: "#1677ff",
    },
  };

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#0D1224]" : "bg-white"
        }`}
      >
        <Skeleton active />
      </div>
    );

  if (!appointment)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#0D1224]" : "bg-white"
        }`}
      >
        <Empty description="Không tìm thấy lịch hẹn" />
      </div>
    );

  return (
    <ConfigProvider theme={localTheme}>
      <div className={`${isDark ? "bg-[#0D1224]" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* ---------- Header ---------- */}
          <Card className="shadow-sm mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  size={72}
                  src={appointment.doctor?.avatarUrl || undefined}
                  icon={<UserOutlined />}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Title level={4} className={isDark ? "text-white" : ""}>
                      {appointment.doctor?.fullName}
                    </Title>
                    {statusTag}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm mt-1 flex-wrap ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    <Tag>{appointment.doctor?.title || "—"}</Tag>
                    <span>•</span>
                    <Tag className="!bg-violet-500 !text-white">
                      {appointment.doctor?.specialty?.specialtyName || "—"}
                    </Tag>
                    <span>•</span>
                    <Tag color="blue-inverse">
                      {appointment.doctor?.clinic?.clinicName || "—"}
                    </Tag>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Mã lịch hẹn
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Text code>{appointment.id.slice(0, 8)}</Text>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() =>
                      navigator.clipboard.writeText(appointment.id)
                    }
                  />
                </div>
                <div className="mt-2 text-sm text-blue-500">
                  {apptTimeVN?.format("DD/MM/YYYY")}, {startTimeVN} -{" "}
                  {endTimeVN}
                </div>
              </div>
            </div>
          </Card>

          {/* ---------- Grid ---------- */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-6">
              <Card title="Thông tin thời gian">
                <Flex gap={12} align="center" className="mb-2">
                  <CalendarOutlined className={isDark ? "text-gray-300" : ""} />
                  <Text className={isDark ? "!text-gray-200" : ""}>
                    {apptTimeVN?.format("DD/MM/YYYY")} •{" "}
                    {apptTimeVN?.format("dddd")}
                  </Text>
                </Flex>

                <Flex gap={12} align="center">
                  <ClockCircleOutlined
                    className={isDark ? "text-gray-300" : ""}
                  />
                  <Text className={isDark ? "!text-gray-200" : ""}>
                    {startTimeVN} - {endTimeVN}
                  </Text>
                </Flex>
              </Card>

              <Card title="Thông tin bệnh nhân">
                <Descriptions column={1} size="middle">
                  <Descriptions.Item label="Họ tên">
                    {appointment.patient?.patientName}
                  </Descriptions.Item>

                  <Descriptions.Item label="Điện thoại">
                    <Flex gap={8} align="center">
                      <PhoneOutlined />
                      {appointment.patient?.patientPhone}
                    </Flex>
                  </Descriptions.Item>

                  <Descriptions.Item label="Email">
                    <Flex gap={8} align="center">
                      <MailOutlined />
                      {appointment.patient?.patientEmail || "—"}
                    </Flex>
                  </Descriptions.Item>

                  <Descriptions.Item label="Giới tính">
                    {appointment.patient?.patientGender === "Male"
                      ? "Nam"
                      : "Nữ"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày sinh">
                    {dayjs(appointment.patient?.patientDateOfBirth).format(
                      "DD/MM/YYYY"
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Địa chỉ">
                    {appointment.patient?.patientAddress}
                  </Descriptions.Item>

                  <Descriptions.Item label="Lý do khám">
                    {appointment.patient?.reason || "—"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card title="Thông tin bác sĩ">
                <Flex gap={16} align="center" className="mb-3">
                  <Avatar
                    size={64}
                    src={appointment.doctor?.avatarUrl}
                    icon={<UserOutlined />}
                  />

                  <div>
                    <div
                      className={`font-medium text-base ${
                        isDark ? "text-white" : ""
                      }`}
                    >
                      {appointment.doctor?.fullName}
                    </div>
                    <div className={isDark ? "text-gray-300" : "text-gray-500"}>
                      {appointment.doctor?.title}
                    </div>
                  </div>
                </Flex>

                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Điện thoại">
                    {appointment.doctor?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chuyên khoa">
                    {appointment.doctor?.specialty?.specialtyName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cơ sở">
                    {appointment.doctor?.clinic?.clinicName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ cơ sở">
                    {[
                      appointment.doctor?.clinic?.street,
                      appointment.doctor?.clinic?.district,
                      appointment.doctor?.clinic?.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card>
                <Flex justify="space-between" align="center">
                  <Text className={isDark ? "!text-gray-300" : ""}>
                    Phí khám
                  </Text>
                  <Text className={isDark ? "!text-gray-100" : ""} strong>
                    {new Intl.NumberFormat("vi-VN").format(
                      parseInt(appointment.totalFee)
                    )}{" "}
                    VNĐ
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center" className="mt-2">
                  <Text className={isDark ? "!text-gray-300" : ""}>
                    Thanh toán
                  </Text>
                  <Tag
                    color={
                      appointment.paymentStatus === "Paid" ? "green" : "orange"
                    }
                  >
                    {appointment.paymentStatus === "Paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </Tag>
                </Flex>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AppointmentDetailPage;
