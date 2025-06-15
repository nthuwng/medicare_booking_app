import amqp from "amqplib";

let channel: amqp.Channel;

export const initRabbitMQ = async () => {
  const conn = await amqp.connect("amqp://localhost");
  channel = await conn.createChannel();
};

export const sendRPCMessage = (queue: string, msg: any): Promise<any> => {
  return new Promise(async (resolve) => {
    const correlationId = generateUuid();
    const replyQueue = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      replyTo: replyQueue.queue,
    });

    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          const result = JSON.parse(msg.content.toString());
          resolve(result);
        }
      },
      { noAck: true }
    );
  });
};

function generateUuid() {
  return Math.random().toString() + Math.random().toString();
}
