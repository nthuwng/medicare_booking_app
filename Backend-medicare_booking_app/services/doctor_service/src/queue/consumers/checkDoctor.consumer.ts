
import { checkDoctorInfor } from "src/services/doctorServices";
import { getChannel } from "../connection";
import { getDoctorProfileBasicInfo } from "src/repository/doctor.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initCheckDoctorConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("doctor.check_doctor_profile", { durable: false });

  channel.consume("doctor.check_doctor_profile", async (msg) => {
    if (!msg) return;

    try {
      const { doctorId } = JSON.parse(msg.content.toString());
      const doctor = await getDoctorProfileBasicInfo(doctorId);
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      const isApproved = doctor?.approvalStatus === "Approved";
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify({ ...doctor, isApproved })),
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
