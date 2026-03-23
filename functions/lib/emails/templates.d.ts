/**
 * HTML email templates for Golden Age Learning.
 *
 * Design spec:
 *   Background:  #F5EDD6  (Soft Cream)
 *   Text:        #3D4F5C  (Charcoal Slate)
 *   Accent:      #C4933F  (Warm Gold)
 *   Body font:   18px minimum
 *   Layout:      Single column, max 600px
 *   Buttons:     60px tall minimum
 *   Footer:      Phone number on every email
 */
export interface BookingConfirmationVars {
    customerName: string;
    className: string;
    classDate: string;
    classTime: string;
    classLocation: string;
    classPrice: string;
    bookingId: string;
}
export declare function bookingConfirmationTemplate(v: BookingConfirmationVars): string;
export interface ClassReminderVars {
    customerName: string;
    className: string;
    classDate: string;
    classTime: string;
    classLocation: string;
}
export declare function classReminderTemplate(v: ClassReminderVars): string;
export interface TransferConfirmationVars {
    customerName: string;
    className: string;
    classDate: string;
    classTime: string;
    classLocation: string;
}
export declare function transferConfirmationTemplate(v: TransferConfirmationVars): string;
export interface PaymentReceivedVars {
    customerName: string;
    className: string;
    amount: string;
    bookingId: string;
}
export declare function paymentReceivedTemplate(v: PaymentReceivedVars): string;
export interface PaymentDeclinedVars {
    customerName: string;
    className: string;
    amount: string;
}
export declare function paymentDeclinedTemplate(v: PaymentDeclinedVars): string;
export interface PasswordResetVars {
    customerName: string;
    resetLink: string;
}
export declare function passwordResetTemplate(v: PasswordResetVars): string;
export interface WelcomeVars {
    customerName: string;
}
export declare function welcomeTemplate(v: WelcomeVars): string;
//# sourceMappingURL=templates.d.ts.map