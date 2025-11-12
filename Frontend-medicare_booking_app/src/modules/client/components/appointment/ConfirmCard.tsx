import { Card, Typography, Row, Col } from "antd";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Text } = Typography;

type TimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  scheduleId: string;
};

type BookingFormData = {
  patientName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  province: string;
  district: string;
  address: string;
  reason: string;
  bookingFor: string;
  appointmentDate: string;
  timeSlotId: number;
  bookerName?: string;
  bookerPhone?: string;
  bookerEmail?: string;
  relationshipToPatient?: string;
};

interface IProps {
  formData: BookingFormData;
  availableTimeSlots: TimeSlot[];
}

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const ConfirmCard = (props: IProps) => {
  const { formData, availableTimeSlots } = props;
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

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

  const relationships = [
    { label: "Con", value: "child" },
    { label: "Cha/Mẹ", value: "parent" },
    { label: "Anh/Chị/Em", value: "sibling" },
    { label: "Vợ/Chồng", value: "spouse" },
    { label: "Ông/Bà", value: "grandparent" },
    { label: "Cháu", value: "grandchild" },
    { label: "Khác", value: "other" },
  ];

  const formatTimeSlot = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => time.substring(0, 5); // Remove seconds
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const cardBg = isDark
    ? "!bg-[#1a2332] !border-2 !border-[#2d3f5a]"
    : "!bg-white !border";

  const titleClass = isDark ? "!text-gray-100" : "!text-gray-800";
  const textStrongClass = isDark ? "!text-gray-300" : "!text-gray-700";
  const textNormalClass = isDark ? "!text-gray-400" : "!text-gray-600";
  const highlightClass = isDark ? "!text-blue-400" : "!text-blue-600";

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        {(() => {
          const currentFormData = formData;
          return (
            <div>
              {/* Thông tin người đặt lịch (nếu đặt cho người thân) */}
              {currentFormData?.bookingFor === "other" && (
                <Card
                  title={
                    <span className={titleClass}>
                      👤 Thông tin người đặt lịch
                    </span>
                  }
                  className={cls("!rounded-xl !mb-4 !shadow-md", cardBg)}
                  size="small"
                >
                  <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                      <Text strong className={textStrongClass}>
                        Họ tên:{" "}
                      </Text>
                      <Text className={textNormalClass}>
                        {formData?.bookerName}
                      </Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong className={textStrongClass}>
                        Mối quan hệ:{" "}
                      </Text>
                      <Text className={textNormalClass}>
                        {
                          relationships.find(
                            (rel) =>
                              rel.value === formData?.relationshipToPatient
                          )?.label
                        }
                      </Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong className={textStrongClass}>
                        Số điện thoại:{" "}
                      </Text>
                      <Text className={textNormalClass}>
                        {formData?.bookerPhone}
                      </Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong className={textStrongClass}>
                        Email:{" "}
                      </Text>
                      <Text className={textNormalClass}>
                        {formData?.bookerEmail}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Thông tin bệnh nhân */}
              <Card
                title={
                  <span className={titleClass}>
                    {formData?.bookingFor === "self"
                      ? "👤 Thông tin của bạn"
                      : "🏥 Thông tin bệnh nhân"}
                  </span>
                }
                className={cls("!rounded-xl !shadow-md", cardBg)}
                size="small"
              >
                <Row gutter={[16, 8]}>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Họ tên:{" "}
                    </Text>
                    <Text className={textNormalClass}>
                      {formData?.patientName}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Giới tính:{" "}
                    </Text>
                    <Text className={textNormalClass}>
                      {formData?.gender === "male" ? "Nam" : "Nữ"}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Số điện thoại:{" "}
                    </Text>
                    <Text className={textNormalClass}>{formData?.phone}</Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Email:{" "}
                    </Text>
                    <Text className={textNormalClass}>{formData?.email}</Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Năm sinh:{" "}
                    </Text>
                    <Text className={textNormalClass}>
                      {formData?.dateOfBirth}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Địa chỉ:{" "}
                    </Text>
                    <Text className={textNormalClass}>
                      {formData?.address},{" "}
                      {
                        districts.find((d) => d.value === formData?.district)
                          ?.label
                      }
                      ,{" "}
                      {
                        provinces.find((p) => p.value === formData?.province)
                          ?.label
                      }
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Ngày khám:{" "}
                    </Text>
                    <Text className={cls(highlightClass, "!font-semibold")}>
                      {formData?.appointmentDate}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong className={textStrongClass}>
                      Giờ khám:{" "}
                    </Text>
                    <Text className={cls(highlightClass, "!font-semibold")}>
                      {(() => {
                        const selectedSlot = availableTimeSlots.find(
                          (slot) => slot.id === formData?.timeSlotId
                        );
                        return selectedSlot
                          ? formatTimeSlot(
                              selectedSlot.startTime,
                              selectedSlot.endTime
                            )
                          : "Chưa chọn";
                      })()}
                    </Text>
                  </Col>
                  {formData?.reason && (
                    <Col span={24}>
                      <Text strong className={textStrongClass}>
                        Lý do khám:{" "}
                      </Text>
                      <Text className={textNormalClass}>
                        {formData?.reason}
                      </Text>
                    </Col>
                  )}
                </Row>
              </Card>
            </div>
          );
        })()}
      </div>
    </>
  );
};

export default ConfirmCard;
