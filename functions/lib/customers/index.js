"use strict";
/**
 * onCustomerCreated
 *
 * Fires when a new Firebase Auth user is created.
 * Looks up the user's profile in RTDB and sends a welcome email
 * if an email address is on file.
 */
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
exports.onCustomerCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const emails_1 = require("../emails");
const sms_1 = require("../messages/sms");
exports.onCustomerCreated = functions.auth.user().onCreate(async (user) => {
    // Look up the user's profile from RTDB
    const db = admin.database();
    const userSnap = await db.ref(`users/${user.uid}`).once("value");
    const profile = userSnap.exists() ? userSnap.val() : null;
    const name = profile?.name ?? user.displayName ?? "Friend";
    const email = user.email ?? profile?.email ?? null;
    const phone = profile?.phone ?? null;
    const sends = [];
    if (email) {
        sends.push((0, emails_1.sendWelcomeEmail)(email, { customerName: name }));
    }
    if (phone) {
        sends.push((0, sms_1.sendWelcomeSms)(phone));
    }
    await Promise.all(sends);
});
//# sourceMappingURL=index.js.map