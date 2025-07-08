import { ApprovalStatus, Gender } from "../common";

export interface CreateAppointmentInput {
  doctorId: string;
  scheduleId: string;
  clinicId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

export interface DoctorDetails {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  bio: string;
  experienceYears: number;
  gender: Gender;
  avatarUrl: string;
  approvalStatus: ApprovalStatus;
  licenseNumber: string;
  createdAt: string;
  specialties: any[];
  clinics: any[];
}

export interface CheckDoctorOutput {
  doctor: DoctorDetails;
}
