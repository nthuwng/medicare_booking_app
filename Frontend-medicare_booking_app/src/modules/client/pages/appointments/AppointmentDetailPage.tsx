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
  ConfigProvider,
  theme as antdTheme,
  type ThemeConfig,
  Alert,
  Space,
  App,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { IAppointmentFullDetail } from "@/types/appointment";
import {
  getMyAppointmentByIdAPI,
  cancelAppointmentAPI,
} from "@/modules/client/services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<IAppointmentFullDetail | null>(
    null
  );
  const { message, modal } = App.useApp(); // Use App hooks for message and modal

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

  // Kiểm tra có thể hủy hay không (12h trước giờ hẹn - theo backend)
  const canCancel = useMemo(() => {
    if (!appointment) return false;
    const status = (appointment.status || "").toLowerCase();
    // Chỉ cho phép hủy khi status là Pending hoặc Confirmed
    if (status !== "pending" && status !== "confirmed") return false;

    // Kiểm tra thời gian 12h (backend yêu cầu)
    const appointmentTime = dayjs.utc(appointment.appointmentDateTime);
    const now = dayjs();
    const hoursDiff = appointmentTime.diff(now, "hour");

    return hoursDiff >= 12;
  }, [appointment]);

  // Hiển thị modal xác nhận hủy lịch
  const handleCancelAppointment = () => {
    if (!appointment) return;

    modal.confirm({
      title: "Xác nhận hủy lịch hẹn",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: (
        <div className="space-y-3">
          <Alert
            message="Chính sách hủy lịch"
            description={
              <div className="space-y-2 text-sm">
                <div>
                  • Lịch hẹn chỉ được hủy <strong>trước 12 giờ</strong>
                </div>
                <div>• Sau khi hủy, bạn có thể đặt lịch mới với bác sĩ</div>
                {appointment.paymentStatus === "Paid" &&
                  appointment.payment?.gateway === "VNPAY" && (
                    <>
                      <div>
                        • Hoàn tiền VNPay sẽ được xử lý tự động trong{" "}
                        <strong>3-5 ngày làm việc</strong>
                      </div>
                      <div>
                        • Số tiền hoàn:{" "}
                        <strong>
                          {new Intl.NumberFormat("vi-VN").format(
                            parseInt(appointment.totalFee)
                          )}{" "}
                          VNĐ
                        </strong>
                      </div>
                    </>
                  )}
                {appointment.payment?.gateway === "CASH" && (
                  <div>
                    • Thanh toán tiền mặt: Không cần hoàn tiền, lịch hẹn sẽ được
                    hủy ngay
                  </div>
                )}
              </div>
            }
            type="warning"
            showIcon
          />
          <div className="text-center pt-2">
            <Text strong>Bạn có chắc chắn muốn hủy lịch hẹn này?</Text>
          </div>
        </div>
      ),
      okText: "Xác nhận hủy",
      cancelText: "Giữ lại lịch hẹn",
      okButtonProps: {
        danger: true,
        loading: cancelling,
      },
      cancelButtonProps: {
        type: "primary",
      },
      onOk: async () => {
        try {
          setCancelling(true);

          // Call API hủy lịch hẹn
          const response = await cancelAppointmentAPI(appointment.id);

          // Hiển thị notification dựa trên gateway và refund status
          const payment = response.data;

          if (
            payment?.payment.gateway === "VNPAY" &&
            payment?.payment.refundProcessed
          ) {
            message.success({
              content: (
                <div>
                  <div className="font-semibold">
                    ✅ Đã hủy lịch hẹn và hoàn tiền thành công!
                  </div>
                  <div className="text-sm mt-1">
                    Tiền sẽ về tài khoản trong 3-5 ngày làm việc
                  </div>
                </div>
              ),
              duration: 5,
            });
          } else if (
            payment?.payment.gateway === "VNPAY" &&
            payment?.payment.refundRequired
          ) {
            message.info({
              content: (
                <div>
                  <div className="font-semibold">
                    ⏳ Đã hủy lịch hẹn và đang xử lý hoàn tiền
                  </div>
                  <div className="text-sm mt-1">
                    Vui lòng kiểm tra lại sau ít phút
                  </div>
                </div>
              ),
              duration: 5,
            });
          } else if (payment?.payment.gateway === "CASH") {
            message.success({
              content: (
                <div>
                  <div className="font-semibold">
                    ✅ Đã hủy lịch hẹn thành công!
                  </div>
                  <div className="text-sm mt-1">
                    Thanh toán tiền mặt không cần hoàn tiền
                  </div>
                </div>
              ),
              duration: 4,
            });
          } else {
            message.success({
              content: "✅ Đã hủy lịch hẹn thành công!",
              duration: 3,
            });
          }

          // Navigate về danh sách appointments sau 2 giây
          setTimeout(() => {
            navigate("/my-appointments");
          }, 2000);
        } catch (error: any) {
          console.error("❌ Cancel appointment error:", error);

          // Hiển thị error message từ backend
          const errorMessage =
            error?.response?.data?.message ||
            "Không thể hủy lịch hẹn. Vui lòng thử lại!";

          message.error({
            content: (
              <div>
                <div className="font-semibold">❌ Hủy lịch hẹn thất bại</div>
                <div className="text-sm mt-1">{errorMessage}</div>
              </div>
            ),
            duration: 5,
          });
        } finally {
          setCancelling(false);
        }
      },
      width: 520,
    });
  };

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

              <Card title="Thông tin thanh toán" className="shadow-sm">
                <div className="space-y-3">
                  {/* Tổng chi phí */}
                  <Flex justify="space-between" align="center">
                    <Text className={isDark ? "!text-gray-300" : ""}>
                      Tổng chi phí
                    </Text>
                    <Text
                      className={isDark ? "!text-gray-100" : ""}
                      strong
                      style={{ fontSize: "16px" }}
                    >
                      {new Intl.NumberFormat("vi-VN").format(
                        parseInt(appointment.totalFee)
                      )}{" "}
                      VNĐ
                    </Text>
                  </Flex>

                  {/* Trạng thái thanh toán */}
                  <Flex justify="space-between" align="center">
                    <Text className={isDark ? "!text-gray-300" : ""}>
                      Trạng thái
                    </Text>
                    <Tag
                      color={
                        appointment.paymentStatus === "Paid"
                          ? "green"
                          : "orange"
                      }
                      style={{ fontSize: "13px", padding: "4px 12px" }}
                    >
                      {appointment.paymentStatus === "Paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Tag>
                  </Flex>

                  {/* Phương thức thanh toán */}
                  {appointment.payment && (
                    <>
                      <Flex justify="space-between" align="center">
                        <Text className={isDark ? "!text-gray-300" : ""}>
                          Phương thức
                        </Text>
                        <Tag
                          color={
                            appointment.payment.gateway === "VNPAY"
                              ? "blue"
                              : "green"
                          }
                          style={{ fontSize: "13px", padding: "4px 12px" }}
                        >
                          {appointment.payment.gateway === "VNPAY"
                            ? "Thanh toán VNPay"
                            : "Tiền mặt"}
                        </Tag>
                      </Flex>

                      {/* Mã giao dịch */}
                      <Flex justify="space-between" align="center">
                        <Text className={isDark ? "!text-gray-300" : ""}>
                          Mã giao dịch
                        </Text>
                        <div className="flex items-center gap-2">
                          <Text
                            code
                            className="!text-xs"
                            style={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {appointment.payment.txnRef?.slice(0, 20)}...
                          </Text>
                          <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                appointment.payment?.txnRef || ""
                              );
                              message.success("Đã copy mã giao dịch!");
                            }}
                          />
                        </div>
                      </Flex>

                      {/* Ngày tạo */}
                      <Flex justify="space-between" align="center">
                        <Text className={isDark ? "!text-gray-300" : ""}>
                          Ngày tạo
                        </Text>
                        <Text className={isDark ? "!text-gray-200" : ""}>
                          {dayjs(appointment.payment.createdAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </Text>
                      </Flex>

                      {/* Ngày thanh toán (nếu có) */}
                      {appointment.payment.payDate && (
                        <Flex justify="space-between" align="center">
                          <Text className={isDark ? "!text-gray-300" : ""}>
                            Ngày thanh toán
                          </Text>
                          <Text className={isDark ? "!text-gray-200" : ""}>
                            {dayjs(appointment.payment.payDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Text>
                        </Flex>
                      )}

                      {/* Số giao dịch ngân hàng (nếu có) */}
                      {appointment.payment.transactionNo && (
                        <Flex justify="space-between" align="center">
                          <Text className={isDark ? "!text-gray-300" : ""}>
                            Số GD ngân hàng
                          </Text>
                          <Text code className={isDark ? "!text-gray-200" : ""}>
                            {appointment.payment.transactionNo}
                          </Text>
                        </Flex>
                      )}

                      {/* Ngân hàng (nếu có) */}
                      {appointment.payment.bankCode && (
                        <Flex justify="space-between" align="center">
                          <Text className={isDark ? "!text-gray-300" : ""}>
                            Ngân hàng
                          </Text>
                          <Tag color="blue">{appointment.payment.bankCode}</Tag>
                        </Flex>
                      )}

                      {/* Thông tin đơn hàng */}
                      {appointment.payment.orderInfo && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Text
                            className={`text-xs ${
                              isDark ? "!text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {appointment.payment.orderInfo}
                          </Text>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Thông báo nếu không thể hủy */}
          {appointment &&
            !canCancel &&
            (appointment.status?.toLowerCase() === "pending" ||
              appointment.status?.toLowerCase() === "confirmed") && (
              <Alert
                message="Không thể hủy lịch hẹn"
                description="Lịch hẹn chỉ có thể hủy trước 12 giờ. Vui lòng liên hệ phòng khám để được hỗ trợ."
                type="warning"
                showIcon
                className="mt-6"
              />
            )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              size="large"
            >
              Về trang chủ
            </Button>

            <Space size="middle">
              <Button onClick={() => navigate(-1)} size="large">
                Quay lại
              </Button>

              {canCancel && (
                <Button
                  danger
                  type="primary"
                  icon={<CloseCircleOutlined />}
                  onClick={handleCancelAppointment}
                  loading={cancelling}
                  size="large"
                  style={{
                    minWidth: "180px",
                  }}
                >
                  Hủy lịch hẹn
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AppointmentDetailPage;
