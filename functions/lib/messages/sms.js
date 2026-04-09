"use strict";
/**
 * SMS message functions for Golden Age Learning.
 *
 * All messages are prefixed with "Golden Age Learning: " automatically by sendSms().
 * All message bodies are kept under 138 characters to stay within one 160-char SMS segment.
 *
 * Phone number in every message: (555) 123-4567
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingConfirmationSms = sendBookingConfirmationSms;
exports.sendClassReminderSms = sendClassReminderSms;
exports.sendTransferConfirmationSms = sendTransferConfirmationSms;
exports.sendPaymentReceivedSms = sendPaymentReceivedSms;
exports.sendPaymentDeclinedSms = sendPaymentDeclinedSms;
exports.sendWelcomeSms = sendWelcomeSms;
const sendSms_1 = require("../utils/sendSms");
const PHONE = "(555) 123-4567";
async function sendBookingConfirmationSms(to, vars) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `You are booked for ${vars.className} on ${vars.classDate} at ${vars.classTime}. See you there! Questions? Call ${PHONE}`,
    });
}
async function sendClassReminderSms(to, vars) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `Don't be late for class! ${vars.className} is tomorrow at ${vars.classTime}. Questions? Call ${PHONE}`,
    });
}
async function sendTransferConfirmationSms(to, vars) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `Your class has been moved. You are now booked for ${vars.className} on ${vars.classDate} at ${vars.classTime}.`,
    });
}
async function sendPaymentReceivedSms(to, vars) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `Payment received! ${vars.amount} confirmed for ${vars.className} on ${vars.classDate}. Thank you!`,
    });
}
async function sendPaymentDeclinedSms(to) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `No payment was taken and your spot is not reserved. Please try again at goldenagelearning.com or call ${PHONE}`,
    });
}
async function sendWelcomeSms(to) {
    await (0, sendSms_1.sendSms)({
        to,
        message: `Welcome! Your account is set up. Book your first class at goldenagelearning.com or call us at ${PHONE}`,
    });
}
//# sourceMappingURL=sms.js.map