import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Empty,
  Tag,
  message,
} from "antd";
import {
  CalendarOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "@/components/contexts/app.context";
import {
  getAllClinics,
  getAllTimeSlots,
  getScheduleByDoctorId,
  updateExpiredTimeSlots,
} from "../../services/doctor.api";
import type { ISchedule, ITimeSlotDetail } from "@/types/schedule";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DoctorScheduleCreate from "./DoctorSchedule.create";
import type { IClinic } from "@/types";

dayjs.extend(utc);

const { Title, Text } = Typography;

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingExpired, setUpdatingExpired] = useState(false);
  const { user } = useCurrentApp();

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [timeSlots, setTimeSlots] = useState<ITimeSlotDetail[]>([]);
  const [clinics, setClinics] = useState<IClinic[]>([]);

  const fetchDoctorSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getScheduleByDoctorId(user?.id as string);

      setSchedules(res?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchAllTimeSlots = useCallback(async () => {
    const res = await getAllTimeSlots();
    setTimeSlots(res?.data || []);
  }, []);

  const fetchAllClinics = useCallback(async () => {
    const res = await getAllClinics();
    setClinics(res?.data?.result || []);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      if (user?.id) {
        try {
          await updateExpiredTimeSlots();
          console.log("✅ Đã tự động cập nhật time slots hết hạn");
        } catch (error) {
          console.log("⚠️ Lỗi khi tự động cập nhật expired slots:", error);
        }

        fetchDoctorSchedule();
        fetchAllTimeSlots();
        fetchAllClinics();
      }
    };

    initializeData();
  }, [user?.id, fetchDoctorSchedule, fetchAllTimeSlots, fetchAllClinics]);

  const sortedSchedules = useMemo(() => {
    return [...schedules].sort(
      (a, b) => dayjs.utc(a.date).valueOf() - dayjs.utc(b.date).valueOf()
    );
  }, [schedules]);

  if (loading) {
    return (
      <div className="h-fullbg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Đang tải lịch làm việc...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="!mb-0">
            Lịch làm việc của tôi
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
          >
            Tạo lịch
          </Button>
        </div>

        {sortedSchedules.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center rounded-xl">
            <Empty description="Chưa có lịch làm việc" />
            <Button type="primary" className="mt-4" icon={<PlusOutlined />}>
              Tạo lịch đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="shadow-lg border-0 rounded-xl"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-blue-600" />
                      <span className="text-base font-semibold">
                        Ngày{" "}
                        {dayjs(schedule.date).isValid()
                          ? dayjs(schedule.date).format("DD/MM/YYYY")
                          : "Invalid Date"}
                      </span>
                    </div>
                    <Tag
                      color={
                        schedule.timeSlots.some(
                          (slot) => slot.status === "OPEN"
                        )
                          ? "green"
                          : "default"
                      }
                    >
                      {schedule.timeSlots.some((slot) => slot.status === "OPEN")
                        ? "Còn khung giờ mở"
                        : "Tất cả hết hạn"}
                    </Tag>
                  </div>
                }
              >
                {schedule.timeSlots.length === 0 ? (
                  <Empty description="Không có khung giờ" />
                ) : (
                  <Row gutter={[16, 16]}>
                    {schedule.timeSlots
                      .sort((a, b) => {
                        // Sắp xếp: OPEN lên trên, EXPIRED xuống dưới
                        if (a.status === "OPEN" && b.status === "EXPIRED")
                          return -1;
                        if (a.status === "EXPIRED" && b.status === "OPEN")
                          return 1;
                        // Nếu cùng status, sắp xếp theo thời gian
                        return a.timeSlot.startTime.localeCompare(
                          b.timeSlot.startTime
                        );
                      })
                      .map((slot) => {
                        const start = slot.timeSlot.startTime || "00:00";
                        const end = slot.timeSlot.endTime || "00:00";
                        const isFull = slot.currentBooking >= slot.maxBooking;
                        const isExpired = slot.status === "EXPIRED";

                        // Xác định màu và text cho tag status
                        const getStatusTag = () => {
                          if (isExpired) {
                            return { color: "default", text: "Hết hạn" };
                          }
                          if (isFull) {
                            return { color: "red", text: "Đầy" };
                          }
                          return { color: "green", text: "Còn chỗ" };
                        };

                        const statusTag = getStatusTag();

                        return (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            key={`${schedule.id}-${slot.timeSlotId}`}
                          >
                            <Card
                              className={`border rounded-lg ${
                                isExpired ? "opacity-60" : ""
                              }`}
                              bodyStyle={{ padding: 16 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Text
                                  strong
                                  className={isExpired ? "text-gray-400" : ""}
                                >
                                  {start} - {end}
                                </Text>
                                <Tag color={statusTag.color}>
                                  {statusTag.text}
                                </Tag>
                              </div>
                              <div className="text-sm text-gray-600">
                                <div>
                                  Đã đặt: {slot.currentBooking}/
                                  {slot.maxBooking}
                                </div>
                                <div className="text-xs mt-1">
                                  Trạng thái:{" "}
                                  {slot.status === "OPEN" ? "Mở" : "Hết hạn"}
                                </div>
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                  </Row>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <DoctorScheduleCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        timeSlots={timeSlots}
        clinics={clinics}
      />
    </>
  );
};

export default DoctorSchedule;
