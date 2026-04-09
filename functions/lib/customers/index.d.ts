/**
 * onCustomerCreated
 *
 * Fires when a new Firebase Auth user is created.
 * Looks up the user's profile in RTDB and sends a welcome email
 * if an email address is on file.
 */
import * as functions from "firebase-functions";
export declare const onCustomerCreated: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
//# sourceMappingURL=index.d.ts.map