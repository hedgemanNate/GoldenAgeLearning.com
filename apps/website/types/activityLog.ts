export type ActivityAction =
  | "booking.create"
  | "booking.transfer.date"
  | "booking.transfer.customer"
  | "booking.markPaid"
  | "class.create"
  | "class.edit"
  | "class.archive"
  | "class.delete"
  | "customer.edit"
  | "customer.merge"
  | "customer.delete"
  | "message.send"
  | "message.schedule"
  | "sponsor.create"
  | "sponsor.edit"
  | "sponsor.delete"
  | "discount.create"
  | "discount.edit"
  | "discount.delete"
  | "staff.add"
  | "staff.remove"
  | "staff.promote"
  | "staff.demote";

export type ActivityTargetType =
  | "booking"
  | "class"
  | "customer"
  | "message"
  | "sponsor"
  | "discount"
  | "staff";

export interface ActivityLog {
  performedBy: string;
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetId: string;
  details: string;
  createdAt: number;
}

export interface ActivityLogWithId extends ActivityLog {
  id: string;
}
