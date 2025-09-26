import { createUserProfile } from "src/repository/patient.repo";
import { getChannel } from "../connection";

export const initCreateUserProfileConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("user.create_user_profile", { durable: false });

  channel.consume("user.create_user_profile", async (msg) => {
    if (!msg) return;

    try {
      const { userId, email } = JSON.parse(msg.content.toString());

      const patient = await createUserProfile(userId, email);

      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(patient || null)),
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
