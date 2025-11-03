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
  Tooltip,
} from "antd";
import {
  StarFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { IDoctorProfile } from "@/types";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text, Paragraph } = Typography;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

type DoctorCardProps = {
  dataDoctors: IDoctorProfile[];
  setDataDoctors: (doctors: IDoctorProfile[]) => void;
  searchText: string;
};

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const DoctorCard = (props: DoctorCardProps) => {
  const { dataDoctors } = props;
  const navigate = useNavigate();
  const { user, theme } = useCurrentApp();
  const isDark = theme === "dark";

  const handleViewDoctorDetail = (doctorId: string) => {
    navigate(`/booking-options/doctor/${doctorId}`);
  };

  return (
    <>
      {/* Fallback cho AntD < v5: ép body về màu dark */}
      {isDark && (
        <style>{`
          .doctor-card .ant-card-body { background:#0e1625 !important; }
          .doctor-card { background:#0e1625 !important; border-color:#1e293b66 !important; }
        `}</style>
      )}

      {dataDoctors.length > 0 && (
        <Row gutter={[24, 24]}>
          {dataDoctors.map((doctor) => (
            <Col key={doctor.id} xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card
                className={cls(
                  "doctor-card hover:shadow-lg transition-all duration-300 h-full",
                  isDark ? "" : "border-0 shadow-sm bg-white"
                )}
                // ✅ AntD v5: styles.body để đổi nền phần body
                styles={{
                  body: {
                    padding: 24,
                    background: isDark ? "#0e1625" : "#ffffff",
                  },
                }}
                style={{
                  background: isDark ? "#0e1625" : "#ffffff",
                  border: isDark ? "1px solid #1e293b66" : "0",
                  boxShadow: isDark
                    ? "0 12px 28px rgba(2,6,23,0.45)"
                    : "0 4px 14px rgba(0,0,0,0.06)",
                  borderRadius: 12,
                }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 md:self-start self-center">
                    <Badge dot color="#52c41a" offset={[-5, 5]}>
                      <Avatar
                        size={96}
                        src={doctor.avatarUrl || undefined}
                        style={{
                          backgroundImage: !doctor.avatarUrl
                            ? "linear-gradient(135deg, #1890ff, #096dd9)"
                            : undefined,
                          color: "#fff",
                          fontSize: 42,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "4px solid #ffffff",
                          boxShadow: "0 6px 20px rgba(24,144,255,0.25)",
                        }}
                      >
                        {!doctor.avatarUrl &&
                          doctor.fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex md:flex-row flex-col items-start md:items-center justify-between mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <Title
                          level={4}
                          className={cls(
                            "!mb-1 truncate",
                            isDark ? "!text-slate-100" : "!text-gray-800"
                          )}
                        >
                          {doctor.fullName}
                        </Title>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Tag
                            className={cls(
                              "rounded-full whitespace-normal",
                              isDark
                                ? "!bg-[#12263f] !border-[#2a3b56] !text-[#9cc5ff]"
                                : ""
                            )}
                            color={isDark ? undefined : "blue"}
                          >
                            {doctor.specialty.specialtyName}
                          </Tag>
                          <Text
                            className={cls(
                              isDark ? "text-slate-300" : "text-gray-500",
                              "text-sm"
                            )}
                          >
                            {doctor.experienceYears} năm kinh nghiệm
                          </Text>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-right md:self-start self-stretch">
                        <div className="flex items-center gap-1 mb-1 md:justify-end">
                          <Rate
                            disabled
                            defaultValue={Number(
                              doctor.ratingStatsByDoctorId?.avgScore || 4.5
                            )}
                            className="text-sm"
                            character={<StarFilled />}
                            style={{ color: isDark ? "#60a5fa" : undefined }}
                          />
                          <Text
                            className={cls(
                              "text-sm font-medium",
                              isDark ? "text-slate-200" : "text-gray-700"
                            )}
                          >
                            {Number(
                              doctor.ratingStatsByDoctorId?.avgScore || 4.5
                            ).toFixed(1)}
                          </Text>
                        </div>
                        <Text
                          className={cls(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-gray-500"
                          )}
                        >
                          ({doctor.ratingStatsByDoctorId?.totalReviews || 0}{" "}
                          đánh giá)
                        </Text>
                      </div>
                    </div>

                    {/* Clinic & Location */}
                    <div
                      className={cls(
                        "flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-sm",
                        isDark ? "text-slate-300" : "text-gray-600"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <EnvironmentOutlined />
                        <span>{doctor.clinic.clinicName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockCircleOutlined />
                        <span>8 lịch trống</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <Paragraph
                      className={cls(
                        "!mb-4 !text-sm line-clamp-3 md:line-clamp-2",
                        isDark ? "!text-slate-300" : "!text-gray-600"
                      )}
                      ellipsis={{ rows: 3 }}
                    >
                      {doctor.bio ||
                        "Bác sĩ chuyên khoa với nhiều năm kinh nghiệm trong lĩnh vực y tế."}
                    </Paragraph>

                    {/* Fees & Action */}
                    <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-3">
                      <div className="flex items-center gap-6">
                        <div>
                          <Text
                            className={cls(
                              "text-xs",
                              isDark ? "text-slate-400" : "text-gray-500"
                            )}
                          >
                            Phí khám
                          </Text>
                          <div
                            className={cls(
                              "font-semibold",
                              isDark ? "text-blue-300" : "text-blue-600"
                            )}
                          >
                            {formatCurrency(Number(doctor.consultationFee))}
                          </div>
                        </div>
                        <div>
                          <Text
                            className={cls(
                              "text-xs",
                              isDark ? "text-slate-400" : "text-gray-500"
                            )}
                          >
                            Phí đặt lịch
                          </Text>
                          <div
                            className={cls(
                              "font-semibold",
                              isDark ? "text-green-300" : "text-green-600"
                            )}
                          >
                            {formatCurrency(Number(doctor.bookingFee))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button
                          size="middle"
                          onClick={() => handleViewDoctorDetail(doctor.id)}
                          className={cls(
                            "w-full md:w-auto",
                            isDark
                              ? "border-[#3b82f6] text-[#93c5fd] !bg-[#0e244a] hover:!bg-[#0D1224]"
                              : "border-blue-600 text-blue-600 hover:bg-blue-50"
                          )}
                        >
                          Xem chi tiết
                        </Button>

                        {user?.userType === "PATIENT" ? (
                          <Button
                            type="primary"
                            size="middle"
                            onClick={() =>
                              navigate(
                                `/booking-options/doctor/${doctor.id}/appointment`
                              )
                            }
                            className={cls(
                              "w-full md:w-auto",
                              isDark
                                ? "bg-blue-500 border-blue-500 hover:bg-blue-100"
                                : "bg-blue-600 hover:bg-blue-700 border-blue-600"
                            )}
                            icon={<CalendarOutlined />}
                          >
                            Đặt lịch
                          </Button>
                        ) : (
                          <Tooltip title="Chỉ có bệnh nhân mới được đặt lịch">
                            <Button
                              type="primary"
                              size="middle"
                              disabled
                              className={cls(
                                "w-full md:w-auto",
                                isDark
                                  ? "bg-blue-500/60 border-blue-500/60"
                                  : "bg-blue-600 hover:bg-blue-700 border-blue-600"
                              )}
                              icon={<CalendarOutlined />}
                            >
                              Đặt lịch
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default DoctorCard;
