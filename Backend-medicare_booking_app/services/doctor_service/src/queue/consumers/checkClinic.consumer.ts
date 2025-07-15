import { findClinicById } from "src/services/clinicServices";
import { getChannel } from "../connection";

export const initCheckClinicConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("doctor.check_clinic", { durable: false });

  channel.consume("doctor.check_clinic", async (msg) => {
    if (!msg) return;

    try {
      const { clinicId } = JSON.parse(msg.content.toString());
      const clinic = await findClinicById(clinicId);
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(clinic || null)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Error processing doctor.check_clinic:", err);
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
