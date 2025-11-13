import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Result,
  Space,
  Alert,
  Timeline,
  Row,
  Col,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text, Paragraph } = Typography;

const CashPaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Theme context
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  // Lấy dữ liệu từ navigation state
  const appointmentData = location.state?.appointmentData;

  useEffect(() => {
    // Scroll to top khi vào trang
    window.scrollTo(0, 0);
  }, []);

  // Theme configuration
  const localTheme = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#1890ff",
      colorSuccess: "#52c41a",
      colorWarning: "#faad14",
      colorError: "#ff4d4f",
      colorInfo: "#1890ff",
      colorBgBase: isDark ? "#141414" : "#ffffff",
      colorTextBase: isDark ? "#ffffff" : "#000000",
    },
  };

  if (!appointmentData) {
    return (
      <ConfigProvider theme={localTheme}>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: isDark ? "#0a1929" : "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <Card style={{ maxWidth: 400, textAlign: "center" }}>
            <Title level={4}>Không tìm thấy thông tin đặt lịch</Title>
            <Button type="primary" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          </Card>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={localTheme}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0a1929" : "#f0f9ff",
          padding: "24px 16px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Success Result */}
          <Card
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 4px 12px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: "32px 24px" }}
          >
            <Result
              status="success"
              icon={
                <CheckCircleOutlined
                  style={{
                    fontSize: "72px",
                    color: "#52c41a",
                  }}
                />
              }
              title={
                <Title
                  level={2}
                  style={{
                    marginBottom: "8px",
                    fontSize: "clamp(20px, 5vw, 28px)",
                  }}
                >
                  Đặt lịch khám thành công!
                </Title>
              }
              subTitle={
                <div style={{ marginTop: "16px" }}>
                  <Paragraph
                    type="secondary"
                    style={{
                      fontSize: "clamp(14px, 3vw, 16px)",
                      marginBottom: "16px",
                      maxWidth: "600px",
                      margin: "0 auto 16px",
                    }}
                  >
                    Bạn đã đặt lịch khám thành công. Vui lòng mang theo tiền mặt
                    và đến đúng giờ hẹn.
                  </Paragraph>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: isDark ? "#2b2111" : "#fff7e6",
                      border: isDark
                        ? "2px solid #594214"
                        : "2px solid #ffc53d",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: "clamp(14px, 3vw, 16px)",
                        color: isDark ? "#ffc53d" : "#d48806",
                      }}
                    >
                      <WalletOutlined style={{ marginRight: "8px" }} />
                      Thanh toán tiền mặt tại phòng khám
                    </Text>
                  </div>
                </div>
              }
            />
          </Card>

          {/* Appointment Details */}
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <CalendarOutlined
                  style={{ fontSize: "20px", color: "#1890ff" }}
                />
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    fontSize: "clamp(16px, 4vw, 18px)",
                  }}
                >
                  Thông tin lịch khám
                </Title>
              </div>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.06)",
            }}
            headStyle={{
              backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
              borderBottom: isDark ? "2px solid #303030" : "2px solid #e8e8e8",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
                    borderRadius: "8px",
                    border: isDark ? "1px solid #303030" : "1px solid #e8e8e8",
                  }}
                >
                  <Text
                    strong
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    Mã lịch khám
                  </Text>
                  <Text
                    code
                    style={{
                      backgroundColor: isDark ? "#111d2c" : "#e6f7ff",
                      border: isDark
                        ? "1px solid #15395b"
                        : "1px solid #91d5ff",
                      color: isDark ? "#3c9ae8" : "#0958d9",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontWeight: "600",
                      fontSize: "clamp(13px, 3vw, 15px)",
                      display: "inline-block",
                      wordBreak: "break-all",
                    }}
                  >
                    {appointmentData.appointment.id}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
                    borderRadius: "8px",
                    border: isDark ? "1px solid #303030" : "1px solid #e8e8e8",
                  }}
                >
                  <Text
                    strong
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    Trạng thái
                  </Text>
                  <span
                    style={{
                      padding: "6px 16px",
                      backgroundColor: isDark ? "#2b2111" : "#fff7e6",
                      border: isDark
                        ? "1px solid #594214"
                        : "1px solid #ffd666",
                      borderRadius: "6px",
                      color: isDark ? "#ffc53d" : "#d48806",
                      fontWeight: "600",
                      fontSize: "clamp(13px, 3vw, 14px)",
                      display: "inline-block",
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: "6px" }} />
                    Chờ thanh toán
                  </span>
                </div>
              </Col>

              <Col xs={24}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#111d2c" : "#f0f9ff",
                    borderRadius: "8px",
                    border: isDark ? "2px solid #15395b" : "2px solid #91d5ff",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#1890ff",
                      fontSize: "13px",
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: "6px" }} />
                    Thời gian khám
                  </Text>
                  <Text
                    style={{
                      fontSize: "clamp(14px, 3vw, 16px)",
                      fontWeight: "600",
                    }}
                  >
                    {(() => {
                      // Parse datetime string directly to avoid timezone issues
                      const dateStr =
                        appointmentData.appointment.appointmentDateTime;
                      const date = new Date(dateStr);

                      // Get date parts using UTC to match database time
                      const weekday = date.toLocaleDateString("vi-VN", {
                        weekday: "long",
                        timeZone: "Asia/Ho_Chi_Minh",
                      });
                      const day = date.getUTCDate();
                      const month = date.getUTCMonth() + 1;
                      const year = date.getUTCFullYear();
                      const hour = date.getUTCHours();
                      const minute = date.getUTCMinutes();

                      // Format giờ: 8h00 hoặc 15h30
                      const timeStr = `${hour}h${minute
                        .toString()
                        .padStart(2, "0")}`;

                      return `${weekday}, ${day} tháng ${month}, ${year} lúc ${timeStr}`;
                    })()}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
                    borderRadius: "8px",
                    border: isDark ? "1px solid #303030" : "1px solid #e8e8e8",
                  }}
                >
                  <Text
                    strong
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <UserOutlined style={{ marginRight: "6px" }} />
                    Bệnh nhân
                  </Text>
                  <Text
                    style={{
                      fontSize: "clamp(14px, 3vw, 15px)",
                      fontWeight: "500",
                    }}
                  >
                    {appointmentData.patient.patientName}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
                    borderRadius: "8px",
                    border: isDark ? "1px solid #303030" : "1px solid #e8e8e8",
                  }}
                >
                  <Text
                    strong
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <PhoneOutlined style={{ marginRight: "6px" }} />
                    Số điện thoại
                  </Text>
                  <Text
                    style={{
                      fontSize: "clamp(14px, 3vw, 15px)",
                      fontWeight: "500",
                    }}
                  >
                    {appointmentData.patient.patientPhone}
                  </Text>
                </div>
              </Col>

              <Col xs={24}>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: isDark ? "#111d2c" : "#f0f9ff",
                    borderRadius: "12px",
                    border: isDark ? "3px solid #15395b" : "3px solid #91d5ff",
                    textAlign: "center",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      color: "#1890ff",
                      fontSize: "14px",
                    }}
                  >
                    <DollarOutlined style={{ marginRight: "6px" }} />
                    TỔNG CHI PHÍ
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: "clamp(24px, 6vw, 32px)",
                      color: "#1890ff",
                      fontWeight: "700",
                      display: "block",
                    }}
                  >
                    {Number(
                      appointmentData.appointment.totalFee
                    ).toLocaleString("vi-VN")}{" "}
                    VND
                  </Text>
                </div>
              </Col>

              <Col xs={24}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: isDark ? "#162312" : "#f6ffed",
                    borderRadius: "8px",
                    border: isDark ? "2px solid #274916" : "2px solid #b7eb8f",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#52c41a",
                      fontSize: "13px",
                    }}
                  >
                    <WalletOutlined style={{ marginRight: "6px" }} />
                    Phương thức thanh toán
                  </Text>
                  <Text
                    style={{
                      fontSize: "clamp(14px, 3vw, 15px)",
                      fontWeight: "600",
                    }}
                  >
                    Thanh toán tiền mặt tại phòng khám
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Important Instructions */}
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <InfoCircleOutlined
                  style={{ fontSize: "20px", color: "#faad14" }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  Hướng dẫn quan trọng
                </Title>
              </div>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.06)",
            }}
            headStyle={{
              backgroundColor: isDark ? "#2b2111" : "#fffbe6",
              borderBottom: isDark ? "2px solid #594214" : "2px solid #ffe58f",
            }}
          >
            <Timeline
              items={[
                {
                  color: "blue",
                  children: (
                    <div>
                      <Text strong style={{ fontSize: "15px" }}>
                        Chuẩn bị tiền mặt
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Vui lòng chuẩn bị đầy đủ số tiền{" "}
                        <Text strong style={{ color: "#1890ff" }}>
                          {Number(
                            appointmentData.appointment.totalFee
                          ).toLocaleString("vi-VN")}{" "}
                          VND
                        </Text>{" "}
                        để thanh toán tại quầy lễ tân
                      </Text>
                    </div>
                  ),
                },
                {
                  color: "green",
                  children: (
                    <div>
                      <Text strong style={{ fontSize: "15px" }}>
                        Đến sớm 15-30 phút
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Đến phòng khám trước giờ hẹn 15-30 phút để làm thủ tục
                        và thanh toán
                      </Text>
                    </div>
                  ),
                },
                {
                  color: "orange",
                  children: (
                    <div>
                      <Text strong style={{ fontSize: "15px" }}>
                        Mang theo giấy tờ
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Mang theo CMND/CCCD và mã lịch khám của bạn để xác nhận
                      </Text>
                    </div>
                  ),
                },
                {
                  color: "red",
                  children: (
                    <div>
                      <Text strong style={{ fontSize: "15px" }}>
                        Thông báo nếu muốn hủy
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Nếu không thể đến khám, vui lòng hủy lịch trước 24 giờ
                      </Text>
                    </div>
                  ),
                },
              ]}
              style={{ marginTop: "16px" }}
            />
          </Card>

          {/* Important Notices */}
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", marginBottom: "24px" }}
          >
            <Alert
              message="Lưu ý quan trọng"
              description={
                <div>
                  <Paragraph style={{ marginBottom: "8px", marginTop: "8px" }}>
                    • Lịch khám chỉ được xác nhận{" "}
                    <Text strong>sau khi thanh toán tiền mặt</Text> tại phòng
                    khám
                  </Paragraph>
                  <Paragraph style={{ marginBottom: "8px" }}>
                    • Vui lòng đến <Text strong>đúng giờ hẹn</Text>. Nếu trễ quá
                    15 phút, lịch khám có thể bị hủy
                  </Paragraph>
                  <Paragraph style={{ marginBottom: "0" }}>
                    • Có thể hủy lịch miễn phí nếu thông báo{" "}
                    <Text strong>trước 24 giờ</Text>
                  </Paragraph>
                </div>
              }
              type="warning"
              showIcon
              icon={<InfoCircleOutlined />}
              style={{
                borderRadius: "8px",
              }}
            />

            <Alert
              message="Hỗ trợ khách hàng"
              description={
                <Paragraph style={{ marginBottom: "0", marginTop: "8px" }}>
                  Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ hotline:{" "}
                  <Text strong style={{ color: "#1890ff" }}>
                    1900 xxxx
                  </Text>{" "}
                  hoặc email:{" "}
                  <Text strong style={{ color: "#1890ff" }}>
                    support@medicare.vn
                  </Text>
                </Paragraph>
              }
              type="info"
              showIcon
              style={{
                borderRadius: "8px",
              }}
            />
          </Space>

          {/* Action Buttons */}
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              textAlign: "center",
            }}
            bodyStyle={{ padding: "24px 16px" }}
          >
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={10}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  onClick={() =>
                    navigate(
                      `/appointment-detail/${appointmentData.appointment.id}`
                    )
                  }
                  block
                  style={{
                    height: "48px",
                    fontSize: "clamp(14px, 3vw, 16px)",
                    fontWeight: "600",
                    borderRadius: "8px",
                  }}
                >
                  Xem lịch khám của tôi
                </Button>
              </Col>

              <Col xs={24} sm={12} md={10}>
                <Button
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/")}
                  block
                  style={{
                    height: "48px",
                    fontSize: "clamp(14px, 3vw, 16px)",
                    fontWeight: "600",
                    borderRadius: "8px",
                  }}
                >
                  Về trang chủ
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CashPaymentSuccessPage;
