import cron from "node-cron";
import { updateExpiredTimeSlots } from "../services/scheduleServices";

// Job chạy mỗi 30 phút để cập nhật time slots hết hạn
const updateExpiredSlotsJob = () => {
  // Chạy mỗi 30 phút
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("🕐 Bắt đầu cập nhật time slots hết hạn...");
      const result = await updateExpiredTimeSlots();
      console.log(`✅ ${result.message}`);

      if (result.updated > 0) {
        console.log(`📊 Chi tiết: Đã cập nhật ${result.updated} time slots`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật time slots hết hạn:", error);
    }
  });

  console.log(
    "⏰ Job cập nhật time slots hết hạn đã được khởi tạo (chạy mỗi 30 phút)"
  );
};

export { updateExpiredSlotsJob };
