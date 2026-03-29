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
export declare const twilioInbound: functions.HttpsFunction;
//# sourceMappingURL=index.d.ts.map