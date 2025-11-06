import { useEffect, useMemo, useRef, useState } from "react";
import {
  App,
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  ReloadOutlined,
  CheckCircleTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/contexts/app.context";
import {
  putUpdatePasswordFromEmailApi,
  resendOtpAPI,
  sendEmailOtpAPI,
  verifyOtpAPI,
} from "../services/client.api";

const RESEND_SECONDS = 60;

const ForgotPassword = () => {
  const { theme } = useCurrentApp();
  const navigate = useNavigate();
  const { message, notification } = App.useApp();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [counter, setCounter] = useState(RESEND_SECONDS);
  const timerRef = useRef<number | null>(null);

  const isDark = theme === "dark";
  const PRIMARY = "#2977FF";

  const getStepColor = (idx: number) => (idx <= step ? PRIMARY : "white");

  const containerBg = useMemo(
    () =>
      isDark
        ? { background: "#0D1224" }
        : {
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.65) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.65) 1px, transparent 1px),
              radial-gradient(circle 600px at 0% 20%, rgba(139,92,246,0.22), transparent),
              radial-gradient(circle 600px at 100% 0%, rgba(59,130,246,0.22), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          },
    [isDark]
  );

  // countdown for resend OTP
  useEffect(() => {
    if (step !== 1) return;

    setCounter(RESEND_SECONDS);

    // clear cũ (nếu có) bằng if, không dùng toán tử &&
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    // ✅ cleanup luôn trả void
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step]);

  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  // STEP 1 — send OTP
  const onSendOtp: (values: { email: string }) => Promise<void> = async (
    values
  ) => {
    try {
      setSending(true);
      const res = await sendEmailOtpAPI(values.email);

      if (res?.success === true) {
        await delay(800);
        setEmail(values.email);
        setStep(1);
        notification.success({
          message: res?.message || "Gửi mã OTP thành công",
          description: `Mã xác minh đã được gửi tới email của bạn. Hãy kiểm tra hộp thư (và mục Spam).`,
        });
      } else {
        notification.error({
          message: "Có lỗi khi gửi mã OTP",
          description: res?.message,
        });
      }
    } catch (e: any) {
      message.error(e?.message || "Gửi OTP thất bại");
    } finally {
      setSending(false);
    }
  };

  // STEP 2 — verify OTP
  const [otp, setOtp] = useState("");
  const onVerifyOtp: () => Promise<void> = async () => {
    if (!otp || otp.length < 6) {
      message.warning("Vui lòng nhập đủ 6 ký tự OTP"); // KHÔNG return message.warning(...)
      return;
    }
    try {
      setVerifying(true);
      const res = await verifyOtpAPI(email, otp);
      if (res?.success === true) {
        await delay(700);
        setStep(2);
        message.success("Xác minh OTP thành công");
      } else {
        notification.error({
          message: "Xác minh OTP thất bại",
          description: res?.message,
        });
      }
    } catch (e: any) {
      message.error(e?.message || "OTP không hợp lệ");
    } finally {
      setVerifying(false);
    }
  };

  const onResend: () => Promise<void> = async () => {
    try {
      setSending(true);
      const res = await resendOtpAPI(email);

      if (res?.success === true) {
        setCounter(RESEND_SECONDS);

        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }

        timerRef.current = window.setInterval(() => {
          setCounter((c) => {
            if (c <= 1) {
              if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
              }
              return 0;
            }
            return c - 1;
          });
        }, 1000);

        message.success("Đã gửi lại OTP");
      } else {
        notification.error({
          message: "Có lỗi khi gửi mã OTP",
          description: res?.message,
        });
      }
    } catch (e: any) {
      message.error(e?.message || "Không thể gửi lại OTP");
    } finally {
      setSending(false);
    }
  };

  // STEP 3 — reset password
  const onResetPassword: (values: {
    emailPassword: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void> = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu nhập lại chưa khớp"); // KHÔNG return message.error(...)
      return;
    }
    try {
      setResetting(true);
      const res = await putUpdatePasswordFromEmailApi(
        values.emailPassword,
        values.password,
        values.confirmPassword,
        email
      );

      if (res?.success === true) {
        await delay(700);
        setStep(2);
        notification.success({
          message: res?.message || "Đổi mật khẩu thành công",
          description: "Bạn có thể dùng mật khẩu mới để đăng nhập.",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Đổi mật khẩu thất bại",
          description: res?.message,
        });
      }
    } catch (e: any) {
      message.error(e?.message || "Đổi mật khẩu thất bại");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={containerBg} className=" transition-all">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Space size={12} direction="vertical" style={{ width: "100%" }}>
              <Space align="center">
                <Link to="/login">
                  <Button
                    type="text"
                    icon={
                      <ArrowLeftOutlined
                        className={`${isDark ? "!text-white" : ""}`}
                      />
                    }
                    className={`${isDark ? "!text-white " : ""}`}
                  >
                    Quay lại đăng nhập
                  </Button>
                </Link>
                <TagLike theme={theme} text="Quên mật khẩu" />
              </Space>

              <Typography.Title
                level={2}
                className={`${
                  isDark ? "!text-white" : "!text-gray-900"
                } !font-extrabold`}
                style={{ marginTop: 0 }}
              >
                Khôi phục tài khoản
              </Typography.Title>

              <Typography.Paragraph
                className={isDark ? "!text-gray-300" : "!text-gray-600"}
              >
                Thực hiện theo 3 bước dưới đây để đặt lại mật khẩu của bạn.
              </Typography.Paragraph>

              <Card
                className={`${
                  isDark
                    ? "!bg-[#0f1b2d] !border-white/10 !text-white"
                    : "shadow-sm"
                } transition`}
                style={{ borderRadius: 16 }}
                bodyStyle={{ padding: 20 }}
              >
                <Steps
                  current={step}
                  items={[
                    {
                      title: (
                        <span style={{ color: getStepColor(0) }}>
                          Nhập email
                        </span>
                      ),
                      icon: <MailOutlined style={{ color: getStepColor(0) }} />,
                      // status giúp antd set trạng thái cho tail:
                      status: step > 0 ? "finish" : "process",
                    },
                    {
                      title: (
                        <span style={{ color: getStepColor(1) }}>
                          Xác minh OTP
                        </span>
                      ),
                      icon: (
                        <SafetyCertificateOutlined
                          style={{ color: getStepColor(1) }}
                        />
                      ),
                      status:
                        step > 1 ? "finish" : step === 1 ? "process" : "wait",
                    },
                    {
                      title: (
                        <span style={{ color: getStepColor(2) }}>
                          Đặt mật khẩu
                        </span>
                      ),
                      icon: <LockOutlined style={{ color: getStepColor(2) }} />,
                      status: step === 2 ? "process" : "wait",
                    },
                  ]}
                />

                <Divider />

                {step === 0 && (
                  <StepEnterEmail
                    isDark={isDark}
                    sending={sending}
                    onSubmit={onSendOtp}
                  />
                )}

                {step === 1 && (
                  <StepVerifyOtp
                    isDark={isDark}
                    email={maskedEmail}
                    rawEmail={email}
                    otp={otp}
                    setOtp={setOtp}
                    verifying={verifying}
                    counter={counter}
                    onResend={onResend}
                    onVerify={onVerifyOtp}
                    sending={sending}
                  />
                )}

                {step === 2 && (
                  <StepResetPassword
                    isDark={isDark}
                    resetting={resetting}
                    onSubmit={onResetPassword}
                  />
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

/* ------------------------ Sub Components ------------------------ */

const TagLike = ({ theme, text }: { theme: string; text: string }) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 999,
      fontSize: 13,
      border:
        theme === "dark"
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid #dbeafe",
      background: theme === "dark" ? "rgba(59,130,246,0.15)" : "#eff6ff",
      color: theme === "dark" ? "#60a5fa" : "#1d4ed8",
    }}
  >
    {text}
  </span>
);

const StepEnterEmail = ({
  isDark,
  sending,
  onSubmit,
}: {
  isDark: boolean;
  sending: boolean;
  onSubmit: (values: { email: string }) => void;
}) => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <Col xs={24} md={14}>
        <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
          <Form.Item
            name="email"
            label={
              <span className={isDark ? "!text-gray-200" : ""}>
                Email đã đăng ký
              </span>
            }
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="you@example.com"
            />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={sending}
            icon={<SendOutlined />}
          >
            Gửi mã OTP
          </Button>
        </Form>
      </Col>
      <Col xs={24} md={10}>
        <Card
          className={`${
            isDark ? "!bg-[#152238] !border-white/10 !text-white" : ""
          } transition`}
          style={{ borderRadius: 12 }}
        >
          <Space direction="vertical">
            <Typography.Text
              className={isDark ? "!text-gray-100" : "!text-gray-800"}
            >
              Vì sao cần email?
            </Typography.Text>
            <Typography.Paragraph
              className={isDark ? "!text-gray-300" : "!text-gray-600"}
              style={{ margin: 0 }}
            >
              Chúng tôi gửi mã xác minh 6 số tới email của bạn để đảm bảo chính
              chủ thực hiện thao tác.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

const StepVerifyOtp = ({
  isDark,
  email,
  rawEmail,
  otp,
  setOtp,
  verifying,
  counter,
  onResend,
  onVerify,
  sending,
}: {
  isDark: boolean;
  email: string;
  rawEmail: string;
  otp: string;
  setOtp: (v: string) => void;
  verifying: boolean;
  counter: number;
  onResend: () => Promise<void>;
  onVerify: () => Promise<void>;
  sending: boolean;
}) => {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Alert
        type="info"
        message={
          <span className={isDark ? "!text-gray-100" : ""}>
            Đã gửi mã tới <b>{email}</b>
          </span>
        }
        description={
          <span className={isDark ? "!text-gray-300" : "!text-gray-600"}>
            Không nhận được? Kiểm tra hộp thư rác hoặc bấm <i>Gửi lại mã</i>.
          </span>
        }
        showIcon
        className={isDark ? "!bg-[#152238] !border-white/10" : ""}
      />

      <div className="flex flex-col items-center">
        <Typography.Text
          className={`!text-[18px] ${isDark ? "!text-gray-200" : ""}`}
        >
          Nhập mã OTP (6 số)
        </Typography.Text>

        <Input.OTP
          length={6}
          value={otp}
          onChange={setOtp}
          size="large"
          style={{ marginTop: 8, maxWidth: 360 }}
        />
      </div>

      <Space>
        <Button
          type="primary"
          size="large"
          onClick={onVerify}
          loading={verifying}
        >
          Xác minh
        </Button>
        <Button
          size="large"
          icon={<ReloadOutlined />}
          disabled={counter > 0 || sending}
          onClick={onResend}
          className={`${isDark ? "!text-white !bg-[#1d1d1d]" : ""}`}
        >
          {counter > 0 ? `Gửi lại (${counter}s)` : "Gửi lại mã"}
        </Button>
      </Space>

      <Typography.Paragraph
        className={isDark ? "!text-gray-400" : "!text-gray-500"}
        style={{ marginTop: 8 }}
      >
        Nhập sai nhiều lần có thể khiến mã hết hiệu lực. Bạn có thể quay lại
        bước trước để đổi email:{" "}
        <Link to="#" onClick={(e) => e.preventDefault()}>
          {rawEmail}
        </Link>
      </Typography.Paragraph>
    </Space>
  );
};

