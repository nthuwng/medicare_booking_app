
import { getChannel } from "../connection";
import { createAdminProfile } from "src/repository/admin.repo";

export const initCreateAdminProfileConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("user.create_admin_profile", { durable: false });

  channel.consume("user.create_admin_profile", async (msg) => {
    if (!msg) return;

    try {
      const { userId, email } = JSON.parse(msg.content.toString());

      const admin = await createAdminProfile(userId, email);

      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(admin || null)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      // Gửi phản hồi null thay vì nack để tránh timeout
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(null)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    }
  });
};
