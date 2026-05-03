import * as admin from "firebase-admin";

// Initialize admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Cloud Function triggers
export { processScheduledMessages, sendAdminMessage } from "./messages";
export { onCustomerCreated, deleteCustomer } from "./customers";
export { twilioInbound } from "./webhooks";
export { onBookingCreated } from "./bookings";
export { changeUserRole, sendStaffInvite } from "./staff";
export { processPayment, getCustomerCard, deleteCustomerCard, saveCustomerCard } from "./payments";
export { sendPasswordResetCallable } from "./emails";
export { deleteAllData, backupDatabase } from "./database";
export { awardGamePoints } from "./games";

