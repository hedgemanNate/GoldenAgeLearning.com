import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

interface AwardGamePointsData {
  classId?: unknown;
  pointsMap?: unknown; // Record<string, number> — uid → points to add
}

export const awardGamePoints = functions.https.onCall(
  async (data: AwardGamePointsData, context) => {
    const callerUid = context.auth?.uid;

    if (!callerUid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to award points.",
      );
    }

    const db = admin.database();

    // Verify caller is staff or superAdmin
    const callerSnap = await db.ref(`users/${callerUid}`).once("value");
    if (!callerSnap.exists()) {
      throw new functions.https.HttpsError("not-found", "Caller user record not found.");
    }

    const callerRole = callerSnap.child("role").val() as string;
    if (callerRole !== "staff" && callerRole !== "superAdmin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only staff or superAdmins can award points.",
      );
    }

    if (
      !data.pointsMap ||
      typeof data.pointsMap !== "object" ||
      Array.isArray(data.pointsMap)
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "pointsMap must be an object mapping user IDs to point amounts.",
      );
    }

    const pointsMap = data.pointsMap as Record<string, unknown>;

    // Award points to each user atomically using transactions
    let awardedCount = 0;
    const updates: Promise<void>[] = [];

    for (const [uid, rawPoints] of Object.entries(pointsMap)) {
      const points = typeof rawPoints === "number" ? Math.floor(rawPoints) : 0;
      if (points <= 0) continue;

      awardedCount++;
      updates.push(
        db
          .ref(`users/${uid}/points_total`)
          .transaction((current: number | null) => (current ?? 0) + points)
          .then(() => undefined),
      );
    }

    await Promise.all(updates);

    functions.logger.info("Game points awarded", {
      actorUid: callerUid,
      classId: typeof data.classId === "string" ? data.classId : null,
      recipientCount: awardedCount,
    });

    return { awarded: awardedCount };
  },
);
