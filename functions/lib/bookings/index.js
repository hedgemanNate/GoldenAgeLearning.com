"use strict";
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
exports.onBookingCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const emails_1 = require("../emails");
const NOTIFICATION_EMAIL = "bookingnotification@goldenagelearning.com";
exports.onBookingCreated = functions.database
    .ref("bookings/{bookingId}")
    .onCreate(async (snap, context) => {
    const booking = snap.val();
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
    await (0, emails_1.sendBookingNotification)(NOTIFICATION_EMAIL, {
        customerName: customer?.name ?? "Unknown",
        customerContact: customer?.email ?? customer?.phone ?? "Unknown",
        className: cls?.name ?? "Unknown Class",
        classDate,
        classTime,
        classLocation: cls?.location ?? "Unknown",
        status: booking.status,
        amount: booking.amount > 0
            ? `$${(booking.amount / 100).toFixed(2)}`
            : "Free (Reserved)",
        bookingId,
    });
});
//# sourceMappingURL=index.js.map