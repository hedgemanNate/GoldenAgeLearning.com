/**
 * SMS message functions for Golden Age Learning.
 *
 * All messages are prefixed with "Golden Age Learning: " automatically by sendSms().
 * All message bodies are kept under 138 characters to stay within one 160-char SMS segment.
 *
 * Phone number in every message: (555) 123-4567
 */
export declare function sendBookingConfirmationSms(to: string, vars: {
    className: string;
    classDate: string;
    classTime: string;
}): Promise<void>;
export declare function sendClassReminderSms(to: string, vars: {
    className: string;
    classTime: string;
}): Promise<void>;
export declare function sendTransferConfirmationSms(to: string, vars: {
    className: string;
    classDate: string;
    classTime: string;
}): Promise<void>;
export declare function sendPaymentReceivedSms(to: string, vars: {
    amount: string;
    className: string;
    classDate: string;
}): Promise<void>;
export declare function sendPaymentDeclinedSms(to: string): Promise<void>;
export declare function sendWelcomeSms(to: string): Promise<void>;
//# sourceMappingURL=sms.d.ts.map