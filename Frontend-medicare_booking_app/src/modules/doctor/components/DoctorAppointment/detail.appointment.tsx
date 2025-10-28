import type { IAppointment } from "@/types";
import {
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Descriptions,
  Tag,
  Divider,
  Typography,
  Avatar,
  Row,
  Col,
  Space,
  Button,
} from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (open: boolean) => void;
  dataViewDetail: IAppointment | null;
  setDataViewDetail: (data: IAppointment | null) => void;
}

const AppointmentDetail = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;
  console.log("têst", dataViewDetail);
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const formatCurrency = (value?: string) => {
    if (!value) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(d);
  };

  const formatDateOnly = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(d);
  };

  const renderStatusTag = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return <Tag color="orange">Chờ xác nhận</Tag>;
      case "confirmed":
        return <Tag color="green">Đã xác nhận</Tag>;
      case "completed":
        return <Tag color="blue">Hoàn thành</Tag>;
      case "cancelled":
      case "canceled":
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>{status || "-"}</Tag>;
    }
  };

  const renderPaymentTag = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "unpaid":
      case "pending":
        return <Tag color="orange">Chưa thanh toán</Tag>;
      case "refunded":
        return <Tag color="blue">Đã hoàn tiền</Tag>;
      default:
        return <Tag>{status || "-"}</Tag>;
    }
  };

  const renderGender = (gender?: string) => {
    const g = (gender || "").toString().trim().toUpperCase();
    if (g === "MALE" || g === "M" || g === "NAM") return "Nam";
    if (g === "FEMALE" || g === "F" || g === "NU" || g === "NỮ") return "Nữ";
    return gender ? "Khác" : "-";
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BankOutlined style={{ color: "#1890ff" }} />
          Chi tiết cuộc hẹn
        </div>
      }
      width={600}
      onClose={onClose}
      open={openViewDetail}
      styles={{
        body: {
          padding: "24px",
          backgroundColor: "#fafafa",
        },
        header: {
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "16px",
        },
      }}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="40px">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              src={dataViewDetail?.doctor?.avatarUrl || undefined}
            />
          </Col>
          <Col flex="auto">
            <Typography.Text type="secondary">Bác sĩ</Typography.Text>
            <div style={{ fontWeight: 600 }}>
              {dataViewDetail?.doctor?.fullName || "-"}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {renderStatusTag(dataViewDetail?.status)}
              {renderPaymentTag(dataViewDetail?.paymentStatus)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "8px 0" }} />

        <Descriptions
          column={1}
          size="small"
          labelStyle={{ width: 160, color: "#64748b" }}
          contentStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label="Mã cuộc hẹn">
            {dataViewDetail?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            <Space size={6}>
              <CalendarOutlined />
              {formatDateTime(dataViewDetail?.appointmentDateTime)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Phòng khám">
            {dataViewDetail?.doctor?.clinicId ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên khoa">
            {dataViewDetail?.doctor?.specialtyId ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Khung giờ">
            {dataViewDetail?.timeSlotId ?? "-"}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Thông tin bệnh nhân</Divider>
        <Descriptions
          column={1}
          size="small"
          labelStyle={{ width: 160, color: "#64748b" }}
        >
          <Descriptions.Item label="Họ và tên">
            {dataViewDetail?.patient?.patientName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="SĐT">
            {dataViewDetail?.patient?.patientPhone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.patient?.patientEmail || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {renderGender(dataViewDetail?.patient?.patientGender)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {formatDateOnly(dataViewDetail?.patient?.patientDateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {[
              dataViewDetail?.patient?.patientAddress,
              dataViewDetail?.patient?.patientDistrict,
              dataViewDetail?.patient?.patientCity,
            ]
              .filter(Boolean)
              .join(", ") || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Lý do khám">
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {dataViewDetail?.patient?.reason || "-"}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Thanh toán</Divider>
        <Descriptions
          column={1}
          size="small"
          labelStyle={{ width: 160, color: "#64748b" }}
        >
          <Descriptions.Item label="Phí khám">
            {formatCurrency(dataViewDetail?.doctor?.consultationFee)}
          </Descriptions.Item>
          <Descriptions.Item label="Phí đặt lịch">
            {formatCurrency(dataViewDetail?.doctor?.bookingFee)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {formatCurrency(dataViewDetail?.totalFee)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {renderPaymentTag(dataViewDetail?.paymentStatus)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Đóng</Button>
          <Button type="primary" disabled>
            Xác nhận (sắp có)
          </Button>
        </Space>
      </Space>
    </Drawer>
  );
};

export default AppointmentDetail;
