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

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const twilioInbound = functions.https.onRequest(async (req, res) => {
  // Only accept POST
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const from: string = (req.body.From ?? "").trim();
  const body: string = (req.body.Body ?? "").trim().toUpperCase();

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
        const updatePromises: Promise<void>[] = [];
        usersSnap.forEach((snap) => {
          updatePromises.push(
            db.ref(`users/${snap.key}/smsOptOut`).set(true)
          );
        });
        await Promise.all(updatePromises);
      }
    } catch (err) {
      console.error("twilioInbound: error processing STOP", err);
    }
  }

  // Respond with empty TwiML — no reply needed
  res.type("text/xml").send("<Response></Response>");
});
