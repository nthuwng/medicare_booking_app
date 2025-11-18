// src/cache/doctor/doctorApprove.cache.ts
import { createCache } from "src/cache/base.cache";

export const DOCTORS_PREFIX = "doctors:all";

export type DoctorsCacheParams = {
  page: number;
  pageSize: number;
  fullName: string;
  phone: string;
  title: string;
  approvalStatus: string;
};

const buildCacheKey = (params: DoctorsCacheParams): string => {
  const { page, pageSize, fullName, phone, title, approvalStatus } =
    params;

  return [
    DOCTORS_PREFIX,
    page,
    pageSize,
    fullName || "_",
    phone || "_",
    title || "_",
    approvalStatus || "_",
  ].join(":");
};

export const DoctorsCache = createCache<DoctorsCacheParams>({
  prefix: DOCTORS_PREFIX,
  buildKey: buildCacheKey,
  ttlSeconds: 600,
});
