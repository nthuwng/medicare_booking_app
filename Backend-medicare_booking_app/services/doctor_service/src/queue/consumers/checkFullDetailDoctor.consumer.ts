import { getDoctorByUserIdService } from "src/services/doctorServices";
import { getChannel } from "../connection";
import {
  getDoctorProfileBasicInfo,
  getDoctorProfileFullDetail,
} from "src/repository/doctor.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initCheckFullDetailDoctorConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("doctor.check_full_detail_doctor", {
    durable: false,
  });

  channel.consume("doctor.check_full_detail_doctor", async (msg) => {
    if (!msg) return;

    try {
      const { doctorId } = JSON.parse(msg.content.toString());
      const doctor = await getDoctorProfileFullDetail(doctorId);

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(doctor)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Error processing doctor.check_full_detail_doctor:", err);
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
