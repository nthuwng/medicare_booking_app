import { Col, Divider, Form, Input, Modal, Row } from "antd";
import React from "react";

interface IProps {
  openAppointment: boolean;
  setOpenAppointment: (open: boolean) => void;
}

type FieldType = {
  specialty_name: string;
  icon_path: string;
  description: string;
};

const DoctorAppointment = (props: IProps) => {
  const [form] = Form.useForm();
  const { openAppointment, setOpenAppointment } = props;

  const onFinish = (values: any) => {
    console.log("values", values);
  };
  console.log("openAppointment", openAppointment);
  return (
    <>
      <Modal
        title="Thêm mới book"
        open={openAppointment}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          form.resetFields();
          setOpenAppointment(false);
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

export default DoctorAppointment;
