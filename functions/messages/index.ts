/**
 * processScheduledMessages
 *
 * Runs every 5 minutes. At 8:00 AM each day, finds all classes
 * scheduled for tomorrow and sends a reminder email to every
 * customer with a booking in those classes.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendClassReminder } from "../emails";

interface ClassRecord {
  name: string;
  date: number;      // Unix timestamp (ms)
  time?: string;
  location: string;
  status: string;
}

interface BookingRecord {
  customerId: string;
  classId: string;
  status: string;
}

interface UserRecord {
  name: string;
  email: string | null;
  phone: string | null;
}

export const processScheduledMessages = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = new Date();

    // Only send reminders during the 8:00–8:04 AM window
    if (now.getHours() !== 8 || now.getMinutes() >= 5) return null;

    const db = admin.database();

    // Build tomorrow's date range (midnight-to-midnight)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowStart = tomorrow.getTime();
    const tomorrowEnd = tomorrowStart + 24 * 60 * 60 * 1000 - 1;

    // Fetch all upcoming classes
    const classesSnap = await db
      .ref("classes")
      .orderByChild("date")
      .startAt(tomorrowStart)
      .endAt(tomorrowEnd)
      .once("value");

    if (!classesSnap.exists()) return null;

    const classPromises: Promise<void>[] = [];

    classesSnap.forEach((classSnap) => {
      const cls = classSnap.val() as ClassRecord;
      const classId = classSnap.key!;

      if (cls.status === "archived" || cls.status === "deleted") return;

      // For each class, fetch its bookings
      const p = db
        .ref("bookings")
        .orderByChild("classId")
        .equalTo(classId)
        .once("value")
        .then(async (bookingsSnap) => {
          if (!bookingsSnap.exists()) return;

          const reminderPromises: Promise<void>[] = [];

          bookingsSnap.forEach((bookingSnap) => {
            const booking = bookingSnap.val() as BookingRecord;
            if (booking.status === "transferred") return;

            const p2 = db
              .ref(`users/${booking.customerId}`)
              .once("value")
              .then(async (userSnap) => {
                if (!userSnap.exists()) return;
                const user = userSnap.val() as UserRecord;
                if (!user.email) return; // SMS handled separately

                const classDate = new Date(cls.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                await sendClassReminder(user.email, {
                  customerName: user.name,
                  className: cls.name,
                  classDate,
                  classTime: cls.time ?? "See your booking details",
                  classLocation: cls.location,
                });
              });

            reminderPromises.push(p2);
          });

          await Promise.all(reminderPromises);
        });

      classPromises.push(p);
    });

    await Promise.all(classPromises);
    return null;
  });
