export interface IPayment {
  id: string;
  appointmentId: string;
  txnRef: string;
  transactionNo: string | null;
  amount: number;
  gateway: PaymentGateway;
  state: PaymentState;
  orderInfo: string;
  bankCode: string | null;
  payDate: string | null;
  transactionDate: string | null;
  rawQuery: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PaymentGateway = "VNPAY" | "CASH";

export type PaymentState = "PENDING" | "PAID" | "FAILED" | "CANCELED";

export interface IReturnPaymentCancel {
  appointment: {
    id: string;
    status: string;
    appointmentDateTime: string;
    totalFee: number;
    updatedAt: string;
  };
  payment: {
    gateway: string;
    refundProcessed: boolean;
    refundRequired: boolean;
  };
}
