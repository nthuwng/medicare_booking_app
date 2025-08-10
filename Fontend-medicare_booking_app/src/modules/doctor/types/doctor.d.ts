export interface IDoctorProfile {
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

  export interface ISpecialty {
    id: string | number;
    specialtyName: string;
    iconPath: string;
    description: string;
  }

  export interface IClinic {
    id: string | number;
    clinicName: string;
    city: string;
    district: string;
    street: string;
    phone: string;
    description: string;
  }

  export interface INotificationDataDoctor {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: {
      data: {
        doctorId: string;
        phone: string;
        doctorName: string;
        doctorUserId: string;
        avatar_url: string;
        approvalStatus: string;
        registrationTime: string;
        email: string;
      };
      type: string;
      title: string;
      userId: string;
      message: string;
    };
    read: boolean;
    createdAt: string;
    updatedAt: string;
  }
  