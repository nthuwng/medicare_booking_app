import { prisma } from "../../config/client";
import { handleGetUserById } from "../../services/auth.services";
import { getChannel } from "../connection";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initAuthCheckPatientConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("auth.check_patient", { durable: false });

  channel.consume("auth.check_patient", async (msg) => {
    if (!msg) return;

    try {
      const { userId } = JSON.parse(msg.content.toString());
      const user = await handleGetUserById(userId);
      const isPatient = user?.userType === "PATIENT";
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify({ isPatient })),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Error processing auth.check_patient:", err);
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
