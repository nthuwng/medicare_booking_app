// src/pages/WeeklyWorkSchedule.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Spin,
  Tag,
  Tooltip,
  Typography,
  DatePicker,
  Col,
  Row,
} from "antd";
import { CiUser } from "react-icons/ci";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { getMyAppointmentsDisplayScheduleByUserIdAPI } from "../services/doctor.api";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

interface IPatient {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientGender: string;
}

interface IAppointment {
  id: string;
  appointmentDateTime: string; // ISO string
  status: "Pending" | "Confirmed" | "Cancelled" | string;
  paymentStatus: "Paid" | "Unpaid" | string;
  totalFee: string;
  patient?: IPatient;
}

const WeeklyWorkSchedule = () => {
  const { user } = useCurrentApp(); // lấy userId của bác sĩ
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  // tuần hiện tại (bắt đầu từ thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(() => {
    const today = dayjs();
    const weekday = today.day(); // 0: CN, 1: T2 ...
    const diffToMonday = (weekday + 6) % 7; // số ngày lùi về thứ 2
    return today.subtract(diffToMonday, "day");
  });

  // gọi API
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await getMyAppointmentsDisplayScheduleByUserIdAPI(user.id);
        // API của bạn trả về { length, success, message, data: [...] }
        setAppointments(res.data || []);
      } catch (error) {
        console.error("Failed to fetch weekly schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // 7 ngày của tuần hiện tại
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day"));
  }, [currentWeekStart]);

  // group appointment theo ngày
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, IAppointment[]> = {};
    weekDays.forEach((d) => {
      map[d.format("YYYY-MM-DD")] = [];
    });

    appointments.forEach((apt) => {
      const d = dayjs(apt.appointmentDateTime);
      const key = d.format("YYYY-MM-DD");
      if (map[key]) {
        map[key].push(apt);
      }
    });

    // sort theo giờ trong ngày
    Object.keys(map).forEach((key) => {
      map[key].sort(
        (a, b) =>
          dayjs(a.appointmentDateTime).valueOf() -
          dayjs(b.appointmentDateTime).valueOf()
      );
    });

    return map;
  }, [appointments, weekDays]);

  const handleChangeWeek = (offset: number) => {
    setCurrentWeekStart((prev) => prev.add(offset * 7, "day"));
  };

  const handleToday = () => {
    const today = dayjs();
    const weekday = today.day();
    const diffToMonday = (weekday + 6) % 7;
    setCurrentWeekStart(today.subtract(diffToMonday, "day"));
  };

  // Khi user chọn 1 ngày trên DatePicker
  const handlePickDate = (date: Dayjs | null) => {
    if (!date) return;
    const weekday = date.day();
    const diffToMonday = (weekday + 6) % 7;
    setCurrentWeekStart(date.subtract(diffToMonday, "day"));
  };

  const getPaymentTag = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Paid":
        return (
          <Tag color="blue" className="px-2">
            Paid
          </Tag>
        );
      case "Unpaid":
        return (
          <Tag color="default" className="px-2">
            Unpaid
          </Tag>
        );
      default:
        return (
          <Tag color="default" className="px-2">
            {paymentStatus}
          </Tag>
        );
    }
  };

  const getGenderTag = (gender: string) => {
    switch (gender) {
      case "Male":
        return <Tag color="blue">Nam</Tag>;
      case "Female":
        return <Tag color="pink">Nữ</Tag>;
      default:
        return <Tag color="default">{gender}</Tag>;
    }
  };

  const weekRangeLabel = `${currentWeekStart.format(
    "DD/MM"
  )} - ${currentWeekStart.add(6, "day").format("DD/MM/YYYY")}`;

  return (
    <div>
      <Card
        className="shadow-sm rounded-xl border border-gray-100 bg-white"
        bodyStyle={{ padding: 20 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-lg" />
            <Title level={4} style={{ margin: 0 }}>
              Weekly Work Schedule
            </Title>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 🔹 DatePicker chọn ngày */}
            <DatePicker
              format="DD/MM/YYYY"
              value={currentWeekStart}
              onChange={handlePickDate}
              allowClear={false}
              className="w-[140px]"
            />

            <Button
              icon={<LeftOutlined />}
              onClick={() => handleChangeWeek(-1)}
              className="flex items-center"
            />
            <Text className="font-medium min-w-[180px] text-center">
              {weekRangeLabel}
            </Text>
            <Button
              icon={<RightOutlined />}
              onClick={() => handleChangeWeek(1)}
              className="flex items-center"
            />
            <Button onClick={handleToday} className="ml-1">
              Today
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Nếu không có lịch nào trong tuần */}
            {weekDays.every(
              (d) =>
                (appointmentsByDay[d.format("YYYY-MM-DD")] || []).length === 0
            ) ? (
              <div className="py-10">
                <Empty description="No appointments in this week" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-3 min-w-[980px]">
                  {weekDays.map((day) => {
                    const key = day.format("YYYY-MM-DD");
                    const list = appointmentsByDay[key] || [];
                    const isToday = day.isSame(dayjs(), "day");

                    return (
                      <div
                        key={key}
                        className={`flex flex-col rounded-lg border bg-gray-50 ${
                          isToday
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Day header */}
                        <div
                          className={`px-3 py-2 border-b text-center ${
                            isToday ? "bg-blue-50" : "bg-gray-100"
                          }`}
                        >
                          <Text className="font-semibold text-sm">
                            {day.format("ddd")}
                          </Text>
                          <div className="text-xs text-gray-500">
                            {day.format("DD/MM")}
                          </div>
                          {isToday && (
                            <div className="mt-1 text-[11px] text-blue-500 font-semibold">
                              Today
                            </div>
                          )}
                        </div>

                        {/* Appointments */}
                        <div className="flex-1 p-2 space-y-2 max-h-[520px] overflow-y-auto">
                          {list.length === 0 ? (
                            <div className="text-xs text-gray-400 text-center mt-4">
                              No appointments
                            </div>
                          ) : (
                            list.map((apt) => {
                              const timeLabel = dayjs
                                .utc(apt.appointmentDateTime)
                                .format("HH:mm");
                              const patientName =
                                apt.patient?.patientName || "Unknown patient";
                              const phone = apt.patient?.patientPhone || "N/A";
                              const email = apt.patient?.patientEmail || "N/A";
                              const gender =
                                apt.patient?.patientGender || "N/A";

                              return (
                                <Tooltip
                                  key={apt.id}
                                  title={
                                    <div className="text-xs space-y-1">
                                      <div>
                                        <strong>Name:</strong> {patientName}
                                      </div>
                                      <div>
                                        <strong>Phone:</strong> {phone}
                                      </div>
                                      <div>
                                        <strong>Email:</strong> {email}
                                      </div>
                                      <div>
                                        <strong>Gender:</strong>{" "}
                                        {getGenderTag(gender)}
                                      </div>
                                      <div>
                                        <strong>Status:</strong> {apt.status}
                                      </div>
                                      <div>
                                        <strong>Payment:</strong>{" "}
                                        {apt.paymentStatus}
                                      </div>
                                      <div>
                                        <strong>Fee:</strong>{" "}
                                        {new Intl.NumberFormat("vi-VN").format(
                                          Number(apt.totalFee || 0)
                                        )}{" "}
                                        ₫
                                      </div>
                                    </div>
                                  }
                                >
                                  <div className="bg-zinc-200 rounded-md border border-gray-200 px-1 py-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center justify-between gap-1">
                                      <Row gutter={[4, 4]} className="w-full">
                                        <Col xs={24} md={24}>
                                          <Text className="text-xs font-semibold flex">
                                            <IoMdTime size={18} />
                                            <span className="ml-2 mr-2">
                                              {timeLabel}
                                            </span>
                                            {getPaymentTag(apt.paymentStatus)}
                                          </Text>
                                        </Col>

                                        <Col xs={24} md={24}>
                                          <div className="mt-1">
                                            <Text className="text-xs line-clamp-1 flex">
                                              <CiUser size={18} />
                                              <span className="ml-1">
                                                {patientName}
                                              </span>
                                            </Text>
                                            <Text className="block text-[11px] text-gray-400 flex">
                                              <AiOutlinePhone size={18} />
                                              <span className="ml-1">
                                                {phone}
                                              </span>
                                            </Text>
                                            <Text className="block text-[11px] text-gray-400 flex">
                                              <AiOutlineMail size={18} />
                                              <span className="ml-1">
                                                {email}
                                              </span>
                                            </Text>
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                  </div>
                                </Tooltip>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default WeeklyWorkSchedule;
