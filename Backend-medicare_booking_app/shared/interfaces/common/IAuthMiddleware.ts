import { UserType } from "./enums";

// Extend Request interface để thêm user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        userType: UserType;
        iat: string;
        exp: string;
      };
    }
  }
}

// Interface cho response từ auth service khi verify token
export interface AuthVerifyResponse {
  success: boolean;
  message: string;
  data: {
    userId: string | null;
    email: string | null;
    userType: string | null;
    isValid: boolean;
    iat: string;
    exp: string;
  };
}
