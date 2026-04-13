"use strict";
/**
 * High-level email sender functions.
 *
 * These are plain async helpers — not Cloud Functions themselves.
 * They are called by Cloud Functions in bookings/, payments/, customers/, etc.
 *
 * Subject lines are exact as per the email plan spec.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetCallable = void 0;
exports.sendBookingConfirmation = sendBookingConfirmation;
exports.sendClassReminder = sendClassReminder;
exports.sendTransferConfirmation = sendTransferConfirmation;
exports.sendPaymentReceived = sendPaymentReceived;
exports.sendPaymentDeclined = sendPaymentDeclined;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendBookingNotification = sendBookingNotification;
const sendEmail_1 = require("../utils/sendEmail");
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
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
async function sendWelcomeEmail(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: "Welcome to Your Golden Age of Learning!",
        html: (0, templates_1.welcomeTemplate)(vars),
    });
}
async function sendBookingNotification(to, vars) {
    await (0, sendEmail_1.sendEmail)({
        to,
        subject: `New Booking: ${vars.customerName} — ${vars.className}`,
        html: (0, templates_1.bookingNotificationTemplate)(vars),
    });
}
// ─── Callable: branded password reset email ──────────────────────────────── //
exports.sendPasswordResetCallable = functions.https.onCall(async (data) => {
    const { email } = data;
    if (!email || typeof email !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "Email is required.");
    }
    // Look up display name from RTDB (best-effort — fall back gracefully)
    let customerName = "there";
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const snap = await admin.database().ref(`users/${userRecord.uid}/name`).once("value");
        if (snap.exists() && snap.val())
            customerName = snap.val();
    }
    catch {
        // User may not exist — generatePasswordResetLink will handle that below
    }
    // Generate a Firebase password reset link (handles token, expiry, etc.)
    let resetLink;
    try {
        resetLink = await admin.auth().generatePasswordResetLink(email);
    }
    catch (err) {
        const code = err?.errorInfo?.code ?? err?.code ?? "";
        const message = err?.errorInfo?.message ?? err?.message ?? String(err);
        functions.logger.error("generatePasswordResetLink failed", { code, message, err: JSON.stringify(err) });
        // Return success silently for any "user doesn't exist" variant
        // so we don't leak account existence to the caller
        if (code === "auth/email-not-found" ||
            code === "auth/user-not-found") {
            return { success: true };
        }
        throw new functions.https.HttpsError("internal", "Could not generate reset link. Please try again.");
    }
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Reset your Golden Age Learning password",
        html: (0, templates_1.passwordResetTemplate)({ customerName, resetLink }),
    });
    return { success: true };
});
//# sourceMappingURL=index.js.map