import { useEffect, useRef, useState } from "react";
import {
  Button,
  Tag,
  Space,
  Avatar,
  Typography,
  Tooltip,
  Select,
  App,
  Card,
  Form,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("vi");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
import {
  ExportOutlined,
  EyeOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  getAllAppointmentsByUserIdDoctor,
  updateAppointmentStatus,
} from "../../services/doctor.api";
import type { IAppointment } from "@/types";
import { useCurrentApp } from "@/components/contexts/app.context";
import AppointmentDetail from "./detail.appointment";

const { Text } = Typography;

const TableAppointment = () => {
  const actionRef = useRef<ActionType>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IAppointment | null>(
    null
  );

  // ====== STATE FILTER ======
  const [filterType, setFilterType] = useState<"date" | "range">("date");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    string | undefined
  >();
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [form] = Form.useForm();
  // ==========================

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const { user } = useCurrentApp();
  const { message } = App.useApp();

  useEffect(() => {
    const handler = () => {
      actionRef.current?.reload();
    };
    window.addEventListener("doctor:appointment-refresh", handler);
    return () =>
      window.removeEventListener("doctor:appointment-refresh", handler);
  }, [actionRef]);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  // ====== HANDLER FILTER ======
  const handleFilterTypeChange = (value: "date" | "range") => {
    setFilterType(value);
    setSelectedDate(null);
    setDateRange([null, null]);
    setStatusFilter(undefined);
    setPaymentStatusFilter(undefined);
    form.resetFields();
  };

  const handleApplyFilters = () => {
    actionRef.current?.reload();
  };

  const handleClearFilters = () => {
    setSelectedDate(null);
    setDateRange([null, null]);
    setStatusFilter(undefined);
    setPaymentStatusFilter(undefined);

    form.resetFields();
    actionRef.current?.reload();
  };
  // ============================

  // Hàm tạo màu sắc cho trạng thái cuộc hẹn
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "orange";
      case "CONFIRMED":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      case "NO_SHOW":
        return "volcano";
      default:
        return "default";
    }
  };

  // Hàm tạo text hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      setUpdatingId(appointmentId);
      await updateAppointmentStatus(appointmentId, status);

      message.success(
        status === "Approved"
          ? "Duyệt bác sĩ thành công!"
          : status === "Rejected"
          ? "Từ chối bác sĩ thành công!"
          : "Chuyển về chờ duyệt thành công!"
      );

      actionRef.current?.reload();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Hàm tạo màu sắc cho trạng thái thanh toán
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "green";
      case "UNPAID":
        return "red";
    }
  };

  // Hàm tạo text hiển thị cho trạng thái thanh toán
  const getPaymentStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "Đã thanh toán";
      case "UNPAID":
        return "Chưa thanh toán";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const columns: ProColumns<IAppointment>[] = [
    {
      title: "Mã cuộc hẹn",
      dataIndex: "id",
      width: 120,
      hideInSearch: true,
      render(_, entity) {
        return (
          <Tooltip title="Nhấn để xem chi tiết">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }}
              style={{
                color: "#1890ff",
                fontWeight: 500,
              }}
            >
              #{entity.id.slice(-8)}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: "Thông tin bệnh nhân",
      dataIndex: "patient",
      width: 280,
      hideInSearch: true,
      render(_, entity) {
        const patient = entity.patient;
        if (!patient) return <Text type="secondary">Không có thông tin</Text>;

        const extractBirthYear = (dob?: string): number | undefined => {
          if (!dob) return undefined;
          if (dob.includes("T")) {
            const d = new Date(dob);
            const y = d.getUTCFullYear();
            return Number.isNaN(y) ? undefined : y;
          }
          const ymd = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
          const dmy = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
          let m: RegExpMatchArray | null = null;
          if ((m = dob.match(ymd))) {
            return parseInt(m[1], 10);
          }
          if ((m = dob.match(dmy))) {
            return parseInt(m[3], 10);
          }
          const fallback = new Date(dob).getUTCFullYear();
          return Number.isNaN(fallback) ? undefined : fallback;
        };
        const birthYear = extractBirthYear(patient.patientDateOfBirth);
        let ageYears: number | undefined = undefined;
        if (typeof birthYear === "number") {
          const currentYear = new Date().getFullYear();
          ageYears = Math.max(0, currentYear - birthYear);
        }

        return (
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size={4}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#87d068" }}
                />
                <div>
                  <Text strong style={{ fontSize: "14px" }}>
                    {patient.patientName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {patient.patientGender === "MALE" ? "Nam" : "Nữ"} •{" "}
                    {typeof ageYears === "number" ? ageYears : "-"} tuổi
                  </Text>
                </div>
              </div>
              <div style={{ marginLeft: 40 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 2,
                  }}
                >
                  <PhoneOutlined style={{ fontSize: "12px", color: "#666" }} />
                  <Text style={{ fontSize: "12px" }}>
                    {patient.patientPhone}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MailOutlined style={{ fontSize: "12px", color: "#666" }} />
                  <Text style={{ fontSize: "12px" }}>
                    {patient.patientEmail}
                  </Text>
                </div>
              </div>
            </Space>
          </div>
        );
      },
    },
    {
      title: "Ngày & Giờ hẹn",
      dataIndex: "appointmentDateTime",
      width: 180,
      hideInSearch: true,
      render(_, entity) {
        const d = new Date(entity.appointmentDateTime);
        const dateText = new Intl.DateTimeFormat("vi-VN", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(d);
        const timeText = new Intl.DateTimeFormat("vi-VN", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(d);
        const todayVN = new Date();
        const todayDateText = new Intl.DateTimeFormat("vi-VN", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(todayVN);
        const isToday = dateText === todayDateText;
        const isPast = d.getTime() < Date.now();

        return (
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size={4}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined
                  style={{ color: isToday ? "#52c41a" : "#1890ff" }}
                />
                <Text
                  strong={isToday}
                  style={{
                    color: isToday ? "#52c41a" : isPast ? "#ff4d4f" : "#333",
                    fontSize: "15px",
                  }}
                >
                  {dateText}
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginLeft: 2,
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: "15px", color: "#666" }}
                />
                <Text style={{ fontSize: "15px" }}>{timeText}</Text>
              </div>
              {isToday && (
                <Tag color="green" style={{ fontSize: "10px", margin: 0 }}>
                  Hôm nay
                </Tag>
              )}
            </Space>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      hideInSearch: true,
      render(_, entity) {
        return (
          <Space direction="vertical" size={4}>
            <Tag
              color={getStatusColor(entity.status)}
              style={{
                fontWeight: 500,
                fontSize: "13px",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {getStatusText(entity.status)}
            </Tag>
            <Tag
              color={getPaymentStatusColor(entity.paymentStatus)}
              style={{
                fontWeight: 500,
                fontSize: "13px",
                padding: "1px 6px",
                borderRadius: "10px",
              }}
            >
              <DollarOutlined style={{ fontSize: "15px", marginRight: 3 }} />
              {getPaymentStatusText(entity.paymentStatus)}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Phí khám",
      dataIndex: "totalFee",
      hideInSearch: true,
      render(_, entity) {
        return (
          <div>
            <Text strong style={{ color: "#52c41a", fontSize: "18px" }}>
              {new Intl.NumberFormat("vi-VN").format(parseInt(entity.totalFee))}
              đ
            </Text>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      hideInSearch: true,
      render(_, entity) {
        return (
          <div>
            <Text style={{ fontSize: "16px" }}>
              {dayjs(entity.createdAt).format("DD/MM/YYYY")}
            </Text>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 2,
              }}
            >
              <ClockCircleOutlined
                style={{ fontSize: "15px", color: "#666" }}
              />
              <Text type="secondary" style={{ fontSize: "15px" }}>
                {dayjs(entity.createdAt).format("HH:mm")}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      hideInSearch: true,
      render(_, entity) {
        return (
          <Space>
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <Button
                type="default"
                icon={<EyeOutlined />}
                size="middle"
                onClick={() => {
                  setDataViewDetail(entity);
                  setOpenViewDetail(true);
                }}
              >
                Xem
              </Button>
              <Select
                size="middle"
                style={{
                  width: 160,
                }}
                value={entity.status}
                loading={updatingId === entity.id}
                disabled={
                  updatingId === entity.id ||
                  entity.status.toUpperCase() === "CANCELLED" ||
                  entity.status.toUpperCase() === "COMPLETED"
                }
                onChange={(value) => handleUpdateStatus(entity.id, value)}
                options={(() => {
                  const baseOptions = [
                    {
                      value: "Pending",
                      label: "⏱ Chờ xác nhận",
                    },
                    {
                      value: "Confirmed",
                      label: "✓ Đã duyệt",
                    },
                  ];

                  if (entity.status.toUpperCase() === "CANCELLED") {
                    return [
                      ...baseOptions,
                      {
                        value: "Cancelled",
                        label: "✗ Đã hủy",
                      },
                    ];
                  }

                  if (entity.status.toUpperCase() === "COMPLETED") {
                    return [
                      ...baseOptions,
                      {
                        value: "Completed",
                        label: "✓ Hoàn thành",
                      },
                    ];
                  }

                  return baseOptions;
                })()}
              />
            </div>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {/* ====== BỘ LỌC LỊCH HẸN ====== */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontWeight: 600 }}>Bộ lọc cuộc hẹn</span>
          </div>
        }
        extra={
          <Button type="link" onClick={() => setShowFilters((v) => !v)}>
            {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
          </Button>
        }
      >
        {showFilters && (
          <Form form={form} layout="vertical">
            <Space
              size="large"
              style={{ width: "100%", flexWrap: "wrap", marginBottom: 8 }}
            >
              <Form.Item label="Loại bộ lọc">
                <Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  style={{ minWidth: 180 }}
                  options={[
                    { label: "Theo ngày cụ thể", value: "date" },
                    { label: "Theo khoảng ngày", value: "range" },
                  ]}
                />
              </Form.Item>

              {filterType === "date" && (
                <>
                  <Form.Item label="Chọn ngày">
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày"
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </>
              )}

              {filterType === "range" && (
                <>
                  <Form.Item label="Từ ngày">
                    <DatePicker
                      value={dateRange[0]}
                      onChange={(date) => setDateRange([date, dateRange[1]])}
                      format="DD/MM/YYYY"
                      placeholder="Từ ngày"
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  <Form.Item label="Đến ngày">
                    <DatePicker
                      value={dateRange[1]}
                      onChange={(date) => setDateRange([dateRange[0], date])}
                      format="DD/MM/YYYY"
                      placeholder="Đến ngày"
                      style={{ width: 200 }}
                      disabledDate={(current) => {
                        if (!dateRange[0]) return false;
                        return !!current && current < dateRange[0];
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </Space>

            {/* Thông tin filter hiện tại */}
            {(filterType === "date" && selectedDate) ||
            (filterType === "range" && dateRange[0] && dateRange[1]) ? (
              <div
                style={{
                  background: "#f0f5ff",
                  padding: 8,
                  borderRadius: 6,
                  marginBottom: 12,
                }}
              >
                <Text strong style={{ color: "#1d39c4" }}>
                  Bộ lọc hiện tại:{" "}
                </Text>
                {filterType === "date" && selectedDate && (
                  <Text>Ngày {selectedDate.format("DD/MM/YYYY")}</Text>
                )}
                {filterType === "range" && dateRange[0] && dateRange[1] && (
                  <Text>
                    Từ {dateRange[0].format("DD/MM/YYYY")} đến{" "}
                    {dateRange[1].format("DD/MM/YYYY")}
                  </Text>
                )}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                type="default"
              >
                Xóa bộ lọc
              </Button>
              <Button
                type="primary"
                onClick={handleApplyFilters}
                disabled={
                  (filterType === "date" && !selectedDate) ||
                  (filterType === "range" && (!dateRange[0] || !dateRange[1]))
                }
              >
                Áp dụng
              </Button>
            </div>
          </Form>
        )}
      </Card>
      {/* ============================ */}

      {/* ====== QUICK FILTER TRẠNG THÁI ====== */}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong style={{ fontSize: 14 }}>
          Lọc nhanh theo trạng thái
        </Text>

        <Space size="middle" wrap>
          <Select
            allowClear
            placeholder="Trạng thái cuộc hẹn"
            style={{ minWidth: 200 }}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              actionRef.current?.reload(); // reload bảng khi đổi filter
            }}
            options={[
              { label: "Chờ xác nhận", value: "Pending" },
              { label: "Đã xác nhận", value: "Confirmed" },
              { label: "Hoàn thành", value: "Completed" },
              { label: "Đã hủy", value: "Cancelled" },
            ]}
          />

          <Select
            allowClear
            placeholder="Trạng thái thanh toán"
            style={{ minWidth: 220 }}
            value={paymentStatusFilter}
            onChange={(val) => {
              setPaymentStatusFilter(val);
              actionRef.current?.reload(); // reload khi đổi
            }}
            options={[
              { label: "Đã thanh toán", value: "Paid" },
              { label: "Chưa thanh toán", value: "Unpaid" },
            ]}
          />

          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              setStatusFilter(undefined);
              setPaymentStatusFilter(undefined);
              actionRef.current?.reload();
            }}
          >
            Xóa lọc trạng thái
          </Button>
        </Space>
      </div>
      {/* ==================================== */}

      <ProTable<IAppointment>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: 1200 }}
        size="middle"
        search={false}
        request={async (params) => {
          const page = params.current ?? 1;
          const pageSize = params.pageSize ?? 10;

          const filters: {
            date?: string;
            from?: string;
            to?: string;
            page?: number;
            pageSize?: number;
            status?: string;
            paymentStatus?: string;
          } = {
            page,
            pageSize,
          };

          if (filterType === "date" && selectedDate) {
            filters.date = selectedDate.format("YYYY-MM-DD");
          } else if (filterType === "range" && dateRange[0] && dateRange[1]) {
            filters.from = dateRange[0].format("YYYY-MM-DD");
            filters.to = dateRange[1].format("YYYY-MM-DD");
          }

          if (statusFilter) {
            filters.status = statusFilter;
          }
          if (paymentStatusFilter) {
            filters.paymentStatus = paymentStatusFilter;
          }

          const res = await getAllAppointmentsByUserIdDoctor(
            user?.id as string,
            filters
          );

          if (res.data) {
            setMeta(res.data.meta);
          }

          return {
            data: res.data?.result ?? [],
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          pageSizeOptions: ["10", "20", "50", "100"],
          showQuickJumper: true,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên {total} rows
            </div>
          ),
        }}
        headerTitle={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
              Danh sách cuộc hẹn của tôi
            </span>
          </div>
        }
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            type="default"
            style={{
              borderColor: "#52c41a",
              color: "#52c41a",
            }}
          >
            Xuất Excel
          </Button>,
          <Button
            key="refresh"
            onClick={() => refreshTable()}
            style={{
              borderColor: "#1890ff",
              color: "#1890ff",
            }}
          >
            Làm mới
          </Button>,
        ]}
        rowSelection={{
          type: "checkbox",
          preserveSelectedRowKeys: true,
        }}
        options={{
          setting: {
            listsHeight: 400,
            checkable: true,
          },
          fullScreen: true,
          reload: true,
          density: true,
        }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
      <AppointmentDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
        getStatusText={getStatusText}
      />
    </>
  );
};

export default TableAppointment;
