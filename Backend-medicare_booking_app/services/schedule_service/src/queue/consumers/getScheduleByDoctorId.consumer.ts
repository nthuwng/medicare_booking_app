import { getChannel } from "../connection";
import { getScheduleByDoctorId } from "src/repository/schedule.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initGetScheduleByDoctorIdConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("schedule.get_schedule_by_doctor_id", {
    durable: false,
  });

  channel.consume("schedule.get_schedule_by_doctor_id", async (msg) => {
    if (!msg) return;

    try {
      const { doctorId } = JSON.parse(msg.content.toString());
      const schedule = await getScheduleByDoctorId(doctorId);
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      // const isAvailable = schedule?.isAvailable === true;
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(schedule)),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error(
        "Error processing schedule.get_schedule_by_doctor_id:",
        err
      );
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
