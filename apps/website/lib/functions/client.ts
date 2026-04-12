import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/client";

interface ProcessPaymentRequest {
  sourceId: string;
  classId: string;
}

interface ProcessPaymentResponse {
  bookingId: string;
}

export function callProcessPayment(request: ProcessPaymentRequest) {
  return httpsCallable<ProcessPaymentRequest, ProcessPaymentResponse>(
    functions,
    "processPayment"
  )(request);
}

interface SendAdminMessageRequest {
  sendTo: string;
  channel: "email" | "sms";
  subject: string | null;
  body: string;
}

interface SendAdminMessageResponse {
  success: boolean;
  recipientCount: number;
}

export function callSendAdminMessage(request: SendAdminMessageRequest) {
  return httpsCallable<SendAdminMessageRequest, SendAdminMessageResponse>(
    functions,
    "sendAdminMessage"
  )(request);
}

interface SendStaffInviteRequest {
  email: string;
}

interface SendStaffInviteResponse {
  success: boolean;
  uid: string;
}

export function callSendStaffInvite(request: SendStaffInviteRequest) {
  return httpsCallable<SendStaffInviteRequest, SendStaffInviteResponse>(
    functions,
    "sendStaffInvite"
  )(request);
}

interface DeleteCustomerRequest {
  uid: string;
}

interface DeleteCustomerResponse {
  success: boolean;
}

export function callDeleteCustomer(request: DeleteCustomerRequest) {
  return httpsCallable<DeleteCustomerRequest, DeleteCustomerResponse>(
    functions,
    "deleteCustomer"
  )(request);
}

interface GetCustomerCardResponse {
  hasCard: boolean;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

export function callGetCustomerCard() {
  return httpsCallable<Record<string, never>, GetCustomerCardResponse>(
    functions,
    "getCustomerCard"
  )({});
}

export function callDeleteCustomerCard() {
  return httpsCallable<Record<string, never>, { success: boolean }>(
    functions,
    "deleteCustomerCard"
  )({});
}

interface SaveCustomerCardRequest {
  sourceId: string;
}

export function callSaveCustomerCard(request: SaveCustomerCardRequest) {
  return httpsCallable<SaveCustomerCardRequest, { success: boolean }>(
    functions,
    "saveCustomerCard"
  )(request);
}

interface SendPasswordResetRequest {
  email: string;
}

export function callSendPasswordReset(request: SendPasswordResetRequest) {
  return httpsCallable<SendPasswordResetRequest, { success: boolean }>(
    functions,
    "sendPasswordResetCallable"
  )(request);
}
