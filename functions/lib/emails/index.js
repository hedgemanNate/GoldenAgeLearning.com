"use strict";
/**
 * High-level email sender functions.
 *
 * These are plain async helpers — not Cloud Functions themselves.
 * They are called by Cloud Functions in bookings/, payments/, customers/, etc.
 *
 * Subject lines are exact as per the email plan spec.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingConfirmation = sendBookingConfirmation;
exports.sendClassReminder = sendClassReminder;
exports.sendTransferConfirmation = sendTransferConfirmation;
exports.sendPaymentReceived = sendPaymentReceived;
exports.sendPaymentDeclined = sendPaymentDeclined;
exports.sendPasswordReset = sendPasswordReset;
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendEmail_1 = require("../utils/sendEmail");
const templates_1 = require("./templates");
async function sendBookingConfirmation(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "You are in the books, and we are expecting you!",
        html: (0, templates_1.bookingConfirmationTemplate)(vars),
    });
}
async function sendClassReminder(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Don't be late for class!",
        html: (0, templates_1.classReminderTemplate)(vars),
    });
}
async function sendTransferConfirmation(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Class Transfer Complete!",
        html: (0, templates_1.transferConfirmationTemplate)(vars),
    });
}
async function sendPaymentReceived(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Payment Confirmation!",
        html: (0, templates_1.paymentReceivedTemplate)(vars),
    });
}
async function sendPaymentDeclined(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "No payment was taken; your spot is not reserved.",
        html: (0, templates_1.paymentDeclinedTemplate)(vars),
    });
}
async function sendPasswordReset(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Password Reset",
        html: (0, templates_1.passwordResetTemplate)(vars),
    });
}
async function sendWelcomeEmail(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Welcome to Your Golden Age of Learning!",
        html: (0, templates_1.welcomeTemplate)(vars),
    });
}
//# sourceMappingURL=index.js.map