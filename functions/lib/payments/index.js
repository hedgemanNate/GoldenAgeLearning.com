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
exports.saveCustomerCard = exports.deleteCustomerCard = exports.getCustomerCard = exports.processPayment = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const square_1 = require("square");
const crypto = __importStar(require("crypto"));
function getSquareClient() {
    const cfg = functions.config().square;
    return new square_1.SquareClient({
        token: cfg.access_token,
        environment: cfg.environment === "production"
            ? square_1.SquareEnvironment.Production
            : square_1.SquareEnvironment.Sandbox,
    });
}
exports.processPayment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be signed in to make a payment.");
    }
    const uid = context.auth.uid;
    const { sourceId, classId } = data;
    if (!sourceId || !classId) {
        throw new functions.https.HttpsError("invalid-argument", "sourceId and classId are required.");
    }
    const db = admin.database();
    const square = getSquareClient();
    // ── 1. Look up class price server-side (never trust the client) ───────────
    const [activeSnap, archivedSnap] = await Promise.all([
        db.ref(`classes/active/${classId}`).once("value"),
        db.ref(`classes/archived/${classId}`).once("value"),
    ]);
    const cls = activeSnap.exists()
        ? activeSnap.val()
        : archivedSnap.exists()
            ? archivedSnap.val()
            : null;
    if (!cls) {
        throw new functions.https.HttpsError("not-found", "Class not found.");
    }
    const amountInCents = Math.round((cls.price ?? 0) * 100);
    // ── 2. Look up user profile ────────────────────────────────────────────────
    const userSnap = await db.ref(`users/${uid}`).once("value");
    const user = userSnap.exists() ? userSnap.val() : null;
    if (!user) {
        throw new functions.https.HttpsError("not-found", "User profile not found.");
    }
    // Prevent duplicate bookings
    if (user.bookedClasses?.[classId]) {
        throw new functions.https.HttpsError("already-exists", "You have already booked this class.");
    }
    // ── 3. Create or reuse Square Customer ────────────────────────────────────
    let squareCustomerId = user.squareCustomerId ?? "";
    if (!squareCustomerId) {
        try {
            const response = await square.customers.create({
                idempotencyKey: crypto.randomUUID(),
                givenName: user.name ?? undefined,
                emailAddress: user.email ?? undefined,
                phoneNumber: user.phone ?? undefined,
            });
            squareCustomerId = response.customer.id;
            await db.ref(`users/${uid}/squareCustomerId`).set(squareCustomerId);
        }
        catch (err) {
            functions.logger.error("Failed to create Square customer", err);
            throw new functions.https.HttpsError("internal", "Could not set up payment. Please try again.");
        }
    }
    // ── 4. Save card on file — validates the card before charging ─────────────
    let squareCardId;
    try {
        const response = await square.cards.create({
            idempotencyKey: crypto.randomUUID(),
            sourceId,
            card: { customerId: squareCustomerId },
        });
        squareCardId = response.card.id;
    }
    catch (err) {
        functions.logger.error("Failed to save card on file", err);
        let message = "Your card could not be verified. Please check your details and try again.";
        if (err instanceof square_1.SquareError && err.errors?.length) {
            message = err.errors[0].detail ?? message;
        }
        throw new functions.https.HttpsError("invalid-argument", message);
    }
    // ── 5. Charge the card ────────────────────────────────────────────────────
    let squarePaymentId;
    try {
        const response = await square.payments.create({
            sourceId: squareCardId,
            idempotencyKey: crypto.randomUUID(),
            amountMoney: {
                amount: BigInt(amountInCents),
                currency: "USD",
            },
            customerId: squareCustomerId,
        });
        squarePaymentId = response.payment.id;
    }
    catch (err) {
        functions.logger.error("Square payment failed", err);
        let message = "Your payment could not be processed. Please try again.";
        if (err instanceof square_1.SquareError && err.errors?.length) {
            const code = err.errors[0].code;
            const detail = err.errors[0].detail;
            if (code === "CARD_DECLINED" ||
                code === "INSUFFICIENT_FUNDS" ||
                code === "INVALID_CARD") {
                message = detail ?? "Your card was declined. Please try a different card.";
            }
        }
        throw new functions.https.HttpsError("invalid-argument", message);
    }
    // ── 6. Write booking + payment records atomically ─────────────────────────
    const bookingRef = db.ref("bookings").push();
    const bookingId = bookingRef.key;
    const paymentRef = db.ref("payments").push();
    const paymentId = paymentRef.key;
    const now = Date.now();
    await db.ref("/").update({
        [`bookings/${bookingId}`]: {
            customerId: uid,
            classId,
            status: "paid",
            amount: amountInCents,
            transferredFrom: null,
            transferredTo: null,
            transferType: null,
            createdAt: now,
            createdBy: uid,
        },
        [`payments/${paymentId}`]: {
            bookingId,
            customerId: uid,
            classId,
            amount: amountInCents,
            currency: "USD",
            method: "card",
            squarePaymentId,
            status: "completed",
            refunded: false,
            refundedAt: null,
            createdAt: now,
        },
        [`users/${uid}/bookedClasses/${classId}`]: bookingId,
        [`users/${uid}/squareCardId`]: squareCardId,
    });
    // Increment seatsBooked — transaction must be separate from multi-path update
    await db
        .ref(`classes/active/${classId}/seatsBooked`)
        .transaction((current) => (current ?? 0) + 1);
    return { bookingId };
});
// ─── getCustomerCard ──────────────────────────────────────────────────────────
exports.getCustomerCard = functions.https.onCall(async (_data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const uid = context.auth.uid;
    const db = admin.database();
    const userSnap = await db.ref(`users/${uid}`).once("value");
    const user = userSnap.exists() ? userSnap.val() : null;
    if (!user?.squareCardId)
        return { hasCard: false };
    const square = getSquareClient();
    try {
        const response = await square.cards.get({ cardId: user.squareCardId });
        const card = response.card;
        return {
            hasCard: true,
            brand: card.cardBrand ?? "UNKNOWN",
            last4: card.last4 ?? "????",
            expMonth: Number(card.expMonth ?? 0),
            expYear: Number(card.expYear ?? 0),
        };
    }
    catch {
        return { hasCard: false };
    }
});
// ─── deleteCustomerCard ───────────────────────────────────────────────────────
exports.deleteCustomerCard = functions.https.onCall(async (_data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const uid = context.auth.uid;
    const db = admin.database();
    const userSnap = await db.ref(`users/${uid}`).once("value");
    const user = userSnap.exists() ? userSnap.val() : null;
    if (!user?.squareCardId)
        return { success: true };
    const square = getSquareClient();
    try {
        await square.cards.disable({ cardId: user.squareCardId });
    }
    catch (err) {
        functions.logger.warn("Could not disable Square card (may already be disabled)", err);
    }
    await db.ref(`users/${uid}/squareCardId`).set(null);
    return { success: true };
});
// ─── saveCustomerCard ─────────────────────────────────────────────────────────
exports.saveCustomerCard = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const sourceId = typeof data.sourceId === "string" ? data.sourceId : "";
    if (!sourceId) {
        throw new functions.https.HttpsError("invalid-argument", "sourceId is required.");
    }
    const uid = context.auth.uid;
    const db = admin.database();
    const userSnap = await db.ref(`users/${uid}`).once("value");
    const user = userSnap.exists() ? userSnap.val() : null;
    if (!user)
        throw new functions.https.HttpsError("not-found", "User profile not found.");
    const square = getSquareClient();
    // Create or reuse Square Customer
    let squareCustomerId = user.squareCustomerId ?? "";
    if (!squareCustomerId) {
        const res = await square.customers.create({
            idempotencyKey: crypto.randomUUID(),
            givenName: user.name ?? undefined,
            emailAddress: user.email ?? undefined,
            phoneNumber: user.phone ?? undefined,
        });
        squareCustomerId = res.customer.id;
        await db.ref(`users/${uid}/squareCustomerId`).set(squareCustomerId);
    }
    // Disable old card if present
    if (user.squareCardId) {
        try {
            await square.cards.disable({ cardId: user.squareCardId });
        }
        catch { }
    }
    // Save new card
    let squareCardId;
    try {
        const cardRes = await square.cards.create({
            idempotencyKey: crypto.randomUUID(),
            sourceId,
            card: { customerId: squareCustomerId },
        });
        squareCardId = cardRes.card.id;
    }
    catch (err) {
        let message = "Your card could not be saved. Please check your details and try again.";
        if (err instanceof square_1.SquareError && err.errors?.length) {
            message = err.errors[0].detail ?? message;
        }
        throw new functions.https.HttpsError("invalid-argument", message);
    }
    await db.ref(`users/${uid}/squareCardId`).set(squareCardId);
    return { success: true };
});
//# sourceMappingURL=index.js.map