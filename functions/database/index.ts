import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const ALL_PATHS = [
  "users",
  "classes",
  "bookings",
  "transferLog",
  "discounts",
  "messages",
  "activityLog",
  "payments",
  "classTemplates",
  "classTaxonomy",
  "settings",
];

export const deleteAllData = functions.https.onCall(async (_data, context) => {
  const callerUid = context.auth?.uid;

  if (!callerUid) {
    throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");
  }

  const db = admin.database();
  const callerSnap = await db.ref(`users/${callerUid}`).once("value");
  const callerRole: string | undefined = callerSnap.val()?.role;

  if (callerRole !== "superAdmin") {
    throw new functions.https.HttpsError("permission-denied", "Only super admins can delete all data.");
  }

  await Promise.all(ALL_PATHS.map((path) => db.ref(path).remove()));
});
