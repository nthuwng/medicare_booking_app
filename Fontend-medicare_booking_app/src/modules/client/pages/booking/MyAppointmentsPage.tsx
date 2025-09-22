import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Segmented,
  Tag,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const statusColorMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: "processing", label: "Chờ xác nhận" },
  CONFIRMED: { color: "success", label: "Đã xác nhận" },
  COMPLETED: { color: "default", label: "Hoàn thành" },
  CANCELLED: { color: "error", label: "Đã hủy" },
};

type UIAppointment = {
  id: string;
  appointmentDateTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  patient?: { patientName?: string; patientPhone?: string };
  doctor?: {
    fullName?: string;
    title?: string;
    avatarUrl?: string;
    consultationFee?: number | string;
  };
  clinicName?: string;
};

const mockAppointments: UIAppointment[] = [
  {
    id: "APT-8f9a12cd",
    status: "CONFIRMED",
    appointmentDateTime: dayjs().add(2, "day").hour(9).minute(30).toISOString(),
    doctor: {
      fullName: "BS. Nguyễn Văn An",
      title: "Chuyên khoa Nội tổng quát",
      avatarUrl:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&q=80&auto=format&fit=crop",
      consultationFee: 250000,
    },
    patient: { patientName: "Trần Minh Quân", patientPhone: "0901 234 567" },
    clinicName: "Phòng khám Đa khoa Medicare - Cơ sở 1",
  },
  {
    id: "APT-3c21b78e",
    status: "PENDING",
    appointmentDateTime: dayjs().add(5, "day").hour(14).minute(0).toISOString(),
    doctor: {
      fullName: "BS. Lê Thảo Nhi",
      title: "Nhi khoa",
      avatarUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&q=80&auto=format&fit=crop",
      consultationFee: 300000,
    },
    patient: { patientName: "Nguyễn Gia Hân", patientPhone: "0912 345 678" },
    clinicName: "Bệnh viện Nhi Đồng",
  },
  {
    id: "APT-9d77aa12",
    status: "COMPLETED",
    appointmentDateTime: dayjs()
      .subtract(3, "day")
      .hour(10)
      .minute(15)
      .toISOString(),
    doctor: {
      fullName: "BS. Phạm Quốc Khánh",
      title: "Ngoại chấn thương chỉnh hình",
      avatarUrl:
        "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=120&q=80&auto=format&fit=crop",
      consultationFee: 350000,
    },
    patient: { patientName: "Đỗ Thành Long", patientPhone: "0987 654 321" },
    clinicName: "BV Chấn thương Chỉnh hình TP.HCM",
  },
  {
    id: "APT-1a2b3c4d",
    status: "CANCELLED",
    appointmentDateTime: dayjs()
      .subtract(10, "day")
      .hour(16)
      .minute(45)
      .toISOString(),
    doctor: {
      fullName: "BS. Trần Thu Uyên",
      title: "Da liễu",
      avatarUrl:
        "https://images.unsplash.com/photo-1550534791-2677533605a1?w=120&q=80&auto=format&fit=crop",
      consultationFee: 280000,
    },
    patient: { patientName: "Phạm Nhật Hạ", patientPhone: "0933 888 999" },
    clinicName: "Phòng khám Da liễu Skincare",
  },
];

const MyAppointmentsPage = () => {
  const [appointments] = useState<UIAppointment[]>(mockAppointments);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    const now = dayjs();
    return appointments.filter((a) => {
      const time = dayjs(a.appointmentDateTime);
      return filter === "upcoming" ? time.isAfter(now) : time.isBefore(now);
    });
  }, [appointments, filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch khám đã đặt</h1>
          <p className="text-gray-500">Xem và quản lý các lịch hẹn của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            size="middle"
            options={[
              { label: "Sắp tới", value: "upcoming" },
              { label: "Đã qua", value: "past" },
              { label: "Tất cả", value: "all" },
            ]}
            value={filter}
            onChange={(v) => setFilter(v as any)}
          />
          <Tooltip title="Hiển thị dữ liệu mẫu">
            <Button disabled>Mock</Button>
          </Tooltip>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <Empty description="Không có lịch hẹn" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a) => {
            const status = statusColorMap[a.status] ?? {
              color: "default",
              label: a.status,
            };
            return (
              <Card key={a.id} className="shadow-sm">
                <Flex justify="space-between" align="center" className="mb-3">
                  <Tag color={status.color}>{status.label}</Tag>
                  <div className="text-gray-400 text-sm">
                    Mã lịch hẹn: {a.id.slice(0, 8)}
                  </div>
                </Flex>

                <Flex gap={16} align="center" className="mb-3">
                  <Badge dot={a.status === "CONFIRMED"} offset={[0, 36]}>
                    <Avatar
                      size={56}
                      src={a.doctor?.avatarUrl}
                      icon={<UserOutlined />}
                    />
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium text-base">
                      {a.doctor?.fullName ?? "Bác sĩ"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {a.doctor?.title}
                    </div>
                  </div>
                </Flex>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <span>
                      {dayjs(a.appointmentDateTime).format("DD/MM/YYYY")}
                    </span>
                    <ClockCircleOutlined className="text-gray-500 ml-3" />
                    <span>{dayjs(a.appointmentDateTime).format("HH:mm")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdcardOutlined className="text-gray-500" />
                    <span>
                      {a.patient?.patientName} • {a.patient?.patientPhone}
                    </span>
                  </div>
                  {a.clinicName && (
                    <div className="flex items-center gap-2">
                      <EnvironmentOutlined className="text-gray-500" />
                      <span>{a.clinicName}</span>
                    </div>
                  )}
                </div>

                <Flex justify="space-between" align="center" className="mt-4">
                  <div className="text-gray-500 text-sm">
                    Phí khám:{" "}
                    <span className="text-gray-800 font-medium">
                      {a.doctor?.consultationFee ?? 0}đ
                    </span>
                  </div>
                  <Button type="primary">Xem chi tiết</Button>
                </Flex>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
