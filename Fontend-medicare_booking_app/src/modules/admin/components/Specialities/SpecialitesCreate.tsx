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
import { createSpecialty } from "../../services/admin.api";
interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  specialty_name: string;
  icon_path: string;
  description: string;
};

const SpecialitesCreate = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { specialty_name, description, icon_path } = values;
    setIsSubmit(true);

    const res = await createSpecialty(specialty_name, description, icon_path);
    console.log("res", res);
    if (res && res.data) {
      message.success("Tạo mới chuyên khoa thành công");
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
        title="Thêm mới book"
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
            <Col span={24}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tên chuyên khoa"
                name="specialty_name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên chuyên khoa!" },
                ]}
              >
                <Input />
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
            <Col span={24}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Ảnh chuyên khoa"
                name="icon_path"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ảnh chuyên khoa!",
                  },
                ]}
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

export default SpecialitesCreate;
