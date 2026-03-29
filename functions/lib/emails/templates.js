"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingConfirmationTemplate = bookingConfirmationTemplate;
exports.classReminderTemplate = classReminderTemplate;
exports.transferConfirmationTemplate = transferConfirmationTemplate;
exports.paymentReceivedTemplate = paymentReceivedTemplate;
exports.paymentDeclinedTemplate = paymentDeclinedTemplate;
exports.passwordResetTemplate = passwordResetTemplate;
exports.welcomeTemplate = welcomeTemplate;
exports.bookingNotificationTemplate = bookingNotificationTemplate;
const PHONE = "(555) 123-4567";
const WEBSITE = "goldenagelearning.com";
const BG = "#F5EDD6";
const TEXT = "#3D4F5C";
const GOLD = "#C4933F";
const MUTED = "#6B7E8C";
const BORDER = "#C4A882";
function base(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;border-bottom:2px solid ${TEXT};">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${TEXT};">Golden Age Learning</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 0;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid ${BORDER};text-align:center;">
              <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${TEXT};">Questions? Give us a call.</p>
              <p style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:${TEXT};">${PHONE}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};">Golden Age Learning &middot; ${WEBSITE}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function detailRow(label, value) {
    return `
    <tr>
      <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${MUTED};width:120px;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${TEXT};font-weight:bold;vertical-align:top;">${value}</td>
    </tr>`;
}
function detailBox(rows) {
    return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
      style="background-color:#EDE4CF;border:1px solid ${BORDER};border-radius:6px;margin:28px 0;">
      <tbody>${rows}</tbody>
    </table>`;
}
function ctaButton(text, href) {
    return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto;">
      <tr>
        <td style="border-radius:6px;background-color:${GOLD};">
          <a href="${href}"
            style="display:inline-block;padding:0 36px;line-height:60px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#FFFFFF;text-decoration:none;white-space:nowrap;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}
function heading(text) {
    return `<h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${TEXT};font-weight:bold;">${text}</h1>`;
}
function para(text) {
    return `<p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.6;color:${TEXT};">${text}</p>`;
}
function bookingConfirmationTemplate(v) {
    const body = `
    ${heading("You are in the books, and we are expecting you!")}
    ${para(`Dear ${v.customerName},`)}
    ${para("Great news — your spot is confirmed! We can't wait to see you in class.")}
    ${detailBox(detailRow("Class", v.className) +
        detailRow("Date", v.classDate) +
        detailRow("Time", v.classTime) +
        detailRow("Location", v.classLocation) +
        detailRow("Amount", v.classPrice) +
        detailRow("Booking #", v.bookingId))}
    ${para("If you have any questions or need to make changes, please give us a call. We are happy to help.")}
    ${para("See you soon!")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Booking Confirmation — Golden Age Learning", body);
}
function classReminderTemplate(v) {
    const body = `
    ${heading("Don't be late for class!")}
    ${para(`Dear ${v.customerName},`)}
    ${para("Just a friendly reminder that your class is <strong>tomorrow</strong>. We are looking forward to seeing you!")}
    ${detailBox(detailRow("Class", v.className) +
        detailRow("Date", v.classDate) +
        detailRow("Time", v.classTime) +
        detailRow("Location", v.classLocation))}
    ${para("If anything has come up and you cannot make it, please give us a call as soon as possible so we can open your spot for someone else.")}
    ${para("See you tomorrow!")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Class Reminder — Golden Age Learning", body);
}
function transferConfirmationTemplate(v) {
    const body = `
    ${heading("Class Transfer Complete!")}
    ${para(`Dear ${v.customerName},`)}
    ${para("Your class booking has been transferred. Here are the details for your new class:")}
    ${detailBox(detailRow("Class", v.className) +
        detailRow("Date", v.classDate) +
        detailRow("Time", v.classTime) +
        detailRow("Location", v.classLocation))}
    ${para("If you did not expect this change or have any questions, please give us a call right away.")}
    ${para("We look forward to seeing you!")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Transfer Confirmation — Golden Age Learning", body);
}
function paymentReceivedTemplate(v) {
    const body = `
    ${heading("Payment Confirmation!")}
    ${para(`Dear ${v.customerName},`)}
    ${para("We have received your payment. Thank you! Your spot in class is fully confirmed.")}
    ${detailBox(detailRow("Class", v.className) +
        detailRow("Amount paid", v.amount) +
        detailRow("Booking #", v.bookingId))}
    ${para("If you have any questions about your payment, please do not hesitate to call us.")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Payment Confirmation — Golden Age Learning", body);
}
function paymentDeclinedTemplate(v) {
    const body = `
    ${heading("No payment was taken; your spot is not reserved.")}
    ${para(`Dear ${v.customerName},`)}
    ${para("We are sorry to let you know that your payment was <strong>not successful</strong>. No charge was made to your card, and your spot in the class has not been reserved.")}
    ${detailBox(detailRow("Class", v.className) +
        detailRow("Amount", v.amount) +
        detailRow("Status", "Payment declined — no charge made"))}
    ${para("Please give us a call so we can help you sort this out. We would love to get you into class.")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Payment Issue — Golden Age Learning", body);
}
function passwordResetTemplate(v) {
    const body = `
    ${heading("Password Reset")}
    ${para(`Dear ${v.customerName},`)}
    ${para("We received a request to reset the password for your Golden Age Learning account. Click the button below to choose a new password.")}
    ${ctaButton("Reset My Password", v.resetLink)}
    ${para("This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email — your password has not been changed.")}
    ${para("If you need help, please call us.")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Password Reset — Golden Age Learning", body);
}
function welcomeTemplate(v) {
    const body = `
    ${heading("Welcome to Your Golden Age of Learning!")}
    ${para(`Dear ${v.customerName},`)}
    ${para("We are so glad you are here. Golden Age Learning was created just for you — a place to learn new things, connect with others, and enjoy yourself.")}
    ${para("Browse our upcoming classes and reserve your spot whenever you are ready. If you ever need help, just give us a call. We are happy to walk you through everything step by step.")}
    ${para("We cannot wait to see you in class!")}
    ${para("<em>The Golden Age Learning Team</em>")}
  `;
    return base("Welcome — Golden Age Learning", body);
}
function bookingNotificationTemplate(v) {
    const body = `
    ${heading("New Booking Received")}
    ${para("A new booking has been placed. Details below.")}
    ${detailBox(detailRow("Customer", v.customerName) +
        detailRow("Contact", v.customerContact) +
        detailRow("Class", v.className) +
        detailRow("Date", v.classDate) +
        detailRow("Time", v.classTime) +
        detailRow("Location", v.classLocation) +
        detailRow("Status", v.status.charAt(0).toUpperCase() + v.status.slice(1)) +
        detailRow("Amount", v.amount) +
        detailRow("Booking #", v.bookingId))}
  `;
    return base("New Booking — Golden Age Learning", body);
}
//# sourceMappingURL=templates.js.map