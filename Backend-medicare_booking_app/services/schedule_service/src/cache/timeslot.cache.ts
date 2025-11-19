// src/cache/timeslot/timeslot.cache.ts
import { createCache } from "src/cache/base.cache";

export const ALL_TIME_SLOTS_PREFIX = "timeSlots:all";

// Params rỗng cho get all time slots
export type AllTimeSlotCacheParams = Record<string, never>;

const buildCacheKey = (): string => {
  return ALL_TIME_SLOTS_PREFIX;
};

export const AllTimeSlotCache = createCache<AllTimeSlotCacheParams>({
  prefix: ALL_TIME_SLOTS_PREFIX,
  buildKey: buildCacheKey,
  ttlSeconds: 3600, // Cache 1 giờ vì timeslots ít thay đổi
});
