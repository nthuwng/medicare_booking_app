import { App, Button, Card, Form, Input, Space, Typography } from "antd";
import { LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { useState } from "react";
import { useCurrentApp } from "@/components/contexts/app.context";
import { updatePasswordDoctorAPI } from "../services/doctor.api";

type FieldType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const DoctorChangePasswordPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { user } = useCurrentApp();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setIsSubmit(true);
      const { oldPassword, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        notification.error({
          message: "Mật khẩu xác nhận không khớp!",
          placement: "topRight",
        });
        return;
      }

      if (!user?.id) {
        notification.error({
          message: "Lỗi",
          description: "Không tìm thấy thông tin người dùng",
          placement: "topRight",
        });
        return;
      }

      const res = await updatePasswordDoctorAPI(
        user.id,
        oldPassword,
        newPassword,
        confirmPassword
      );
      console.log(res);

      if (res?.success === true) {
        message.success("Đổi mật khẩu thành công!");
        form.resetFields();
      } else {
        notification.error({
          message: "Đổi mật khẩu thất bại!",
          description:
            res?.message || "Vui lòng kiểm tra lại thông tin và thử lại.",
          placement: "topRight",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Đổi mật khẩu thất bại!",
        description:
          error?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        placement: "topRight",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: 12,
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <SafetyCertificateOutlined
              style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
            />
            <Typography.Title level={3} style={{ marginBottom: 8 }}>
              Đổi mật khẩu
            </Typography.Title>
            <Typography.Paragraph style={{ color: "#666", marginBottom: 0 }}>
              Bảo mật tài khoản của bạn bằng cách thay đổi mật khẩu thường xuyên
            </Typography.Paragraph>
          </div>

          <Form
            form={form}
            name="form-change-password"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<FieldType>
              label="Mật khẩu hiện tại"
              name="oldPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                block
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default DoctorChangePasswordPage;
