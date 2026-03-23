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

interface UserRecord {
  name: string;
  email: string | null;
}

export const onCustomerCreated = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  if (!email) return; // No email on file — SMS handled separately

  // Look up the user's display name from RTDB profile
  const db = admin.database();
  const userSnap = await db.ref(`users/${user.uid}`).once("value");

  // Fall back to displayName from Auth if RTDB profile not yet written
  const name: string =
    (userSnap.exists() ? (userSnap.val() as UserRecord).name : null) ??
    user.displayName ??
    "Friend";

  await sendWelcomeEmail(email, { customerName: name });
});
