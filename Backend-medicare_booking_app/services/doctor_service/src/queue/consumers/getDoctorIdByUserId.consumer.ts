import { getDoctorByUserIdService } from "src/services/doctorServices";
import { getChannel } from "../connection";
import { getDoctorProfileBasicInfo } from "src/repository/doctor.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initGetDoctorIdByUserIdConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("doctor.get_doctor_id_by_user_id", {
    durable: false,
  });

  channel.consume("doctor.get_doctor_id_by_user_id", async (msg) => {
    if (!msg) return;

    try {
      const { userId } = JSON.parse(msg.content.toString());
      const doctor = await getDoctorByUserIdService(userId);

      const doctorId = doctor?.id;
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify({ doctorId })),
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
