import { getChannel } from "../connection";
import { doctorIdMessage } from "src/repository/doctor.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initGetDoctorIdMessage = async () => {
  const channel = getChannel();

  await channel.assertQueue("doctor.getDoctorIdByUserId", {
    durable: false,
  });

  channel.consume("doctor.getDoctorIdByUserId", async (msg) => {
    if (!msg) return;

    try {
      const { userId } = JSON.parse(msg.content.toString());
      const doctor = await doctorIdMessage(userId);

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(doctor?.id || null)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Error processing doctor.check_doctor_profile:", err);
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
