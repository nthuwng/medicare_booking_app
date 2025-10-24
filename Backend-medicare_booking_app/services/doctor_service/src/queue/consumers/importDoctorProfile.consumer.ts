// src/queue/consumers/notification.registered.consumer.ts

import { importDoctorProfiles } from "src/repository/doctor.repo";
import { getChannel } from "../connection";

export const initImportDoctorProfileConsumer = async () => {
  const channel = getChannel();
  const exchangeName = "auth.exchange";
  const queueName = "auth.import_doctor_profile";

  await channel.assertExchange(exchangeName, "topic", { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(
    queueName,
    exchangeName,
    "auth.import_doctor_profile"
  );

  channel.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      const { doctors }: { doctors: any } = JSON.parse(msg.content.toString());
      await importDoctorProfiles(doctors as any[]);

      channel.ack(msg);
    } catch (err) {
      console.error("[Auth] Error handling auth.import_doctor_profile:", err);
      // tránh requeue vô hạn; nếu có DLX thì nack requeue=false sẽ đẩy sang DLQ
      channel.nack(msg, false, false);
    }
  });
};
