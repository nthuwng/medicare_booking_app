import { rpcRequest } from "./rpcRequest";

const verifyTokenViaRabbitMQ = async (token: string) => {
  return rpcRequest("auth.verify_token", { token });
};

const getUserProfileByUserIdViaRabbitMQ = async (userId: string) => {
  return rpcRequest("user.getUserProfileByUserId", { userId });
};

const getDoctorIdByUserIdViaRabbitMQ = async (userId: string) => {
  return rpcRequest("doctor.get_doctor_id_by_user_id", { userId });
};

const checkFullDetailDoctorViaRabbitMQ = async (doctorId: string) => {
  return rpcRequest("doctor.check_full_detail_doctor", { doctorId });
};

export {
  verifyTokenViaRabbitMQ,
  getUserProfileByUserIdViaRabbitMQ,
  checkFullDetailDoctorViaRabbitMQ,
  getDoctorIdByUserIdViaRabbitMQ,
};
