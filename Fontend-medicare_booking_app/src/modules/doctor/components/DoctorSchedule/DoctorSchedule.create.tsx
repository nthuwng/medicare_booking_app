import React, { useEffect, useMemo } from "react";
import { Col, Divider, Form, Input, Modal, Row, Select, DatePicker, message } from "antd";
import type { FormProps } from "antd";
import type { Dayjs } from "dayjs";
import { createDoctorSchedule } from "../../services/doctor.api";

// ---- types nhẹ (tuỳ dự án bạn có thể import type riêng) ----
export interface IClinic {
  id: number | string;
  tenPhongKham?: string;
  name?: string;
  clinicName?: string;
  clinic_name?: string;
  title?: string;
  clinic?: {
    tenPhongKham?: string;
    name?: string;
    clinicName?: string;
  };
}
export interface ITimeSlotDetail {
  id: number | string;
  name?: string;
  startTime?: string;
  endTime?: string;
}

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  timeSlots: ITimeSlotDetail[];
  clinics: IClinic[];     // truyền từ cha: res.data.result
  doctorId: string;
}

type FieldType = {
  date: Dayjs;
  clinicId: number | string;
  timeSlotIds: Array<number | string>;
  note?: string;
  doctorId?: string; // field ẩn
};

// helper: rút nhãn phòng khám từ mọi key có thể gặp
const getClinicLabel = (c: any) => {
  const label =
    c?.tenPhongKham ??
    c?.name ??
    c?.clinicName ??
    c?.clinic_name ??
    c?.title ??
    c?.clinic?.tenPhongKham ??
    c?.clinic?.name ??
    c?.clinic?.clinicName;

  const trimmed = (label ?? "").toString().trim();
  return trimmed || `Phòng khám #${c?.id}`;
};

const DoctorScheduleCreate: React.FC<IProps> = ({
  openModalCreate,
  setOpenModalCreate,
  timeSlots,
  clinics,
  doctorId,
}) => {
  const [form] = Form.useForm<FieldType>();

  // log để kiểm tra dữ liệu khi mở modal
  useEffect(() => {
    if (openModalCreate) {
      console.log("[Clinics in modal] ->", clinics);
      if (clinics?.length) {
        console.log("First clinic keys:", Object.keys(clinics[0]), clinics[0]);
      }
      form.setFieldsValue({ doctorId });
    } else {
      form.resetFields();
    }
  }, [openModalCreate, doctorId, form, clinics]);

  // ---- options: phòng khám (hiển thị tên, submit id) ----
  const clinicOptions = useMemo(
    () =>
      (clinics ?? []).map((c: any) => ({
        value: Number(c.id),       // submit lên BE
        label: getClinicLabel(c),  // tên hiển thị
      })),
    [clinics]
  );

  // ---- options: khung giờ ----
  const timeSlotOptions = useMemo(
    () =>
      (timeSlots ?? []).map((t) => ({
        value: Number(t.id),
        label: t.name ?? `${t.startTime} - ${t.endTime}`,
      })),
    [timeSlots]
  );

  const onFinish: FormProps<FieldType>["onFinish"] = async (v) => {
    const d = v.date;
    const payload = {
      doctorId: (v.doctorId || doctorId || "").trim(),
      clinicId: Number(v.clinicId),
      timeSlotId: (v.timeSlotIds ?? []).map((x) => Number(x)), // BE yêu cầu: number[]
      date: `${d.year()}/${d.month() + 1}/${d.date()}`,        // "YYYY/M/D"
      // note: v.note,
    };

    try {
      await createDoctorSchedule(payload);
      message.success("Tạo lịch làm việc thành công");
      form.resetFields();
      setOpenModalCreate(false);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Tạo lịch thất bại");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = ({ errorFields }) => {
    if (errorFields?.length) form.scrollToField(errorFields[0].name);
  };

  return (
    <Modal
      title="Thêm mới lịch làm việc"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpenModalCreate(false);
      }}
      destroyOnClose
      okText="Tạo mới"
      cancelText="Hủy"
      width="50vw"
      maskClosable={false}
    >
      <Divider />
      <Form
        form={form}
        name="form-create-schedule"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* giữ doctorId trong values */}
        <Form.Item<FieldType> name="doctorId" hidden rules={[{ required: true, message: "Thiếu doctorId" }]}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Ngày làm việc"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker className="w-full" format="YYYY/MM/DD" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
              label="Phòng khám"
              name="clinicId"
              rules={[{ required: true, message: "Vui lòng chọn phòng khám!" }]}
            >
              <Select
                placeholder="Chọn phòng khám"
                options={clinicOptions}
                showSearch
                optionFilterProp="label"
                notFoundContent="Trống"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Khung giờ làm"
              name="timeSlotIds"
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 khung giờ!" },
                { type: "array", min: 1, message: "Chọn ít nhất 1 khung giờ!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn khung giờ"
                options={timeSlotOptions}
                showSearch
                optionFilterProp="label"
                notFoundContent="Trống"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType> label="Ghi chú (tuỳ chọn)" name="note">
              <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DoctorScheduleCreate;
