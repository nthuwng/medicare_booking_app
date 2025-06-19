export * from "./IPatient";
export * from "./IAdmin";

export interface UserInfo {
  id: string;
  email: string;
  userType: "ADMIN" | "PATIENT" | "DOCTOR";
  isActive: boolean;
}
