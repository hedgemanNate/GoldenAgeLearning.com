/**
 * High-level email sender functions.
 *
 * These are plain async helpers — not Cloud Functions themselves.
 * They are called by Cloud Functions in bookings/, payments/, customers/, etc.
 *
 * Subject lines are exact as per the email plan spec.
 */

import { sendEmail } from "../utils/sendEmail";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  bookingConfirmationTemplate,
  classReminderTemplate,
  transferConfirmationTemplate,
  paymentReceivedTemplate,
  paymentDeclinedTemplate,
  passwordResetTemplate,
  welcomeTemplate,
  bookingNotificationTemplate,
  type BookingConfirmationVars,
  type ClassReminderVars,
  type TransferConfirmationVars,
  type PaymentReceivedVars,
  type PaymentDeclinedVars,
  type WelcomeVars,
  type BookingNotificationVars,
} from "./templates";

export async function sendBookingConfirmation(
  to: string,
  vars: BookingConfirmationVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "You are in the books, and we are expecting you!",
    html: bookingConfirmationTemplate(vars),
  });
}

export async function sendClassReminder(
  to: string,
  vars: ClassReminderVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "Don't be late for class!",
    html: classReminderTemplate(vars),
  });
}

export async function sendTransferConfirmation(
  to: string,
  vars: TransferConfirmationVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "Class Transfer Complete!",
    html: transferConfirmationTemplate(vars),
  });
}

export async function sendPaymentReceived(
  to: string,
  vars: PaymentReceivedVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "Payment Confirmation!",
    html: paymentReceivedTemplate(vars),
  });
}

export async function sendPaymentDeclined(
  to: string,
  vars: PaymentDeclinedVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "No payment was taken; your spot is not reserved.",
    html: paymentDeclinedTemplate(vars),
  });
}

export async function sendWelcomeEmail(
  to: string,
  vars: WelcomeVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "Welcome to Your Golden Age of Learning!",
    html: welcomeTemplate(vars),
  });
}

export async function sendBookingNotification(
  to: string,
  vars: BookingNotificationVars
): Promise<void> {
  await sendEmail({
    to,
    subject: `New Booking: ${vars.customerName} — ${vars.className}`,
    html: bookingNotificationTemplate(vars),
  });
}

// ─── Callable: branded password reset email ──────────────────────────────── //

export const sendPasswordResetCallable = functions.https.onCall(
  async (data: { email: string }) => {
    const { email } = data;
    if (!email || typeof email !== "string") {
      throw new functions.https.HttpsError("invalid-argument", "Email is required.");
    }

    // Look up display name from RTDB (best-effort — fall back gracefully)
    let customerName = "there";
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const snap = await admin.database().ref(`users/${userRecord.uid}/name`).once("value");
      if (snap.exists() && snap.val()) customerName = snap.val();
    } catch {
      // User may not exist — generatePasswordResetLink will handle that below
    }

    // Generate a Firebase password reset link (handles token, expiry, etc.)
    let resetLink: string;
    try {
      resetLink = await admin.auth().generatePasswordResetLink(email);
    } catch (err: any) {
      const code = err?.errorInfo?.code ?? err?.code ?? "";
      const message = err?.errorInfo?.message ?? err?.message ?? String(err);
      functions.logger.error("generatePasswordResetLink failed", { code, message, err: JSON.stringify(err) });

      // Return success silently for any "user doesn't exist" variant
      // so we don't leak account existence to the caller
      if (
        code === "auth/email-not-found" ||
        code === "auth/user-not-found"
      ) {
        return { success: true };
      }

      throw new functions.https.HttpsError("internal", "Could not generate reset link. Please try again.");
    }

    await sendEmail({
      to: email,
      subject: "Reset your Golden Age Learning password",
      html: passwordResetTemplate({ customerName, resetLink }),
    });

    return { success: true };
  }
);
