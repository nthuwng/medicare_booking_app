import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Select,
  Breadcrumb,
  Spin,
  message,
  Divider,
  Rate,
} from "antd";
import {
  HomeOutlined,
  RightOutlined,
  EnvironmentOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  UserOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { IDoctorProfile } from "@/types";
import { getDoctorDetailBookingById } from "../../services/client.api";

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorDetailPage = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<IDoctorProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const timeSlots = [
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
  ];

  const fetchDoctorDetail = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const response = await getDoctorDetailBookingById(doctorId);
      if (response.data) setDoctor(response.data);
    } catch {
      message.error("Không thể tải thông tin bác sĩ");
      navigate("/booking/doctor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetail();
  }, [doctorId]);

  const handleBookAppointment = () => {
    if (!selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian khám");
      return;
    }
    navigate(
      `/booking/appointment/${doctorId}?timeSlot=${selectedTimeSlot}&date=${selectedDate}`
    );
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  if (!doctor) return null;

  return (
    // THÊM class doctor-text để reset word-break
    <div className="doctor-text min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            separator={<RightOutlined className="text-gray-400" />}
            className="text-sm overflow-x-auto whitespace-nowrap"
          >
            <Breadcrumb.Item>
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/")}
                className="!p-0 !h-auto !text-gray-600 hover:!text-blue-600"
                icon={<HomeOutlined />}
              >
                Trang chủ
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/booking-options")}
                className="!p-0 !h-auto !text-gray-600 hover:!text-blue-600"
              >
                Hình thức đặt lịch
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/booking-options/doctor")}
                className="!p-0 !h-auto !text-gray-600 hover:!text-blue-600"
              >
                Tìm bác sĩ
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="text-blue-600 font-medium">
              {doctor.title} {doctor.fullName}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <Row gutter={[24, 24]}>
          {/* Left */}
          <Col xs={24} lg={16} className="min-w-0">
            <Card className="mb-6 border-0 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Avatar */}
                <div className="md:self-start flex-shrink-0">
                  <Avatar
                    size={{ xs: 72, sm: 88, md: 108, lg: 120, xl: 128 }}
                    src={doctor.avatarUrl || undefined}
                    style={{
                      backgroundImage: !doctor.avatarUrl
                        ? "linear-gradient(135deg, #1890ff, #096dd9)"
                        : undefined,
                      color: "#fff",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #ffffff",
                      boxShadow: "0 8px 25px rgba(24, 144, 255, 0.25)",
                    }}
                  >
                    {!doctor.avatarUrl && doctor.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Title
                    level={3}
                    className="!mb-2 md:!mb-3 !text-gray-800 !leading-tight truncate"
                  >
                    {doctor.title} {doctor.fullName}
                  </Title>

                  <div className="space-y-2 md:space-y-2.5 mb-3 md:mb-4 text-[14px] md:text-[15px] leading-snug">
                    <div className="flex items-start gap-2 text-gray-600">
                      <UserOutlined className="relative top-[2px]" />
                      <span>
                        Hơn {doctor.experienceYears} năm kinh nghiệm khám các vấn đề sức khỏe
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 min-w-0">
                      <EnvironmentOutlined className="relative top-[2px]" />
                      <span className="truncate max-w-full">
                        {doctor.clinic.clinicName}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <EnvironmentOutlined className="relative top-[2px]" />
                      <span>Từng tu nghiệp tại nước ngoài: Singapore, Hoa Kỳ</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2 text-gray-600 min-w-0">
                      <EnvironmentOutlined />
                      <span className="truncate max-w-full">{doctor.clinic.city}</span>
                    </div>
                    <Button
                      type="primary"
                      icon={<ShareAltOutlined />}
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    >
                      Chia sẻ
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <Title level={4} className="!mb-3 !text-gray-800">
                Khám và điều trị
              </Title>

              <div className="space-y-2.5 text-gray-700 leading-relaxed text-[14px] md:text-[15px]">
                <div>
                  • Phẫu thuật điều trị các bệnh lý cột sống – tủy sống: thoát vị đĩa đệm cổ/lưng;
                  hẹp ống sống; u tủy sống; lao cột sống; viêm dính khớp; trượt đốt sống…
                </div>
                <div>• Tạo hình thân sống bằng cement sinh học</div>
                <div>
                  • Phẫu thuật các bệnh lý về não: u não, giãn não thất, túi phình mạch, dị dạng mạch,
                  xuất huyết não, chấn thương sọ não…
                </div>
              </div>
            </Card>
          </Col>

          {/* Right */}
          <Col xs={24} lg={8} className="min-w-0">
            <div className="space-y-6 lg:sticky lg:top-4">
              <Card className="border-0 shadow-sm">
                <Select
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="w-full mb-4"
                  size="large"
                >
                  <Option value="today">Hôm nay - 19/8</Option>
                  <Option value="tomorrow">Ngày mai - 20/8</Option>
                  <Option value="day3">Thứ 6 - 21/8</Option>
                </Select>

                <Title level={5} className="!mb-3 !text-gray-800">
                  LỊCH KHÁM
                </Title>

                {/* mobile 2 cột, >=sm 3 cột */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type={selectedTimeSlot === slot ? "primary" : "default"}
                      className={`w-full text-xs md:text-sm ${
                        selectedTimeSlot === slot
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-600"
                      }`}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>

                <Text className="block text-sm text-gray-500 mb-3">
                  Chọn và đặt (Phí đặt lịch 0đ)
                </Text>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleBookAppointment}
                  disabled={!selectedTimeSlot}
                  className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600"
                  icon={<CalendarOutlined />}
                >
                  Đặt lịch khám
                </Button>
              </Card>

              <Card className="border-0 shadow-sm">
                <Title level={5} className="!mb-3 !text-gray-800">
                  ĐỊA CHỈ KHÁM
                </Title>
                <div className="space-y-2 text-[14px] md:text-[15px]">
                  <div className="text-blue-600 font-medium">
                    {doctor.clinic.clinicName}
                  </div>
                  <div className="text-gray-600">
                    {doctor.clinic.street}, {doctor.clinic.district}, {doctor.clinic.city}
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-600">GIÁ KHÁM:</Text>
                    <Text className="font-semibold text-blue-600 text-lg">
                      {formatCurrency(Number(doctor.consultationFee))}
                    </Text>
                  </div>
                  <Button type="link" className="!p-0 !h-auto text-blue-600">
                    Xem chi tiết
                  </Button>
                  <Divider className="!my-2" />
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-600">BẢO HIỂM ÁP DỤNG</Text>
                    <Button type="link" className="!p-0 !h-auto text-blue-600">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={4.5} character={<StarFilled />} />
                  <Text className="font-medium">4.5</Text>
                  <Text className="text-gray-500">(127 đánh giá)</Text>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
