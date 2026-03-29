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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = sendSms;
const functions = __importStar(require("firebase-functions"));
const twilio_1 = __importDefault(require("twilio"));
const PREFIX = "Golden Age Learning: ";
const MAX_CHARS = 160;
// Lazy singleton
let _client = null;
function getClient() {
    if (!_client) {
        const cfg = (functions.config().twilio ?? {});
        _client = (0, twilio_1.default)(cfg.account_sid ?? "", cfg.auth_token ?? "");
    }
    return _client;
}
function buildBody(message) {
    const full = `${PREFIX}${message}`;
    if (full.length > MAX_CHARS) {
        console.warn(`SMS exceeds 160 chars (${full.length}): ${full}`);
    }
    return full;
}
async function sendSms(params) {
    const cfg = (functions.config().twilio ?? {});
    const from = cfg.from_number ?? "";
    await getClient().messages.create({
        from,
        to: params.to,
        body: buildBody(params.message),
    });
}
//# sourceMappingURL=sendSms.js.map