import dayjs from "dayjs";
import sendEmail from "src/helpers/email.sender";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

function generateEmailResetPasswordHtml(email: string, newPassword: string) {
  const logoDataUri = `https://res.cloudinary.com/dwevfv0is/image/upload/v1762418766/LOGO_MEDICARE_iz1guo.png`;
  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Khôi phục mật kh</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #f6f7fb;">
      <div style="padding: 24px 12px;">
        <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #eaecef; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
          <div style="padding: 24px; text-align: center; border-bottom: 1px solid #f0f1f3;">
            <img src="${logoDataUri}" style="max-width: 120px; margin-bottom: 20px;" alt="Logo Medicare"/>
            <h2 style="color: #333; margin: 0 0 20px; font-size: 24px;">Khôi phục mật khẩu</h2>
            <h2 style="color: #333; margin: 0 0 20px; font-size: 18px;">Xin chào ${email}! 👋</h2>
          </div>

          <div style="padding: 16px 24px 24px 24px;">
            <div style="background-color: #e3f2fd; color: #1e88e5; font-size: 30px; text-align: center; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
              Mật khẩu mới của bạn: <strong>${newPassword}</strong>
            </div>

            <p style="margin-top: 16px; font-size: 14px; color: #56637a;">
              Trân trọng,<br />
              Đội ngũ Medicare Booking
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}

export async function sendPasswordToEmail(email: string, newPassword: string) {
  const subject = "Khôi phục mật khẩu - Medicare Booking";
  const html = generateEmailResetPasswordHtml(email, newPassword);
  await sendEmail({ email, subject, html });
}

export const EmailService = {
  sendPasswordToEmail,
};
