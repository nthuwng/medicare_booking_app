export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

export interface UpdateNotificationStatus {
  read: boolean;
}
