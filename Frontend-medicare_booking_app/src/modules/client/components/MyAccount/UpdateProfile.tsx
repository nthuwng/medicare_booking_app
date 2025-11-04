import {
  LoadingOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  Select,
  App,
  Upload,
  Image,
  type GetProp,
  type UploadProps,
  ConfigProvider,
  theme as antdTheme,
  type ThemeConfig,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { IPatientProfile } from "@/types";
import {
  deletePatientAvatarAPI,
  updatePatientProfileAPI,
} from "../../services/client.api";
import type { UploadFile } from "antd/lib";
import { uploadFileAPI } from "@/modules/admin/services/admin.api";
import type { UploadChangeParam } from "antd/es/upload";
import { useCurrentApp } from "@/components/contexts/app.context";

interface Props {
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: (open: boolean) => void;
  dataUpdateProfile: IPatientProfile | null;
  setDataUpdateProfile: (dataUpdateProfile: IPatientProfile | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// Provinces/Districts of Vietnam
type TDistrict = { code: number; name: string };
type TProvince = { code: number; name: string; districts: TDistrict[] };

const UpdateProfile = (props: Props) => {
  const {
    editProfileModalOpen,
    setEditProfileModalOpen,
    dataUpdateProfile,
    setDataUpdateProfile,
    setLoading,
  } = props;
  const [form] = Form.useForm();

  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  const [provinces, setProvinces] = useState<TProvince[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(false);
  const [selectedCityName, setSelectedCityName] = useState<string | undefined>(
    undefined
  );
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<
    string | undefined
  >(undefined);

  // Tailwind classes áp trực tiếp
  const inputCls = isDark
    ? "!bg-[#0b1626] !text-gray-100 !border-[#1f2a3a] !placeholder:text-gray-500"
    : "";
  const labelCls = isDark ? "!text-gray-300" : "!text-slate-600";
  const sectionTitleCls = isDark ? "!text-white" : "";
  const uploadCardStyle: React.CSSProperties = isDark
    ? {
        background: "!#0f1b2d",
        borderColor: "!#1f2a3a",
        color: "!#e5e7eb",
        borderRadius: 12,
      }
    : { borderRadius: 12 };

  // AntD tokens cục bộ cho modal này
  const modalTheme: ThemeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorBgElevated: isDark ? "#0f1b2d" : "#fff",
      colorBgContainer: isDark ? "#0f1b2d" : "#fff",
      colorBorder: isDark ? "#1f2a3a" : "#e5e7eb",
      colorText: isDark ? "#e5e7eb" : "#0f172a",
      colorTextSecondary: isDark ? "#9CA3AF" : "#64748b",
      colorPrimary: "#1677ff",
      borderRadiusLG: 12,
    },
    components: {
      Modal: {
        headerBg: isDark ? "#0f1b2d" : "#fff",
        titleColor: isDark ? "#e5e7eb" : "#0f172a",
        contentBg: isDark ? "#0f1b2d" : "#fff",
        footerBg: isDark ? "#0f1b2d" : "#fff",
      },
      Input: {
        colorBgContainer: isDark ? "#0b1626" : "#fff",
        colorBorder: isDark ? "#1f2a3a" : "#dfe3e8",
      },
      Select: {
        colorBgContainer: isDark ? "#0b1626" : "#fff",
        colorBorder: isDark ? "#1f2a3a" : "#dfe3e8",
        optionSelectedBg: isDark ? "#17233a" : undefined,
      },
      DatePicker: {
        colorBgContainer: isDark ? "#0b1626" : "#fff",
        colorBorder: isDark ? "#1f2a3a" : "#dfe3e8",
      },
      Upload: { colorBorder: isDark ? "#1f2a3a" : "#dfe3e8" },
      Button: { borderRadius: 10 },
    },
  };

  const handleSubmit = async (values: any) => {
    const { full_name, phone, gender, date_of_birth, address, city, district } =
      values;
    try {
      let avatar_url = "";
      if (fileList.length > 0 && fileList[0].url) {
        avatar_url = fileList[0].url;
      }
      setLoading(true);
      const response = await updatePatientProfileAPI(
        dataUpdateProfile?.id || "",
        full_name,
        phone,
        gender,
        date_of_birth,
        address,
        city,
        district,
        avatar_url
      );
      if (response.success === true) {
        message.success(response.message);
        // cập nhật parent để đồng bộ lại MyAccountPage
        setDataUpdateProfile(response.data as IPatientProfile);
        setEditProfileModalOpen(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditProfileModalOpen(false);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = async () => {
    try {
      const response = await deletePatientAvatarAPI(
        dataUpdateProfile?.id || ""
      );
      if (response.success === true) {
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa ảnh đại diện");
    }
    setFileList([]);
    form.setFieldsValue({ avatar_url: undefined });
    setLoadingUpload(false);
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") setLoadingUpload(true);
    if (info.file.status === "done" || info.file.status === "error") {
      setLoadingUpload(false);
    }
    if (info.file.status === "removed") {
      form.setFieldsValue({ avatar_url: undefined });
    }
  };

  useEffect(() => {
    if (!editProfileModalOpen) return;

    if (dataUpdateProfile) {
      form.setFieldsValue({
        full_name: dataUpdateProfile.full_name,
        phone: dataUpdateProfile.phone,
        gender: dataUpdateProfile.gender || undefined,
        date_of_birth: dataUpdateProfile.date_of_birth
          ? dayjs(dataUpdateProfile.date_of_birth)
          : undefined,
        address: dataUpdateProfile.address,
        city: dataUpdateProfile.city,
        district: dataUpdateProfile.district,
        avatar_url: dataUpdateProfile.avatar_url,
      });
      if (dataUpdateProfile.avatar_url) {
        setFileList([
          {
            uid: "-1",
            name: "avatar",
            status: "done",
            url: dataUpdateProfile.avatar_url,
          } as UploadFile,
        ]);
      } else {
        setFileList([]);
      }
      setSelectedCityName(dataUpdateProfile.city || undefined);
    }
  }, [editProfileModalOpen, dataUpdateProfile, form]);

  useEffect(() => {
    if (!editProfileModalOpen) return;
    const fetchProvinces = async () => {
      try {
        setLoadingLocations(true);
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data: TProvince[] = await res.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch {
        // ignore silently
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchProvinces();
  }, [editProfileModalOpen]);

  const selectedProvince = useMemo(() => {
    if (!selectedCityName) return undefined;
    return provinces.find((p) => p.name === selectedCityName);
  }, [provinces, selectedCityName]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    // mở modal xác nhận (ngừng auto-upload)
    const objectUrl = URL.createObjectURL(file);
    setPendingFile(file);
    setPendingPreviewUrl(objectUrl);
    setConfirmOpen(true);
    return Upload.LIST_IGNORE;
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    try {
      setLoadingUpload(true);
      const res = await uploadFileAPI(pendingFile);
      if (res && res.data) {
        const uploadedFile: UploadFile = {
          uid: String(Date.now()),
          name: res.data.public_id,
          status: "done",
          url: res.data.url,
        };
        setFileList([uploadedFile]);
        form.setFieldsValue({ avatar_url: res.data.url });
        message.success("Tải ảnh thành công");
      } else {
        message.error(res?.message || "Upload thất bại");
      }
    } catch (e: any) {
      message.error(e?.message || "Upload thất bại");
    } finally {
      setLoadingUpload(false);
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
      setPendingFile(null);
      setPendingPreviewUrl(undefined);
      setConfirmOpen(false);
    }
  };

  const cancelConfirm = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl(undefined);
    setConfirmOpen(false);
  };

  return (
    <ConfigProvider theme={modalTheme}>
      <Modal
        open={editProfileModalOpen}
        onCancel={handleCancel}
        title={
          <div className="flex items-center gap-2">
            <LockOutlined style={{ color: "#1890ff" }} />
            <span className={sectionTitleCls}>Chỉnh sửa hồ sơ</span>
          </div>
        }
        footer={null}
        width={720}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Họ và tên</span>}
                name="full_name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input
                  placeholder="Nhập họ và tên"
                  size="large"
                  className={inputCls}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Số điện thoại</span>}
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^(0|\+84)\d{9,10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  size="large"
                  className={inputCls}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Giới tính</span>}
                name="gender"
              >
                <Select
                  size="large"
                  placeholder="Chọn giới tính"
                  className={inputCls}
                  dropdownRender={(menu) => (
                    <div
                      style={{
                        background: isDark ? "#0b1626" : "#fff",
                        border: `1px solid ${
                          isDark ? "#1f2a3a" : "#dfe3e8"
                        }`,
                        borderRadius: 8,
                        color: isDark ? "#e5e7eb" : "#0f172a",
                        padding: 4,
                      }}
                    >
                      {menu}
                    </div>
                  )}
                  options={[
                    { label: "Nam", value: "Male" },
                    { label: "Nữ", value: "Female" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Ngày sinh</span>}
                name="date_of_birth"
              >
                <DatePicker
                  size="large"
                  className={`w-full ${inputCls}`}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  panelRender={(panel) => (
                    <div
                      style={{
                        background: isDark ? "#0b1626" : "#fff",
                        border: `1px solid ${
                          isDark ? "#1f2a3a" : "#dfe3e8"
                        }`,
                        borderRadius: 8,
                        color: isDark ? "#e5e7eb" : "#0f172a",
                        padding: 4,
                      }}
                    >
                      {panel}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <Form.Item
                label={<span className={labelCls}>Địa chỉ</span>}
                name="address"
              >
                <Input
                  placeholder="Số nhà, tên đường"
                  size="large"
                  className={inputCls}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Thành phố / Tỉnh</span>}
                name="city"
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="Chọn tỉnh/thành phố"
                  loading={loadingLocations}
                  optionFilterProp="label"
                  onChange={(v) => {
                    setSelectedCityName(v as string);
                    form.setFieldsValue({ city: v, district: undefined });
                  }}
                  options={provinces.map((p) => ({
                    label: p.name,
                    value: p.name,
                  }))}
                  className={inputCls}
                  dropdownRender={(menu) => (
                    <div
                      style={{
                        background: isDark ? "#0b1626" : "#fff",
                        border: `1px solid ${
                          isDark ? "#1f2a3a" : "#dfe3e8"
                        }`,
                        borderRadius: 8,
                        color: isDark ? "#e5e7eb" : "#0f172a",
                        padding: 4,
                      }}
                    >
                      {menu}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={labelCls}>Quận / Huyện</span>}
                name="district"
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="Chọn quận/huyện"
                  optionFilterProp="label"
                  disabled={!selectedProvince}
                  options={(selectedProvince?.districts || []).map((d) => ({
                    label: d.name,
                    value: d.name,
                  }))}
                  className={inputCls}
                  dropdownRender={(menu) => (
                    <div
                      style={{
                        background: isDark ? "#0b1626" : "#fff",
                        border: `1px solid ${
                          isDark ? "#1f2a3a" : "#dfe3e8"
                        }`,
                        borderRadius: 8,
                        color: isDark ? "#e5e7eb" : "#0f172a",
                        padding: 4,
                      }}
                    >
                      {menu}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="avatar_url"
                label={<span className={labelCls}>Ảnh đại diện</span>}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  multiple={false}
                  beforeUpload={beforeUpload}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  fileList={fileList}
                  style={uploadCardStyle}
                >
                  <div>
                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {fileList.length === 0 && (
                  <div style={{ color: isDark ? "#fca5a5" : "#ff4d4f" }}>
                    Vui lòng chọn ảnh (hoặc giữ nguyên ảnh cũ).
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button size="large" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}

        <Modal
          open={confirmOpen}
          onCancel={cancelConfirm}
          title={<span className={sectionTitleCls}>Xem trước ảnh đại diện</span>}
          footer={[
            <Button key="cancel" onClick={cancelConfirm}>
              Hủy
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loadingUpload}
              onClick={confirmUpload}
            >
              Lưu
            </Button>,
          ]}
          centered
        >
          <div className="flex items-center justify-center">
            {pendingPreviewUrl && (
              <img
                src={pendingPreviewUrl}
                alt="preview"
                style={{ maxWidth: 320, maxHeight: 320, borderRadius: 8 }}
              />
            )}
          </div>
        </Modal>
      </Modal>
    </ConfigProvider>
  );
};

export default UpdateProfile;
