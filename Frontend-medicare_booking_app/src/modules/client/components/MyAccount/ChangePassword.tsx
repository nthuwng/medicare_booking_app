import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  App,
  ConfigProvider,
  theme as antdTheme,
  type ThemeConfig,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { putUpdatePasswordApi } from "../../services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

interface Props {
  passwordModalOpen: boolean;
  setPasswordModalOpen: (open: boolean) => void;
}

const ChangePassword = (props: Props) => {
  const { passwordModalOpen, setPasswordModalOpen } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, theme } = useCurrentApp();
  const isDark = theme === "dark";
  const { message } = App.useApp();

  // Tailwind classes theo theme (không cần CSS file)
  const inputCls = isDark
    ? "bg-[#0b1626] text-gray-100 border-[#1f2a3a] placeholder:text-gray-500"
    : "";
  const labelCls = isDark ? "text-gray-300" : "text-slate-600";
  const titleCls = isDark ? "text-white" : "";

  // AntD tokens cục bộ cho modal (khớp tone MyAccountPage)
  const modalTheme: ThemeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorBgElevated: isDark ? "#0f1b2d" : "#fff",
      colorBgContainer: isDark ? "#0f1b2d" : "#fff",
      colorBorder: isDark ? "#1f2a3a" : "#e5e7eb",
      colorText: isDark ? "#e5e7eb" : "#0f172a",
      colorTextSecondary: isDark ? "#9CA3AF" : "#64748b",
      colorPrimary: "#1677ff",
      borderRadiusLG: 12,
    },
    components: {
      Modal: {
        headerBg: isDark ? "#0f1b2d" : "#fff",
        titleColor: isDark ? "#e5e7eb" : "#0f172a",
        contentBg: isDark ? "#0f1b2d" : "#fff",
        footerBg: isDark ? "#0f1b2d" : "#fff",
      },
      Input: {
        colorBgContainer: isDark ? "#0b1626" : "#fff",
        colorBorder: isDark ? "#1f2a3a" : "#dfe3e8",
      },
      Button: { borderRadius: 10 },
    },
  };

  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);
      const response = await putUpdatePasswordApi(
        values.oldPassword,
        values.newPassword,
        values.confirmPassword,
        user?.id || ""
      );

      if (response?.success === true) {
        message.success(response?.message || "Đổi mật khẩu thành công!");
        form.resetFields();
        setPasswordModalOpen(false);
      } else {
        message.error(response?.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPasswordModalOpen(false);
  };

  return (
    <ConfigProvider theme={modalTheme}>
      <Modal
        open={passwordModalOpen}
        onCancel={handleCancel}
        title={
          <div className="flex items-center gap-2">
            <LockOutlined style={{ color: "#1890ff" }} />
            <span className={titleCls}>Đổi mật khẩu</span>
          </div>
        }
        footer={null}
        width={500}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label={<span className={labelCls}>Mật khẩu hiện tại</span>}
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              size="large"
              className={inputCls}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label={<span className={labelCls}>Mật khẩu mới</span>}
            name="newPassword"
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
              placeholder="Nhập mật khẩu mới"
              size="large"
              className={inputCls}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label={<span className={labelCls}>Xác nhận mật khẩu mới</span>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value)
                    return Promise.resolve();
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              size="large"
              className={inputCls}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 30 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                size="large"
                onClick={handleCancel}
                style={{ minWidth: 100 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ minWidth: 100 }}
              >
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ChangePassword;
