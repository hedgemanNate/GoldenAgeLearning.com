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
exports.processScheduledMessages = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const emails_1 = require("../emails");
const sms_1 = require("./sms");
exports.processScheduledMessages = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
    const now = new Date();
    // Only send reminders during the 8:00–8:04 AM window
    if (now.getHours() !== 8 || now.getMinutes() >= 5)
        return null;
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