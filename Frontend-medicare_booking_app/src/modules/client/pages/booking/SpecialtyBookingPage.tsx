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

import SpecialtiesCard from "../../components/BookingSpecialties/specialties.card";
import type { ISpecialty } from "@/types";
import { getAllSpecialtiesBooking } from "../../services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const SpecialtyBookingPage = () => {
  const navigate = useNavigate();
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  // ===== Palette giống DoctorBookingPage =====
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
  const mutedTx = isDark ? "text-slate-300" : "text-slate-600";
  const blueTx = isDark ? "text-blue-300" : "text-blue-600";
  const primaryBtn = isDark
    ? "bg-blue-500 hover:bg-blue-500/90 border-blue-500"
    : "bg-blue-600 hover:bg-blue-700 border-blue-600";
  const fieldDark =
    "!bg-[#0b1220] !text-slate-100 !border-[#1e293b66] focus:!border-[#3b82f6] focus:!ring-2 focus:!ring-[#3b82f6]/30";

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [dataSpecialties, setDataSpecialties] = useState<ISpecialty[]>([]);

  const fetchSpecialties = async (searchQuery = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: "1", pageSize: "100" });
      if (searchQuery.trim())
        queryParams.append("specialtyName", searchQuery.trim());
      const response = await getAllSpecialtiesBooking(queryParams.toString());
      if (response.data) setDataSpecialties(response.data.result);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách chuyên khoa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    await fetchSpecialties(searchText);
    setIsSearching(false);
  };

  const handleClearFilters = async () => {
    setSearchText("");
    setIsSearching(false);
    await fetchSpecialties();
  };

  const handleRefetch = async () => {
    setLoading(true);
    try {
      await fetchSpecialties(searchText);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi làm mới dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cls("min-h-screen specialties-page", pageBg)}>
      {/* ==== CSS override trong dark-mode (giống DoctorBookingPage) ==== */}
      {isDark ? (
        <style>{`
/* Breadcrumb: bỏ nền/viền nút và tăng độ sáng chữ */
.specialties-page .ant-breadcrumb .ant-btn,
.specialties-page .ant-breadcrumb .ant-btn:hover,
.specialties-page .ant-breadcrumb .ant-btn:focus,
.specialties-page .ant-breadcrumb .ant-btn:active {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 8px !important;
}
.specialties-page .ant-breadcrumb a { color:#cbd5e1 !important; }
.specialties-page .ant-breadcrumb a:hover { color:#60a5fa !important; }
.specialties-page .ant-breadcrumb-separator { color:#94a3b8 !important; }

/* Input text/placeholder/viền trong dark */
.specialties-page input,
.specialties-page .ant-input,
.specialties-page .ant-input-affix-wrapper {
  color:#e5e7eb !important;
  background:#0b1220 !important;
  border-color:#243244 !important;
}
.specialties-page input::placeholder,
.specialties-page .ant-input::placeholder {
  color:#cbd5e1 !important;
}

/* Nút thường (không primary) & disabled */
.specialties-page .ant-btn:not(.ant-btn-primary){
  color:#e5e7eb !important;
  border-color:#334155 !important;
}
.specialties-page .ant-btn[disabled]{
  color:#94a3b8 !important;
  border-color:#334155 !important;
  background:#0f172a !important;
}

/* (Tùy chọn) Nếu SpecialtiesCard là AntD Card, ép nền tối:
.specialties-page .specialties-card .ant-card,
.specialties-page .specialties-card .ant-card-body{
  background:#0e1625 !important;
  border-color:#1e293b66 !important;
}
*/
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
              Chuyên khoa
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
                Chuyên khoa dành cho bạn
              </Title>
              <Text className={cls("!text-gray-300 text-lg", mutedTx)}>
                Chọn chuyên khoa để xem các bác sĩ phù hợp
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
                  placeholder="Tìm kiếm chuyên khoa..."
                  prefix={
                    <SearchOutlined
                      className={cls(
                        isDark ? "text-slate-400" : "text-gray-400"
                      )}
                    />
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearch}
                  className={cls("rounded-lg", isDark ? fieldDark : "")}
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
              <FilterOutlined className={cls("!text-gray-300", blueTx)} />
              <Text className={cls("!text-gray-300", mutedTx)}>
                Tìm thấy{" "}
                <span className={cls("font-semibold", blueTx)}>
                  {dataSpecialties.length}
                </span>{" "}
                chuyên khoa
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

        {!loading && dataSpecialties.length === 0 && (
          <Empty
            description={
              <span className={cls(isDark ? "!text-slate-200" : "")}>
                Không tìm thấy chuyên khoa phù hợp
              </span>
            }
            className="py-12"
          />
        )}

        {!loading && dataSpecialties.length > 0 && (
          // Gợi ý: bọc root của SpecialtiesCard bằng className="specialties-card"
          <SpecialtiesCard
            dataSpecialties={dataSpecialties}
            setDataSpecialties={setDataSpecialties}
            searchText={searchText}
          />
        )}
      </div>
    </div>
  );
};

export default SpecialtyBookingPage;
