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
exports.onBookingCreated = exports.twilioInbound = exports.onCustomerCreated = exports.processScheduledMessages = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}
// Cloud Function triggers
var messages_1 = require("./messages");
Object.defineProperty(exports, "processScheduledMessages", { enumerable: true, get: function () { return messages_1.processScheduledMessages; } });
var customers_1 = require("./customers");
Object.defineProperty(exports, "onCustomerCreated", { enumerable: true, get: function () { return customers_1.onCustomerCreated; } });
var webhooks_1 = require("./webhooks");
Object.defineProperty(exports, "twilioInbound", { enumerable: true, get: function () { return webhooks_1.twilioInbound; } });
var bookings_1 = require("./bookings");
Object.defineProperty(exports, "onBookingCreated", { enumerable: true, get: function () { return bookings_1.onBookingCreated; } });
//# sourceMappingURL=index.js.map