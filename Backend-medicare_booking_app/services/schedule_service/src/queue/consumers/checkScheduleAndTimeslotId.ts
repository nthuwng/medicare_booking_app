import { getChannel } from "../connection";
import {
  getScheduleByScheduleId,
  getScheduleByScheduleIdAndTimeSlotId,
} from "src/repository/schedule.repo";

// Khởi tạo consumer để lắng nghe queue "auth.get_user"
export const initCheckScheduleAndTimeslotIdConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("schedule.check_schedule_and_timeslot_id", {
    durable: false,
  });

  channel.consume("schedule.check_schedule_and_timeslot_id", async (msg) => {
    if (!msg) return;

    try {
      const { scheduleId, timeSlotId } = JSON.parse(msg.content.toString());
      const schedule = await getScheduleByScheduleIdAndTimeSlotId(
        scheduleId,
        timeSlotId
      );
      // Gửi phản hồi đến queue được chỉ định trong `replyTo`
      // const isAvailable = schedule?.isAvailable === true;
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify({ ...schedule })),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    } catch (err) {
      console.error(
        "Error processing schedule.check_schedule_and_timeslot_id:",
        err
      );
      channel.nack(msg, false, false); // bỏ qua message lỗi
    }
  });
};
