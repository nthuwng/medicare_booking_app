import axios from "services/axios.customize";
import type { ISpecialty } from "../types";

export const getAllSpecialties = (query: string) => {
  const urlBackend = `/api/doctor/specialties?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ISpecialty>>>(urlBackend);
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
