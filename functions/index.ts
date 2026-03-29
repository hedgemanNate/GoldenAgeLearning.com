import * as admin from "firebase-admin";

// Initialize admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Cloud Function triggers
export { processScheduledMessages } from "./messages";
export { onCustomerCreated } from "./customers";
export { twilioInbound } from "./webhooks";

