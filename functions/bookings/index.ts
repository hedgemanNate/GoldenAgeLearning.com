import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendBookingConfirmation, sendBookingNotification, sendPaymentReceived } from "../emails";
import { sendBookingConfirmationSms, sendPaymentReceivedSms } from "../messages/sms";

const NOTIFICATION_EMAIL = "bookingnotification@goldenagelearning.com";

interface BookingRecord {
  customerId: string;
  classId: string;
  status: string;
  amount: number;
  createdAt: number;
}

export const onBookingCreated = functions.database
  .ref("bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const booking = snap.val() as BookingRecord;
    const { bookingId } = context.params;
    const db = admin.database();

    const [classActiveSnap, classArchivedSnap, customerSnap] = await Promise.all([
      db.ref(`classes/active/${booking.classId}`).once("value"),
      db.ref(`classes/archived/${booking.classId}`).once("value"),
      db.ref(`users/${booking.customerId}`).once("value"),
    ]);

    const cls = classActiveSnap.exists()
      ? classActiveSnap.val()
      : classArchivedSnap.exists()
      ? classArchivedSnap.val()
      : null;

    const customer = customerSnap.exists() ? customerSnap.val() : null;

    const classDate = cls
      ? new Date(cls.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown";

    const classTime = cls
      ? new Date(cls.date).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

    const deliveries: Array<{ label: string; task: Promise<void> }> = [
      {
        label: "admin booking notification",
        task: sendBookingNotification(NOTIFICATION_EMAIL, {
          customerName: customer?.name ?? "Unknown",
          customerContact: customer?.email ?? customer?.phone ?? "Unknown",
          className: cls?.name ?? "Unknown Class",
          classDate,
          classTime,
          classLocation: cls?.location ?? "Unknown",
          status: booking.status,
          amount:
            booking.amount > 0
              ? `$${(booking.amount / 100).toFixed(2)}`
              : "Free (Reserved)",
          bookingId,
        }),
      },
    ];

    if (customer?.email) {
      if (booking.status === "paid") {
        deliveries.push({
          label: `customer payment receipt (${customer.email})`,
          task: sendPaymentReceived(customer.email, {
            customerName: customer.name ?? "Friend",
            className: cls?.name ?? "Unknown Class",
            classDate,
            classTime,
            classLocation: cls?.location ?? "Unknown",
            amount: `$${(booking.amount / 100).toFixed(2)}`,
            bookingId,
          }),
        });
      } else {
        deliveries.push({
          label: `customer booking email (${customer.email})`,
          task: sendBookingConfirmation(customer.email, {
            customerName: customer.name ?? "Friend",
            className: cls?.name ?? "Unknown Class",
            classDate,
            classTime,
            classLocation: cls?.location ?? "Unknown",
            classPrice: "Free (Reserved)",
            bookingId,
          }),
        });
      }
    }

    if (customer?.phone) {
      if (booking.status === "paid") {
        deliveries.push({
          label: `customer payment received SMS (${customer.phone})`,
          task: sendPaymentReceivedSms(customer.phone, {
            amount: `$${(booking.amount / 100).toFixed(2)}`,
            className: cls?.name ?? "Unknown Class",
            classDate,
          }),
        });
      } else {
        deliveries.push({
          label: `customer booking SMS (${customer.phone})`,
          task: sendBookingConfirmationSms(customer.phone, {
            className: cls?.name ?? "Unknown Class",
            classDate,
            classTime,
          }),
        });
      }
    }

    const results = await Promise.allSettled(deliveries.map((delivery) => delivery.task));

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        functions.logger.error(
          `Failed to send ${deliveries[index].label}`,
          result.reason
        );
      }
    });
  });
