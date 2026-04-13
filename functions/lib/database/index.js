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
exports.deleteAllData = exports.backupDatabase = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
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
exports.backupDatabase = functions.https.onCall(async (_data, context) => {
    const callerUid = context.auth?.uid;
    if (!callerUid)
        throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");
    const db = admin.database();
    const callerSnap = await db.ref(`users/${callerUid}`).once("value");
    if (callerSnap.val()?.role !== "superAdmin")
        throw new functions.https.HttpsError("permission-denied", "Only super admins can back up the database.");
    const entries = await Promise.all(ALL_PATHS.map(async (path) => {
        const snap = await db.ref(path).once("value");
        return [path, snap.val()];
    }));
    const json = JSON.stringify(Object.fromEntries(entries.filter(([, v]) => v !== null)), null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backups/gal-database-${timestamp}.json`;
    const file = admin.storage().bucket(STORAGE_BUCKET).file(filename);
    await file.save(json, { contentType: "application/json" });
    return { backupFile: filename };
});
exports.deleteAllData = functions.https.onCall(async (_data, context) => {
    const callerUid = context.auth?.uid;
    if (!callerUid) {
        throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");
    }
    const db = admin.database();
    const callerSnap = await db.ref(`users/${callerUid}`).once("value");
    const callerRole = callerSnap.val()?.role;
    if (callerRole !== "superAdmin") {
        throw new functions.https.HttpsError("permission-denied", "Only super admins can delete all data.");
    }
    // Read all data
    const entries = await Promise.all(ALL_PATHS.map(async (path) => {
        const snap = await db.ref(path).once("value");
        return [path, snap.val()];
    }));
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
//# sourceMappingURL=index.js.map