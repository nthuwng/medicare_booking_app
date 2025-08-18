export interface IDoctorProfileBooking {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  bio: string;
  experienceYears: number;
  gender: string;
  avatarUrl: string;
  approvalStatus: string;
  title: string;
  specialtyId: number;
  clinicId: number;
  consultationFee: number;
  bookingFee: number;
  createdAt: string;
  clinic: IClinicDoctor;
  specialty: ISpecialtyDoctor;
  userInfo: IManageUser;
}

export interface IClinicDoctor {
  id: number;
  clinicName: string;
  city: string;
  district: string;
  street: string;
  phone: string;
  description: string;
}

export interface IClinicBooking {
  id: number;
  clinicName: string;
  city: string;
}

export interface ISpecialtyDoctor {
  id: number;
  specialtyName: string;
  iconPath: string;
  description: string;
}

export interface IManageUser {
  id: string;
  email: string;
  userType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
