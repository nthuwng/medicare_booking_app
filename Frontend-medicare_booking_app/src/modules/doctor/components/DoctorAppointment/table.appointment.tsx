import { useEffect, useRef, useState } from "react";
import { Button, Tag, Space, Avatar, Typography, Tooltip } from "antd";
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
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { getAllAppointmentsByUserIdDoctor } from "../../services/doctor.api";
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
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const { user } = useCurrentApp();
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
      case "NO_SHOW":
        return "Không đến";
      default:
        return status;
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
                // setDataViewDetail(entity);
                // setOpenViewDetail(true);
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

        // Tính tuổi đơn giản dựa trên NĂM sinh (đúng theo yêu cầu)
        const extractBirthYear = (dob?: string): number | undefined => {
          if (!dob) return undefined;
          // ISO
          if (dob.includes("T")) {
            const d = new Date(dob);
            const y = d.getUTCFullYear();
            return Number.isNaN(y) ? undefined : y;
          }
          // YYYY-MM-DD
          const ymd = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
          const dmy = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/; // DD/MM/YYYY
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
        const birthYear = extractBirthYear(patient.patientDateOfBirth);;
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
        // Vietnam timezone-safe formatting
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
      title: "Thao tác",
      hideInSearch: true,
      render(_, entity) {
        return (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ fontSize: "18px" }} />}
                onClick={() => {
                  setDataViewDetail(entity);
                  setOpenViewDetail(true);
                }}
                style={{ color: "#1890ff" }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<IAppointment>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: 1200 }}
        size="middle"
        search={{
          labelWidth: 120,
          searchText: "Tìm kiếm",
          resetText: "Làm mới",
          collapseRender: (collapsed) => (collapsed ? "Mở rộng" : "Thu gọn"),
          optionRender: (formProps) => [
            <Button
              key="search"
              type="primary"
              onClick={() => formProps?.form?.submit()}
              style={{ marginRight: 8 }}
            >
              Tìm kiếm
            </Button>,
            <Button key="reset" onClick={() => formProps?.form?.resetFields()}>
              Làm mới
            </Button>,
          ],
        }}
        request={async (params) => {
          let query = "";
          if (params) {
            query += `${user?.id}?page=${params.current}&pageSize=${params.pageSize}`;

            // Thêm tham số tìm kiếm nếu có
            if (params.patientName) {
              query += `&patientName=${encodeURIComponent(params.patientName)}`;
            }
          }
          const res = await getAllAppointmentsByUserIdDoctor(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data?.result ?? [],
            page: 1,
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
            <div style={{ color: "#666", fontSize: "14px" }}>
              Hiển thị {range[0]}-{range[1]} trong tổng số {total} cuộc hẹn
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
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={16}>
            <span>Đã chọn {selectedRowKeys.length} cuộc hẹn</span>
            <Button size="small" onClick={onCleanSelected}>
              Bỏ chọn
            </Button>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <Space size={8}>
            <Button
              size="small"
              type="primary"
              disabled={selectedRowKeys.length === 0}
            >
              Xác nhận hàng loạt
            </Button>
            <Button size="small" danger disabled={selectedRowKeys.length === 0}>
              Hủy hàng loạt
            </Button>
          </Space>
        )}
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
      />
    </>
  );
};

export default TableAppointment;
