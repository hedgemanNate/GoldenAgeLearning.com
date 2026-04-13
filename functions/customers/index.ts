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

// ─── deleteCustomer ───────────────────────────────────────────────────────────

export const deleteCustomer = functions.https.onCall(
  async (data: { uid?: unknown }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }

    const db = admin.database();
    const callerSnap = await db.ref(`users/${context.auth.uid}`).once("value");
    if (!callerSnap.exists() || callerSnap.child("role").val() !== "superAdmin") {
      throw new functions.https.HttpsError("permission-denied", "Only a Super Admin can delete customers.");
    }

    const targetUid = typeof data.uid === "string" ? data.uid.trim() : "";
    if (!targetUid) {
      throw new functions.https.HttpsError("invalid-argument", "A target user ID is required.");
    }

    await Promise.all([
      admin.auth().deleteUser(targetUid),
      db.ref(`users/${targetUid}`).remove(),
    ]);

    functions.logger.info("Customer deleted", { targetUid, deletedBy: context.auth.uid });
    return { success: true };
  }
);
