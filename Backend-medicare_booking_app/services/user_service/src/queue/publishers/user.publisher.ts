import { getChannel } from "../connection";
import { randomUUID } from "crypto";

const getUserByIdViaRabbitMQ = async (userId: string) => {
  const channel = getChannel();

  // Tạo một queue tạm thời để nhận response
  const { queue: replyQueue } = await channel.assertQueue("", {
    exclusive: true,
    autoDelete: true,
  });

  // Tạo một correlationId unique để map request với response
  const correlationId = randomUUID();

  return new Promise((resolve, reject) => {
    // Set timeout để không đợi mãi mãi
    const timeout = setTimeout(() => {
      channel.close();
      reject(new Error("Request timeout"));
    }, 5000);

    // Lắng nghe response
    channel.consume(replyQueue, (msg) => {
      if (!msg) return;
      if (msg.properties.correlationId === correlationId) {
        clearTimeout(timeout);
        const response = JSON.parse(msg.content.toString());
        resolve(response);
        channel.ack(msg);
      }
    });

    // Gửi request với replyTo và correlationId
    channel.sendToQueue(
      "auth.get_user",
      Buffer.from(JSON.stringify({ userId })),
      {
        correlationId,
        replyTo: replyQueue,
      }
    );
  });
};

export { getUserByIdViaRabbitMQ };
