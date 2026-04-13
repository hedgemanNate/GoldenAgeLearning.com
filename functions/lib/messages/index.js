"use strict";
/**
 * processScheduledMessages
 *
 * Runs every 5 minutes. At 8:00 AM each day, finds all classes
 * scheduled for tomorrow and sends a reminder email to every
 * customer with a booking in those classes.
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
exports.processScheduledMessages = exports.sendAdminMessage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const emails_1 = require("../emails");
const sms_1 = require("./sms");
const sendEmail_1 = require("../utils/sendEmail");
const sendSms_1 = require("../utils/sendSms");
// ─── Helper: resolve recipients for an admin message ─────────────────────────
async function resolveRecipients(db, sendTo) {
    const usersSnap = await db.ref("users").once("value");
    const allCustomers = [];
    if (usersSnap.exists()) {
        usersSnap.forEach((snap) => {
            const u = snap.val();
            if (u.role === "customer") {
                allCustomers.push({ uid: snap.key, name: u.name, email: u.email ?? null, phone: u.phone ?? null });
            }
        });
    }
    if (sendTo === "all")
        return allCustomers;
    if (sendTo === "active") {
        const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
        const bookingsSnap = await db.ref("bookings").once("value");
        const activeIds = new Set();
        if (bookingsSnap.exists()) {
            bookingsSnap.forEach((snap) => {
                const b = snap.val();
                if (b.createdAt >= cutoff && b.status !== "transferred")
                    activeIds.add(b.customerId);
            });
        }
        return allCustomers.filter((u) => activeIds.has(u.uid));
    }
    // sendTo is a classId
    const booksSnap = await db.ref("bookings").orderByChild("classId").equalTo(sendTo).once("value");
    const classCustomerIds = new Set();
    if (booksSnap.exists()) {
        booksSnap.forEach((snap) => {
            const b = snap.val();
            if (b.status !== "transferred")
                classCustomerIds.add(b.customerId);
        });
    }
    return allCustomers.filter((u) => classCustomerIds.has(u.uid));
}
async function dispatchToRecipients(recipients, channel, subject, body) {
    const sent = {};
    await Promise.allSettled(recipients.map(async (user) => {
        try {
            if (channel === "email" && user.email) {
                await (0, sendEmail_1.sendEmail)({ to: user.email, subject: subject || "A message from Golden Age Learning", html: body });
                sent[user.uid] = true;
            }
            else if (channel === "sms" && user.phone) {
                await (0, sendSms_1.sendSms)({ to: user.phone, message: body });
                sent[user.uid] = true;
            }
        }
        catch (err) {
            console.error(`Failed to send message to ${user.uid}:`, err);
        }
    }));
    return sent;
}
// ─── Callable: send an admin-composed message immediately ─────────────────────
exports.sendAdminMessage = functions.https.onCall(async (data, context) => {
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
});
exports.processScheduledMessages = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
    const now = new Date();
    const db = admin.database();
    // ── Process pending scheduled admin messages (runs every 5 minutes) ───────
    const messagesSnap = await db.ref("messages").once("value");
    if (messagesSnap.exists()) {
        const pending = [];
        messagesSnap.forEach((snap) => {
            const msg = snap.val();
            if (msg.status === "scheduled" && typeof msg.scheduledAt === "number" && msg.scheduledAt <= now.getTime()) {
                pending.push({ id: snap.key, data: msg });
            }
        });
        for (const { id, data } of pending) {
            try {
                const sendTo = (data.recipientType === "class" ? data.recipientId : data.recipientType);
                const recipients = await resolveRecipients(db, sendTo);
                const sent = await dispatchToRecipients(recipients, data.channel, data.subject ?? null, data.body);
                const recipientsMap = Object.keys(sent).length > 0 ? sent : null;
                await db.ref(`messages/${id}`).update({
                    status: "sent",
                    sentAt: now.getTime(),
                    recipients: recipientsMap,
                    recipientCount: Object.keys(sent).length,
                });
            }
            catch (err) {
                console.error(`Failed to process scheduled message ${id}:`, err);
            }
        }
    }
    // Only send class reminders during the 8:00–8:04 AM window
    if (now.getHours() !== 8 || now.getMinutes() >= 5)
        return null;
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
    if (!classesSnap.exists())
        return null;
    const classPromises = [];
    classesSnap.forEach((classSnap) => {
        const cls = classSnap.val();
        const classId = classSnap.key;
        if (cls.status === "archived" || cls.status === "deleted")
            return;
        // For each class, fetch its bookings
        const p = db
            .ref("bookings")
            .orderByChild("classId")
            .equalTo(classId)
            .once("value")
            .then(async (bookingsSnap) => {
            if (!bookingsSnap.exists())
                return;
            const reminderPromises = [];
            bookingsSnap.forEach((bookingSnap) => {
                const booking = bookingSnap.val();
                if (booking.status === "transferred")
                    return;
                const p2 = db
                    .ref(`users/${booking.customerId}`)
                    .once("value")
                    .then(async (userSnap) => {
                    if (!userSnap.exists())
                        return;
                    const user = userSnap.val();
                    const classDate = new Date(cls.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    const classTime = cls.time ?? "See your booking details";
                    const sends = [];
                    if (user.email) {
                        sends.push((0, emails_1.sendClassReminder)(user.email, {
                            customerName: user.name,
                            className: cls.name,
                            classDate,
                            classTime,
                            classLocation: cls.location,
                        }));
                    }
                    if (user.phone) {
                        sends.push((0, sms_1.sendClassReminderSms)(user.phone, {
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
//# sourceMappingURL=index.js.map