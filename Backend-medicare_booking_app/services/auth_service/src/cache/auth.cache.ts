// src/cache/clinic/clinic.cache.ts
import { createCache } from "src/cache/base.cache";

export const ALL_USERS_PREFIX = "users:all";

export type AllUsersCacheParams = {
  page: number;
  pageSize: number;
  email: string;
  userType: string;
  isActive: string;
};

const buildCacheKey = (params: AllUsersCacheParams): string => {
  const { page, pageSize, email, userType, isActive } = params;
  return [
    ALL_USERS_PREFIX,
    page,
    pageSize,
    email || "_",
    userType || "_",
    isActive || "_",
  ].join(":");
};

export const AllUsersCache = createCache<AllUsersCacheParams>({
  prefix: ALL_USERS_PREFIX,
  buildKey: buildCacheKey,
  ttlSeconds: 600, // có thể bỏ, mặc định 600
});
