import React from "react";
import { Card, Typography, Row, Col, Button, Breadcrumb } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import doctorImage from "../../../assets/ForYouSection/Doctor-section.jpg";
import specialtyImage from "../../../assets/ForYouSection/Specialty-section.jpg";
import clinicImage from "../../../assets/ForYouSection/Clinic-section.jpg";
import BookingOptions from "../components/BookingOptions/BookingOptions";

const { Title, Paragraph, Text } = Typography;

type ColorKey = "blue" | "green" | "purple";

const COLOR_STYLES: Record<
  ColorKey,
  {
    iconText: string;
    iconBg: string;
    ringHover: string;
    btn: string;
    btnHover: string;
    btnFocus: string;
    pillText: string;
    pillBg: string;
  }
> = {
  blue: {
    iconText: "text-blue-600",
    iconBg: "bg-blue-50",
    ringHover: "hover:ring-blue-100",
    btn: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
    btnFocus: "focus:ring-blue-300",
    pillText: "text-blue-700",
    pillBg: "bg-blue-50",
  },
  green: {
    iconText: "text-green-600",
    iconBg: "bg-green-50",
    ringHover: "hover:ring-green-100",
    btn: "bg-green-600",
    btnHover: "hover:bg-green-700",
    btnFocus: "focus:ring-green-300",
    pillText: "text-green-700",
    pillBg: "bg-green-50",
  },
  purple: {
    iconText: "text-purple-600",
    iconBg: "bg-purple-50",
    ringHover: "hover:ring-purple-100",
    btn: "bg-purple-600",
    btnHover: "hover:bg-purple-700",
    btnFocus: "focus:ring-purple-300",
    pillText: "text-purple-700",
    pillBg: "bg-purple-50",
  },
};

const OPTIONS = [
  {
    id: "doctor",
    title: "Đặt lịch theo Bác sĩ",
    description: "Tìm và đặt lịch với bác sĩ cụ thể mà bạn tin tưởng.",
    image: "/src/assets/ForYouSection/Doctor-section.jpg",
    icon: <UserOutlined />,
    color: "blue" as ColorKey,
    path: "/booking/doctor",
    hint: "Cá nhân hoá theo bác sĩ",
  },
  {
    id: "specialty",
    title: "Đặt lịch theo Chuyên khoa",
    description:
      "Chọn chuyên khoa phù hợp với tình trạng sức khỏe hiện tại của bạn.",
    image: "/src/assets/ForYouSection/Specialty-section.jpg",
    icon: <MedicineBoxOutlined />,
    color: "green" as ColorKey,
    path: "/booking/specialty",
    hint: "Tập trung theo triệu chứng",
  },
  {
    id: "clinic",
    title: "Đặt lịch theo Phòng khám",
    description: "Chọn địa điểm thuận tiện để di chuyển và tái khám.",
    image: "/src/assets/ForYouSection/Clinic-section.jpg",
    icon: <HomeOutlined />,
    color: "purple" as ColorKey,
    path: "/booking/clinic",
    hint: "Ưu tiên vị trí gần bạn",
  },
];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            separator={<RightOutlined className="text-gray-400" />}
            className="text-sm"
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
            <Breadcrumb.Item className="text-blue-600 font-medium">
              Đặt lịch
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      {/* Header */}
      <header className="px-4 pt-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 !text-[14px]">
            Đặt lịch nhanh chóng • Bảo mật • Miễn phí
          </span>

          <Title
            level={1}
            className="!mt-2 !text-3xl sm:!text-4xl !font-bold !text-gray-800"
          >
            Đặt lịch khám bệnh
          </Title>

          <Paragraph className="!text-gray-600 !text-base max-w-3xl mx-auto !text-[17px]">
            Chọn cách thức đặt lịch phù hợp nhất với nhu cầu của bạn. Chúng tôi
            cung cấp nhiều lựa chọn để bạn dễ dàng tìm được bác sĩ và thời gian
            phù hợp.
          </Paragraph>
        </div>
      </header>

      {/* Cards */}
      <BookingOptions />

      {/* Gợi ý phụ */}
      <div className="max-w-7xl mx-auto flex justify-center items-center text-center px-4 pb-8 pt-8">
        <Text className="text-gray-500 !text-[17px]">
          Chưa biết bắt đầu từ đâu? Hãy thử{" "}
          <button
            onClick={() => navigate("/booking/specialty")}
            className="underline decoration-dashed underline-offset-4 hover:text-gray-700 transition-colors"
          >
            Chuyên khoa
          </button>{" "}
          để được gợi ý phù hợp.
        </Text>
      </div>
    </div>
  );
};

export default BookingPage;
