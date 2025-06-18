export interface UserInfo {
  id: string;
  email: string;
  userType: "ADMIN" | "PATIENT" | "DOCTOR";
  isActive: boolean;
}

export interface CreateAdminProfileData {
  userId: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
}

export interface CreatePatientProfileData {
  userId: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender: "Male" | "Female" | "Other";
  address?: string;
  city?: string;
  district?: string;
  createdAt?: Date;
}
