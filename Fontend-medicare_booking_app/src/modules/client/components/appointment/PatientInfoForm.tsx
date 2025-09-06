import { Card, Typography, Row, Col, Form, Input, Select, Radio } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  bookingFor: string;
}

const PatientInfoForm = (props: IProps) => {
  const { bookingFor } = props;

  const provinces = [
    { label: "Hà Nội", value: "hanoi" },
    { label: "Hồ Chí Minh", value: "hcm" },
    { label: "Đà Nẵng", value: "danang" },
    { label: "Hải Phòng", value: "haiphong" },
    { label: "Cần Thơ", value: "cantho" },
  ];

  const districts = [
    { label: "Ba Đình", value: "ba-dinh" },
    { label: "Hoàn Kiếm", value: "hoan-kiem" },
    { label: "Đống Đa", value: "dong-da" },
    { label: "Cầu Giấy", value: "cau-giay" },
    { label: "Thanh Xuân", value: "thanh-xuan" },
  ];
  return (
    <>
      <Card
        style={{
          borderRadius: "16px",
          border: "2px solid #e6f7ff",
          backgroundColor: "#fafcff",
          boxShadow: "0 4px 12px rgba(24, 144, 255, 0.1)",
          marginBottom: "24px",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            {bookingFor === "self" ? (
              <UserOutlined
                style={{
                  fontSize: "20px",
                  color: "#1890ff",
                  marginRight: "8px",
                }}
              />
            ) : (
              <UserOutlined
                style={{
                  fontSize: "20px",
                  color: "#1890ff",
                  marginRight: "8px",
                }}
              />
            )}
            <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
              {bookingFor === "self"
                ? "Thông tin của bạn"
                : "Thông tin bệnh nhân"}
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            Vui lòng nhập đầy đủ thông tin để chúng tôi có thể liên hệ và xác
            nhận lịch khám
          </Text>
        </div>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Họ tên bệnh nhân</Text>}
              name="patientName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ tên!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập họ tên bệnh nhân"
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Giới tính</Text>}
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giới tính!",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Số điện thoại liên hệ</Text>}
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập số điện thoại"
                prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Địa chỉ email</Text>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập địa chỉ email"
                prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<Text strong>Năm sinh</Text>}
          name="dateOfBirth"
          rules={[{ required: true, message: "Vui lòng nhập năm sinh!" }]}
        >
          <Input
            size="large"
            placeholder="Nhập năm sinh (ví dụ: 1990)"
            prefix={<CalendarOutlined style={{ color: "#bfbfbf" }} />}
          />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Tỉnh/Thành phố</Text>}
              name="province"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tỉnh/thành!",
                },
              ]}
            >
              <Select size="large" placeholder="-- Chọn Tỉnh/Thành --">
                {provinces.map((province) => (
                  <Option key={province.value} value={province.value}>
                    {province.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text strong>Quận/Huyện</Text>}
              name="district"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn quận/huyện!",
                },
              ]}
            >
              <Select size="large" placeholder="-- Chọn Quận/Huyện --">
                {districts.map((district) => (
                  <Option key={district.value} value={district.value}>
                    {district.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<Text strong>Địa chỉ</Text>}
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input
            size="large"
            placeholder="Nhập số nhà, tên đường..."
            prefix={<EnvironmentOutlined style={{ color: "#bfbfbf" }} />}
          />
        </Form.Item>

        <Form.Item label={<Text strong>Lý do khám</Text>} name="reason">
          <TextArea
            rows={4}
            placeholder="Mô tả triệu chứng, lý do khám bệnh..."
            maxLength={400}
            showCount
          />
        </Form.Item>
      </Card>
    </>
  );
};

export default PatientInfoForm;
