import { rpcRequest } from "./rpcRequest";

const createUserProfileViaRabbitMQ = async (userId: string, email: string) => {
  return rpcRequest("user.create_user_profile", { userId, email });
};

export { createUserProfileViaRabbitMQ };
