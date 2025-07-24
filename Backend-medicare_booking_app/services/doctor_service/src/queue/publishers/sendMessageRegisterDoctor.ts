import { getChannel } from "../connection";

export const publishNewDoctorRegistered = async (
  exchangeName: string,
  routingKey: string,
  payload: any
): Promise<void> => {
  try {
    const channel = getChannel();
    if (!channel) {
      console.error(
        "RabbitMQ channel is not available. Cannot publish message."
      );
      return;
    }

    // Tạo exchange type fanout để broadcast message
    await channel.assertExchange(exchangeName, "fanout", { durable: false });

    // Publish message tới exchange
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

  } catch (error) {
    console.error(
      `[Publisher] Error sending message to exchange "${exchangeName}":`,
      error
    );
  }
};
