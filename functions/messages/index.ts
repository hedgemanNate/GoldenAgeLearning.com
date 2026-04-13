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
import { sendClassReminderSms } from "./sms";
import { sendEmail } from "../utils/sendEmail";
import { sendSms } from "../utils/sendSms";

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
  role?: string;
}

// ─── Helper: resolve recipients for an admin message ─────────────────────────

async function resolveRecipients(
  db: admin.database.Database,
  sendTo: string
): Promise<Array<{ uid: string; name: string; email: string | null; phone: string | null }>> {
  const usersSnap = await db.ref("users").once("value");
  const allCustomers: Array<{ uid: string; name: string; email: string | null; phone: string | null }> = [];
  if (usersSnap.exists()) {
    usersSnap.forEach((snap) => {
      const u = snap.val() as UserRecord & { role?: string };
      if (u.role === "customer") {
        allCustomers.push({ uid: snap.key!, name: u.name, email: u.email ?? null, phone: u.phone ?? null });
      }
    });
  }
  if (sendTo === "all") return allCustomers;
  if (sendTo === "active") {
    const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
    const bookingsSnap = await db.ref("bookings").once("value");
    const activeIds = new Set<string>();
    if (bookingsSnap.exists()) {
      bookingsSnap.forEach((snap) => {
        const b = snap.val();
        if (b.createdAt >= cutoff && b.status !== "transferred") activeIds.add(b.customerId);
      });
    }
    return allCustomers.filter((u) => activeIds.has(u.uid));
  }
  // sendTo is a classId
  const booksSnap = await db.ref("bookings").orderByChild("classId").equalTo(sendTo).once("value");
  const classCustomerIds = new Set<string>();
  if (booksSnap.exists()) {
    booksSnap.forEach((snap) => {
      const b = snap.val();
      if (b.status !== "transferred") classCustomerIds.add(b.customerId);
    });
  }
  return allCustomers.filter((u) => classCustomerIds.has(u.uid));
}

async function dispatchToRecipients(
  recipients: Array<{ uid: string; email: string | null; phone: string | null }>,
  channel: string,
  subject: string | null,
  body: string
): Promise<Record<string, true>> {
  const sent: Record<string, true> = {};
  await Promise.allSettled(
    recipients.map(async (user) => {
      try {
        if (channel === "email" && user.email) {
          await sendEmail({ to: user.email, subject: subject || "A message from Golden Age Learning", html: body });
          sent[user.uid] = true;
        } else if (channel === "sms" && user.phone) {
          await sendSms({ to: user.phone, message: body });
          sent[user.uid] = true;
        }
      } catch (err) {
        console.error(`Failed to send message to ${user.uid}:`, err);
      }
    })
  );
  return sent;
}

// ─── Callable: send an admin-composed message immediately ─────────────────────

export const sendAdminMessage = functions.https.onCall(
  async (data: { sendTo: string; channel: string; subject: string | null; body: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const { sendTo, channel, subject, body } = data;
    if (!body?.trim()) {
      throw new functions.https.HttpsError("invalid-argument", "Message body is required.");
    }
    const db = admin.database();
    const recipients = await resolveRecipients(db, sendTo);
    const sent = await dispatchToRecipients(recipients, channel, subject, body);
    const recipientType = sendTo === "all" ? "all" : sendTo === "active" ? "active" : "class";
    const msgRef = db.ref("messages").push();
    const recipientsMap = Object.keys(sent).length > 0 ? sent : null;
    await msgRef.set({
      subject: subject || null,
      body,
      channel,
      recipientType,
      recipientId: recipientType === "class" ? sendTo : null,
      recipients: recipientsMap,
      recipientCount: Object.keys(sent).length,
      status: "sent",
      scheduledAt: null,
      sentAt: Date.now(),
      createdAt: Date.now(),
      createdBy: context.auth.uid,
    });
    return { success: true, recipientCount: Object.keys(sent).length };
  }
);

export const processScheduledMessages = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = new Date();
    const db = admin.database();

    // ── Process pending scheduled admin messages (runs every 5 minutes) ───────
    const messagesSnap = await db.ref("messages").once("value");
    if (messagesSnap.exists()) {
      const pending: Array<{ id: string; data: Record<string, unknown> }> = [];
      messagesSnap.forEach((snap) => {
        const msg = snap.val() as Record<string, unknown>;
        if (msg.status === "scheduled" && typeof msg.scheduledAt === "number" && msg.scheduledAt <= now.getTime()) {
          pending.push({ id: snap.key!, data: msg });
        }
      });
      for (const { id, data } of pending) {
        try {
          const sendTo = (data.recipientType === "class" ? data.recipientId : data.recipientType) as string;
          const recipients = await resolveRecipients(db, sendTo);
          const sent = await dispatchToRecipients(recipients, data.channel as string, (data.subject as string | null) ?? null, data.body as string);
          const recipientsMap = Object.keys(sent).length > 0 ? sent : null;
          await db.ref(`messages/${id}`).update({
            status: "sent",
            sentAt: now.getTime(),
            recipients: recipientsMap,
            recipientCount: Object.keys(sent).length,
          });
        } catch (err) {
          console.error(`Failed to process scheduled message ${id}:`, err);
        }
      }
    }

    // Only send class reminders during the 8:00–8:04 AM window
    if (now.getHours() !== 8 || now.getMinutes() >= 5) return null;

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

                const classDate = new Date(cls.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                const classTime = cls.time ?? "See your booking details";

                const sends: Promise<void>[] = [];

                if (user.email) {
                  sends.push(sendClassReminder(user.email, {
                    customerName: user.name,
                    className: cls.name,
                    classDate,
                    classTime,
                    classLocation: cls.location,
                  }));
                }

                if (user.phone) {
                  sends.push(sendClassReminderSms(user.phone, {
                    className: cls.name,
                    classTime,
                  }));
                }

                await Promise.all(sends);
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
