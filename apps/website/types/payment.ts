export type PaymentMethod = "card" | "cash" | "other";
export type PaymentStatus = "completed" | "failed" | "refunded";

export interface Payment {
  bookingId: string;
  customerId: string;
  classId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  squarePaymentId: string | null;
  status: PaymentStatus;
  refunded: boolean;
  refundedAt: number | null;
  createdAt: number;
}

export interface PaymentWithId extends Payment {
  id: string;
}
