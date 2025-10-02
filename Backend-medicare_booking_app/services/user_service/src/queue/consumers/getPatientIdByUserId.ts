import { getPatientIdByUserId } from "src/repository/patient.repo";
import { getChannel } from "../connection";

export const initGetPatientIdByUserIdConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("user.getPatientIdByUserId", { durable: false });

  channel.consume("user.getPatientIdByUserId", async (msg) => {
    if (!msg) return;

    try {
      const { userId } = JSON.parse(msg.content.toString());

      const patient = await getPatientIdByUserId(userId);

      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(patient?.id || null)),
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
