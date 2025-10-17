import type { IDoctorProfile, IPatientProfile } from "./user";

export interface IRatingResponse {
  ratings: IRating[];
  ratingStats: IRatingStats;
}

export interface IRating {
  id: string;
  doctorId: string;
  userId: string;
  appointmentId: string | null;
  score: number;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  replies: IRatingReply[];
  userProfile: IPatientProfile;
  doctorProfile: IDoctorProfile;
}

export interface IRatingStats {
  doctorId: string;
  avgScore: string;
  totalReviews: number;
  lastReviewAt: string;
  updatedAt: string;
}

export interface IRatingReply {
  id: string;
  ratingId: string;
  replierType: "DOCTOR";
  replierId: string;
  content: string;
  createdAt: string;
}