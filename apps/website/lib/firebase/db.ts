import {
  ref,
  get,
  set,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { db } from "./client";
import type { User, UserWithId } from "../../types/user";
import type { Class, ClassWithId } from "../../types/class";
import type { Booking, BookingWithId, TransferLog, TransferLogWithId } from "../../types/booking";
import type { Discount, DiscountWithId } from "../../types/discount";
import type { Message, MessageWithId } from "../../types/message";
import type { Payment, PaymentWithId } from "../../types/payment";
import type { ActivityLog, ActivityLogWithId } from "../../types/activityLog";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<UserWithId | null> {
  const snap = await get(ref(db, `users/${uid}`));
  if (!snap.exists()) return null;
  return { uid, ...snap.val() } as UserWithId;
}

export async function createUser(uid: string, data: User): Promise<void> {
  await set(ref(db, `users/${uid}`), data);
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await update(ref(db, `users/${uid}`), data);
}

export async function getAllUsers(): Promise<UserWithId[]> {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([uid, val]) => ({ uid, ...(val as User) }));
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function getClass(classId: string): Promise<ClassWithId | null> {
  const snap = await get(ref(db, `classes/${classId}`));
  if (!snap.exists()) return null;
  return { id: classId, ...snap.val() } as ClassWithId;
}

export async function createClass(data: Class): Promise<string> {
  const newRef = push(ref(db, "classes"));
  await set(newRef, data);
  return newRef.key!;
}

export async function updateClass(classId: string, data: Partial<Class>): Promise<void> {
  await update(ref(db, `classes/${classId}`), data);
}

export async function getAllClasses(): Promise<ClassWithId[]> {
  const snap = await get(ref(db, "classes"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Class) }));
}

export async function getUpcomingClasses(): Promise<ClassWithId[]> {
  const q = query(ref(db, "classes"), orderByChild("status"), equalTo("upcoming"));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Class) }));
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBooking(bookingId: string): Promise<BookingWithId | null> {
  const snap = await get(ref(db, `bookings/${bookingId}`));
  if (!snap.exists()) return null;
  return { id: bookingId, ...snap.val() } as BookingWithId;
}

export async function createBooking(data: Booking): Promise<string> {
  const newRef = push(ref(db, "bookings"));
  await set(newRef, data);
  return newRef.key!;
}

export async function updateBooking(bookingId: string, data: Partial<Booking>): Promise<void> {
  await update(ref(db, `bookings/${bookingId}`), data);
}

export async function getAllBookings(): Promise<BookingWithId[]> {
  const snap = await get(ref(db, "bookings"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Booking) }));
}

export async function getBookingsByCustomer(customerId: string): Promise<BookingWithId[]> {
  const q = query(ref(db, "bookings"), orderByChild("customerId"), equalTo(customerId));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Booking) }));
}

export async function getBookingsByClass(classId: string): Promise<BookingWithId[]> {
  const q = query(ref(db, "bookings"), orderByChild("classId"), equalTo(classId));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Booking) }));
}

// ─── Transfer Log ─────────────────────────────────────────────────────────────

export async function createTransferLog(data: TransferLog): Promise<string> {
  const newRef = push(ref(db, "transferLog"));
  await set(newRef, data);
  return newRef.key!;
}

export async function getTransferLog(transferId: string): Promise<TransferLogWithId | null> {
  const snap = await get(ref(db, `transferLog/${transferId}`));
  if (!snap.exists()) return null;
  return { id: transferId, ...snap.val() } as TransferLogWithId;
}

// ─── Discounts ────────────────────────────────────────────────────────────────

export async function getDiscount(discountId: string): Promise<DiscountWithId | null> {
  const snap = await get(ref(db, `discounts/${discountId}`));
  if (!snap.exists()) return null;
  return { id: discountId, ...snap.val() } as DiscountWithId;
}

export async function createDiscount(data: Discount): Promise<string> {
  const newRef = push(ref(db, "discounts"));
  await set(newRef, data);
  return newRef.key!;
}

