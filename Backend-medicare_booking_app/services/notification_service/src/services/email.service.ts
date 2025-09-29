import dayjs from "dayjs";
import sendEmail from "src/helpers/email.sender";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export interface AppointmentEmailData {
  appointmentId: string;
  patientName: string;
  patientPhone?: string;
  appointmentDateTime: string;
  doctorName?: string;
  specialtyName?: string;
  clinicName?: string;
  location?: string;
  reason?: string;
  totalFee?: number;
}

function generateAppointmentCreatedHtml(data: AppointmentEmailData) {
  const {
    appointmentId,
    patientName,
    patientPhone,
    appointmentDateTime,
    doctorName,
    specialtyName,
    clinicName,
    location,
    reason,
    totalFee,
  } = data;

  const money = typeof totalFee === "string" ? `${totalFee} VND` : "-";

  const isUTCInput = /Z$/i.test(appointmentDateTime);
  const localParsed = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(
    appointmentDateTime
  );

  const formattedDate = (() => {
    return dayjs.utc(appointmentDateTime).format("DD/MM/YYYY");
  })();

  const formattedTime = (() => {
    return dayjs.utc(appointmentDateTime).format("HH:mm");
  })();

  return `
  <div style="background:#f6f7fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#222;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eaecef;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="padding:24px 24px 8px 24px;text-align:center;border-bottom:1px solid #f0f1f3;">
        <h2 style="color:#0c6efd;margin:0 0 8px 0;font-size:20px;">Xác nhận đặt lịch hẹn thành công</h2>
        <p style="margin:0;color:#56637a;font-size:14px;">Xin chào <strong>${patientName}</strong>, bạn đã đặt lịch hẹn thành công trên hệ thống Medicare Booking.</p>
      </div>
      <div style="padding:16px 24px 24px 24px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0;">
          <tbody>
            <tr>
              <td style="padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;width:200px;color:#445069;font-weight:600;">Mã lịch hẹn</td>
              <td style="padding:10px 12px;border:1px solid #eef0f3;">${appointmentId}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;">Thời gian</td>
              <td style="padding:10px 12px;border:1px solid #eef0f3;">${formattedDate}${
    formattedTime ? ` ${formattedTime}` : ""
  }</td>
            </tr>
        ${
          doctorName
            ? `<tr><td style=\"padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;\">Bác sĩ</td><td style=\"padding:10px 12px;border:1px solid #eef0f3;\">${doctorName}${
                specialtyName ? ` - ${specialtyName}` : ""
              }</td></tr>`
            : ""
        }
        ${
          clinicName
            ? `<tr><td style=\"padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;\">Cơ sở</td><td style=\"padding:10px 12px;border:1px solid #eef0f3;\">${clinicName}</td></tr>`
            : ""
        }
        ${
          location
            ? `<tr><td style=\"padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;\">Địa chỉ</td><td style=\"padding:10px 12px;border:1px solid #eef0f3;\">${location}</td></tr>`
            : ""
        }
        ${
          patientPhone
            ? `<tr><td style=\"padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;\">SĐT liên hệ</td><td style=\"padding:10px 12px;border:1px solid #eef0f3;\">${patientPhone}</td></tr>`
            : ""
        }
        ${
          reason
            ? `<tr><td style=\"padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;\">Lý do khám</td><td style=\"padding:10px 12px;border:1px solid #eef0f3;\">${reason}</td></tr>`
            : ""
        }
            <tr>
              <td style="padding:10px 12px;border:1px solid #eef0f3;background:#fafbfc;color:#445069;font-weight:600;">Tổng chi phí dự kiến</td>
              <td style="padding:10px 12px;border:1px solid #eef0f3;">${money}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin:16px 0 0 0;color:#56637a;font-size:14px;">Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân cần thiết. Nếu bạn cần hỗ trợ, hãy phản hồi email này hoặc liên hệ CSKH.</p>
        <p style="margin:12px 0 0 0;color:#56637a;font-size:14px;">Trân trọng,<br/>Đội ngũ Medicare Booking</p>
      </div>
    </div>
  </div>`;
}

export async function sendAppointmentCreatedEmail(
  toEmail: string,
  data: AppointmentEmailData
) {
  const subject = "Xác nhận đặt lịch hẹn thành công";
  const html = generateAppointmentCreatedHtml(data);
  await sendEmail({ email: toEmail, subject, html });
}

export const EmailService = {
  sendAppointmentCreatedEmail,
};
