import axios from "services/axios.customize";
import type {
  IClinic,
  IDoctorProfile,
  INotificationDataAdmin,
  ISpecialty,
} from "@/types";
import type { ISchedule } from "@/types/schedule";

export const getDoctorProfileByUserId = (userId: string) => {
  const urlBackend = `/api/doctor/doctors/profile/${userId}`;
  return axios.get<IBackendRes<IDoctorProfile>>(urlBackend);
};

export const getAllSpecialtiesDoctorProFile = () => {
  const urlBackend = `/api/doctor/specialties?page=1&pageSize=100`;
  return axios.get<IBackendRes<IModelPaginate<ISpecialty>>>(urlBackend);
};

export const getAllClinicsDoctorProFile = () => {
  const urlBackend = `/api/doctor/clinics?page=1&pageSize=100`;
  return axios.get<IBackendRes<IModelPaginate<IClinic>>>(urlBackend);
};

export const markAsReadNotification = (notificationId: string) => {
  const urlBackend = `/api/notification/mark-as-read/${notificationId}`;
  return axios.put(urlBackend);
};

export const getNotificationByUserId = (userId: string) => {
  const urlBackend = `/api/notification/get-notification-by-user-id/${userId}`;
  return axios.get<IBackendRes<INotificationDataAdmin[]>>(urlBackend);
};

export const createDoctorProfile = (
  fullName: string,
  phone: string,
  gender: string,
  title: string,
  experienceYears: number,
  avatar_url: string,
  specialtyId: string,
  clinicId: string,
  bookingFee: number,
  consultationFee: number,
  bio: string
) => {
  const urlBackend = `/api/doctor/doctors`;
  return axios.post<IBackendRes<IDoctorProfile>>(urlBackend, {
    fullName,
    phone,
    gender,
    title,
    experienceYears,
    avatar_url,
    specialtyId,
    clinicId,
    bookingFee,
    consultationFee,
    bio,
  });
};

export const getScheduleByDoctorId = (userId: string) => {
  const urlBackend = `/api/schedule/schedules/by-doctorId/${userId}`;
  return axios.get<IBackendRes<ISchedule[]>>(urlBackend);
};
