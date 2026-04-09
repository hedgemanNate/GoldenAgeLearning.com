/**
 * SMS message functions for Golden Age Learning.
 *
 * All messages are prefixed with "Golden Age Learning: " automatically by sendSms().
 * All message bodies are kept under 138 characters to stay within one 160-char SMS segment.
 *
 * Phone number in every message: (555) 123-4567
 */

import { sendSms } from "../utils/sendSms";

const PHONE = "(555) 123-4567";

export async function sendBookingConfirmationSms(
  to: string,
  vars: { className: string; classDate: string; classTime: string }
): Promise<void> {
  await sendSms({
    to,
    message: `You are booked for ${vars.className} on ${vars.classDate} at ${vars.classTime}. See you there! Questions? Call ${PHONE}`,
  });
}

export async function sendClassReminderSms(
  to: string,
  vars: { className: string; classTime: string }
): Promise<void> {
  await sendSms({
    to,
    message: `Don't be late for class! ${vars.className} is tomorrow at ${vars.classTime}. Questions? Call ${PHONE}`,
  });
}

export async function sendTransferConfirmationSms(
  to: string,
  vars: { className: string; classDate: string; classTime: string }
): Promise<void> {
  await sendSms({
    to,
    message: `Your class has been moved. You are now booked for ${vars.className} on ${vars.classDate} at ${vars.classTime}.`,
  });
}

export async function sendPaymentReceivedSms(
  to: string,
  vars: { amount: string; className: string; classDate: string }
): Promise<void> {
  await sendSms({
    to,
    message: `Payment received! ${vars.amount} confirmed for ${vars.className} on ${vars.classDate}. Thank you!`,
  });
}

export async function sendPaymentDeclinedSms(
  to: string
): Promise<void> {
  await sendSms({
    to,
    message: `No payment was taken and your spot is not reserved. Please try again at goldenagelearning.com or call ${PHONE}`,
  });
}

export async function sendWelcomeSms(to: string): Promise<void> {
  await sendSms({
    to,
    message: `Welcome! Your account is set up. Book your first class at goldenagelearning.com or call us at ${PHONE}`,
  });
}
