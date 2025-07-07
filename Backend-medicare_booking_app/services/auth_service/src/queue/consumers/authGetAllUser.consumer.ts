import { prisma } from "../../config/client";
import { handleGetAllUsers, handleGetUserById } from "../../services/auth.services";
import { getChannel } from "../connection";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initAuthGetAllUserConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("auth.get_all_users", { durable: false });

  channel.consume("auth.get_all_users", async (msg) => {
    if (!msg) return;

    try {
      const user = await handleGetAllUsers();
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(user || [])),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Error processing auth.get_all_users:", err);
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
