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
exports.changeUserRole = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const ALLOWED_ROLES = new Set(["customer", "staff", "superAdmin", "sponsor"]);
exports.changeUserRole = functions.https.onCall(async (data, context) => {
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
    const targetUser = targetSnap.val();
    const currentRole = targetUser.role ?? "customer";
    const requestedRole = nextRole;
    if (currentRole === requestedRole) {
        return { uid: targetUid, role: requestedRole, unchanged: true };
    }
    if (currentRole === "superAdmin" && requestedRole !== "superAdmin") {
        const superAdminSnap = await db.ref("users").orderByChild("role").equalTo("superAdmin").once("value");
        const superAdminCount = superAdminSnap.exists() ? superAdminSnap.numChildren() : 0;
        if (superAdminCount <= 1) {
            throw new functions.https.HttpsError("failed-precondition", "The last remaining Super Admin cannot be demoted.");
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
//# sourceMappingURL=index.js.map