import React from "react";
import {
  Drawer,
  Avatar,
  Typography,
  Tag,
  Button,
  Divider,
  Rate,
  Space,
  Empty,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { IDoctorProfileBooking } from "../../types";

const { Title, Text, Paragraph } = Typography;

type DoctorDetailProps = {
  open: boolean;
  doctor: IDoctorProfileBooking | null;
  onClose: () => void;
  onBook?: (doctorId: string) => void;
};

const DoctorDetail = (props: DoctorDetailProps) => {
  const { open, doctor, onClose, onBook } = props;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      title={
        <div className="flex items-center gap-4">
          <Avatar
            size={64}
            src={doctor?.avatarUrl || undefined}
            style={{
              backgroundImage: !doctor?.avatarUrl
                ? "linear-gradient(135deg, #1890ff, #096dd9)"
                : undefined,
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {!doctor?.avatarUrl && doctor?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Title level={4} className="!mb-1 !text-gray-800">
              {doctor?.fullName || "Bác sĩ"}
            </Title>
            <div className="flex items-center gap-2">
              {doctor?.specialty?.specialtyName && (
                <Tag color="blue" className="rounded-full">
                  {doctor.specialty.specialtyName}
                </Tag>
              )}
              {doctor?.experienceYears != null && (
                <Text className="text-gray-500">
                  {doctor.experienceYears} năm kinh nghiệm
                </Text>
              )}
            </div>
          </div>
        </div>
      }
      extra={
        doctor ? (
          <Space>
            <Button onClick={onClose}>Đóng</Button>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => doctor && onBook && onBook(doctor.id)}
            >
              Đặt lịch
            </Button>
          </Space>
        ) : null
      }
    >
      {!doctor ? (
        <Empty description="Không có dữ liệu bác sĩ" />
      ) : (
        <div className="space-y-6">
          <section>
            <div>
              <Title level={5} className="!mb-2">
                Thông tin chung
              </Title>
              <div className="flex items-center gap-4 text-gray-600">
                <EnvironmentOutlined />
                <span>{doctor.clinic?.clinicName}</span>
              </div>
            </div>
            <div className="mt-5">
              <Title level={5} className="!mb-2">
                Địa chỉ phòng khám
              </Title>
              <div className="flex items-center gap-4 text-gray-600">
                <EnvironmentOutlined />
                <span>
                  {doctor.clinic?.street}, {doctor.clinic?.district},{" "}
                  {doctor.clinic?.city}
                </span>
              </div>
            </div>
            <div className="mt-5">
              <Title level={5} className="!mb-2">
                Giới thiệu
              </Title>
              <div className="rounded-lg border p-3 text-gray-600">
                {doctor.bio || "Chưa có mô tả."}
              </div>
            </div>
          </section>

          <Divider className="!my-0" />

          <section>
            <Title level={5} className="!mb-2">
              Đánh giá
            </Title>
            <div className="flex items-center gap-2 mb-2">
              <Rate disabled defaultValue={4.5} character={<StarFilled />} />
              <Text className="text-gray-600">4.5</Text>
              <Text className="text-gray-400">(127 đánh giá)</Text>
            </div>
            <div className="rounded-lg border p-3 text-gray-600">
              Chức năng bình luận/đánh giá sẽ được bổ sung ở bước sau.
            </div>
          </section>

          <Divider className="!my-0" />

          <section className="flex items-center gap-8">
            <div>
              <Text className="text-xs text-gray-500">Phí khám</Text>
              <div className="font-semibold text-blue-600 text-lg">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(doctor.consultationFee))}
              </div>
            </div>
            <div>
              <Text className="text-xs text-gray-500">Phí đặt lịch</Text>
              <div className="font-semibold text-green-600 text-lg">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(doctor.bookingFee))}
              </div>
            </div>
          </section>
        </div>
      )}
    </Drawer>
  );
};

export default DoctorDetail;
