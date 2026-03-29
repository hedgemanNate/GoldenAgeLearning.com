/**
 * onCustomerCreated
 *
 * Fires when a new Firebase Auth user is created.
 * Looks up the user's profile in RTDB and sends a welcome email
 * if an email address is on file.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendWelcomeEmail } from "../emails";
import { sendWelcomeSms } from "../messages/sms";

interface UserRecord {
  name: string;
  email: string | null;
  phone: string | null;
}

export const onCustomerCreated = functions.auth.user().onCreate(async (user) => {
  // Look up the user's profile from RTDB
  const db = admin.database();
  const userSnap = await db.ref(`users/${user.uid}`).once("value");
  const profile = userSnap.exists() ? (userSnap.val() as UserRecord) : null;

  const name: string = profile?.name ?? user.displayName ?? "Friend";
  const email = user.email ?? profile?.email ?? null;
  const phone = profile?.phone ?? null;

  const sends: Promise<void>[] = [];

  if (email) {
    sends.push(sendWelcomeEmail(email, { customerName: name }));
  }

  if (phone) {
    sends.push(sendWelcomeSms(phone));
  }

  await Promise.all(sends);
});
