import axios from "services/axios.customize";
import type {
  IDoctorProfileBooking,
  ISpecialtyBooking,
  IClinicBooking,
} from "../types";

export const getAllApprovedDoctorsBooking = (query: string) => {
  const urlBackend = `/api/doctor/doctors/approved?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IDoctorProfileBooking>>>(
    urlBackend
  );
};

export const getAllSpecialtiesBooking = (query: string) => {
  const urlBackend = `/api/doctor/specialties?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ISpecialtyBooking>>>(urlBackend);
};

export const getAllClinicsBooking = (query: string) => {
  const urlBackend = `/api/doctor/clinics?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IClinicBooking>>>(urlBackend);
};
