import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"MediCare" <' + process.env.GMAIL_USER + ">",
    to: email,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendEmail;
