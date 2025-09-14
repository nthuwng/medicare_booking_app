import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Button, Typography, Spin, Empty, Tag } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { useCurrentApp } from "@/components/contexts/app.context";
import {
  getAllTimeSlots,
  getDoctorProfileByUserId,
  getScheduleByDoctorId,
  updateExpiredTimeSlots,
  getAllClinics, // <-- dùng để lấy danh sách phòng khám
} from "../../services/doctor.api";
import type { ISchedule, ITimeSlotDetail } from "@/types/schedule";
import type { IDoctorProfile } from "@/types";
import type { IClinic } from "@/types/clinic"; // IClinic có tenPhongKham?: string
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DoctorScheduleCreate from "./DoctorSchedule.create";

dayjs.extend(utc);
const { Title, Text } = Typography;

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentApp();

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [timeSlots, setTimeSlots] = useState<ITimeSlotDetail[]>([]);
  const [dataDoctor, setDataDoctor] = useState<IDoctorProfile>();
  const [clinics, setClinics] = useState<IClinic[]>([]);

  // ------- FETCHERS -------
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

  const fetchDetailDoctor = useCallback(async () => {
    const res = await getDoctorProfileByUserId(user?.id || "");
    setDataDoctor(res?.data);
  }, []);

  const fetchClinics = useCallback(async () => {
    try {
      const res = await getAllClinics();
      // ⚠️ API phân trang => lấy result
      setClinics(res?.data?.result || []);
    } catch (err) {
      console.error("Lỗi load clinics", err);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      if (!user?.id) return;

      try {
        await updateExpiredTimeSlots();
      } catch (error) {
        console.log("⚠️ Lỗi update expired slots:", error);
      }

      fetchDoctorSchedule();
      fetchAllTimeSlots();
      fetchDetailDoctor();
      fetchClinics();
    };

    initializeData();
  }, [user?.id, fetchDoctorSchedule, fetchAllTimeSlots, fetchDetailDoctor, fetchClinics]);

  // ------- SORTED SCHEDULES -------
  const sortedSchedules = useMemo(
    () =>
      [...schedules].sort(
        (a, b) => dayjs.utc(a.date).valueOf() - dayjs.utc(b.date).valueOf()
      ),
    [schedules]
  );

  // ------- MAP ID -> TÊN PHÒNG KHÁM -------
  const clinicNameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const c of clinics) {
      const label =
        (c as any)?.tenPhongKham ||
        (c as any)?.name ||
        (c as any)?.clinicName ||
        (c as any)?.clinic_name ||
        "";
      if (label) m.set(Number((c as any).id), String(label).trim());
    }
    return m;
  }, [clinics]);

  // Ưu tiên tên nhúng trong schedule.clinic nếu có
  const getClinicName = (s: ISchedule) => {
    const embedded =
      (s as any)?.clinic?.tenPhongKham ||
      (s as any)?.clinic?.name ||
      (s as any)?.clinic?.clinicName ||
      (s as any)?.clinic?.clinic_name ||
      "";
    if (String(embedded).trim()) return String(embedded).trim();

    const fromList = clinicNameById.get(Number((s as any).clinicId));
    return fromList || `Phòng khám #${(s as any).clinicId}`;
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
          <Title level={3} className="!mb-0">Lịch làm việc của tôi</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModalCreate(true)}>
            Tạo lịch
          </Button>
        </div>

        {sortedSchedules.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center rounded-xl">
            <Empty description="Chưa có lịch làm việc" />
            <Button
              type="primary"
              className="mt-4"
              icon={<PlusOutlined />}
              onClick={() => setOpenModalCreate(true)}
            >
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
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-blue-600" />
                        <span className="text-base font-semibold">
                          Ngày{" "}
                          {dayjs(schedule.date).isValid()
                            ? dayjs(schedule.date).format("DD/MM/YYYY")
                            : "Invalid Date"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Phòng khám: {getClinicName(schedule)}
                      </div>
                    </div>
                    <Tag
                      color={
                        schedule.timeSlots.some((slot) => slot.status === "OPEN")
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
                        if (a.status === "OPEN" && b.status === "EXPIRED") return -1;
                        if (a.status === "EXPIRED" && b.status === "OPEN") return 1;
                        return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
                      })
                      .map((slot) => {
                        const start = slot.timeSlot.startTime || "00:00";
                        const end = slot.timeSlot.endTime || "00:00";
                        const isFull = slot.currentBooking >= slot.maxBooking;
                        const isExpired = slot.status === "EXPIRED";
                        const statusTag = isExpired
                          ? { color: "default", text: "Hết hạn" }
                          : isFull
                          ? { color: "red", text: "Đầy" }
                          : { color: "green", text: "Còn chỗ" };

                        return (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            key={`${schedule.id}-${slot.timeSlotId}`}
                          >
                            <Card
                              className={`border rounded-lg ${isExpired ? "opacity-60" : ""}`}
                              bodyStyle={{ padding: 16 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Text strong className={isExpired ? "text-gray-400" : ""}>
                                  {start} - {end}
                                </Text>
                                <Tag color={statusTag.color}>{statusTag.text}</Tag>
                              </div>
                              <div className="text-sm text-gray-600">
                                <div>Đã đặt: {slot.currentBooking}/{slot.maxBooking}</div>
                                <div className="text-xs mt-1">
                                  Trạng thái: {slot.status === "OPEN" ? "Mở" : "Hết hạn"}
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

      {/* Modal tạo lịch */}
      <DoctorScheduleCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        timeSlots={timeSlots}
        clinics={clinics}                 // để Select hiển thị đúng tên
        doctorId={dataDoctor?.id || ""}   // truyền doctorId của bác sĩ
      />
    </>
  );
};

export default DoctorSchedule;
