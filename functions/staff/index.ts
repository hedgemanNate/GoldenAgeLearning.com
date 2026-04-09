import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

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
