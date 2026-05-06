"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.awardGamePoints = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
exports.awardGamePoints = functions.https.onCall(async (data, context) => {
    const callerUid = context.auth?.uid;
    if (!callerUid) {
        throw new functions.https.HttpsError("unauthenticated", "You must be signed in to award points.");
    }
    const db = admin.database();
    // Verify caller is staff or superAdmin
    const callerSnap = await db.ref(`users/${callerUid}`).once("value");
    if (!callerSnap.exists()) {
        throw new functions.https.HttpsError("not-found", "Caller user record not found.");
    }
    const callerRole = callerSnap.child("role").val();
    if (callerRole !== "staff" && callerRole !== "superAdmin") {
        throw new functions.https.HttpsError("permission-denied", "Only staff or superAdmins can award points.");
    }
    if (!data.pointsMap ||
        typeof data.pointsMap !== "object" ||
        Array.isArray(data.pointsMap)) {
        throw new functions.https.HttpsError("invalid-argument", "pointsMap must be an object mapping user IDs to point amounts.");
    }
    const pointsMap = data.pointsMap;
    // Award points to each user atomically using transactions
    let awardedCount = 0;
    const updates = [];
    for (const [uid, rawPoints] of Object.entries(pointsMap)) {
        const points = typeof rawPoints === "number" ? Math.floor(rawPoints) : 0;
        if (points <= 0)
            continue;
        awardedCount++;
        updates.push(db
            .ref(`users/${uid}/points_total`)
            .transaction((current) => (current ?? 0) + points)
            .then(() => undefined));
    }
    await Promise.all(updates);
    functions.logger.info("Game points awarded", {
        actorUid: callerUid,
        classId: typeof data.classId === "string" ? data.classId : null,
        recipientCount: awardedCount,
    });
    return { awarded: awardedCount };
});
//# sourceMappingURL=index.js.map