export async function updateDiscount(discountId: string, data: Partial<Discount>): Promise<void> {
  await update(ref(db, `discounts/${discountId}`), data);
}

export async function getAllDiscounts(): Promise<DiscountWithId[]> {
  const snap = await get(ref(db, "discounts"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Discount) }));
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessage(messageId: string): Promise<MessageWithId | null> {
  const snap = await get(ref(db, `messages/${messageId}`));
  if (!snap.exists()) return null;
  return { id: messageId, ...snap.val() } as MessageWithId;
}

export async function createMessage(data: Message): Promise<string> {
  const newRef = push(ref(db, "messages"));
  await set(newRef, data);
  return newRef.key!;
}

export async function getAllMessages(): Promise<MessageWithId[]> {
  const snap = await get(ref(db, "messages"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Message) }));
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPayment(paymentId: string): Promise<PaymentWithId | null> {
  const snap = await get(ref(db, `payments/${paymentId}`));
  if (!snap.exists()) return null;
  return { id: paymentId, ...snap.val() } as PaymentWithId;
}

export async function createPayment(data: Payment): Promise<string> {
  const newRef = push(ref(db, "payments"));
  await set(newRef, data);
  return newRef.key!;
}

export async function getAllPayments(): Promise<PaymentWithId[]> {
  const snap = await get(ref(db, "payments"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Payment) }));
}

export async function getPaymentsByCustomer(customerId: string): Promise<PaymentWithId[]> {
  const q = query(ref(db, "payments"), orderByChild("customerId"), equalTo(customerId));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Payment) }));
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export async function createActivityLog(data: ActivityLog): Promise<string> {
  const newRef = push(ref(db, "activityLog"));
  await set(newRef, data);
  return newRef.key!;
}

export async function getActivityLogs(limit?: number): Promise<ActivityLogWithId[]> {
  const snap = await get(ref(db, "activityLog"));
  if (!snap.exists()) return [];
  const logs = Object.entries(snap.val()).map(([id, val]) => ({
    id,
    ...(val as ActivityLog),
  }));
  return logs
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

// ─── Real-time subscriptions ───────────────────────────────────────────────────

export function subscribeToClasses(callback: (classes: ClassWithId[]) => void) {
  return onValue(ref(db, "classes"), (snap) => {
    if (!snap.exists()) { callback([]); return; }
    callback(Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Class) })));
  });
}

export function subscribeToBookings(
  callback: (bookings: BookingWithId[]) => void,
  onCancelled?: (error: Error) => void
) {
  return onValue(
    ref(db, "bookings"),
    (snap) => {
      if (!snap.exists()) { callback([]); return; }
      callback(Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Booking) })));
    },
    onCancelled
  );
}

export function subscribeToDiscounts(callback: (discounts: DiscountWithId[]) => void) {
  return onValue(ref(db, "discounts"), (snap) => {
    if (!snap.exists()) { callback([]); return; }
    callback(Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Discount) })));
  });
}

export function subscribeToCustomerBookings(
  customerId: string,
  callback: (bookings: BookingWithId[]) => void
) {
  const q = query(ref(db, "bookings"), orderByChild("customerId"), equalTo(customerId));
  return onValue(q, (snap) => {
    if (!snap.exists()) { callback([]); return; }
    callback(Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Booking) })));
  });
}

export function subscribeToMessages(callback: (messages: MessageWithId[]) => void) {
  return onValue(ref(db, "messages"), (snap) => {
    if (!snap.exists()) { callback([]); return; }
    const msgs = Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as Message) }));
    callback(msgs.sort((a, b) => b.createdAt - a.createdAt));
  });
}

export function subscribeToUsers(callback: (users: UserWithId[]) => void) {
  return onValue(ref(db, "users"), (snap) => {
    if (!snap.exists()) { callback([]); return; }
    callback(Object.entries(snap.val()).map(([uid, val]) => ({ uid, ...(val as User) })));
  });
}
