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
exports.onContactRequestCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const sendEmail_1 = require("../utils/sendEmail");
const NOTIFY_EMAIL = "info@goldenagelearning.com";
exports.onContactRequestCreated = functions.database
    .ref("contactRequests/{requestId}")
    .onCreate(async (snap, context) => {
    const data = snap.val();
    const requestRef = admin.database().ref(`contactRequests/${context.params.requestId}`);
    const submittedAt = data.createdAt
        ? new Date(data.createdAt).toLocaleString("en-US", {
            timeZone: "America/New_York",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
        : "Unknown";
    try {
        await (0, sendEmail_1.sendEmail)({
            to: NOTIFY_EMAIL,
            subject: "New Contact Request from Maintenance Page",
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
            <h2 style="color: #c9a84c; margin-bottom: 4px;">New Contact Request</h2>
            <p style="color: #666; font-size: 13px; margin-top: 0;">Submitted via the Golden Age Learning maintenance page</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px 4px; font-weight: bold;">Phone</td>
                <td style="padding: 8px 4px;">${data.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #c9a84c;">${data.email}</a></td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px 4px; font-weight: bold;">Submitted</td>
                <td style="padding: 8px 4px;">${submittedAt} ET</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="font-size: 13px; color: #999;">Please follow up within 24 hours.</p>
          </div>
        `,
        });
        functions.logger.info("Contact request email sent", {
            email: data.email,
            requestId: context.params.requestId,
        });
        await requestRef.update({
            notificationStatus: "sent",
            notificationSentAt: Date.now(),
            notifiedEmail: NOTIFY_EMAIL,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        functions.logger.error("Contact request email failed", {
            error: message,
            email: data.email,
            requestId: context.params.requestId,
        });
        await requestRef.update({
            notificationStatus: "failed",
            notificationError: message,
            notificationFailedAt: Date.now(),
            notifiedEmail: NOTIFY_EMAIL,
        });
        throw error;
    }
});
//# sourceMappingURL=index.js.map