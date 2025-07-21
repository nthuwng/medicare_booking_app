export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: {
      id: string;
      email: string;
      userType: string;
      isActive: boolean;
    };
  }

  interface IUser {
    id: string;
    email: string;
    userType: string;
    isActive: boolean;
  }
  interface IFetchAccount {
    user: IUser;
  }
}
