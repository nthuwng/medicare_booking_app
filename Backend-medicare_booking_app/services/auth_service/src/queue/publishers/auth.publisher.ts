import { rpcRequest } from "./rpcRequest";

const createUserProfileViaRabbitMQ = async (userId: string, email: string) => {
  return rpcRequest("user.create_user_profile", { userId, email });
};

const createAdminProfileViaRabbitMQ = async (userId: string, email: string) => {
  return rpcRequest("user.create_admin_profile", { userId, email });
};

export { createUserProfileViaRabbitMQ, createAdminProfileViaRabbitMQ };
