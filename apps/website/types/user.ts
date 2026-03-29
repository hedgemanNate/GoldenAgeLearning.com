export type UserRole = "customer" | "staff" | "superAdmin" | "sponsor";

export interface DiscountRedemption {
  discountId: string;
  redeemedAt: number;
}

export interface User {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  notes: string | null;
  contact: string[];
  discounts: DiscountRedemption[];
  bookedClasses: Record<string, string>; // classId → bookingId
  starRating: number | null;
  profilePicture: string | null;
  totalRedemptions: number;
  squareCustomerId: string | null;
  squareCardId: string | null;
  createdAt: number;
  lastLoginAt: number | null;
}

export interface UserWithId extends User {
  uid: string;
}
