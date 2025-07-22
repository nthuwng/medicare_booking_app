import axios from "services/axios.customize";
import type { IClinic, ISpecialty } from "../types";

export const getAllSpecialties = (query: string) => {
  const urlBackend = `/api/doctor/specialties?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ISpecialty>>>(urlBackend);
};

export const getAllClinics = (query: string) => {
  const urlBackend = `/api/doctor/clinics?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IClinic>>>(urlBackend);
};

export const createSpecialty = (
  specialty_name: string,
  description: string,
  icon_path: string
) => {
  const urlBackend = `/api/doctor/specialties`;
  return axios.post<IBackendRes<ISpecialty>>(urlBackend, {
    specialty_name,
    description,
    icon_path,
  });
};

export const createClinic = (
  clinic_name: string,
  city: string,
  district: string,
  street: string,
  phone: string,
  description: string
) => {
  const urlBackend = `/api/doctor/clinics`;
  return axios.post<IBackendRes<ISpecialty>>(urlBackend, {
    clinic_name,
    city,
    district,
    street,
    phone,
    description,
  });
};
