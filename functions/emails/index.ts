/**
 * High-level email sender functions.
 *
 * These are plain async helpers — not Cloud Functions themselves.
 * They are called by Cloud Functions in bookings/, payments/, customers/, etc.
 *
 * Subject lines are exact as per the email plan spec.
 */

import { sendEmail } from "../utils/sendEmail";
import {
  bookingConfirmationTemplate,
  classReminderTemplate,
  transferConfirmationTemplate,
  paymentReceivedTemplate,
  paymentDeclinedTemplate,
  passwordResetTemplate,
  welcomeTemplate,
  type BookingConfirmationVars,
  type ClassReminderVars,
  type TransferConfirmationVars,
  type PaymentReceivedVars,
  type PaymentDeclinedVars,
  type PasswordResetVars,
  type WelcomeVars,
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

export async function sendPasswordReset(
  to: string,
  vars: PasswordResetVars
): Promise<void> {
  await sendEmail({
    to,
    subject: "Password Reset",
    html: passwordResetTemplate(vars),
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
