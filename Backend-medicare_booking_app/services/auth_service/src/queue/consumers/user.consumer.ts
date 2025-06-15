import amqp from "amqplib";
import { prisma } from "../../config/client";

export const initAuthConsumer = async () => {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue("auth.get_user", { durable: false });

  channel.consume("auth.get_user", async (msg) => {
    if (msg === null) return;
    const { userId } = JSON.parse(msg.content.toString());

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, userType: true, isActive: true },
    });

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(user || {})),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    channel.ack(msg);
  });
};
