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
exports.sendEmail = sendEmail;
const functions = __importStar(require("firebase-functions"));
const client_ses_1 = require("@aws-sdk/client-ses");
const FROM = "The Golden Age Learning Team <noreply@goldenagelearning.com>";
// Lazy singleton — initialized on first call so functions.config() is available at runtime
let _client = null;
function getClient() {
    if (!_client) {
        const cfg = (functions.config().aws ?? {});
        _client = new client_ses_1.SESClient({
            region: cfg.ses_region ?? "us-east-1",
            credentials: {
                accessKeyId: cfg.ses_access_key ?? "",
                secretAccessKey: cfg.ses_secret_key ?? "",
            },
        });
    }
    return _client;
}
async function sendEmail(params) {
    const command = new client_ses_1.SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [params.to] },
        Message: {
            Subject: { Data: params.subject, Charset: "UTF-8" },
            Body: { Html: { Data: params.html, Charset: "UTF-8" } },
        },
    });
    await getClient().send(command);
}
//# sourceMappingURL=sendEmail.js.map