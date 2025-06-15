import { sendRPCMessage } from "@shared/utils/rabbitmq";

const getUserByIdViaRabbitMQ = async (userId: string) => {
  const response = await sendRPCMessage("auth.get_user", { userId });
  return response;
};

export { getUserByIdViaRabbitMQ };
