import { useEffect, useMemo, useState } from "react";
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
  Skeleton,
  ConfigProvider,
  Pagination,
  Select,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { IAppointment } from "@/types";
import { getMyAppointmentsAPI } from "@/modules/client/services/client.api";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EvaluateRating from "@/modules/client/components/Rating/EvaluateRating";
import { useCurrentApp } from "@/components/contexts/app.context";

dayjs.extend(utc);
dayjs.extend(timezone);

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [ratingDoctor, setRatingDoctor] = useState<string>("");

  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const navigate = useNavigate();
  const { user, theme } = useCurrentApp();
  const isDark = theme === "dark";

  // helpers class
  const cls = (...x: (string | false | undefined)[]) =>
    x.filter(Boolean).join(" ");
  const pageBg = isDark ? "!bg-[#111A2B]" : "!bg-white";
  const textStrong = isDark ? "!text-gray-100" : "!text-slate-900";
  const textMuted = isDark ? "!text-gray-400" : "!text-slate-600";

  // Card skin: hover + focus ring xanh
  const cardSkin = isDark
    ? "!bg-[#0f1b2d] !border !border-[#1f2a3a] !text-gray-100 hover:!border-blue-500 focus-visible:!border-blue-500 focus-visible:!ring-2 focus-visible:!ring-blue-500/60 !transition-all !duration-200 hover:!shadow-lg"
    : "!bg-white !border !border-slate-200 !text-slate-900 hover:!border-blue-500 focus-visible:!border-blue-500 focus-visible:!ring-2 focus-visible:!ring-blue-500/60 !transition-all !duration-200 hover:!shadow-lg";

  // Build query string
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("pageSize", pageSize.toString());
    if (statusFilter) {
      params.append("status", statusFilter);
    }
    return params.toString();
  };

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const query = buildQuery();
        const res = await getMyAppointmentsAPI(query);

        // API response structure: { data: { appointments: [], meta: {} } }
        const responseData = res?.data as any;
        const list = responseData?.result || [];
        const meta = responseData?.meta;

        setAppointments(Array.isArray(list) ? list : []);
        setTotalItems(meta?.totalItems || 0);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentPage, pageSize, statusFilter]);

  // Filter by time (upcoming/past/all)
  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    const now = dayjs();
    return appointments.filter((a) => {
      const time = dayjs.utc(a.appointmentDateTime);
      return filter === "upcoming" ? time.isAfter(now) : time.isBefore(now);
    });
  }, [appointments, filter]);

  // Handle page change
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getStatusTag = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    switch (normalized) {
      case "pending":
        return { color: "gold", label: "Chờ xác nhận" };
      case "confirmed":
        return { color: "green", label: "Đã xác nhận" };
      case "cancelled":
      case "canceled":
        return { color: "red", label: "Đã hủy" };
      case "completed":
        return { color: "blue", label: "Hoàn tất" };
      default:
        return { color: "default", label: status || "Trạng thái" };
    }
  };

  return (
    <div className={cls("max-w7xl mx-auto", pageBg)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={cls("text-2xl font-semibold", textStrong)}>
              Lịch khám đã đặt
            </h1>
            <p className={cls(textMuted)}>
              Xem và quản lý các lịch hẹn của bạn
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <Card
          className={cls(
            "shadow-md !rounded-xl",
            isDark
              ? "!bg-gradient-to-br !from-[#1a2332] !to-[#0f1620] !border-2 !border-[#2a3f5f]"
              : "!bg-white !border !border-slate-200",
            "hover:!border-blue-400 !transition-all !duration-300"
          )}
          tabIndex={0}
        >
          <Row gutter={[16, 16]} align="middle">
            {/* ===== Select trạng thái (viền xanh hover/focus) ===== */}
            <Col xs={24} sm={12} md={8}>
              <div className="flex items-center gap-2 mb-3">
                <FilterOutlined
                  className={cls(
                    "!text-lg",
                    isDark ? "!text-blue-400" : "!text-blue-600"
                  )}
                />
                <span
                  className={cls(
                    "font-semibold !text-base",
                    isDark ? "!text-gray-200" : "!text-slate-700"
                  )}
                >
                  Lọc theo trạng thái:
                </span>
              </div>

              {/* Bọc một div để custom border hover/focus */}
              <div
                className={[
                  "!rounded-lg !border-2",
                  isDark
                    ? "!border-[#374365] !bg-[#1a2332]"
                    : "!border-slate-300 !bg-white",
                  "!transition-all !duration-200",
                  "hover:!border-blue-400 focus-within:!border-blue-500",
                  "focus-within:!ring-2",
                  isDark
                    ? "focus-within:!ring-blue-500/40"
                    : "focus-within:!ring-blue-500/60",
                  "!px-3 !py-1",
                  "!shadow-sm",
                ].join(" ")}
              >
                <ConfigProvider
                  theme={{
                    components: {
                      Select: {
                        borderRadius: 8,
                        controlHeight: 40,
                        colorBgContainer: isDark ? "#1a2332" : "#ffffff",
                        colorText: isDark ? "#e5e7eb" : "#1e293b",
                        colorTextPlaceholder: isDark ? "#9ca3af" : "#94a3b8",
                        colorBorder: "transparent",
                        colorPrimaryHover: isDark ? "#60a5fa" : "#3b82f6",
                        // Dropdown menu:
                        controlItemBgActive: isDark
                          ? "rgba(59,130,246,0.2)"
                          : "#eff6ff",
                        controlItemBgHover: isDark
                          ? "rgba(59,130,246,0.15)"
                          : "#f0f9ff",
                        optionSelectedBg: isDark
                          ? "rgba(59,130,246,0.3)"
                          : "#dbeafe",
                        optionSelectedColor: isDark ? "#bfdbfe" : "#1e40af",
                      },
                    },
                  }}
                >
                  <Select
                    bordered={false}
                    placeholder="Chọn trạng thái"
                    className="!w-full"
                    popupClassName={isDark ? "dark-select-dropdown" : ""}
                    dropdownStyle={{
                      background: isDark ? "#1a2332" : "#ffffff",
                      border: isDark
                        ? "1px solid #374365"
                        : "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    value={statusFilter || undefined}
                    onChange={handleStatusFilterChange}
                    allowClear
                    size="large"
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Chờ xác nhận", value: "Pending" },
                      { label: "Đã xác nhận", value: "Confirmed" },
                      { label: "Đã hủy", value: "Cancelled" },
                      { label: "Hoàn tất", value: "Completed" },
                    ]}
                  />
                </ConfigProvider>
              </div>
            </Col>

            {/* ===== Segmented thời gian ===== */}
            <Col xs={24} sm={12} md={8}>
              <div className="flex items-center gap-2 mb-3">
                <ClockCircleOutlined
                  className={cls(
                    "!text-lg",
                    isDark ? "!text-blue-400" : "!text-blue-600"
                  )}
                />
                <span
                  className={cls(
                    "font-semibold !text-base",
                    isDark ? "!text-gray-200" : "!text-slate-700"
                  )}
                >
                  Lọc theo thời gian:
                </span>
              </div>
              <ConfigProvider
                theme={{
                  components: {
                    Segmented: {
                      borderRadius: 10,
                      controlHeight: 44,
                      itemColor: isDark ? "#d1d5db" : "#475569",
                      itemHoverBg: isDark ? "rgba(59,130,246,0.15)" : "#f1f5f9",
                      itemHoverColor: isDark ? "#e5e7eb" : "#1e293b",
                      trackBg: isDark ? "#1a2332" : "#f1f5f9",
                      itemSelectedBg: isDark ? "#3b82f6" : "#3b82f6",
                      itemSelectedColor: "#ffffff",
                      trackPadding: 4,
                    },
                  },
                }}
              >
                <Segmented
                  block
                  size="large"
                  options={[
                    { label: "Sắp tới", value: "upcoming" },
                    { label: "Đã qua", value: "past" },
                    { label: "Tất cả", value: "all" },
                  ]}
                  value={filter}
                  onChange={(v) => setFilter(v as any)}
                  className={[
                    "!rounded-lg !shadow-sm",
                    isDark
                      ? "!border-2 !border-[#374365]"
                      : "!border !border-slate-200",
                  ].join(" ")}
                />
              </ConfigProvider>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <div
                className={cls(
                  "text-right !px-4 !py-3 !rounded-lg",
                  isDark
                    ? "!bg-gradient-to-br !from-blue-900/30 !to-blue-800/20 !border-2 !border-blue-700/50"
                    : "!bg-blue-50 !border !border-blue-200"
                )}
              >
                <div
                  className={cls(
                    "text-sm font-medium",
                    isDark ? "!text-blue-300" : "!text-blue-700"
                  )}
                >
                  Tổng số lịch hẹn
                </div>
                <div
                  className={cls(
                    "text-3xl font-bold !mt-1",
                    isDark ? "!text-blue-100" : "!text-blue-900"
                  )}
                >
                  {totalItems}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className={cls(
                "shadow-sm !rounded-xl !outline-none",
                "!cursor-wait",
                cardSkin
              )}
              tabIndex={0}
            >
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-95 flex justify-center items-center py-1">
          <Empty
            description={
              <span
                className={
                  isDark
                    ? "!text-gray-300 !text-[14px] font-semibold"
                    : " !text-[14px] font-semibold"
                }
              >
                Không có lịch hẹn
              </span>
            }
            className={isDark ? "!text-white" : ""}
            imageStyle={{ filter: isDark ? "brightness(0.9)" : undefined }}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a) => {
            const status = getStatusTag(a.status);
            const isConfirmed = (a.status || "").toLowerCase() === "confirmed";
            const feeText =
              a?.totalFee && !Number.isNaN(Number(a.totalFee))
                ? new Intl.NumberFormat("vi-VN").format(Number(a.totalFee)) +
                  " VNĐ"
                : "—";

            return (
              <Card
                key={a.id}
                className={cls(
                  "group shadow-sm border !rounded-xl !outline-none",
                  "!cursor-pointer",
                  cardSkin
                )}
                tabIndex={0}
              >
                <Flex justify="space-between" align="center" className="mb-3">
                  <Tag color={status.color} className="!text-sm">
                    {status.label}
                  </Tag>
                  <div className={cls("text-sm", textMuted)}>
                    Mã lịch hẹn:{" "}
                    <span className={textStrong}>{a.id.slice(0, 8)}</span>
                  </div>
                </Flex>

                <Flex gap={16} align="center" className="mb-3">
                  <Badge
                    dot={a.status?.toUpperCase() === "CONFIRMED"}
                    offset={[0, 36]}
                  >
                    <Avatar
                      size={104}
                      src={a.doctor?.avatarUrl || undefined}
                      className="!transition-all !duration-200 group-hover:!ring-2 group-hover:!ring-blue-500 group-hover:!ring-offset-2 group-hover:!ring-offset-transparent"
                      style={{
                        backgroundImage: !a.doctor?.avatarUrl
                          ? "linear-gradient(135deg, #1890ff, #096dd9)"
                          : undefined,
                        color: "#fff",
                        fontSize: "42px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "4px solid #ffffff",
                        boxShadow: "0 6px 20px rgba(24, 144, 255, 0.25)",
                      }}
                    >
                      {!a.doctor?.avatarUrl &&
                        a.doctor?.fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <div
                      className={cls(
                        "font-medium text-base truncate",
                        textStrong
                      )}
                    >
                      {a.doctor?.fullName ?? "Bác sĩ"}
                    </div>
                    <div className={cls("text-sm truncate", textMuted)}>
                      {a.doctor?.title}
                    </div>
                  </div>
                </Flex>

                <div className={cls("space-y-2 text-sm", textStrong)}>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className={textMuted} />
                    <span>
                      {dayjs(a.appointmentDateTime).format("DD/MM/YYYY")}
                    </span>
                    <ClockCircleOutlined className={cls("ml-3", textMuted)} />
                    <span>
                      {dayjs.utc(a.appointmentDateTime).format("HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdcardOutlined className={textMuted} />
                    <span>{a.patient?.patientName || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className={textMuted} />
                    <span>{a.patient?.patientPhone || "—"}</span>
                  </div>
                </div>

                <Flex justify="space-between" align="center" className="mt-4">
                  <div className={cls("text-sm", textMuted)}>
                    <div className="!text-[16px]">
                      Phí khám:{" "}
                      <span className={cls("font-semibold", textStrong)}>
                        {feeText}
                      </span>
                    </div>
                    <div className="!mt-1">
                      <Tag
                        color={a.paymentStatus === "Paid" ? "green" : "orange"}
                        className="!text-sm"
                      >
                        {a.paymentStatus === "Paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </Tag>
                    </div>
                  </div>

                  <div className="ml-auto grid grid-cols-2 gap-2">
                    <Button
                      onClick={() =>
                        navigate("/message", {
                          state: { doctorId: a.doctorId },
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600 !w-full"
                    >
                      Nhắn tin
                    </Button>

                    <Tooltip
                      title={
                        isConfirmed
                          ? undefined
                          : "Chỉ có thể đánh giá khi lịch hẹn đã được xác nhận"
                      }
                    >
                      <Button
                        className={cls(
                          "!w-full",
                          isDark
                            ? isConfirmed
                              ? "!text-gray-900 !bg-white hover:!bg-gray-100 !border-gray-300"
                              : "!bg-slate-700 !border-slate-600 !text-slate-300 hover:!bg-slate-700 hover:!border-slate-600 !cursor-not-allowed"
                            : ""
                        )}
                        disabled={!isConfirmed}
                        onClick={() => {
                          setRatingModalOpen(true);
                          setRatingDoctor(a.doctorId);
                        }}
                      >
                        Đánh giá bác sĩ
                      </Button>
                    </Tooltip>

                    <Button
                      type="primary"
                      className="!w-full !bg-orange-500 hover:!bg-orange-600"
                      onClick={() => navigate(`/appointment-detail/${a.id}`)}
                    >
                      Xem chi tiết lịch hẹn
                    </Button>

                    <Button
                      type="primary"
                      className="!w-full"
                      onClick={() =>
                        navigate(`/booking-options/doctor/${a.doctorId}`)
                      }
                    >
                      Xem chi tiết bác sĩ
                    </Button>
                  </div>
                </Flex>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <>
          {isDark && (
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .ant-select-dropdown {
                  background-color: #1e293b !important;
                  border: 1px solid #475569 !important;
                }
                .ant-select-item {
                  color: #e2e8f0 !important;
                }
                .ant-select-item-option-selected {
                  background-color: rgba(59,130,246,0.25) !important;
                  color: #93c5fd !important;
                  font-weight: 600 !important;
                }
                .ant-select-item-option-active:not(.ant-select-item-option-selected) {
                  background-color: rgba(59,130,246,0.12) !important;
                  color: #e2e8f0 !important;
                }
                .ant-pagination .ant-select-selector {
                  background-color: #1e293b !important;
                  border-color: #475569 !important;
                  color: #e2e8f0 !important;
                }
                .ant-pagination .ant-select-arrow {
                  color: #94a3b8 !important;
                }
                .ant-pagination-options .ant-select-selection-item {
                  color: #e2e8f0 !important;
                }
              `,
              }}
            />
          )}

          <div
            className={cls(
              "mt-8 flex justify-center !p-4 !rounded-xl",
              isDark
                ? "!bg-gradient-to-br !from-[#1a2332] !to-[#0f1620] !border-2 !border-[#2a3f5f]"
                : "!bg-slate-50 !border !border-slate-200"
            )}
          >
            <ConfigProvider
              theme={{
                components: {
                  Pagination: {
                    itemActiveBg: isDark ? "!#3b82f6" : "!#1890ff",
                    itemBg: isDark ? "!#1e293b" : "!#ffffff",
                    itemLinkBg: isDark ? "!#1e293b" : "!#ffffff",
                    colorText: isDark ? "!#e2e8f0" : "!#1e293b",
                    colorTextDisabled: isDark ? "!#64748b" : "!#cbd5e1",
                    borderRadius: 8,
                    controlHeight: 32,
                    itemSize: 32,
                  },
                },
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total, range) => (
                  <span
                    className={cls(
                      "font-medium",
                      isDark ? "!text-blue-300" : "!text-slate-600"
                    )}
                  >
                    {range[0]}-{range[1]} của {total} lịch hẹn
                  </span>
                )}
                pageSizeOptions={["6", "12", "18", "60"]}
                size="default"
              />
            </ConfigProvider>
          </div>
        </>
      )}

      <EvaluateRating
        ratingModalOpen={ratingModalOpen}
        setRatingModalOpen={setRatingModalOpen}
        userId={user?.id || ""}
        doctorId={ratingDoctor || ""}
      />
    </div>
  );
};

export default MyAppointmentsPage;
