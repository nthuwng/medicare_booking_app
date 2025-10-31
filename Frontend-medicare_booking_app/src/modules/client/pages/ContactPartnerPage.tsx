// src/modules/client/pages/ContactPartnerPage.tsx
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  App,
} from "antd";
import { MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const CITIES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Khác",
];

const ContactPartnerPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const mailto = buildMailTo(values);
      window.location.href = mailto;

      setTimeout(() => {
        setLoading(false);
        message.success("Đã mở ứng dụng email để gửi thông tin hợp tác.");
      }, 300);
    } catch {}
  };

  function buildMailTo(values: any) {
    const to = "business@medicare.vn"; // có thể thay bằng email doanh nghiệp của bạn
    const subject = encodeURIComponent(
      `[Hợp tác phòng khám] ${values.clinicName}`
    );
    const body = encodeURIComponent(
      `Thông tin liên hệ\n\n` +
        `- Tên cơ sở: ${values.clinicName}\n` +
        `- Người liên hệ: ${values.contactName}\n` +
        `- Email: ${values.email}\n` +
        `- Điện thoại: ${values.phone}\n` +
        `- Thành phố: ${values.city}\n` +
        `- Ghi chú: ${values.note || "(không)"}\n\n` +
        `Vui lòng liên hệ lại để trao đổi thêm.`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div
      style={{
        background: "#f8fafc",
        paddingTop: 32,
        paddingBottom: 48,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={2} className="!text-blue-700 !mb-4">
              Hợp tác cùng MediCare
            </Title>
            <Paragraph className="!text-slate-600 !text-base">
              Chúng tôi luôn chào đón các phòng khám, bệnh viện và bác sĩ hợp
              tác để mang lại trải nghiệm đặt lịch tốt hơn cho người bệnh. Hãy
              gửi thông tin bên cạnh, đội ngũ phụ trách sẽ liên hệ lại trong
              vòng 24–48 giờ làm việc.
            </Paragraph>
            <Card className="!mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MailOutlined />
                  <Text>business@medicare.vn</Text>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneOutlined />
                  <Text>0356 566 573</Text>
                </div>
                <div className="flex items-center gap-2">
                  <HomeOutlined />
                  <Text>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Đăng ký hợp tác" className="!shadow-md">
              <Form layout="vertical" form={form}>
                <Form.Item
                  label="Tên cơ sở y tế"
                  name="clinicName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên cơ sở" },
                  ]}
                >
                  <Input placeholder="VD: Phòng khám Đa khoa ABC" />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Người liên hệ"
                      name="contactName"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                      ]}
                    >
                      <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Chức vụ (không bắt buộc)" name="position">
                      <Input placeholder="Quản lý cơ sở, Trưởng phòng..." />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="email@clinic.vn" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}
                    >
                      <Input placeholder="0xx xxxx xxx" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Thành phố" name="city">
                  <Select placeholder="Chọn tỉnh/thành">
                    {CITIES.map((c) => (
                      <Select.Option key={c} value={c}>
                        {c}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Nhu cầu hợp tác/Ghi chú" name="note">
                  <Input.TextArea
                    rows={4}
                    placeholder="Mô tả ngắn gọn nhu cầu hợp tác"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  onClick={onSubmit}
                  loading={loading}
                  block
                >
                  Gửi thông tin
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactPartnerPage;
