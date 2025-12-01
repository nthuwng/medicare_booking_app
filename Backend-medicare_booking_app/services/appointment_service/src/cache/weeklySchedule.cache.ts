// src/cache/clinic/clinic.cache.ts
import { createCache } from "src/cache/base.cache";

export const ALL_WEEKLY_SCHEDULE_PREFIX = "weeklySchedule:all";

export type AllWeeklyScheduleCacheParams = {
  doctorId: string;
};

const buildCacheKey = (params: AllWeeklyScheduleCacheParams): string => {
  const { doctorId } = params;
  return [ALL_WEEKLY_SCHEDULE_PREFIX, doctorId || "_"].join(
    ":"
  );
};

export const AllWeeklyScheduleCache = createCache<AllWeeklyScheduleCacheParams>(
  {
    prefix: ALL_WEEKLY_SCHEDULE_PREFIX,
    buildKey: buildCacheKey,
    ttlSeconds: 600, // có thể bỏ, mặc định 600
  }
);
