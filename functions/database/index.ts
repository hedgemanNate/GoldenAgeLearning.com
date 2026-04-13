import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const STORAGE_BUCKET = "golden-age-learning.firebasestorage.app";

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

export const backupDatabase = functions.https.onCall(async (_data, context) => {
  const callerUid = context.auth?.uid;
  if (!callerUid) throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");

  const db = admin.database();
  const callerSnap = await db.ref(`users/${callerUid}`).once("value");
  if (callerSnap.val()?.role !== "superAdmin")
    throw new functions.https.HttpsError("permission-denied", "Only super admins can back up the database.");

  const entries = await Promise.all(
    ALL_PATHS.map(async (path) => {
      const snap = await db.ref(path).once("value");
      return [path, snap.val()] as const;
    })
  );
  const json = JSON.stringify(Object.fromEntries(entries.filter(([, v]) => v !== null)), null, 2);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backups/gal-database-${timestamp}.json`;
  const file = admin.storage().bucket(STORAGE_BUCKET).file(filename);
  await file.save(json, { contentType: "application/json" });

  return { backupFile: filename };
});

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

  // Read all data
  const entries = await Promise.all(
    ALL_PATHS.map(async (path) => {
      const snap = await db.ref(path).once("value");
      return [path, snap.val()] as const;
    })
  );
  const json = JSON.stringify(Object.fromEntries(entries.filter(([, v]) => v !== null)), null, 2);

  // Upload backup to Firebase Storage
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backups/gal-database-${timestamp}.json`;
  const file = admin.storage().bucket(STORAGE_BUCKET).file(filename);
  await file.save(json, { contentType: "application/json" });

  // Verify backup exists before deleting
  const [exists] = await file.exists();
  if (!exists) {
    throw new functions.https.HttpsError("internal", "Backup verification failed. Deletion aborted.");
  }

  // Delete all data
  await Promise.all(ALL_PATHS.map((path) => db.ref(path).remove()));

  return { backupFile: filename };
});
