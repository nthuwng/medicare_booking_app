// src/cache/schedule/scheduleByDoctorId.cache.ts
import { createCache } from "src/cache/base.cache";

export const SCHEDULE_BY_DOCTOR_PREFIX = "schedule:doctor";

export type ScheduleByDoctorCacheParams = {
  doctorId: string;
  mode: "exact" | "range" | "fromToday";
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format (optional for fromToday mode)
};

const buildCacheKey = (params: ScheduleByDoctorCacheParams): string => {
  const { doctorId, mode, startDate, endDate } = params;
  return [
    SCHEDULE_BY_DOCTOR_PREFIX,
    doctorId,
    mode,
    startDate,
    endDate || "_",
  ].join(":");
};

export const ScheduleByDoctorCache = createCache<ScheduleByDoctorCacheParams>({
  prefix: SCHEDULE_BY_DOCTOR_PREFIX,
  buildKey: buildCacheKey,
  ttlSeconds: 300, // Cache 5 phút vì schedule thường xuyên thay đổi
});
