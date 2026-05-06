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
exports.onContactRequestCreated = exports.awardGamePoints = exports.backupDatabase = exports.deleteAllData = exports.sendPasswordResetCallable = exports.saveCustomerCard = exports.deleteCustomerCard = exports.getCustomerCard = exports.processPayment = exports.sendStaffInvite = exports.changeUserRole = exports.onBookingCreated = exports.twilioInbound = exports.deleteCustomer = exports.onCustomerCreated = exports.sendAdminMessage = exports.processScheduledMessages = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}
// Cloud Function triggers
var messages_1 = require("./messages");
Object.defineProperty(exports, "processScheduledMessages", { enumerable: true, get: function () { return messages_1.processScheduledMessages; } });
Object.defineProperty(exports, "sendAdminMessage", { enumerable: true, get: function () { return messages_1.sendAdminMessage; } });
var customers_1 = require("./customers");
Object.defineProperty(exports, "onCustomerCreated", { enumerable: true, get: function () { return customers_1.onCustomerCreated; } });
Object.defineProperty(exports, "deleteCustomer", { enumerable: true, get: function () { return customers_1.deleteCustomer; } });
var webhooks_1 = require("./webhooks");
Object.defineProperty(exports, "twilioInbound", { enumerable: true, get: function () { return webhooks_1.twilioInbound; } });
var bookings_1 = require("./bookings");
Object.defineProperty(exports, "onBookingCreated", { enumerable: true, get: function () { return bookings_1.onBookingCreated; } });
var staff_1 = require("./staff");
Object.defineProperty(exports, "changeUserRole", { enumerable: true, get: function () { return staff_1.changeUserRole; } });
Object.defineProperty(exports, "sendStaffInvite", { enumerable: true, get: function () { return staff_1.sendStaffInvite; } });
var payments_1 = require("./payments");
Object.defineProperty(exports, "processPayment", { enumerable: true, get: function () { return payments_1.processPayment; } });
Object.defineProperty(exports, "getCustomerCard", { enumerable: true, get: function () { return payments_1.getCustomerCard; } });
Object.defineProperty(exports, "deleteCustomerCard", { enumerable: true, get: function () { return payments_1.deleteCustomerCard; } });
Object.defineProperty(exports, "saveCustomerCard", { enumerable: true, get: function () { return payments_1.saveCustomerCard; } });
var emails_1 = require("./emails");
Object.defineProperty(exports, "sendPasswordResetCallable", { enumerable: true, get: function () { return emails_1.sendPasswordResetCallable; } });
var database_1 = require("./database");
Object.defineProperty(exports, "deleteAllData", { enumerable: true, get: function () { return database_1.deleteAllData; } });
Object.defineProperty(exports, "backupDatabase", { enumerable: true, get: function () { return database_1.backupDatabase; } });
var games_1 = require("./games");
Object.defineProperty(exports, "awardGamePoints", { enumerable: true, get: function () { return games_1.awardGamePoints; } });
var contactRequests_1 = require("./contactRequests");
Object.defineProperty(exports, "onContactRequestCreated", { enumerable: true, get: function () { return contactRequests_1.onContactRequestCreated; } });
//# sourceMappingURL=index.js.map