export type BookingStatus = "paid" | "reserved" | "transferred";
export type TransferType = "date" | "customer";

export interface Booking {
  customerId: string;
  classId: string;
  status: BookingStatus;
  amount: number;
  transferredFrom: string | null;
  transferredTo: string | null;
  transferType: TransferType | null;
  createdAt: number;
  createdBy: string | null;
}

export interface BookingWithId extends Booking {
  id: string;
}

export interface TransferLog {
  originalBookingId: string;
  newBookingId: string;
  transferType: TransferType;
  fromClassId: string | null;
  toClassId: string | null;
  fromCustomerId: string | null;
  toCustomerId: string | null;
  performedBy: string;
  createdAt: number;
}

export interface TransferLogWithId extends TransferLog {
  id: string;
}
