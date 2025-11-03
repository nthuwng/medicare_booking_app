import { Card, Typography, Row, Col, Form, Input, Radio } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

interface IProps {
  bookingFor: string;
  setBookingFor: (value: string) => void;
}

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const BookerInfoForm = (props: IProps) => {
  const { bookingFor, setBookingFor } = props;
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  return (
    <>
      {/* CSS dark mode chỉ áp dụng trong phạm vi .booker-form */}
      {isDark && (
        <style>{`
          .booker-form .card-soft {
            background:#0e1625 !important;
            border:1px solid #1e293b99 !important;
            box-shadow:none !important;
          }
          .booker-form .card-soft h5,
          .booker-form .muted {
            color:#cbd5e1 !important;
          }

          /* Radio pill */
          .booker-form .pill {
            border:1px solid #263449 !important;
            background:#0b1220 !important;
            color:#e5e7eb !important;
            transition:all .15s ease;
          }
          .booker-form .pill:hover {
            border-color:#3b82f6 !important;
            box-shadow:0 0 0 2px rgba(59,130,246,.18);
          }
          .booker-form .ant-radio-wrapper-checked.pill {
            border-color:#3b82f6 !important;
            background:linear-gradient(135deg,#1d4ed8 0%, #2563eb 100%) !important;
            color:#fff !important;
          }

          /* Khối "đặt cho người thân" */
          .booker-form .guardian {
            background:#0f1a2b !important;
            border:1px solid #1e293b99 !important;
          }
          .booker-form .guardian h5 { color:#7dd3fc !important; }
          .booker-form .ant-input,
          .booker-form .ant-input-affix-wrapper {
            background:#101b2d !important;
            border-color:#1e293b99 !important;
            color:#e5e7eb !important;
          }
          .booker-form .ant-input::placeholder,
          .booker-form .ant-input-affix-wrapper input::placeholder {
            color:#94a3b8 !important;
            opacity:1;
          }
          .booker-form .ant-input-affix-wrapper:hover,
          .booker-form .ant-input:hover {
            border-color:#3b82f6 !important;
          }
          .booker-form .ant-input-affix-wrapper-focused {
            border-color:#3b82f6 !important;
            box-shadow:0 0 0 2px rgba(59,130,246,.25) !important;
          }
            
        `}</style>
      )}

      <div className="booker-form">
        {/* Booking For Section */}
        <Card
          className={cls(
            "card-soft",
            !isDark &&
              "rounded-[16px] border-[2px] border-[#fff2e8] bg-[#fffbf5] shadow-[0_4px_12px_rgba(250,140,22,.1)]",
            isDark && "rounded-[16px]"
          )}
          bodyStyle={{ padding: 24 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{ marginBottom: 16 }}>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <UserOutlined
                style={{
                  fontSize: 20,
                  color: isDark ? "#f59e0b" : "#fa8c16",
                  marginRight: 8,
                }}
              />
              <Title
                level={5}
                className={cls(isDark ? "!text-slate-200 !m-0" : "!m-0")}
                style={{ color: isDark ? undefined : "#fa8c16" }}
              >
                Đặt lịch cho ai?
              </Title>
            </div>
            <Text
              className={cls(isDark ? "muted" : "")}
              style={{ fontSize: 14 }}
            >
              Chọn bạn đang đặt lịch cho ai
            </Text>
          </div>

          <Form.Item
            name="bookingFor"
            initialValue="self"
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
          >
            <Radio.Group
              onChange={(e) => setBookingFor(e.target.value)}
              style={{ width: "100%" }}
            >
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Radio
                  value="self"
                  className={cls("pill")}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: !isDark ? "#fff" : undefined,
                    border: !isDark ? "1px solid #d9d9d9" : undefined,
                    fontWeight: 500,
                  }}
                >
                  👤 Đặt cho mình
                </Radio>
                <Radio
                  value="other"
                  className={cls("pill")}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: !isDark ? "#fff" : undefined,
                    border: !isDark ? "1px solid #d9d9d9" : undefined,
                    fontWeight: 500,
                  }}
                >
                  👨‍👩‍👧‍👦 Đặt cho người thân
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
        </Card>

        {/* Thông tin người đặt lịch - chỉ hiển thị khi đặt cho người thân */}
        {bookingFor === "other" && (
          <div
            className={cls(
              "guardian rounded-[12px]",
              !isDark && "bg-[#f0f9ff] border-[#bae6fd]"
            )}
            style={{
              padding: 20,
              border: "1px solid",
              marginBottom: 24,
              borderColor: !isDark ? "#bae6fd" : undefined,
            }}
          >
            <Title
              level={5}
              style={{
                color: isDark ? undefined : "#0369a1",
                marginBottom: 16,
              }}
            >
              👤 Thông tin người đặt lịch
            </Title>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Text className={isDark ? "!text-slate-100" : ""} strong>
                      Họ tên người đặt
                    </Text>
                  }
                  name="bookerName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên người đặt!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập họ tên của bạn"
                    prefix={
                      <UserOutlined
                        style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                      />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Text className={isDark ? "!text-slate-100" : ""} strong>
                      Số điện thoại người đặt
                    </Text>
                  }
                  name="bookerPhone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập số điện thoại của bạn"
                    prefix={
                      <PhoneOutlined
                        style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                      />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Text className={isDark ? "!text-slate-100" : ""} strong>
                      Email người đặt
                    </Text>
                  }
                  name="bookerEmail"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập email của bạn"
                    prefix={
                      <MailOutlined
                        style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                      />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default BookerInfoForm;
