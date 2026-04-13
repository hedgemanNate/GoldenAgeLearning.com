/**
 * processScheduledMessages
 *
 * Runs every 5 minutes. At 8:00 AM each day, finds all classes
 * scheduled for tomorrow and sends a reminder email to every
 * customer with a booking in those classes.
 */
import * as functions from "firebase-functions";
export declare const sendAdminMessage: functions.HttpsFunction & functions.Runnable<any>;
export declare const processScheduledMessages: functions.CloudFunction<unknown>;
//# sourceMappingURL=index.d.ts.map