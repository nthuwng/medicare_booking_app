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