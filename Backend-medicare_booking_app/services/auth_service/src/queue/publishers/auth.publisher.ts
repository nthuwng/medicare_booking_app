import { publishAuthEvent } from "./AuthEvent";
import { rpcRequest } from "./rpcRequest";
import { publishSendEmailEvent } from "./SendEmailEvent";
import { publishSendPasswordToEmailEvent } from "./SendPasswordToEmail";

const createUserProfileViaRabbitMQ = async (userId: string, email: string) => {
  return rpcRequest("user.create_user_profile", { userId, email });
};

const createAdminProfileViaRabbitMQ = async (userId: string, email: string) => {
  return rpcRequest("user.create_admin_profile", { userId, email });
};

const importDoctorProfilesViaRabbitMQ = async (doctors: any[]) => {
  return publishAuthEvent("auth.import_doctor_profile", { doctors });
};

const sendEmailForgotPassword = async (email: string, otp: string) => {
  return publishSendEmailEvent("auth.forgot_password", { email, otp });
};

const sendEmailResetPassword = async (email: string, newPassword: string) => {
  return publishSendPasswordToEmailEvent("auth.reset_password", {
    email,
    newPassword,
  });
};

export {
  createUserProfileViaRabbitMQ,
  createAdminProfileViaRabbitMQ,
  importDoctorProfilesViaRabbitMQ,
  sendEmailForgotPassword,
  sendEmailResetPassword,
};