const passwordRules = [
  { required: true, message: "Vui lòng nhập mật khẩu" },
  { min: 8, message: "Tối thiểu 8 ký tự" },
];

const StepResetPassword = ({
  isDark,
  resetting,
  onSubmit,
}: {
  isDark: boolean;
  resetting: boolean;
  onSubmit: (values: {
    emailPassword: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <Alert
        type="success"
        showIcon
        className={isDark ? "!bg-[#152238] !border-white/10" : ""}
        message={
          <Space align="center">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span className={isDark ? "!text-gray-100" : ""}>
              OTP đã được xác minh
            </span>
          </Space>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label={
            <span className={isDark ? "!text-gray-200" : ""}>
              Nhập mật khẩu được gửi từ vào email
            </span>
          }
          name="emailPassword"
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className={isDark ? "!text-gray-200" : ""}>Mật khẩu mới</span>
          }
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message:
                "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className={isDark ? "!text-gray-200" : ""}>
              Nhập lại mật khẩu
            </span>
          }
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            ...passwordRules,
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Mật khẩu nhập lại chưa khớp"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={resetting}
          >
            Đổi mật khẩu
          </Button>
          <Link to="/login">
            <Button size="large">Về trang đăng nhập</Button>
          </Link>
        </Space>
      </Form>
    </>
  );
};

/* ------------------------ Utils ------------------------ */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function maskEmail(input: string) {
  const [name, domain] = input.split("@");
  if (!name || !domain) return input;
  const head = name.slice(0, 2);
  const tail = name.slice(-1);
  return `${head}${"*".repeat(Math.max(1, name.length - 3))}${tail}@${domain}`;
}

export default ForgotPassword;
