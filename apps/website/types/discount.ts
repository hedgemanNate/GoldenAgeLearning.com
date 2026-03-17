export type DiscountStatus = "active" | "archived";

export interface Discount {
  title: string;
  description: string;
  sponsorId: string;
  estimatedValue: number;
  appliesToClasses: string[];
  appliesToAll: boolean;
  expiresAt: number;
  status: DiscountStatus;
  totalRedemptions: number;
  redeemedBy: string[];
  createdAt: number;
  createdBy: string;
  archivedAt: number | null;
}

export interface DiscountWithId extends Discount {
  id: string;
}
