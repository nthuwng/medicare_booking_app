import {
  Form,
  Modal,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  message,
  App,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  TrophyOutlined,
  DollarOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import axios from "services/axios.customize";
import {
  createDoctorProfile,
  getAllClinicsDoctorProFile,
  getAllSpecialtiesDoctorProFile,
} from "../../services/doctor.api";
import type { IClinic, ISpecialty } from "../../types";
import type { FormProps } from "antd/lib";

const { TextArea } = Input;
const { Title } = Typography;

interface IProps {
  openCreate: boolean;
  setOpenCreate: (open: boolean) => void;
  fetchDoctorProfile: () => void;
}

type FieldType = {
  fullName: string;
  phone: string;
  gender: string;
  title: string;
  experienceYears: number;
  avatar_url: string;
  specialtyId: string;
  clinicId: string;
  bookingFee: number;
  consultationFee: number;
  bio: string;
};

const DoctorProFileCreate = (props: IProps) => {
  const { openCreate, setOpenCreate, fetchDoctorProfile } = props;
  const [form] = Form.useForm();
  const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
  const [clinics, setClinics] = useState<IClinic[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  // Fetch specialties and clinics
  useEffect(() => {
    if (openCreate) {
      fetchSpecialties();
      fetchClinics();
    }
  }, [openCreate]);

  const fetchSpecialties = async () => {
    try {
      const res = await getAllSpecialtiesDoctorProFile();
      if (res.data) {
        setSpecialties(res?.data.result as ISpecialty[]);
      }
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await getAllClinicsDoctorProFile();
      if (res.data) {
        setClinics(res?.data.result as IClinic[]);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const {
      fullName,
      phone,
      gender,
      title,
      experienceYears,
      avatar_url,
      specialtyId,
      clinicId,
      bookingFee,
      consultationFee,
      bio,
    } = values;
    setIsSubmit(true);

    const res = await createDoctorProfile(
      fullName,
      phone,
      gender,
      title,
      experienceYears,
      avatar_url,
      specialtyId,
      clinicId,
      bookingFee,
      consultationFee,
      bio
    );
    if (res && res.data) {
      notification.success({
        message: "Tạo mới hồ sơ bác sĩ thành công",
        placement: "top",
        duration: 5,
        style: {
          fontSize: "16px",
        },
        description: "Vui lòng chờ admin phê duyệt",
      });
      form.resetFields();
      setOpenCreate(false);
      fetchDoctorProfile?.();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setOpenCreate(false);
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
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
      return false; // Prevent auto upload
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1)); // Only keep the last uploaded file
    },
    fileList,
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span
            className="text-lg font-semibold w-full flex justify-center items-center"
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "700",
            }}
          >
            Tạo hồ sơ bác sĩ
          </span>
        </div>
      }
      open={openCreate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnClose={true}
      okText="Tạo mới"
      cancelText="Hủy"
      width="60vw"
      maskClosable={false}
      confirmLoading={isSubmit}
      className="doctor-profile-create-modal"
      okButtonProps={{
        size: "large",
        style: { minWidth: 100, height: 45, fontSize: 18, borderRadius: 10 },
      }}
      cancelButtonProps={{
        size: "large",
        style: { minWidth: 100, height: 45, fontSize: 18, borderRadius: 10 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          experienceYears: 0,
          consultationFee: 0,
          bookingFee: 0,
        }}
      >
        {/* Personal Information Section */}
        <div>
          <Title level={4} className="flex items-center mb-4">
            <UserOutlined className="mr-2 text-blue-600" />
            Thông tin cá nhân
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input
                  placeholder="Nhập họ và tên đầy đủ"
                  prefix={<UserOutlined className="text-gray-400" />}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  size="large"
                  options={[
                    { value: "Male", label: "Nam" },
                    { value: "Female", label: "Nữ" },
                    { value: "Other", label: "Khác" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Học vị"
                rules={[{ required: true, message: "Vui lòng chọn học vị!" }]}
              >
                <Select
                  placeholder="Chọn học vị"
                  size="large"
                  options={[
                    { value: "BS", label: "Bác sĩ" },
                    { value: "ThS", label: "Thạc sĩ" },
                    { value: "TS", label: "Tiến sĩ" },
                    { value: "PGS", label: "Phó Giáo sư" },
                    { value: "GS", label: "Giáo sư" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="experienceYears"
                label="Số năm kinh nghiệm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số năm kinh nghiệm!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số năm kinh nghiệm"
                  min={0}
                  max={50}
                  className="w-full"
                  size="large"
                  prefix={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="avatar_url" label="Ảnh đại diện">
                <Upload {...uploadProps} listType="picture-card" maxCount={1}>
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div className="mt-2">Tải ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Professional Information Section */}
        <div className="mb-6">
          <Title level={4} className="flex items-center mb-4">
            <TrophyOutlined className="mr-2 text-green-600" />
            Thông tin chuyên môn
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="specialtyId"
                label="Chuyên khoa"
                rules={[
                  { required: true, message: "Vui lòng chọn chuyên khoa!" },
                ]}
              >
                <Select
                  placeholder="Chọn chuyên khoa"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={specialties.map((specialty) => ({
                    value: specialty.id,
                    label: specialty.specialtyName,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="clinicId"
                label="Phòng khám"
                rules={[
                  { required: true, message: "Vui lòng chọn phòng khám!" },
                ]}
              >
                <Select
                  placeholder="Chọn phòng khám"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={clinics.map((clinic) => ({
                    value: clinic.id,
                    label: clinic.clinicName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Financial Information Section */}
        <div className="mb-6">
          <Title level={4} className="flex items-center mb-4">
            <DollarOutlined className="mr-2 text-yellow-600" />
            Thông tin phí khám
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="bookingFee"
                label="Phí đặt lịch (VND)"
                rules={[
                  { required: true, message: "Vui lòng nhập phí đặt lịch!" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập phí đặt lịch"
                  min={0}
                  className="!w-[200px]"
                  size="large"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  prefix={<DollarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="consultationFee" label="Phí tư vấn (VND)">
                <InputNumber
                  placeholder="Nhập phí tư vấn"
                  min={0}
                  className="!w-[200px]"
                  size="large"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  prefix={<DollarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Bio Section */}
        <div className="mb-6">
          <Title level={4} className="flex items-center mb-4">
            <FileTextOutlined className="mr-2 text-purple-600" />
            Giới thiệu
          </Title>

          <Form.Item
            name="bio"
            label="Tiểu sử và kinh nghiệm"
            rules={[{ required: true, message: "Vui lòng nhập tiểu sử!" }]}
          >
            <TextArea
              placeholder="Nhập tiểu sử, kinh nghiệm chuyên môn, chuyên khoa chính..."
              rows={6}
              showCount
              maxLength={1000}
              className="resize-none"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default DoctorProFileCreate;
