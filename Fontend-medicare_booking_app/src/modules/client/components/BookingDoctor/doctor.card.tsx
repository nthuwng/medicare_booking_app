import React from "react";
import {
  Card,
  Avatar,
  Rate,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Badge,
  Grid,
} from "antd";
import {
  StarFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { IDoctorProfile } from "@/types";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(isNaN(Number(amount)) ? 0 : Number(amount));

type DoctorCardProps = {
  dataDoctors: IDoctorProfile[];
  setDataDoctors?: (doctors: IDoctorProfile[]) => void;
  searchText?: string;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ dataDoctors }) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // breakpoints
  const isXs = !!screens.xs && !screens.sm;
  const isSm = !!screens.sm && !screens.md;
  const isMdUp = !!screens.md;

  const avatarSize = isXs ? 72 : isSm ? 88 : 104;
  const cardPadding = isXs ? 16 : 24;
  const btnSize: "small" | "middle" = isXs ? "small" : "middle";

  const handleViewDoctorDetail = (doctorId: string) => {
    navigate(`/booking-options/doctor/${doctorId}`);
  };

  return (
    <div style={{ paddingInline: isXs ? 8 : 0 }}>
      {Array.isArray(dataDoctors) && dataDoctors.length > 0 && (
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 24 },
            { xs: 12, sm: 16, md: 24 },
          ]}
          wrap
        >
          {dataDoctors.map((doctor) => {
            const name = doctor?.fullName || "Bác sĩ";
            const specialty =
              doctor?.specialty?.specialtyName || "Chuyên khoa";
            const clinicName = doctor?.clinic?.clinicName || "Phòng khám";
            const exp = doctor?.experienceYears ?? 0;
            const rating = Number((doctor as any)?.rating ?? 4.5);
            const ratingCount = Number((doctor as any)?.ratingCount ?? 127);
            const consultationFee = Number(doctor?.consultationFee ?? 0);
            const bookingFee = Number(doctor?.bookingFee ?? 0);

            return (
              <Col key={doctor.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
                  bodyStyle={{ padding: cardPadding }}
                  style={{ height: "100%", borderRadius: 12, overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: isXs ? 12 : 16,
                      flexDirection: isXs ? "column" : "row",
                      flexWrap: "wrap", // tránh tràn khi thiếu chỗ
                      alignItems: isXs ? "stretch" : "flex-start",
                      minWidth: 0, // cho phép ellipsis hoạt động
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: isXs ? "center" : "flex-start",
                        width: isXs ? "100%" : "auto",
                      }}
                    >
                      <Badge dot color="#52c41a" offset={[-5, 5]}>
                        <Avatar
                          size={avatarSize}
                          src={doctor?.avatarUrl || undefined}
                          style={{
                            backgroundImage: !doctor?.avatarUrl
                              ? "linear-gradient(135deg, #1890ff, #096dd9)"
                              : undefined,
                            color: "#fff",
                            fontSize: isXs ? 28 : 42,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "4px solid #ffffff",
                            boxShadow: "0 6px 20px rgba(24, 144, 255, 0.25)",
                          }}
                        >
                          {!doctor?.avatarUrl && name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Header + Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: isXs ? "flex-start" : "center",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 8,
                          flexDirection: isXs ? "column" : "row",
                          minWidth: 0,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Title
                            level={4}
                            className="!mb-1 !text-gray-800"
                            style={{ marginBottom: 4 }}
                            ellipsis
                          >
                            {name}
                          </Title>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            <Tag color="blue" style={{ borderRadius: 999 }}>
                              {specialty}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {exp} năm kinh nghiệm
                            </Text>
                          </div>
                        </div>

                        <div
                          style={{
                            textAlign: isXs ? "left" : "right",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 2,
                              flexWrap: "nowrap",
                            }}
                          >
                            <Rate
                              disabled
                              allowHalf
                              value={rating}
                              character={<StarFilled />}
                            />
                            <Text style={{ fontSize: 12, fontWeight: 600 }}>
                              {rating.toFixed(1)}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ({ratingCount} đánh giá)
                          </Text>
                        </div>
                      </div>

                      {/* Clinic & Location */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          marginBottom: 8,
                          flexWrap: "wrap",
                          color: "rgba(0,0,0,.65)",
                          fontSize: 13,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            minWidth: 0,
                          }}
                        >
                          <EnvironmentOutlined />
                          <Text ellipsis style={{ minWidth: 0 }}>
                            {clinicName}
                          </Text>
                        </span>
                        <span
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <ClockCircleOutlined />
                          8 lịch trống
                        </span>
                      </div>

                      {/* Bio */}
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                          marginBottom: 12,
                          color: "rgba(0,0,0,.65)",
                          fontSize: 13,
                          wordBreak: "break-word",
                        }}
                      >
                        {doctor?.bio ||
                          "Bác sĩ chuyên khoa với nhiều năm kinh nghiệm trong lĩnh vực y tế."}
                      </Paragraph>

                      {/* Fees & Actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: isXs ? "stretch" : "center",
                          justifyContent: "space-between",
                          gap: 12,
                          flexDirection: isXs ? "column" : "row",
                          minWidth: 0,
                        }}
                      >
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Phí khám
                            </Text>
                            <div style={{ fontWeight: 600, color: "#1677ff" }}>
                              {formatCurrency(consultationFee)}
                            </div>
                          </div>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Phí đặt lịch
                            </Text>
                            <div style={{ fontWeight: 600, color: "#52c41a" }}>
                              {formatCurrency(bookingFee)}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            justifyContent: isXs ? "stretch" : "flex-end",
                            width: isXs ? "100%" : "auto",
                          }}
                        >
                          <Button
                            size={btnSize}
                            onClick={() => handleViewDoctorDetail(doctor.id)}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            style={{ width: isXs ? "100%" : "auto" }}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            type="primary"
                            size={btnSize}
                            onClick={() =>
                              navigate(
                                `/booking-options/doctor/${doctor.id}/appointment`
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                            icon={<CalendarOutlined />}
                            style={{ width: isXs ? "100%" : "auto" }}
                          >
                            Đặt lịch
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default DoctorCard;
