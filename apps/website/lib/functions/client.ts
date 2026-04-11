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
