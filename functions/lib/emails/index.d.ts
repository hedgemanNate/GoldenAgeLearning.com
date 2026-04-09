/**
 * High-level email sender functions.
 *
 * These are plain async helpers — not Cloud Functions themselves.
 * They are called by Cloud Functions in bookings/, payments/, customers/, etc.
 *
 * Subject lines are exact as per the email plan spec.
 */
import { type BookingConfirmationVars, type ClassReminderVars, type TransferConfirmationVars, type PaymentReceivedVars, type PaymentDeclinedVars, type PasswordResetVars, type WelcomeVars, type BookingNotificationVars } from "./templates";
export declare function sendBookingConfirmation(to: string, vars: BookingConfirmationVars): Promise<void>;
export declare function sendClassReminder(to: string, vars: ClassReminderVars): Promise<void>;
export declare function sendTransferConfirmation(to: string, vars: TransferConfirmationVars): Promise<void>;
export declare function sendPaymentReceived(to: string, vars: PaymentReceivedVars): Promise<void>;
export declare function sendPaymentDeclined(to: string, vars: PaymentDeclinedVars): Promise<void>;
export declare function sendPasswordReset(to: string, vars: PasswordResetVars): Promise<void>;
export declare function sendWelcomeEmail(to: string, vars: WelcomeVars): Promise<void>;
export declare function sendBookingNotification(to: string, vars: BookingNotificationVars): Promise<void>;
//# sourceMappingURL=index.d.ts.map