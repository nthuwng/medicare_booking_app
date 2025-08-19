import { rpcRequest } from "./rpcRequest";

const verifyTokenViaRabbitMQ = async (token: string) => {
  return rpcRequest("auth.verify_token", { token });
};

const checkAdminViaRabbitMQ = async (userId: string) => {
  return rpcRequest("auth.checkAdmin", { userId });
};

const checkDoctorViaRabbitMQ = async (userId: string) => {
  return rpcRequest("auth.checkDoctor", { userId });
};

const checkDoctorProfileViaRabbitMQ = async (doctorId: string) => {
  return rpcRequest("doctor.check_doctor_profile", { doctorId });
};

const checkClinicViaRabbitMQ = async (clinicId: string) => {
  return rpcRequest("doctor.check_clinic", { clinicId });
};

const getDoctorIdByUserIdViaRabbitMQ = async (userId: string) => {
  return rpcRequest("doctor.get_doctor_id_by_user_id", { userId });
};

export {
  verifyTokenViaRabbitMQ,
  checkAdminViaRabbitMQ,
  checkDoctorViaRabbitMQ,
  checkDoctorProfileViaRabbitMQ,
  checkClinicViaRabbitMQ,
  getDoctorIdByUserIdViaRabbitMQ,
};
