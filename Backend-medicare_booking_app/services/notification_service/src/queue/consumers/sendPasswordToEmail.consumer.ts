import { sendEmailOTP } from "src/services/sendEmail.service";
import { getChannel } from "../connection";
import { sendPasswordToEmail } from "src/services/sendPasswordToEmail.service";

export const initSendPasswordToEmailConsumer = async () => {
  const channel = getChannel();
  const exchangeName = "auth.exchange";
  const queueName = "auth.reset_password";

  await channel.assertExchange(exchangeName, "topic", { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName, "auth.reset_password");

  channel.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());

      await sendPasswordToEmail(payload.email, payload.newPassword);

      channel.ack(msg);
    } catch (err) {
      console.error("[Notification] Error handling auth.reset_password:", err);
      // tránh requeue vô hạn; nếu có DLX thì nack requeue=false sẽ đẩy sang DLQ
      channel.nack(msg, false, false);
    }
  });
};
