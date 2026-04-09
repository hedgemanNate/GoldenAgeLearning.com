export type MessageChannel = "email" | "sms" | "push";
export type MessageStatus = "sent" | "scheduled" | "failed";
export type RecipientType = "single" | "class" | "active" | "inactive" | "all";

export interface Message {
  subject: string | null;
  body: string;
  channel: MessageChannel;
  recipientType: RecipientType;
  recipientId: string | null;
  recipients: Record<string, true>;
  recipientCount: number;
  status: MessageStatus;
  scheduledAt: number | null;
  sentAt: number | null;
  createdAt: number;
  createdBy: string;
}

export interface MessageWithId extends Message {
  id: string;
}
