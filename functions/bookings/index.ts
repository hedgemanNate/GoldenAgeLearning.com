import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendBookingNotification } from "../emails";

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

    await sendBookingNotification(NOTIFICATION_EMAIL, {
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
    });
  });
