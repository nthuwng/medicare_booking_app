import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface IProps {
  bookingFor: string;
}

type TDistrict = { code: number; name: string };
type TProvince = { code: number; name: string; districts: TDistrict[] };

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const PatientInfoForm = (props: IProps) => {
  const { bookingFor } = props;
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  const [provinces, setProvinces] = useState<TProvince[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string>();
  const form = Form.useFormInstance();

  useEffect(() => {
    (async () => {
      try {
        setLoadingLocations(true);
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data: TProvince[] = await res.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch {
        setProvinces([]);
      } finally {
        setLoadingLocations(false);
      }
    })();
  }, []);

  const selectedProvince = useMemo(
    () =>
      selectedCityName
        ? provinces.find((p) => p.name === selectedCityName)
        : undefined,
    [provinces, selectedCityName]
  );

  const handleCityChange = (value: string) => {
    setSelectedCityName(value);
    form.setFieldsValue({ province: value, district: undefined });
  };

  // lớp dùng lại cho input/select/datepicker
  const inputCls = isDark
    ? "!bg-[#101b2d] !border-[#1e293b66] !text-slate-100"
    : "";

  return (
    <>
      {/* ==== DARK THEME OVERRIDES – chỉ áp dụng trong .appt-form ==== */}
      {isDark && (
        <style>{`
          .appt-form .ant-input,
          .appt-form .ant-input-affix-wrapper,
          .appt-form .ant-input-affix-wrapper .ant-input,
          .appt-form .ant-select-selector,
          .appt-form .ant-picker,
          .appt-form .ant-picker-input > input,
          .appt-form textarea.ant-input {
            color:#e5e7eb !important;
            background:#101b2d !important;
            border-color:#1e293bb3 !important;
          }
          .appt-form .ant-input::placeholder,
          .appt-form .ant-input-affix-wrapper input::placeholder,
          .appt-form textarea.ant-input::placeholder,
          .appt-form .ant-picker-input > input::placeholder,
          .appt-form .ant-select-selection-placeholder {
            color:#94a3b8 !important; opacity:1;
          }
          .appt-form .ant-input-affix-wrapper:hover,
          .appt-form .ant-input:hover,
          .appt-form .ant-select-selector:hover,
          .appt-form .ant-picker:hover { border-color:#3b82f6 !important; }
          .appt-form .ant-input-affix-wrapper-focused,
          .appt-form .ant-select-focused .ant-select-selector,
          .appt-form .ant-picker-focused {
            border-color:#3b82f6 !important;
            box-shadow:0 0 0 2px rgba(59,130,246,.25) !important;
          }

          /* ===== Select Dropdown (dark) ===== */
          .appt-form .booking-dd{
            background:#0f1a2b !important;
            border:1px solid #243244 !important;
            box-shadow:0 12px 28px rgba(2,6,23,.6) !important;
            border-radius:10px !important;
            overflow:hidden; padding:4px 0;
          }
          .appt-form .booking-dd .ant-select-item { color:#e5e7eb !important; padding:10px 12px !important; }
          .appt-form .booking-dd .ant-select-item-option:hover,
          .appt-form .booking-dd .ant-select-item-option-active { background:#15243b !important; color:#fff !important; }
          .appt-form .booking-dd .ant-select-item-option-selected {
            background:rgba(59,130,246,.18) !important; color:#dbeafe !important;
            box-shadow:inset 0 0 0 1px rgba(96,165,250,.45);
          }
          /* Khi Select mở: CHỈ sáng border, không phủ tối control */
          .appt-form .ant-select-open .ant-select-selector{
            border-color:#3b82f6 !important;
            box-shadow:0 0 0 2px rgba(59,130,246,.25) !important;
          }

          /* ===== DatePicker Popup (dark) – KHÔNG phủ tối xung quanh ===== */
          /* Root dropdown trong suốt */
          .appt-form :where(.picker-dd).ant-picker-dropdown,
          .appt-form .picker-dd {
            background:transparent !important;
            border:0 !important;
            box-shadow:none !important;
            padding:0 !important;
            min-width:0 !important;
          }
          /* container trong suốt */
          .appt-form .picker-dd > div {
            background:transparent !important;
            box-shadow:none !important;
          }
          /* Hộp panel thực sự */
          .appt-form .picker-dd .ant-picker-panel-container{
            background:#0f1a2b !important;
            border:1px solid #243244 !important;
            box-shadow:0 12px 28px rgba(2,6,23,.6) !important;
            border-radius:10px !important;
            overflow:hidden;
          }
          /* Bên trong panel */
          .appt-form .picker-dd .ant-picker-panel,
          .appt-form .picker-dd .ant-picker-time-panel{
            background:#0f1a2b !important;
            color:#e5e7eb !important;
          }
          /* Ô ngày & trạng thái */
          .appt-form .picker-dd .ant-picker-cell{ color:#cbd5e1 !important; }
          .appt-form .picker-dd .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
          .appt-form .picker-dd .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
          .appt-form .picker-dd .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner{
            background:#2563eb !important; color:#fff !important;
          }
          /* Header / Footer / "Hôm nay" */
          .appt-form .picker-dd .ant-picker-header,
          .appt-form .picker-dd .ant-picker-footer{ border-color:#1e293b !important; }
          .appt-form .picker-dd .ant-picker-today-btn{ color:#93c5fd !important; }
          .appt-form .picker-dd .ant-picker-today-btn:hover{ color:#bfdbfe !important; }

          .appt-form .picker-dd .ant-picker-header button{
  color:#e5e7eb !important;        /* "Th11 2025" + mũi tên */
}
.appt-form .picker-dd .ant-picker-header button:hover{
  color:#ffffff !important;
}

/* Hàng T2–CN */
.appt-form .picker-dd .ant-picker-content th{
  color:#e5e7eb !important;
  opacity:1;                        /* phòng khi bị hạ opacity */
}

/* (tuỳ chọn) màu icon mũi tên nếu cần đậm hơn */
.appt-form .picker-dd .ant-picker-header
  .ant-picker-header-super-prev-btn,
.appt-form .picker-dd .ant-picker-header
  .ant-picker-header-prev-btn,
.appt-form .picker-dd .ant-picker-header
  .ant-picker-header-next-btn,
.appt-form .picker-dd .ant-picker-header
  .ant-picker-header-super-next-btn{
  color:#e5e7eb !important;
}

.appt-form .picker-dd .ant-picker-now .ant-picker-now-btn{
  color:#e5e7eb !important;
  opacity:1 !important;
}

/* Màu chữ "Trống" trong dropdown rỗng */
.appt-form .booking-dd .ant-select-item-empty,
.appt-form .booking-dd .ant-empty-description{
  color:#e5e7eb !important;
  opacity:1 !important;
}

/* (tuỳ chọn) làm icon hộp sáng hơn chút trong dark */
.appt-form .booking-dd .ant-empty-image svg{
  filter: brightness(1.2) contrast(1.05);
}
        `}</style>
      )}

      <div className="appt-form">
        <Card
          className={cls(
            "rounded-2xl shadow-sm mb-6 transition-all duration-300",
            isDark
              ? "!bg-[#0e1625] !border !border-[#1e293b66]"
              : "!bg-white !border-2 !border-[#e6f7ff]"
          )}
          bodyStyle={{ padding: 24 }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <UserOutlined
                style={{
                  fontSize: 20,
                  color: isDark ? "#60a5fa" : "#1890ff",
                  marginRight: 8,
                }}
              />
              <Title
                level={5}
                className={
                  isDark ? "!text-slate-100 !m-0" : "!text-gray-900 !m-0"
                }
              >
                {bookingFor === "self"
                  ? "Thông tin của bạn"
                  : "Thông tin bệnh nhân"}
              </Title>
            </div>
            <Text className={isDark ? "!text-slate-400" : "!text-gray-600"}>
              Vui lòng nhập đầy đủ thông tin để chúng tôi có thể liên hệ và xác
              nhận lịch khám
            </Text>
          </div>

          {/* Họ tên + Giới tính */}
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Họ tên bệnh nhân
                  </Text>
                }
                name="patientName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ tên!" },
                  {
                    whitespace: true,
                    message: "Họ tên không được chỉ chứa khoảng trắng!",
                  },
                ]}
              >
                <Input
                  size="large"
                  className={inputCls}
                  placeholder="Nhập họ tên bệnh nhân"
                  prefix={
                    <UserOutlined
                      style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Giới tính
                  </Text>
                }
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Radio.Group className={isDark ? "!text-slate-100" : ""}>
                  <Radio
                    value="male"
                    className={isDark ? "!text-slate-100" : ""}
                  >
                    Nam
                  </Radio>
                  <Radio
                    value="female"
                    className={isDark ? "!text-slate-100" : ""}
                  >
                    Nữ
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Phone + Email */}
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Số điện thoại liên hệ
                  </Text>
                }
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                  {
                    whitespace: true,
                    message: "Số điện thoại không được để trống!",
                  },
                ]}
              >
                <Input
                  size="large"
                  className={inputCls}
                  placeholder="Nhập số điện thoại"
                  prefix={
                    <PhoneOutlined
                      style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Địa chỉ email
                  </Text>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                  { whitespace: true, message: "Email không được để trống!" },
                ]}
              >
                <Input
                  size="large"
                  className={inputCls}
                  placeholder="Nhập địa chỉ email"
                  prefix={
                    <MailOutlined
                      style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                    />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Ngày sinh */}
          <Form.Item
            label={
              <Text
                className={
                  isDark ? "font-semibold !text-slate-100" : "font-semibold"
                }
              >
                Ngày sinh
              </Text>
            }
            name="dateOfBirth"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              size="large"
              className={inputCls}
              placeholder="Chọn ngày sinh"
              suffixIcon={
                <CalendarOutlined
                  style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                />
              }
              popupClassName={isDark ? "picker-dd" : undefined}
              getPopupContainer={(trigger) =>
                trigger.parentElement as HTMLElement
              }
              disabledDate={(current) => {
                if (!current) return false;
                const tooEarly = current.year() < 1900;
                const inFuture = current.endOf("day").isAfter(new Date());
                return tooEarly || inFuture;
              }}
            />
          </Form.Item>

          {/* Tỉnh + Quận */}
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Tỉnh/Thành phố
                  </Text>
                }
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành!" },
                ]}
              >
                <Select
                  showSearch
                  size="large"
                  className={inputCls}
                  placeholder="-- Chọn Tỉnh/Thành --"
                  loading={loadingLocations}
                  optionFilterProp="label"
                  onChange={handleCityChange}
                  popupClassName={isDark ? "booking-dd" : undefined}
                  getPopupContainer={(trigger) =>
                    trigger.parentElement as HTMLElement
                  }
                  options={provinces.map((p) => ({
                    label: p.name,
                    value: p.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Text
                    className={
                      isDark ? "font-semibold !text-slate-100" : "font-semibold"
                    }
                  >
                    Quận/Huyện
                  </Text>
                }
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện!" },
                ]}
              >
                <Select
                  showSearch
                  size="large"
                  className={inputCls}
                  placeholder="-- Chọn Quận/Huyện --"
                  disabled={!selectedProvince}
                  optionFilterProp="label"
                  popupClassName={isDark ? "booking-dd" : undefined}
                  getPopupContainer={(trigger) =>
                    trigger.parentElement as HTMLElement
                  }
                  options={(selectedProvince?.districts || []).map((d) => ({
                    label: d.name,
                    value: d.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Địa chỉ */}
          <Form.Item
            label={
              <Text
                className={
                  isDark ? "font-semibold !text-slate-100" : "font-semibold"
                }
              >
                Địa chỉ
              </Text>
            }
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ!" },
              {
                whitespace: true,
                message: "Địa chỉ không được chỉ chứa khoảng trắng!",
              },
            ]}
          >
            <Input
              size="large"
              className={inputCls}
              placeholder="Nhập số nhà, tên đường..."
              prefix={
                <EnvironmentOutlined
                  style={{ color: isDark ? "#64748b" : "#bfbfbf" }}
                />
              }
            />
          </Form.Item>

          {/* Lý do khám */}
          <Form.Item
            label={
              <Text
                className={
                  isDark ? "font-semibold !text-slate-100" : "font-semibold"
                }
              >
                Lý do khám
              </Text>
            }
            name="reason"
          >
            <TextArea
              rows={4}
              maxLength={400}
              className={inputCls}
              placeholder="Mô tả triệu chứng, lý do khám bệnh..."
              showCount
            />
          </Form.Item>
        </Card>
      </div>
    </>
  );
};

export default PatientInfoForm;
