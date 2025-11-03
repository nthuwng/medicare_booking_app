import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { ISpecialty } from "@/types";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

type SpecialtiesCardProps = {
  dataSpecialties: ISpecialty[];
  setDataSpecialties: (specialties: ISpecialty[]) => void;
  searchText?: string;
};

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const SpecialtiesCard = (props: SpecialtiesCardProps) => {
  const { dataSpecialties } = props;
  const navigate = useNavigate();
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  const handleViewDoctors = (specialty: ISpecialty) => {
    navigate(
      `/booking-options/doctor?specialtyId=${
        specialty.id
      }&specialtyName=${encodeURIComponent(specialty.specialtyName)}`
    );
  };

  {
    /* Đặt ngay đầu return, trước grid Row cũng được */
  }

  return (
    <>
      <style>{`
  /* hover nâng nhẹ card + shadow */
  .specialties-card .ant-card {
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease !important;
    will-change: transform, box-shadow !important;
  }
  .specialties-card .ant-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 26px rgba(0,0,0,.25) !important;
  }

  /* animation rung */
  @keyframes micro-shake {
    0%   { transform: translate3d(0,0,0) rotate(0) !important; }
    25%  { transform: translate3d(1.6px,0,0) rotate(.2deg); }
    50%  { transform: translate3d(-1.6px,0,0) rotate(-.2deg) !important; }
    75%  { transform: translate3d(1.2px,0,0) rotate(.1deg) !important; }
    100% { transform: translate3d(0,0,0) rotate(0) !important; }
  }

  /* Khi hover vào Card -> box ảnh rung 1 nhịp */
  .specialties-card .ant-card:hover [data-shake] {
    animation: micro-shake .35s ease-in-out both;
  }

  /* Tôn trọng người dùng hạn chế chuyển động */
  @media (prefers-reduced-motion: reduce) {
    .specialties-card .ant-card,
    .specialties-card .ant-card:hover { transform: none; box-shadow: none; }
    .specialties-card .ant-card:hover [data-shake] { animation: none !important; }
  }
`}</style>

      {dataSpecialties.length > 0 && (
        <Row gutter={[24, 24]} className="specialties-card">
          {dataSpecialties.map((specialty) => (
            <Col key={specialty.id} xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card
                onClick={() => handleViewDoctors(specialty)}
                bodyStyle={{ padding: "12px 12px 16px 12px" }}
                className={cls(
                  "transition-all duration-300 cursor-pointer rounded-2xl h-full",
                  // light
                  !isDark && "border-0 shadow-sm hover:shadow-md bg-white",
                  // dark
                  isDark &&
                    "!bg-[#0e1625] !border !border-[#1e293b66] !hover:!shadow-lg !hover:!shadow-black/20"
                )}
              >
                <div className="flex flex-col">
                  {/* Hộp ảnh / icon */}
                  <div
                    className={cls(
                      "w-full h-36 md:h-40 rounded-xl flex items-center justify-center overflow-hidden",
                      isDark
                        ? "!bg-gradient-to-b !from-[#0f1a2b] !to-[#0b1220] !border !border-[#1e293b66]"
                        : "!bg-gradient-to-b !from-[#fff9f0] !to-[#f3f9ff]"
                    )}
                    data-shake
                  >
                    {specialty.iconPath ? (
                      <img
                        src={specialty.iconPath}
                        alt={specialty.specialtyName}
                        className="max-h-28 md:max-h-32 object-contain"
                      />
                    ) : (
                      <div
                        className={cls(
                          "w-16 h-16 rounded-full text-white flex items-center justify-center text-xl font-semibold",
                          isDark
                            ? "!bg-gradient-to-tr !from-blue-500 !to-cyan-400"
                            : "!bg-gradient-to-tr !from-blue-500 !to-cyan-400"
                        )}
                      >
                        {specialty.specialtyName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Tiêu đề + mô tả */}
                  <div className="mt-3">
                    <Title
                      level={5}
                      className={cls(
                        "!m-0 !font-semibold truncate",
                        isDark ? "!text-slate-100" : "!text-gray-900"
                      )}
                    >
                      {specialty.specialtyName}
                    </Title>
                    <Text
                      className={cls(
                        isDark ? "!text-slate-400" : "!text-gray-500"
                      )}
                    >
                      Xem bác sĩ theo chuyên khoa
                    </Text>
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

export default SpecialtiesCard;
