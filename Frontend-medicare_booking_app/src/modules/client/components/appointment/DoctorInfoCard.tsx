import type { IDoctorProfile } from "@/types";
import { Card, Typography, Avatar, Space, Tag, Divider } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

interface IProps {
  doctor: IDoctorProfile;
}

const cls = (...x: (string | false | undefined)[]) => x.filter(Boolean).join(" ");

const DoctorInfoCard = (props: IProps) => {
  const { doctor } = props;
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  // tokens theo palette đã dùng ở các trang khác
  const cardCls = isDark
    ? "!bg-[#0e1625] !border !border-[#1e293b66] !shadow-black/20"
    : "!bg-white !border";
  const titleTx = isDark ? "!text-slate-100" : "!text-gray-900";
  const mutedTx = isDark ? "!text-slate-400" : "!text-gray-500";

  const infoBoxStyle = isDark
    ? {
        background: "#101b2d",
        border: "1px solid #1e293b66",
      }
    : {
        background: "#fff7e6",
        border: "1px solid #ffd591",
      };

  const priceBoxStyle = isDark
    ? {
        background: "#0f1a2b",
        border: "1px solid #1e293b66",
      }
    : {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
      };

  return (
    <Card
      className={cls("rounded-xl sticky", cardCls)}
      style={{
        top: 24,
      }}
      bodyStyle={{ padding: 24 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Tag
          className={cls(
            "rounded-full px-3",
            isDark
              ? "!bg-[#12263f] !border-[#2a3b56] !text-[#f7b955]"
              : ""
          )}
          color={isDark ? undefined : "orange"}
          style={{ marginBottom: 12 }}
        >
          ĐẶT LỊCH KHÁM
        </Tag>
        <Title level={4} className={cls("!m-0", titleTx)}>
          {doctor.fullName}
        </Title>
      </div>

      {/* Doctor Avatar & Basic Info */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <Avatar
          size={64}
          src={doctor.avatarUrl || undefined}
          icon={!doctor.avatarUrl ? <UserOutlined /> : undefined}
          style={{
            marginRight: 12,
            backgroundImage: !doctor.avatarUrl
              ? "linear-gradient(135deg, #1890ff, #096dd9)"
              : undefined,
            color: "#fff",
          }}
        />
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <StarFilled style={{ color: isDark ? "#f59e0b" : "#faad14", marginRight: 4 }} />
            <Text strong className={isDark ? "!text-slate-200" : ""}>
              4.8
            </Text>
            <Text className={cls("ml-2", mutedTx)}>
              {doctor.experienceYears}+ năm kinh nghiệm
            </Text>
          </div>
          <Text className={mutedTx}>
            {doctor.specialty?.specialtyName || "Chuyên khoa"}
          </Text>
        </div>
      </div>

      {/* Schedule Info */}
      <div
        style={{
          ...infoBoxStyle,
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ color: isDark ? "#f7b955" : "#fa8c16", marginRight: 8 }} />
          <Text className={isDark ? "!text-slate-200" : ""} strong>
            Thứ 2 - Chủ nhật
          </Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
          <ClockCircleOutlined style={{ color: isDark ? "#f7b955" : "#fa8c16", marginRight: 8 }} />
          <Text className={isDark ? "!text-slate-200" : ""} strong>
            8:00 - 17:00
          </Text>
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
          <EnvironmentOutlined
            style={{
              color: isDark ? "#86efac" : "#52c41a",
              marginRight: 8,
              marginTop: 2,
            }}
          />
        </div>
        <Text strong className={isDark ? "!text-slate-200" : ""} style={{ display: "block", marginBottom: 4 }}>
          {doctor.clinic?.clinicName || "Phòng khám"}
        </Text>
        <Text className={cls(mutedTx)} style={{ fontSize: 14, lineHeight: 1.5 }}>
          {doctor.clinic
            ? `${doctor.clinic.street}, ${doctor.clinic.district}, ${doctor.clinic.city
                .replace("HoChiMinh", "Hồ Chí Minh")
                .replace("HaNoi", "Hà Nội")}`
            : "Địa chỉ phòng khám"}
        </Text>
      </div>

      {/* Price */}
      <div
        style={{
          ...priceBoxStyle,
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Text
            strong
            style={{
              fontSize: 16,
              color: isDark ? "#7dd3fc" : "#52c41a",
            }}
          >
            💰 Chi phí khám bệnh
          </Text>
        </div>

        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text className={mutedTx}>Phí khám:</Text>
            <Text strong style={{ color: isDark ? "#7dd3fc" : "#52c41a" }}>
              {Number(doctor.consultationFee) > 0
                ? `${Number(doctor.consultationFee)?.toLocaleString()}đ`
                : "Miễn phí"}
            </Text>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text className={mutedTx}>Phí đặt lịch:</Text>
            <Text strong style={{ color: isDark ? "#86efac" : "#52c41a" }}>
              {Number(doctor.bookingFee)?.toLocaleString()}đ
            </Text>
          </div>

          <Divider style={{ margin: "8px 0", borderColor: isDark ? "#1e293b66" : undefined }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong className={isDark ? "!text-slate-200" : ""} style={{ fontSize: 16 }}>
              Tổng cộng:
            </Text>
            <Text strong style={{ fontSize: 18, color: isDark ? "#86efac" : "#52c41a" }}>
              {(Number(doctor.consultationFee) + Number(doctor.bookingFee))?.toLocaleString()}đ
            </Text>
          </div>
        </Space>
      </div>

      <Divider style={{ borderColor: isDark ? "#1e293b66" : undefined }} />

      {/* Payment Info */}
      <div style={{ textAlign: "center" }}>
        <Text
          strong
          className={isDark ? "!text-blue-300" : ""}
          style={{ marginBottom: 8, display: "block" }}
        >
          Hình thức thanh toán
        </Text>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SafetyCertificateOutlined style={{ color: isDark ? "#86efac" : "#52c41a", marginRight: 4 }} />
          <Text className={mutedTx}>Thanh toán sau tại cơ sở y tế</Text>
        </div>
      </div>
    </Card>
  );
};

export default DoctorInfoCard;
