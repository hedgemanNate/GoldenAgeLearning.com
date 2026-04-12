import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { sendEmail } from "../utils/sendEmail";

const ALLOWED_ROLES = new Set(["customer", "staff", "superAdmin", "sponsor"]);

type UserRole = "customer" | "staff" | "superAdmin" | "sponsor";

interface ChangeUserRoleData {
  uid?: unknown;
  role?: unknown;
}

interface UserRecord {
  role?: UserRole;
}

export const changeUserRole = functions.https.onCall(async (data: ChangeUserRoleData, context) => {
  const callerUid = context.auth?.uid;

  if (!callerUid) {
    throw new functions.https.HttpsError("unauthenticated", "You must be signed in to change roles.");
  }

  const targetUid = typeof data.uid === "string" ? data.uid.trim() : "";
  const nextRole = typeof data.role === "string" ? data.role.trim() : "";

  if (!targetUid) {
    throw new functions.https.HttpsError("invalid-argument", "A target user ID is required.");
  }

  if (!ALLOWED_ROLES.has(nextRole)) {
    throw new functions.https.HttpsError("invalid-argument", "The requested role is invalid.");
  }

  const db = admin.database();
  const [callerSnap, targetSnap] = await Promise.all([
    db.ref(`users/${callerUid}`).once("value"),
    db.ref(`users/${targetUid}`).once("value"),
  ]);

  if (!callerSnap.exists() || callerSnap.child("role").val() !== "superAdmin") {
    throw new functions.https.HttpsError("permission-denied", "Only a Super Admin can change roles.");
  }

  if (!targetSnap.exists()) {
    throw new functions.https.HttpsError("not-found", "The selected user does not exist.");
  }

  if (callerUid === targetUid) {
    throw new functions.https.HttpsError("failed-precondition", "You cannot change your own role.");
  }

  const targetUser = targetSnap.val() as UserRecord;
  const currentRole = targetUser.role ?? "customer";
  const requestedRole = nextRole as UserRole;

  if (currentRole === requestedRole) {
    return { uid: targetUid, role: requestedRole, unchanged: true };
  }

  if (currentRole === "superAdmin" && requestedRole !== "superAdmin") {
    const superAdminSnap = await db.ref("users").orderByChild("role").equalTo("superAdmin").once("value");
    const superAdminCount = superAdminSnap.exists() ? superAdminSnap.numChildren() : 0;

    if (superAdminCount <= 1) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The last remaining Super Admin cannot be demoted."
      );
    }
  }

  await db.ref(`users/${targetUid}/role`).set(requestedRole);

  functions.logger.info("User role changed", {
    actorUid: callerUid,
    targetUid,
    previousRole: currentRole,
    nextRole: requestedRole,
  });

  return { uid: targetUid, role: requestedRole };
});

// ─── sendStaffInvite ──────────────────────────────────────────────────────────

export const sendStaffInvite = functions.https.onCall(
  async (data: { email?: unknown }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }

    const db = admin.database();
    const callerSnap = await db.ref(`users/${context.auth.uid}`).once("value");
    if (!callerSnap.exists() || callerSnap.child("role").val() !== "superAdmin") {
      throw new functions.https.HttpsError("permission-denied", "Only a Super Admin can invite staff.");
    }

    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      throw new functions.https.HttpsError("invalid-argument", "A valid email address is required.");
    }

    // Create Firebase Auth account if it does not already exist
    let uid: string;
    try {
      const existing = await admin.auth().getUserByEmail(email);
      uid = existing.uid;
    } catch {
      const newUser = await admin.auth().createUser({ email, emailVerified: false });
      uid = newUser.uid;
      await db.ref(`users/${uid}`).set({
        name: email,
        email,
        phone: null,
        role: "staff",
        createdAt: Date.now(),
        bookedClasses: null,
      });
    }

    // Write or update pending staff record
    await db.ref(`pendingStaff/${uid}`).set({ email, invitedAt: Date.now(), status: "pending" });

    // Generate a password-setup link
    const actionCodeSettings = { url: "https://goldenagelearning.com/admin/login" };
    const setupLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

    await sendEmail({
      to: email,
      subject: "You've been invited to join Golden Age Learning as Staff",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#141b1f;">Welcome to the Golden Age Learning team!</h2>
          <p>You have been invited as a <strong>Staff Member</strong> on the Golden Age Learning platform.</p>
          <p>Click the button below to set up your password and access the admin dashboard:</p>
          <a href="${setupLink}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#c9a84c;color:#141b1f;font-weight:bold;text-decoration:none;border-radius:6px;">Set Up My Account</a>
          <p style="font-size:13px;color:#666;">This link expires in 1 hour. If you did not expect this invitation, you can ignore this email.</p>
        </div>
      `,
    });

    functions.logger.info("Staff invite sent", { email, uid });
    return { success: true, uid };
  }
);
