import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Spin,
  Empty,
  message,
  Breadcrumb,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ClearOutlined,
  HomeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { IClinic } from "@/types";
import { getAllClinicsBooking } from "../../services/client.api";
import BookingClinic from "../../components/BookingClinic/BookingClinic";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const ClinicBookingPage = () => {
  const navigate = useNavigate();
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  // palette giống DoctorBookingPage
  const pageBg = isDark
    ? "bg-[#0b1220]"
    : "bg-gradient-to-b from-blue-50 to-white";
  const headerBg = isDark
    ? "bg-[#0e1625] border-b border-[#1e293b66]"
    : "bg-white border-b";
  const sectionBg = isDark
    ? "bg-[#0e1625] border border-[#1e293b66]"
    : "bg-white border";
  const titleTx = isDark ? "!text-slate-50" : "!text-slate-800";
  const mutedTx = isDark ? "!text-gray-300" : "!text-gray-600";
  const blueTx = isDark ? "!text-gray-300" : "!text-gray-600";
  const primaryBtn = isDark
    ? "bg-blue-500 hover:bg-blue-500/90 border-blue-500"
    : "bg-blue-600 hover:bg-blue-700 border-blue-600";
  const fieldDark =
    "!bg-[#0b1220] !text-slate-100 !border-[#1e293b66] focus:!border-[#3b82f6] focus:!ring-2 focus:!ring-[#3b82f6]/30";

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dataClinics, setDataClinics] = useState<IClinic[]>([]);

  const fetchClinics = async (searchQuery = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: "1", pageSize: "100" });
      if (searchQuery.trim())
        queryParams.append("clinicName", searchQuery.trim());
      const response = await getAllClinicsBooking(queryParams.toString());
      if (response.data) setDataClinics(response.data.result);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      message.error("Không thể tải danh sách phòng khám");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    await fetchClinics(searchText);
    setIsSearching(false);
  };

  const handleClearFilters = async () => {
    setSearchText("");
    setIsSearching(false);
    await fetchClinics();
  };

  const handleRefetch = async () => {
    setLoading(true);
    try {
      await fetchClinics(searchText);
    } catch {
      message.error("Có lỗi xảy ra khi làm mới dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cls("min-h-screen clinic-booking", pageBg)}>
      {/* CSS override cho dark mode (giống trang bác sĩ) */}
      {isDark ? (
        <style>{`
          /* Breadcrumb buttons: bỏ viền/nền */
          .clinic-booking .ant-breadcrumb .ant-btn,
          .clinic-booking .ant-breadcrumb .ant-btn:hover,
          .clinic-booking .ant-breadcrumb .ant-btn:focus,
          .clinic-booking .ant-breadcrumb .ant-btn:active {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 8px !important;
          }
          .clinic-booking .ant-breadcrumb a { color: #cbd5e1 !important; }
          .clinic-booking .ant-breadcrumb a:hover { color: #60a5fa !important; }
          .clinic-booking .ant-breadcrumb-separator { color: #94a3b8 !important; }

          /* Inputs */
          .clinic-booking input,
          .clinic-booking .ant-input,
          .clinic-booking .ant-input-affix-wrapper {
            color: #e5e7eb !important;
            background: #0b1220 !important;
            border-color: #243244 !important;
          }
          .clinic-booking input::placeholder { color: #cbd5e1 !important; }

          /* Non-primary buttons */
          .clinic-booking .ant-btn:not(.ant-btn-primary) {
            color: #e5e7eb !important;
            border-color: #334155 !important;
          }
          .clinic-booking .ant-btn[disabled] {
            color: #94a3b8 !important; background:#0f172a !important; border-color:#334155 !important;
          }
        `}</style>
      ) : null}

      {/* Breadcrumb */}
      <div className={headerBg}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            separator={
              <RightOutlined
                className={cls(isDark ? "!text-white" : "text-gray-400")}
              />
            }
            className="text-sm"
          >
            <Breadcrumb.Item>
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/")}
                className={cls(
                  "!p-0 !h-auto !font-bold",
                  isDark
                    ? "!text-slate-300 hover:!text-blue-400"
                    : "!text-slate-600 hover:!text-blue-600"
                )}
                icon={<HomeOutlined />}
              >
                Trang chủ
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/booking-options")}
                className={cls(
                  "!p-0 !h-auto !font-bold",
                  isDark
                    ? "!text-slate-300 hover:!text-blue-400"
                    : "!text-slate-600 hover:!text-blue-600"
                )}
              >
                Hình thức đặt lịch
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item className={cls(blueTx, "!font-bold")}>
              Phòng khám
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <div className={cls("shadow-sm border-b", headerBg)}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={2} className={cls("!mb-2", titleTx)}>
                Phòng khám dành cho bạn
              </Title>
              <Text className={cls("!text-gray-300 text-lg", mutedTx)}>
                Chọn phòng khám để xem các bác sĩ phù hợp
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/booking-options")}
              className={primaryBtn}
            >
              Quay lại
            </Button>
          </div>

          {/* Search */}
          <div className={cls("rounded-xl p-6 shadow-sm", sectionBg)}>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  size="large"
                  placeholder="Tìm kiếm phòng khám..."
                  prefix={<SearchOutlined className="text-slate-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearch}
                  className={cls(isDark ? fieldDark : "")}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearch}
                  loading={isSearching}
                  icon={<SearchOutlined />}
                  className={cls(primaryBtn, "rounded-lg")}
                >
                  Tìm kiếm
                </Button>
                <Button
                  size="large"
                  onClick={handleClearFilters}
                  icon={<ClearOutlined />}
                  className={cls(
                    "rounded-lg",
                    isDark ? "!text-black  !bg-gray-100 hover:!bg-gray-300" : ""
                  )}
                >
                  Xóa lọc
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FilterOutlined className={cls("!text-gray-300 ", blueTx)} />
              <Text className={cls("!text-gray-300", mutedTx)}>
                Tìm thấy{" "}
                <span className={isDark ? "!text-blue-400" : "!text-blue-600"}>
                  {dataClinics.length}
                </span>{" "}
                phòng khám
              </Text>
            </div>

            <Button
              size="small"
              onClick={handleRefetch}
              loading={loading}
              icon={<ReloadOutlined />}
              className={cls(
                "hover:bg-blue-50",
                isDark
                  ? "!bg-[#122037] hover:!bg-[#0D1224] hover:!text-blue-400"
                  : "text-blue-600 border-blue-600"
              )}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        )}

        {!loading && dataClinics.length === 0 && (
          <Empty
            description={
              <span className={cls(isDark ? "!text-slate-200" : "")}>
                Không tìm thấy phòng khám phù hợp
              </span>
            }
            className="py-12"
          />
        )}

        {!loading && dataClinics.length > 0 && (
          <BookingClinic
            dataClinics={dataClinics}
            setDataClinics={setDataClinics}
            searchText={searchText}
          />
        )}
      </div>
    </div>
  );
};

export default ClinicBookingPage;
