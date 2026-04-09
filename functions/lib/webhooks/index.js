"use strict";
/**
 * twilioInbound
 *
 * Handles inbound SMS messages from Twilio (opt-outs, replies).
 * Twilio sends a POST to this endpoint when a customer replies to an SMS.
 *
 * Webhook setup in Twilio Console:
 *   Your number → Messaging → "A message comes in" → Webhook → POST
 *   URL: https://us-central1-golden-age-learning.cloudfunctions.net/twilioInbound
 *
 * Twilio automatically handles STOP/UNSTOP/HELP for short codes.
 * This webhook additionally records opt-outs in Firebase so the app
 * can check smsOptOut before sending messages.
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
exports.twilioInbound = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.twilioInbound = functions.https.onRequest(async (req, res) => {
    // Only accept POST
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const from = (req.body.From ?? "").trim();
    const body = (req.body.Body ?? "").trim().toUpperCase();
    if (from && body === "STOP") {
        try {
            const db = admin.database();
            // Find user by phone number
            const usersSnap = await db
                .ref("users")
                .orderByChild("phone")
                .equalTo(from)
                .once("value");
            if (usersSnap.exists()) {
                const updatePromises = [];
                usersSnap.forEach((snap) => {
                    updatePromises.push(db.ref(`users/${snap.key}/smsOptOut`).set(true));
                });
                await Promise.all(updatePromises);
            }
        }
        catch (err) {
            console.error("twilioInbound: error processing STOP", err);
        }
    }
    // Respond with empty TwiML — no reply needed
    res.type("text/xml").send("<Response></Response>");
});
//# sourceMappingURL=index.js.map