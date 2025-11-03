import { Card, Avatar, Row, Col, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { IClinic } from "@/types";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

type BookingClinicProps = {
  dataClinics: IClinic[];
  setDataClinics: (clinics: IClinic[]) => void;
  searchText?: string;
};

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const BookingClinic = (props: BookingClinicProps) => {
  const { dataClinics } = props;
  const navigate = useNavigate();
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  const handleViewDoctors = (clinic: IClinic) => {
    navigate(
      `/booking-options/doctor?clinicId=${
        clinic.id
      }&clinicName=${encodeURIComponent(clinic.clinicName)}`
    );
  };

  return (
    <>
      {/* Shake animation */}
      <style>{`
        .clinic-card .ant-card {
          transition: transform .15s ease, box-shadow .15s ease !important;
        }
        .clinic-card .ant-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 28px rgba(0,0,0,.45) !important;
        }

        @keyframes micro-shake {
          0%   { transform: translate3d(0,0,0) rotate(0); }
          25%  { transform: translate3d(1.5px,0,0) rotate(.2deg); }
          50%  { transform: translate3d(-1.5px,0,0) rotate(-.2deg); }
          75%  { transform: translate3d(1px,0,0) rotate(.1deg); }
          100% { transform: translate3d(0,0,0) rotate(0); }
        }

        .clinic-card .ant-card:hover [data-shake] {
          animation: micro-shake .35s ease-in-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .clinic-card .ant-card,
          .clinic-card .ant-card:hover { transform:none; box-shadow:none; }
          .clinic-card .ant-card:hover [data-shake] { animation:none !important; }
        }
      `}</style>

      {dataClinics.length > 0 && (
        <Row gutter={[24, 24]} className="clinic-card">
          {dataClinics.map((clinic) => (
            <Col key={clinic.id} xs={24} md={12}>
              <Card
                className={cls(
                  "cursor-pointer rounded-2xl transition-all duration-300 h-full",
                  !isDark && "border-0 bg-white shadow-sm hover:shadow-lg",
                  isDark &&
                    "!bg-[#0e1625] !border !border-[#1e293b66] !shadow-md !hover:shadow-black/40"
                )}
                onClick={() => handleViewDoctors(clinic)}
                bodyStyle={{ padding: 20 }}
              >
                <div className="flex items-center gap-5">
                  <div data-shake>
                    <Avatar
                      size={104}
                      src={clinic.iconPath || undefined}
                      style={{
                        backgroundImage: !clinic.iconPath
                          ? "linear-gradient(135deg, #1890ff, #096dd9)"
                          : undefined,
                        color: "#fff",
                        fontSize: "42px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isDark
                          ? "4px solid #0b1220"
                          : "4px solid #ffffff",
                        boxShadow: isDark
                          ? "0 6px 18px rgba(0, 140, 255, 0.25)"
                          : "0 6px 20px rgba(24,144,255,0.25)",
                      }}
                    >
                      {!clinic.iconPath &&
                        clinic.clinicName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Title
                      level={4}
                      className={cls(
                        "!mb-1 truncate",
                        isDark ? "!text-slate-100" : "!text-gray-800"
                      )}
                    >
                      {clinic.clinicName}
                    </Title>
                    <Text
                      className={cls(
                        isDark ? "!text-slate-400" : "!text-gray-500"
                      )}
                    >
                      Xem bác sĩ theo phòng khám
                    </Text>
                  </div>

                  <RightOutlined
                    className={cls(
                      "transition-all duration-200",
                      isDark
                        ? "!text-slate-400 group-hover:text-blue-400"
                        : "!text-gray-400"
                    )}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default BookingClinic;
