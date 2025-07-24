import { App, Button, Divider, Form, Input, message, Select } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { registerAPI } from "@/services/api";

type FieldType = {
  email: string;
  password: string;
  userType: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password, userType } = values;
    const res = await registerAPI(email, password, userType);
    if (res.success === true) {
      message.success(
        "Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục!"
      );
      navigate("/login");
    } else {
      notification.error({
        message: "Đăng ký tài khoản thất bại!",
        description: res.message,
        placement: "topRight",
      });
    }
  };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
              <Divider />
            </div>
            <Form name="form-register" onFinish={onFinish} autoComplete="off">
              <Form.Item<FieldType>
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }} //whole column
                label="Vai trò"
                name="userType"
                rules={[
                  {
                    required: true,
                    message: "Vai trò không được để trống!",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="DOCTOR">Bác sĩ</Select.Option>
                  <Select.Option value="PATIENT">Bệnh nhân</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng ký
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal" style={{ textAlign: "center" }}>
                Đã có tài khoản ?
                <span>
                  <Link to="/login"> Đăng Nhập </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
