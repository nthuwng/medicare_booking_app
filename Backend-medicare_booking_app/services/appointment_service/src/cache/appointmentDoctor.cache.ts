// src/cache/clinic/clinic.cache.ts
import { createCache } from "src/cache/base.cache";

export const ALL_APPOINTMENTS_BY_DOCTOR_PREFIX = "appointmentsDoctor:all";

export type AllAppointmentByDoctorCacheParams = {
  page: number;
  pageSize: number;
  doctorId: string;
  mode: "exact" | "range" | "fromToday";
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format (optional for fromToday mode)
  status?: string;
  paymentStatus?: string;
};

const buildCacheKey = (params: AllAppointmentByDoctorCacheParams): string => {
  const { page, pageSize, doctorId, mode, startDate, endDate, status, paymentStatus } = params;
  return [
    ALL_APPOINTMENTS_BY_DOCTOR_PREFIX,
    page,
    pageSize,
    doctorId || "_",
    mode,
    startDate,
    endDate || "_",
    status || "_",
    paymentStatus || "_",
  ].join(":");
};

export const AllAppointmentByDoctorCache =
  createCache<AllAppointmentByDoctorCacheParams>({
    prefix: ALL_APPOINTMENTS_BY_DOCTOR_PREFIX,
    buildKey: buildCacheKey,
    ttlSeconds: 600, // có thể bỏ, mặc định 600
  });
