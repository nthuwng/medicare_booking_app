import {
  Modal,
  Form,
  Divider,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Upload,
  App,
} from "antd";
import { useState } from "react";
import type { FormProps } from "antd";
import { createClinic } from "../../services/admin.api";
interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  clinic_name: string;
  city: string;
  district: string;
  street: string;
  phone: string;
  description: string;
};

const ClinicCreate = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);

  const cityDistrictData: Record<string, string[]> = {
    HoChiMinh: [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Quận Bình Thạnh",
      "Quận Tân Bình",
      "Thủ Đức",
      "Quận Gò Vấp",
      "Quận Bình Tân",
    ],
    Hanoi: [
      "Ba Đình",
      "Hoàn Kiếm",
      "Đống Đa",
      "Cầu Giấy",
      "Thanh Xuân",
      "Hai Bà Trưng",
      "Tây Hồ",
    ],
  };

  const handleCityChange = (value: string) => {
    const selectedDistricts = cityDistrictData[value] || [];
    setDistricts(selectedDistricts);
    form.setFieldsValue({ district: undefined }); // reset district khi city đổi
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { clinic_name, city, district, street, phone, description } = values;
    console.log("city", values.city);
    setIsSubmit(true);

    const res = await createClinic(
      clinic_name,
      city,
      district,
      street,
      phone,
      description
    );
    console.log("res", res);
    if (res && res.data) {
      message.success("Tạo mới phòng khám thành công");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable?.();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Thêm mới phòng khám"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          form.resetFields();
          setOpenModalCreate(false);
        }}
        destroyOnClose={true}
        // okButtonProps={{ loading: isSubmit }}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        // confirmLoading={isSubmit}
        width={"50vw"}
        maskClosable={false}
      >
        <Divider />

        <Form
          form={form}
          name="form-create-book"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tên phòng khám"
                name="clinic_name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên phòng khám!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Số điện thoại phòng khám"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tên đường"
                name="street"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đường!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Thành phố"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng chọn thành phố!" },
                ]}
              >
                <Select
                  placeholder="Chọn thành phố"
                  onChange={handleCityChange}
                  options={[
                    { label: "Hồ Chí Minh", value: "HoChiMinh" },
                    { label: "Hà Nội", value: "Hanoi" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Quận/Huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng nhập quận/huyện!" },
                ]}
              >
                <Select
                  placeholder="Chọn quận/huyện"
                  options={districts.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  disabled={districts.length === 0}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ClinicCreate;
