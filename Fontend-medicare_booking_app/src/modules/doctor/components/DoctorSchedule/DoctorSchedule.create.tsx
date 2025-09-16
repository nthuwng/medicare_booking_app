import React, { useEffect, useMemo } from "react";
import { Col, Divider, Form, Input, Modal, Row, Select, DatePicker, message } from "antd";
import type { FormProps } from "antd";
import type { Dayjs } from "dayjs";
import { createDoctorSchedule } from "../../services/doctor.api";

export interface IClinic { id: number | string; tenPhongKham?: string; name?: string; }
export interface ITimeSlotDetail { id: number | string; name?: string; startTime?: string; endTime?: string; }

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  timeSlots: ITimeSlotDetail[];
  clinics: IClinic[];
  doctorId: string;

  // 👇 mới thêm
  fixedClinicId?: number | string | null;
  fixedClinicName?: string;
}

type FieldType = {
  date: Dayjs;
  clinicId: number | string;
  timeSlotIds: Array<number | string>;
  note?: string;
  doctorId?: string;
};

const DoctorScheduleCreate: React.FC<IProps> = ({
  openModalCreate,
  setOpenModalCreate,
  timeSlots,
  clinics,
  doctorId,
  fixedClinicId,
  fixedClinicName,
}) => {
  const [form] = Form.useForm<FieldType>();

  // Bơm sẵn doctorId & clinicId khi mở modal
  useEffect(() => {
    if (openModalCreate) {
      const patch: Partial<FieldType> = { doctorId };
      if (fixedClinicId != null) patch.clinicId = Number(fixedClinicId);
      form.setFieldsValue(patch as FieldType);
    } else {
      form.resetFields();
    }
  }, [openModalCreate, doctorId, fixedClinicId, form]);

  // Options (phòng khám) — vẫn giữ để dùng nếu không truyền fixedClinicId
  const clinicOptions = useMemo(
    () =>
      (clinics ?? []).map((c) => ({
        value: Number(c.id),
        label: c.tenPhongKham || c.name || `Phòng khám #${c.id}`,
      })),
    [clinics]
  );

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
      clinicId: Number(v.clinicId ?? fixedClinicId),          // 🔒 đảm bảo gửi đúng clinic cố định
      timeSlotId: (v.timeSlotIds ?? []).map((x) => Number(x)),
      date: `${d.year()}/${d.month() + 1}/${d.date()}`,
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
      onCancel={() => { form.resetFields(); setOpenModalCreate(false); }}
      destroyOnClose
      okText="Tạo mới"
      cancelText="Hủy"
      width="50vw"
      maskClosable={false}
    >
      <Divider />
      <Form form={form} name="form-create-schedule" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        {/* Ẩn doctorId */}
        <Form.Item<FieldType> name="doctorId" hidden rules={[{ required: true, message: "Thiếu doctorId" }]}>
          <Input />
        </Form.Item>

        {/* Nếu có fixedClinicId -> ẩn field submit clinicId + hiển thị tên readonly */}
        {fixedClinicId != null ? (
          <>
            {/* Ẩn để submit đúng clinicId */}
            <Form.Item<FieldType> name="clinicId" hidden initialValue={Number(fixedClinicId)}>
              <Input />
            </Form.Item>
            {/* Chỉ hiển thị tên phòng khám, không cho đổi */}
            <Form.Item label="Phòng khám">
              <Input value={fixedClinicName || `Phòng khám #${fixedClinicId}`} disabled />
            </Form.Item>
          </>
        ) : (
          // Ngược lại: cho chọn bình thường (trường hợp account chưa gán phòng)
          <Form.Item<FieldType>
            label="Phòng khám"
            name="clinicId"
            rules={[{ required: true, message: "Vui lòng chọn phòng khám!" }]}
          >
            <Select placeholder="Chọn phòng khám" options={clinicOptions} showSearch optionFilterProp="label" />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label="Ngày làm việc" name="date" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <DatePicker className="w-full" format="YYYY/MM/DD" />
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
              <Select mode="multiple" placeholder="Chọn khung giờ" options={timeSlotOptions} showSearch optionFilterProp="label" />
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
