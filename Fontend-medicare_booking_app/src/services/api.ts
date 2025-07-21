import axios from "services/axios.customize";

export const loginAPI = (email: string, password: string) => {
  const urlBackend = "/api/auth/login";
  return axios.post<IBackendRes<ILogin>>(urlBackend, { email, password });
};

export const fetchAccountAPI = () => {
  const urlBackend = "/api/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};
