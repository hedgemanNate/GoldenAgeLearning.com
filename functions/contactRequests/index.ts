import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendEmail } from "../utils/sendEmail";

const NOTIFY_EMAIL = "info@goldenagelearning.com";

interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  createdAt: number;
  source: string;
}

export const onContactRequestCreated = functions.database
  .ref("contactRequests/{requestId}")
  .onCreate(async (snap, context) => {
    const data = snap.val() as ContactRequest;
    const requestRef = admin.database().ref(`contactRequests/${context.params.requestId}`);

    const submittedAt = data.createdAt
      ? new Date(data.createdAt).toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Unknown";

    try {
      await sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Contact Request from Maintenance Page",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
            <h2 style="color: #c9a84c; margin-bottom: 4px;">New Contact Request</h2>
            <p style="color: #666; font-size: 13px; margin-top: 0;">Submitted via the Golden Age Learning maintenance page</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px 4px; font-weight: bold;">Phone</td>
                <td style="padding: 8px 4px;">${data.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #c9a84c;">${data.email}</a></td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px 4px; font-weight: bold;">Submitted</td>
                <td style="padding: 8px 4px;">${submittedAt} ET</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="font-size: 13px; color: #999;">Please follow up within 24 hours.</p>
          </div>
        `,
      });

      functions.logger.info("Contact request email sent", {
        email: data.email,
        requestId: context.params.requestId,
      });

      await requestRef.update({
        notificationStatus: "sent",
        notificationSentAt: Date.now(),
        notifiedEmail: NOTIFY_EMAIL,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      functions.logger.error("Contact request email failed", {
        error: message,
        email: data.email,
        requestId: context.params.requestId,
      });

      await requestRef.update({
        notificationStatus: "failed",
        notificationError: message,
        notificationFailedAt: Date.now(),
        notifiedEmail: NOTIFY_EMAIL,
      });

      throw error;
    }
  });
