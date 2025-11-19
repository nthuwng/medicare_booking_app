import "dotenv/config";
import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
  ? new Redis(redisUrl)
  : new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      ...(process.env.REDIS_PASSWORD && {
        password: process.env.REDIS_PASSWORD,
      }),
    });

redis.on("connect", () => {
  console.log("✅ [Redis] Appointment_service Connected");
});

redis.on("error", (err) => {
  console.error("❌ [Redis] Appointment_service Error:", err);
});

redis.on("close", () => {
  console.log("⚠️ [Redis] Appointment_service Connection closed");
});