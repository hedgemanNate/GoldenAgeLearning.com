"use client";

import { useEffect, useMemo, useState } from "react";
import DatabaseTypedEditor, { type DatabaseTypedField } from "../../../../components/admin/DatabaseTypedEditor";
import { useAuthContext } from "../../../../context/AuthContext";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useDiscounts } from "../../../../hooks/useDiscounts";
import { useClassTemplates } from "../../../../hooks/useClassTemplates";
import {
  addTaxonomyTag,
  adminCreateChildValue,
  adminDeleteRawValue,
  adminSetRawValue,
  createBooking,
  createClassTemplate,
  createDiscount,
  createMessage,
  deleteClass,
  deleteClassTemplate,
  deleteTaxonomyTag,
  getActivityLogs,
  getAllPayments,
  moveClassToArchived,
  subscribeToMessages,
  unarchiveClass,
  updateBooking,
  updateClassTemplate,
  updateDiscount,
} from "../../../../lib/firebase/db";
import type { ActivityLogWithId } from "../../../../types/activityLog";
import type { PaymentWithId } from "../../../../types/payment";

type CollectionKey =
  | "users"
  | "classesActive"
  | "classesArchived"
  | "bookings"
  | "discounts"
  | "messages"
  | "payments"
  | "activityLog"
  | "classTemplates"
  | "taxonomyCategories"
  | "taxonomyLocations";

type DetailTab = "details" | "json";

type CreateMode = "push" | "custom" | "none";
type EditorMode = "typed" | "json" | null;
type TypedEditorValue = string | boolean;

interface TypedEditorConfig {
  fields: DatabaseTypedField[];
  toFormValues: (raw: Record<string, unknown>) => Record<string, TypedEditorValue>;
  toRecord: (values: Record<string, TypedEditorValue>, base: Record<string, unknown>) => Record<string, unknown>;
}

interface DatabaseRecord {
  id: string;
  collection: CollectionKey;
  path: string;
  label: string;
  subtitle: string;
  raw: Record<string, unknown>;
  searchText: string;
}

interface CollectionMeta {
  label: string;
  description: string;
  createMode: CreateMode;
  canEdit: boolean;
  canHardDelete: boolean;
  canArchive: boolean;
  canRestore: boolean;
  readOnlyReason?: string;
  helperText?: string;
}

const COLLECTION_ORDER: CollectionKey[] = [
  "users",
  "classesActive",
  "classesArchived",
  "bookings",
  "discounts",
  "messages",
  "payments",
  "activityLog",
  "classTemplates",
  "taxonomyCategories",
  "taxonomyLocations",
];

const COLLECTION_META: Record<CollectionKey, CollectionMeta> = {
  users: {
    label: "Users",
    description: "All user profiles across every role.",
    createMode: "custom",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: false,
    helperText: "Creating a user here creates only the database profile. It does not create a Firebase Auth login.",
  },
  classesActive: {
    label: "Classes: Active",
    description: "Upcoming and active class records.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: true,
    canRestore: false,
    helperText: "Archive moves the class into the archived collection.",
  },
  classesArchived: {
    label: "Classes: Archived",
    description: "Archived class records.",
    createMode: "none",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: true,
    helperText: "Restore moves the class back into the active collection.",
  },
  bookings: {
    label: "Bookings",
    description: "Booking records across all statuses.",
    createMode: "push",
    canEdit: true,
    canHardDelete: false,
    canArchive: false,
    canRestore: false,
    helperText: "Editing customerId or classId here does not automatically repair linked bookedClasses maps or seat counts.",
  },
  discounts: {
    label: "Discounts",
    description: "Sponsor-linked discount offers.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: true,
    canRestore: true,
  },
  messages: {
    label: "Messages",
    description: "Email, SMS, and push communication records.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: false,
  },
  payments: {
    label: "Payments",
    description: "Payment records linked to bookings.",
    createMode: "none",
    canEdit: false,
    canHardDelete: false,
    canArchive: false,
    canRestore: false,
    readOnlyReason: "Payments are read-only in this client because the current rules and flow treat them as backend-controlled records.",
  },
  activityLog: {
    label: "Activity Log",
    description: "Administrative audit trail.",
    createMode: "none",
    canEdit: false,
    canHardDelete: false,
    canArchive: false,
    canRestore: false,
    readOnlyReason: "Activity Log is read-only here so audit history stays immutable.",
  },
  classTemplates: {
    label: "Class Templates",
    description: "Reusable presets for class creation.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: false,
  },
  taxonomyCategories: {
    label: "Taxonomy: Categories",
    description: "Global class category tags.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: false,
  },
  taxonomyLocations: {
    label: "Taxonomy: Locations",
    description: "Global class location tags.",
    createMode: "push",
    canEdit: true,
    canHardDelete: true,
    canArchive: false,
    canRestore: false,
  },
};

function formatDateTime(ts: number | null | undefined) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFieldLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (String(value).length >= 12) return formatDateTime(value);
    return String(value);
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value.length === 0 ? "—" : value;
  return JSON.stringify(value);
}

function getDefaultRecord(collection: CollectionKey, currentUserId: string | undefined): Record<string, unknown> {
  const now = Date.now();

  switch (collection) {
    case "users":
      return {
        name: "",
        email: null,
        phone: null,
        address: null,
        role: "customer",
        notes: null,
        contact: [],
        discounts: [],
        bookedClasses: {},
        starRating: null,
        profilePicture: null,
        totalRedemptions: 0,
        squareCustomerId: null,
        squareCardId: null,
        createdAt: now,
        lastLoginAt: null,
      };
    case "classesActive":
      return {
        name: "",
        description: "",
        category: "",
        date: now,
        duration: 60,
        location: "",
        price: 0,
        seatLimit: 20,
        seatsBooked: 0,
        sponsorId: null,
        instructorId: null,
        status: "upcoming",
        archivedAt: null,
        createdAt: now,
        createdBy: currentUserId ?? "unknown",
      };
    case "bookings":
      return {
        customerId: "",
        classId: "",
        status: "reserved",
        amount: 0,
        transferredFrom: null,
        transferredTo: null,
        transferType: null,
        createdAt: now,
        createdBy: currentUserId ?? null,
      };
    case "discounts":
      return {
        title: "",
        description: "",
        sponsorId: "",
        estimatedValue: 0,
        appliesToClasses: [],
        appliesToAll: true,
        expiresAt: now,
        status: "active",
        totalRedemptions: 0,
        redeemedBy: [],
        createdAt: now,
        createdBy: currentUserId ?? "unknown",
        archivedAt: null,
      };
    case "messages":
      return {
        subject: null,
        body: "",
        channel: "email",
        recipientType: "all",
        recipientId: null,
        recipients: {},
        recipientCount: 0,
        status: "sent",
        scheduledAt: null,
        sentAt: now,
        createdAt: now,
        createdBy: currentUserId ?? "unknown",
      };
    case "classTemplates":
      return {
        name: "",
        description: "",
        price: 0,
        seatLimit: 20,
        duration: 60,
        defaultCategory: "",
        defaultLocation: "",
        createdAt: now,
        createdBy: currentUserId ?? "unknown",
      };
    case "taxonomyCategories":
    case "taxonomyLocations":
      return { value: "" };
    default:
      return {};
  }
}

function parseJsonDraft(draft: string): Record<string, unknown> {
  const parsed = JSON.parse(draft) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON must describe an object.");
  }
  return parsed as Record<string, unknown>;
}

function formatDateTimeInput(value: unknown): string {
  if (typeof value !== "number" || value <= 0) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(value - offset).toISOString().slice(0, 16);
}

function parseDateTimeInput(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? fallback : timestamp;
}

function nullableString(value: TypedEditorValue): string | null {
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function numberOr(value: TypedEditorValue, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value: TypedEditorValue): number | null {
  const normalized = String(value).trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function listToText(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

function textToList(value: TypedEditorValue): string[] {
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function booleanValue(value: unknown): boolean {
  return Boolean(value);
}

export default function AdminDatabasePage() {
  const { user: currentUser } = useAuthContext();
  const { classes, bookings, users, loading: adminLoading } = useAdminData();
  const { discounts, loading: discountsLoading } = useDiscounts();
  const { templates, categories, locations, loading: templatesLoading } = useClassTemplates();

  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentWithId[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLogWithId[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const [selectedCollection, setSelectedCollection] = useState<CollectionKey>("users");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{ collection: CollectionKey; id: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailTab, setDetailTab] = useState<DetailTab>("details");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [customRecordId, setCustomRecordId] = useState("");
  const [draftJson, setDraftJson] = useState("");
  const [typedFormValues, setTypedFormValues] = useState<Record<string, TypedEditorValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [mutationNotice, setMutationNotice] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToMessages((all) => {
      setMessages(all as unknown as Record<string, unknown>[]);
      setMessagesLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSecondaryCollections() {
      try {
        const [allPayments, allActivityLogs] = await Promise.all([
          getAllPayments(),
          getActivityLogs(),
        ]);
        if (!active) return;
        setPayments(allPayments);
        setActivityLogs(allActivityLogs);
      } finally {
        if (active) {
          setPaymentsLoading(false);
          setActivityLoading(false);
        }
      }
    }

    loadSecondaryCollections();
    return () => {
      active = false;
    };
  }, []);

  const loading = adminLoading || discountsLoading || templatesLoading || messagesLoading || paymentsLoading || activityLoading;

  const activeClassIds = useMemo(() => new Set(classes.filter((cls) => cls.status !== "archived").map((cls) => cls.id)), [classes]);
  const archivedClassIds = useMemo(() => new Set(classes.filter((cls) => cls.status === "archived").map((cls) => cls.id)), [classes]);
  const usersById = useMemo(() => Object.fromEntries(users.map((user) => [user.uid, user])), [users]);
  const classesById = useMemo(() => Object.fromEntries(classes.map((cls) => [cls.id, cls])), [classes]);

  const recordsByCollection = useMemo<Record<CollectionKey, DatabaseRecord[]>>(() => {
    const sortBySubtitle = (left: DatabaseRecord, right: DatabaseRecord) => right.subtitle.localeCompare(left.subtitle);
    const sortByLabel = (left: DatabaseRecord, right: DatabaseRecord) => left.label.localeCompare(right.label);

    const usersRecords: DatabaseRecord[] = users
      .map((user) => ({
        id: user.uid,
        collection: "users" as const,
        path: `users/${user.uid}`,
        label: user.name || user.uid,
        subtitle: `${user.role} · ${user.email ?? "No email"}`,
        raw: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          notes: user.notes,
          contact: user.contact,
          discounts: user.discounts,
          bookedClasses: user.bookedClasses,
          starRating: user.starRating,
          profilePicture: user.profilePicture,
          totalRedemptions: user.totalRedemptions,
          squareCustomerId: user.squareCustomerId,
          squareCardId: user.squareCardId,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
        searchText: `${user.uid} ${user.name} ${user.email ?? ""} ${user.role}`.toLowerCase(),
      }))
      .sort(sortByLabel);

    const activeClasses: DatabaseRecord[] = classes
      .filter((cls) => cls.status !== "archived")
      .map((cls) => ({
        id: cls.id,
        collection: "classesActive" as const,
        path: `classes/active/${cls.id}`,
        label: cls.name,
        subtitle: `${formatDateTime(cls.date)} · ${cls.status}`,
        raw: {
          name: cls.name,
          description: cls.description,
          category: cls.category,
          date: cls.date,
          duration: cls.duration,
          location: cls.location,
          price: cls.price,
          seatLimit: cls.seatLimit,
          seatsBooked: cls.seatsBooked,
          sponsorId: cls.sponsorId,
          instructorId: cls.instructorId,
          status: cls.status,
          archivedAt: cls.archivedAt,
          createdAt: cls.createdAt,
          createdBy: cls.createdBy,
        },
        searchText: `${cls.id} ${cls.name} ${cls.category} ${cls.location}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const archivedClasses: DatabaseRecord[] = classes
      .filter((cls) => cls.status === "archived")
      .map((cls) => ({
        id: cls.id,
        collection: "classesArchived" as const,
        path: `classes/archived/${cls.id}`,
        label: cls.name,
        subtitle: `${formatDateTime(cls.date)} · archived`,
        raw: {
          name: cls.name,
          description: cls.description,
          category: cls.category,
          date: cls.date,
          duration: cls.duration,
          location: cls.location,
          price: cls.price,
          seatLimit: cls.seatLimit,
          seatsBooked: cls.seatsBooked,
          sponsorId: cls.sponsorId,
          instructorId: cls.instructorId,
          status: cls.status,
          archivedAt: cls.archivedAt,
          createdAt: cls.createdAt,
          createdBy: cls.createdBy,
        },
        searchText: `${cls.id} ${cls.name} ${cls.category} ${cls.location}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const bookingRecords: DatabaseRecord[] = bookings
      .map((booking) => ({
        id: booking.id,
        collection: "bookings" as const,
        path: `bookings/${booking.id}`,
        label: `${usersById[booking.customerId]?.name ?? booking.customerId}`,
        subtitle: `${classesById[booking.classId]?.name ?? booking.classId} · ${booking.status} · ${formatDateTime(booking.createdAt)}`,
        raw: {
          customerId: booking.customerId,
          classId: booking.classId,
          status: booking.status,
          amount: booking.amount,
          transferredFrom: booking.transferredFrom,
          transferredTo: booking.transferredTo,
          transferType: booking.transferType,
          createdAt: booking.createdAt,
          createdBy: booking.createdBy,
        },
        searchText: `${booking.id} ${booking.customerId} ${booking.classId} ${booking.status}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const discountRecords: DatabaseRecord[] = discounts
      .map((discount) => ({
        id: discount.id,
        collection: "discounts" as const,
        path: `discounts/${discount.id}`,
        label: discount.title,
        subtitle: `${usersById[discount.sponsorId]?.name ?? discount.sponsorId} · ${discount.status}`,
        raw: {
          title: discount.title,
          description: discount.description,
          sponsorId: discount.sponsorId,
          estimatedValue: discount.estimatedValue,
          appliesToClasses: discount.appliesToClasses,
          appliesToAll: discount.appliesToAll,
          expiresAt: discount.expiresAt,
          status: discount.status,
          totalRedemptions: discount.totalRedemptions,
          redeemedBy: discount.redeemedBy,
          createdAt: discount.createdAt,
          createdBy: discount.createdBy,
          archivedAt: discount.archivedAt,
        },
        searchText: `${discount.id} ${discount.title} ${discount.description} ${discount.sponsorId}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const messageRecords: DatabaseRecord[] = (messages as Array<Record<string, unknown> & { id: string }>)
      .map((message) => ({
        id: message.id,
        collection: "messages" as const,
        path: `messages/${message.id}`,
        label: (message.subject as string | null) ?? ((message.body as string) || "Untitled message"),
        subtitle: `${String(message.channel)} · ${String(message.status)} · ${formatDateTime(message.createdAt as number)}`,
        raw: {
          subject: message.subject,
          body: message.body,
          channel: message.channel,
          recipientType: message.recipientType,
          recipientId: message.recipientId,
          recipients: message.recipients,
          recipientCount: message.recipientCount,
          status: message.status,
          scheduledAt: message.scheduledAt,
          sentAt: message.sentAt,
          createdAt: message.createdAt,
          createdBy: message.createdBy,
        },
        searchText: `${message.id} ${String(message.subject ?? "")} ${String(message.body ?? "")}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const paymentRecords: DatabaseRecord[] = payments
      .map((payment) => ({
        id: payment.id,
        collection: "payments" as const,
        path: `payments/${payment.id}`,
        label: `${usersById[payment.customerId]?.name ?? payment.customerId}`,
        subtitle: `${payment.status} · ${formatDateTime(payment.createdAt)}`,
        raw: {
          bookingId: payment.bookingId,
          customerId: payment.customerId,
          classId: payment.classId,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          squarePaymentId: payment.squarePaymentId,
          status: payment.status,
          refunded: payment.refunded,
          refundedAt: payment.refundedAt,
          createdAt: payment.createdAt,
        },
        searchText: `${payment.id} ${payment.customerId} ${payment.bookingId} ${payment.status}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const activityRecords: DatabaseRecord[] = activityLogs
      .map((log) => ({
        id: log.id,
        collection: "activityLog" as const,
        path: `activityLog/${log.id}`,
        label: log.action,
        subtitle: `${log.targetType}:${log.targetId} · ${formatDateTime(log.createdAt)}`,
        raw: {
          performedBy: log.performedBy,
          action: log.action,
          targetType: log.targetType,
          targetId: log.targetId,
          details: log.details,
          createdAt: log.createdAt,
        },
        searchText: `${log.id} ${log.action} ${log.targetType} ${log.targetId} ${log.details}`.toLowerCase(),
      }))
      .sort(sortBySubtitle);

    const templateRecords: DatabaseRecord[] = templates
      .map((template) => ({
        id: template.id,
        collection: "classTemplates" as const,
        path: `classTemplates/${template.id}`,
        label: template.name,
        subtitle: `${template.defaultCategory || "No category"} · ${template.defaultLocation || "No location"}`,
        raw: {
          name: template.name,
          description: template.description,
          price: template.price,
          seatLimit: template.seatLimit,
          duration: template.duration,
          defaultCategory: template.defaultCategory,
          defaultLocation: template.defaultLocation,
          createdAt: template.createdAt,
          createdBy: template.createdBy,
        },
        searchText: `${template.id} ${template.name} ${template.defaultCategory} ${template.defaultLocation}`.toLowerCase(),
      }))
      .sort(sortByLabel);

    const categoryRecords: DatabaseRecord[] = categories
      .map((tag) => ({
        id: tag.id,
        collection: "taxonomyCategories" as const,
        path: `classTaxonomy/categories/${tag.id}`,
        label: tag.value,
        subtitle: "Category tag",
        raw: { value: tag.value },
        searchText: `${tag.id} ${tag.value}`.toLowerCase(),
      }))
      .sort(sortByLabel);

    const locationRecords: DatabaseRecord[] = locations
      .map((tag) => ({
        id: tag.id,
        collection: "taxonomyLocations" as const,
        path: `classTaxonomy/locations/${tag.id}`,
        label: tag.value,
        subtitle: "Location tag",
        raw: { value: tag.value },
        searchText: `${tag.id} ${tag.value}`.toLowerCase(),
      }))
      .sort(sortByLabel);

    return {
      users: usersRecords,
      classesActive: activeClasses,
      classesArchived: archivedClasses,
      bookings: bookingRecords,
      discounts: discountRecords,
      messages: messageRecords,
      payments: paymentRecords,
      activityLog: activityRecords,
      classTemplates: templateRecords,
      taxonomyCategories: categoryRecords,
      taxonomyLocations: locationRecords,
    };
  }, [activityLogs, bookings, categories, classes, classesById, discounts, locations, messages, payments, templates, users, usersById]);

  const collectionRecords = recordsByCollection[selectedCollection] ?? [];
  const filteredRecords = collectionRecords.filter((record) => {
    if (!search.trim()) return true;
    const needle = search.toLowerCase();
    return record.searchText.includes(needle);
  });

  const selectedRecord = filteredRecords.find((record) => record.id === selectedRecordId)
    ?? collectionRecords.find((record) => record.id === selectedRecordId)
    ?? null;

  useEffect(() => {
    setSearch("");
    setIsCreating(false);
    setIsEditing(false);
    setEditorMode(null);
    setMutationError("");
    setMutationNotice("");
    setCustomRecordId("");
    setSelectedRecordId(recordsByCollection[selectedCollection]?.[0]?.id ?? null);
  }, [selectedCollection]);

  useEffect(() => {
    if (isCreating || pendingSelection?.collection === selectedCollection) return;
    const hasSelected = selectedRecordId && collectionRecords.some((record) => record.id === selectedRecordId);
    if (!hasSelected) {
      setSelectedRecordId(collectionRecords[0]?.id ?? null);
    }
  }, [collectionRecords, isCreating, pendingSelection, selectedCollection, selectedRecordId]);

  useEffect(() => {
    if (pendingSelection?.collection !== selectedCollection) return;
    const exists = recordsByCollection[selectedCollection].some((record) => record.id === pendingSelection.id);
    if (exists) {
      setSelectedRecordId(pendingSelection.id);
      setPendingSelection(null);
      setIsCreating(false);
      setIsEditing(false);
      setEditorMode(null);
    }
  }, [pendingSelection, recordsByCollection, selectedCollection]);

  useEffect(() => {
    if (isCreating) {
      setDraftJson(JSON.stringify(getDefaultRecord(selectedCollection, currentUser?.uid), null, 2));
      return;
    }
    if (selectedRecord) {
      setDraftJson(JSON.stringify(selectedRecord.raw, null, 2));
    } else {
      setDraftJson("");
    }
  }, [currentUser?.uid, isCreating, selectedCollection, selectedRecord]);

  const currentMeta = COLLECTION_META[selectedCollection];
  const sponsorOptions = useMemo(
    () => [{ label: "None", value: "" }, ...users.filter((user) => user.role === "sponsor").map((user) => ({ label: user.name, value: user.uid }))],
    [users]
  );
  const instructorOptions = useMemo(
    () => [{ label: "None", value: "" }, ...users.filter((user) => user.role === "staff" || user.role === "superAdmin").map((user) => ({ label: user.name, value: user.uid }))],
    [users]
  );
  const userOptions = useMemo(
    () => users.map((user) => ({ label: `${user.name} (${user.role})`, value: user.uid })),
    [users]
  );
  const classOptions = useMemo(
    () => classes.map((cls) => ({ label: cls.name, value: cls.id })),
    [classes]
  );
  const categoryOptions = useMemo(
    () => [{ label: "None", value: "" }, ...categories.map((tag) => ({ label: tag.value, value: tag.value }))],
    [categories]
  );
  const locationOptions = useMemo(
    () => [{ label: "None", value: "" }, ...locations.map((tag) => ({ label: tag.value, value: tag.value }))],
    [locations]
  );
  const typedEditorConfigs = useMemo<Record<CollectionKey, TypedEditorConfig | null>>(() => ({
    users: {
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "select", options: [
          { label: "Customer", value: "customer" },
          { label: "Sponsor", value: "sponsor" },
          { label: "Staff", value: "staff" },
          { label: "Super Admin", value: "superAdmin" },
        ] },
        { key: "email", label: "Email", type: "text" },
        { key: "phone", label: "Phone", type: "text" },
        { key: "address", label: "Address", type: "textarea", fullWidth: true },
        { key: "notes", label: "Notes", type: "textarea", fullWidth: true },
        { key: "starRating", label: "Star Rating", type: "number", min: "0", step: "1" },
        { key: "totalRedemptions", label: "Total Redemptions", type: "number", min: "0", step: "1" },
        { key: "createdAt", label: "Created At", type: "datetime-local" },
        { key: "lastLoginAt", label: "Last Login", type: "datetime-local" },
      ],
      toFormValues: (raw) => ({
        name: String(raw.name ?? ""),
        role: String(raw.role ?? "customer"),
        email: String(raw.email ?? ""),
        phone: String(raw.phone ?? ""),
        address: String(raw.address ?? ""),
        notes: String(raw.notes ?? ""),
        starRating: raw.starRating == null ? "" : String(raw.starRating),
        totalRedemptions: String(raw.totalRedemptions ?? 0),
        createdAt: formatDateTimeInput(raw.createdAt),
        lastLoginAt: formatDateTimeInput(raw.lastLoginAt),
      }),
      toRecord: (values, base) => ({
        ...base,
        name: String(values.name ?? "").trim(),
        role: String(values.role ?? "customer"),
        email: nullableString(values.email ?? ""),
        phone: nullableString(values.phone ?? ""),
        address: nullableString(values.address ?? ""),
        notes: nullableString(values.notes ?? ""),
        starRating: nullableNumber(values.starRating ?? ""),
        totalRedemptions: numberOr(values.totalRedemptions ?? "0", 0),
        createdAt: parseDateTimeInput(String(values.createdAt ?? ""), Number(base.createdAt ?? Date.now())) ?? Date.now(),
        lastLoginAt: parseDateTimeInput(String(values.lastLoginAt ?? ""), null),
      }),
    },
    classesActive: {
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "category", label: "Category", type: "select", options: categoryOptions },
        { key: "date", label: "Date & Time", type: "datetime-local" },
        { key: "duration", label: "Duration (min)", type: "number", min: "0", step: "1" },
        { key: "location", label: "Location", type: "select", options: locationOptions },
        { key: "price", label: "Price", type: "number", min: "0", step: "1" },
        { key: "seatLimit", label: "Seat Limit", type: "number", min: "0", step: "1" },
        { key: "seatsBooked", label: "Seats Booked", type: "number", min: "0", step: "1" },
        { key: "sponsorId", label: "Sponsor", type: "select", options: sponsorOptions },
        { key: "instructorId", label: "Instructor", type: "select", options: instructorOptions },
        { key: "status", label: "Status", type: "select", options: [
          { label: "Upcoming", value: "upcoming" },
          { label: "Deleted", value: "deleted" },
        ] },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
      ],
      toFormValues: (raw) => ({
        name: String(raw.name ?? ""),
        category: String(raw.category ?? ""),
        date: formatDateTimeInput(raw.date),
        duration: String(raw.duration ?? 60),
        location: String(raw.location ?? ""),
        price: String(raw.price ?? 0),
        seatLimit: String(raw.seatLimit ?? 0),
        seatsBooked: String(raw.seatsBooked ?? 0),
        sponsorId: String(raw.sponsorId ?? ""),
        instructorId: String(raw.instructorId ?? ""),
        status: String(raw.status ?? "upcoming"),
        description: String(raw.description ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        name: String(values.name ?? "").trim(),
        category: String(values.category ?? ""),
        date: parseDateTimeInput(String(values.date ?? ""), Number(base.date ?? Date.now())) ?? Date.now(),
        duration: numberOr(values.duration ?? "60", 60),
        location: String(values.location ?? ""),
        price: numberOr(values.price ?? "0", 0),
        seatLimit: numberOr(values.seatLimit ?? "0", 0),
        seatsBooked: numberOr(values.seatsBooked ?? "0", 0),
        sponsorId: nullableString(values.sponsorId ?? ""),
        instructorId: nullableString(values.instructorId ?? ""),
        status: String(values.status ?? "upcoming"),
        description: String(values.description ?? ""),
      }),
    },
    classesArchived: {
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "category", label: "Category", type: "select", options: categoryOptions },
        { key: "date", label: "Date & Time", type: "datetime-local" },
        { key: "duration", label: "Duration (min)", type: "number", min: "0", step: "1" },
        { key: "location", label: "Location", type: "select", options: locationOptions },
        { key: "price", label: "Price", type: "number", min: "0", step: "1" },
        { key: "seatLimit", label: "Seat Limit", type: "number", min: "0", step: "1" },
        { key: "seatsBooked", label: "Seats Booked", type: "number", min: "0", step: "1" },
        { key: "sponsorId", label: "Sponsor", type: "select", options: sponsorOptions },
        { key: "instructorId", label: "Instructor", type: "select", options: instructorOptions },
        { key: "status", label: "Status", type: "select", options: [{ label: "Archived", value: "archived" }], disabled: true },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
      ],
      toFormValues: (raw) => ({
        name: String(raw.name ?? ""),
        category: String(raw.category ?? ""),
        date: formatDateTimeInput(raw.date),
        duration: String(raw.duration ?? 60),
        location: String(raw.location ?? ""),
        price: String(raw.price ?? 0),
        seatLimit: String(raw.seatLimit ?? 0),
        seatsBooked: String(raw.seatsBooked ?? 0),
        sponsorId: String(raw.sponsorId ?? ""),
        instructorId: String(raw.instructorId ?? ""),
        status: String(raw.status ?? "archived"),
        description: String(raw.description ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        name: String(values.name ?? "").trim(),
        category: String(values.category ?? ""),
        date: parseDateTimeInput(String(values.date ?? ""), Number(base.date ?? Date.now())) ?? Date.now(),
        duration: numberOr(values.duration ?? "60", 60),
        location: String(values.location ?? ""),
        price: numberOr(values.price ?? "0", 0),
        seatLimit: numberOr(values.seatLimit ?? "0", 0),
        seatsBooked: numberOr(values.seatsBooked ?? "0", 0),
        sponsorId: nullableString(values.sponsorId ?? ""),
        instructorId: nullableString(values.instructorId ?? ""),
        description: String(values.description ?? ""),
      }),
    },
    bookings: {
      fields: [
        { key: "customerId", label: "Customer", type: "select", options: userOptions },
        { key: "classId", label: "Class", type: "select", options: classOptions },
        { key: "status", label: "Status", type: "select", options: [
          { label: "Reserved", value: "reserved" },
          { label: "Paid", value: "paid" },
          { label: "Transferred", value: "transferred" },
        ] },
        { key: "amount", label: "Amount (cents)", type: "number", min: "0", step: "1" },
        { key: "createdAt", label: "Created At", type: "datetime-local" },
        { key: "createdBy", label: "Created By", type: "text" },
        { key: "transferType", label: "Transfer Type", type: "select", options: [
          { label: "None", value: "" },
          { label: "Date", value: "date" },
          { label: "Customer", value: "customer" },
        ] },
        { key: "transferredFrom", label: "Transferred From", type: "text" },
        { key: "transferredTo", label: "Transferred To", type: "text" },
      ],
      toFormValues: (raw) => ({
        customerId: String(raw.customerId ?? ""),
        classId: String(raw.classId ?? ""),
        status: String(raw.status ?? "reserved"),
        amount: String(raw.amount ?? 0),
        createdAt: formatDateTimeInput(raw.createdAt),
        createdBy: String(raw.createdBy ?? ""),
        transferType: String(raw.transferType ?? ""),
        transferredFrom: String(raw.transferredFrom ?? ""),
        transferredTo: String(raw.transferredTo ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        customerId: String(values.customerId ?? ""),
        classId: String(values.classId ?? ""),
        status: String(values.status ?? "reserved"),
        amount: numberOr(values.amount ?? "0", 0),
        createdAt: parseDateTimeInput(String(values.createdAt ?? ""), Number(base.createdAt ?? Date.now())) ?? Date.now(),
        createdBy: nullableString(values.createdBy ?? ""),
        transferType: nullableString(values.transferType ?? ""),
        transferredFrom: nullableString(values.transferredFrom ?? ""),
        transferredTo: nullableString(values.transferredTo ?? ""),
      }),
    },
    discounts: {
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "sponsorId", label: "Sponsor", type: "select", options: sponsorOptions },
        { key: "estimatedValue", label: "Estimated Value (cents)", type: "number", min: "0", step: "1" },
        { key: "expiresAt", label: "Expires At", type: "datetime-local" },
        { key: "status", label: "Status", type: "select", options: [
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ] },
        { key: "appliesToAll", label: "Applies To All Classes", type: "checkbox", fullWidth: true },
        { key: "appliesToClasses", label: "Class IDs", type: "textarea", fullWidth: true, helperText: "Enter one class ID per line or separate them with commas." },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
      ],
      toFormValues: (raw) => ({
        title: String(raw.title ?? ""),
        sponsorId: String(raw.sponsorId ?? ""),
        estimatedValue: String(raw.estimatedValue ?? 0),
        expiresAt: formatDateTimeInput(raw.expiresAt),
        status: String(raw.status ?? "active"),
        appliesToAll: booleanValue(raw.appliesToAll),
        appliesToClasses: listToText(raw.appliesToClasses),
        description: String(raw.description ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        title: String(values.title ?? "").trim(),
        sponsorId: String(values.sponsorId ?? ""),
        estimatedValue: numberOr(values.estimatedValue ?? "0", 0),
        expiresAt: parseDateTimeInput(String(values.expiresAt ?? ""), Number(base.expiresAt ?? Date.now())) ?? Date.now(),
        status: String(values.status ?? "active"),
        appliesToAll: booleanValue(values.appliesToAll),
        appliesToClasses: booleanValue(values.appliesToAll) ? [] : textToList(values.appliesToClasses ?? ""),
        description: String(values.description ?? ""),
      }),
    },
    messages: {
      fields: [
        { key: "subject", label: "Subject", type: "text" },
        { key: "channel", label: "Channel", type: "select", options: [
          { label: "Email", value: "email" },
          { label: "SMS", value: "sms" },
          { label: "Push", value: "push" },
        ] },
        { key: "recipientType", label: "Recipient Type", type: "select", options: [
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Class", value: "class" },
          { label: "Single", value: "single" },
        ] },
        { key: "recipientId", label: "Recipient ID", type: "text" },
        { key: "recipientCount", label: "Recipient Count", type: "number", min: "0", step: "1" },
        { key: "status", label: "Status", type: "select", options: [
          { label: "Sent", value: "sent" },
          { label: "Scheduled", value: "scheduled" },
          { label: "Failed", value: "failed" },
        ] },
        { key: "scheduledAt", label: "Scheduled At", type: "datetime-local" },
        { key: "sentAt", label: "Sent At", type: "datetime-local" },
        { key: "body", label: "Body", type: "textarea", fullWidth: true },
      ],
      toFormValues: (raw) => ({
        subject: String(raw.subject ?? ""),
        channel: String(raw.channel ?? "email"),
        recipientType: String(raw.recipientType ?? "all"),
        recipientId: String(raw.recipientId ?? ""),
        recipientCount: String(raw.recipientCount ?? 0),
        status: String(raw.status ?? "sent"),
        scheduledAt: formatDateTimeInput(raw.scheduledAt),
        sentAt: formatDateTimeInput(raw.sentAt),
        body: String(raw.body ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        subject: nullableString(values.subject ?? ""),
        channel: String(values.channel ?? "email"),
        recipientType: String(values.recipientType ?? "all"),
        recipientId: nullableString(values.recipientId ?? ""),
        recipientCount: numberOr(values.recipientCount ?? "0", 0),
        status: String(values.status ?? "sent"),
        scheduledAt: parseDateTimeInput(String(values.scheduledAt ?? ""), null),
        sentAt: parseDateTimeInput(String(values.sentAt ?? ""), null),
        body: String(values.body ?? ""),
      }),
    },
    payments: null,
    activityLog: null,
    classTemplates: {
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "defaultCategory", label: "Default Category", type: "select", options: categoryOptions },
        { key: "defaultLocation", label: "Default Location", type: "select", options: locationOptions },
        { key: "price", label: "Price", type: "number", min: "0", step: "1" },
        { key: "seatLimit", label: "Seat Limit", type: "number", min: "0", step: "1" },
        { key: "duration", label: "Duration (min)", type: "number", min: "0", step: "1" },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
      ],
      toFormValues: (raw) => ({
        name: String(raw.name ?? ""),
        defaultCategory: String(raw.defaultCategory ?? ""),
        defaultLocation: String(raw.defaultLocation ?? ""),
        price: String(raw.price ?? 0),
        seatLimit: String(raw.seatLimit ?? 20),
        duration: String(raw.duration ?? 60),
        description: String(raw.description ?? ""),
      }),
      toRecord: (values, base) => ({
        ...base,
        name: String(values.name ?? "").trim(),
        defaultCategory: String(values.defaultCategory ?? ""),
        defaultLocation: String(values.defaultLocation ?? ""),
        price: numberOr(values.price ?? "0", 0),
        seatLimit: numberOr(values.seatLimit ?? "20", 20),
        duration: numberOr(values.duration ?? "60", 60),
        description: String(values.description ?? ""),
      }),
    },
    taxonomyCategories: {
      fields: [{ key: "value", label: "Category Value", type: "text" }],
      toFormValues: (raw) => ({ value: String(raw.value ?? "") }),
      toRecord: (values, base) => ({ ...base, value: String(values.value ?? "").trim() }),
    },
    taxonomyLocations: {
      fields: [{ key: "value", label: "Location Value", type: "text" }],
      toFormValues: (raw) => ({ value: String(raw.value ?? "") }),
      toRecord: (values, base) => ({ ...base, value: String(values.value ?? "").trim() }),
    },
  }), [categories, categoryOptions, classOptions, classes, instructorOptions, locationOptions, locations, sponsorOptions, userOptions, users]);
  const currentTypedConfig = typedEditorConfigs[selectedCollection];

  useEffect(() => {
    if (!currentTypedConfig) {
      setTypedFormValues({});
      return;
    }

    const source = isCreating
      ? getDefaultRecord(selectedCollection, currentUser?.uid)
      : selectedRecord?.raw;

    if (!source) {
      setTypedFormValues({});
      return;
    }

    setTypedFormValues(currentTypedConfig.toFormValues(source));
  }, [currentTypedConfig, currentUser?.uid, isCreating, selectedCollection, selectedRecord]);

  useEffect(() => {
    if (!currentTypedConfig || !(isCreating || editorMode === "typed")) return;
    const base = isCreating
      ? getDefaultRecord(selectedCollection, currentUser?.uid)
      : selectedRecord?.raw;
    if (!base) return;
    setDraftJson(JSON.stringify(currentTypedConfig.toRecord(typedFormValues, base), null, 2));
  }, [currentTypedConfig, currentUser?.uid, editorMode, isCreating, selectedCollection, selectedRecord, typedFormValues]);

  const relatedLinks = useMemo(() => {
    if (!selectedRecord) return [] as Array<{ label: string; collection: CollectionKey; id: string }>;

    const links: Array<{ label: string; collection: CollectionKey; id: string }> = [];
    const raw = selectedRecord.raw;

    const pushUser = (id: unknown, prefix: string) => {
      if (typeof id === "string" && usersById[id]) {
        links.push({ label: `${prefix}: ${usersById[id].name || id}`, collection: "users", id });
      }
    };

    const pushClass = (id: unknown, prefix: string) => {
      if (typeof id !== "string") return;
      if (activeClassIds.has(id)) {
        links.push({ label: `${prefix}: ${classesById[id]?.name ?? id}`, collection: "classesActive", id });
      } else if (archivedClassIds.has(id)) {
        links.push({ label: `${prefix}: ${classesById[id]?.name ?? id}`, collection: "classesArchived", id });
      }
    };

    switch (selectedCollection) {
      case "users": {
        const bookedClasses = raw.bookedClasses;
        if (bookedClasses && typeof bookedClasses === "object") {
          Object.keys(bookedClasses as Record<string, string>).slice(0, 6).forEach((classId) => {
            pushClass(classId, "Booked class");
          });
        }
        break;
      }
      case "classesActive":
      case "classesArchived":
        pushUser(raw.sponsorId, "Sponsor");
        pushUser(raw.instructorId, "Instructor");
        break;
      case "bookings":
        pushUser(raw.customerId, "Customer");
        pushClass(raw.classId, "Class");
        break;
      case "discounts":
        pushUser(raw.sponsorId, "Sponsor");
        if (Array.isArray(raw.appliesToClasses)) {
          (raw.appliesToClasses as unknown[]).forEach((classId) => pushClass(classId, "Applies to"));
        }
        break;
      case "payments":
        pushUser(raw.customerId, "Customer");
        pushClass(raw.classId, "Class");
        if (typeof raw.bookingId === "string") {
          links.push({ label: `Booking: ${raw.bookingId}`, collection: "bookings", id: raw.bookingId });
        }
        break;
      case "activityLog":
        if (typeof raw.targetId === "string") {
          const targetMap: Partial<Record<string, CollectionKey>> = {
            booking: "bookings",
            class: activeClassIds.has(raw.targetId) ? "classesActive" : "classesArchived",
            customer: "users",
            sponsor: "users",
            discount: "discounts",
            message: "messages",
            staff: "users",
          };
          const targetType = typeof raw.targetType === "string" ? raw.targetType : "";
          const targetCollection = targetMap[targetType];
          if (targetCollection) {
            links.push({ label: `${targetType}: ${raw.targetId}`, collection: targetCollection, id: raw.targetId });
          }
        }
        break;
      default:
        break;
    }

    return links;
  }, [activeClassIds, archivedClassIds, classesById, currentUser?.uid, selectedCollection, selectedRecord, usersById]);

  async function handleSave() {
    setSubmitting(true);
    setMutationError("");
    setMutationNotice("");

    try {
      const parsed = currentTypedConfig && (isCreating || editorMode === "typed")
        ? currentTypedConfig.toRecord(
            typedFormValues,
            isCreating
              ? getDefaultRecord(selectedCollection, currentUser?.uid)
              : (selectedRecord?.raw ?? {})
          )
        : parseJsonDraft(draftJson);
      let createdId: string | null = null;

      switch (selectedCollection) {
        case "users": {
          const recordId = isCreating ? customRecordId.trim() : selectedRecord?.id;
          if (!recordId) throw new Error("A record ID is required for users.");
          await adminSetRawValue(`users/${recordId}`, parsed);
          createdId = recordId;
          break;
        }
        case "classesActive": {
          if (isCreating) {
            createdId = await adminCreateChildValue("classes/active", parsed);
          } else if (selectedRecord) {
            await adminSetRawValue(selectedRecord.path, parsed);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "classesArchived": {
          if (!selectedRecord) throw new Error("Select a class to edit.");
          await adminSetRawValue(selectedRecord.path, parsed);
          createdId = selectedRecord.id;
          break;
        }
        case "bookings": {
          if (isCreating) {
            createdId = await createBooking(parsed as never);
          } else if (selectedRecord) {
            await updateBooking(selectedRecord.id, parsed as never);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "discounts": {
          if (isCreating) {
            createdId = await createDiscount(parsed as never);
          } else if (selectedRecord) {
            await updateDiscount(selectedRecord.id, parsed as never);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "messages": {
          if (isCreating) {
            createdId = await createMessage(parsed as never);
          } else if (selectedRecord) {
            await adminSetRawValue(selectedRecord.path, parsed);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "classTemplates": {
          if (isCreating) {
            createdId = await createClassTemplate(parsed as never);
          } else if (selectedRecord) {
            await updateClassTemplate(selectedRecord.id, parsed as never);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "taxonomyCategories": {
          if (isCreating) {
            const value = typeof parsed.value === "string" ? parsed.value.trim() : "";
            if (!value) throw new Error("Category value is required.");
            createdId = await addTaxonomyTag("categories", value);
          } else if (selectedRecord) {
            await adminSetRawValue(selectedRecord.path, parsed);
            createdId = selectedRecord.id;
          }
          break;
        }
        case "taxonomyLocations": {
          if (isCreating) {
            const value = typeof parsed.value === "string" ? parsed.value.trim() : "";
            if (!value) throw new Error("Location value is required.");
            createdId = await addTaxonomyTag("locations", value);
          } else if (selectedRecord) {
            await adminSetRawValue(selectedRecord.path, parsed);
            createdId = selectedRecord.id;
          }
          break;
        }
        default:
          throw new Error("This collection is read-only.");
      }

      if (createdId) {
        setPendingSelection({ collection: selectedCollection, id: createdId });
      }

      setMutationNotice(isCreating ? "Record created." : "Record saved.");
      setIsEditing(false);
      setEditorMode(null);
      if (!isCreating) setDetailTab("details");
      if (isCreating) setIsCreating(false);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchiveToggle() {
    if (!selectedRecord) return;
    setSubmitting(true);
    setMutationError("");
    setMutationNotice("");

    try {
      if (selectedCollection === "classesActive") {
        await moveClassToArchived(selectedRecord.id);
        setMutationNotice("Class archived.");
      } else if (selectedCollection === "classesArchived") {
        await unarchiveClass(selectedRecord.id);
        setMutationNotice("Class restored.");
      } else if (selectedCollection === "discounts") {
        const nextStatus = selectedRecord.raw.status === "archived" ? "active" : "archived";
        await updateDiscount(selectedRecord.id, {
          status: nextStatus,
          archivedAt: nextStatus === "archived" ? Date.now() : null,
        });
        setMutationNotice(nextStatus === "archived" ? "Discount archived." : "Discount restored.");
      }
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Archive action failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHardDelete() {
    if (!selectedRecord) return;
    const confirmed = window.confirm("Hard delete this record permanently?");
    if (!confirmed) return;

    setSubmitting(true);
    setMutationError("");
    setMutationNotice("");

    try {
      switch (selectedCollection) {
        case "users":
        case "messages":
        case "discounts":
          await adminDeleteRawValue(selectedRecord.path);
          break;
        case "classesActive":
        case "classesArchived":
          await deleteClass(selectedRecord.id);
          break;
        case "classTemplates":
          await deleteClassTemplate(selectedRecord.id);
          break;
        case "taxonomyCategories":
          await deleteTaxonomyTag("categories", selectedRecord.id);
          break;
        case "taxonomyLocations":
          await deleteTaxonomyTag("locations", selectedRecord.id);
          break;
        default:
          throw new Error("Hard delete is not available for this collection.");
      }

      setMutationNotice("Record deleted.");
      setSelectedRecordId(null);
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartCreate() {
    setIsCreating(true);
    setIsEditing(true);
    setEditorMode(currentTypedConfig ? "typed" : "json");
    setDetailTab(currentTypedConfig ? "details" : "json");
    setMutationError("");
    setMutationNotice("");
    setCustomRecordId("");
  }

  function handleCancelEdit() {
    setIsCreating(false);
    setIsEditing(false);
    setEditorMode(null);
    setMutationError("");
    setMutationNotice("");
    if (selectedRecord) {
      setDraftJson(JSON.stringify(selectedRecord.raw, null, 2));
    }
  }

  function handlePivot(collection: CollectionKey, id: string) {
    setSelectedCollection(collection);
    setSelectedRecordId(id);
    setDetailTab("details");
    setIsCreating(false);
    setIsEditing(false);
    setEditorMode(null);
  }

  if (loading) {
    return (
      <div className="p-[32px] font-sans flex items-center justify-center min-h-[300px]">
        <div className="text-[rgba(245,237,214,0.3)] text-[14px]">Loading database workspace…</div>
      </div>
    );
  }

  if (currentUser?.role !== "superAdmin") {
    return (
      <div className="p-[32px] font-sans">
        <div className="max-w-[680px] rounded-[12px] border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.08)] px-[24px] py-[22px]">
          <p className="font-display text-[24px] font-bold text-[var(--color-cream)]">Database</p>
          <p className="mt-[8px] text-[14px] text-[rgba(245,237,214,0.7)]">
            This page is restricted to the Super Admin. Staff can manage data through the dedicated admin pages, but direct database access is not available here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[32px] font-sans">
      <div className="mb-[24px] flex items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Database</h1>
          <p className="mt-[4px] max-w-[760px] text-[13px] text-[rgba(245,237,214,0.45)]">
            Super-admin workspace for browsing live database records, inspecting relationships, and performing controlled mutations on collections the current client rules allow.
          </p>
        </div>
        <span className="inline-flex rounded-full bg-[rgba(201,168,76,0.12)] px-[10px] py-[4px] text-[11px] font-semibold text-[var(--color-gold)]">
          Super Admin Only
        </span>
      </div>

      <div className="mb-[18px] grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {COLLECTION_ORDER.map((key) => {
          const isActive = key === selectedCollection;
          return (
            <button
              key={key}
              onClick={() => setSelectedCollection(key)}
              className={`rounded-[10px] border px-[14px] py-[12px] text-left transition ${
                isActive
                  ? "border-[rgba(201,168,76,0.45)] bg-[rgba(201,168,76,0.08)]"
                  : "border-[rgba(245,237,214,0.08)] bg-[var(--color-dark-surface)] hover:border-[rgba(245,237,214,0.18)]"
              }`}
            >
              <div className="flex items-center justify-between gap-[10px]">
                <span className={`text-[13px] font-semibold ${isActive ? "text-[var(--color-gold)]" : "text-[var(--color-cream)]"}`}>
                  {COLLECTION_META[key].label}
                </span>
                <span className="rounded-full bg-[rgba(245,237,214,0.06)] px-[7px] py-[2px] text-[10px] text-[rgba(245,237,214,0.5)]">
                  {recordsByCollection[key].length}
                </span>
              </div>
              <p className="mt-[6px] text-[11px] leading-relaxed text-[rgba(245,237,214,0.38)]">
                {COLLECTION_META[key].description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-[20px] xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-[12px] border border-[rgba(245,237,214,0.07)] bg-[var(--color-dark-surface)]">
          <div className="border-b border-[rgba(245,237,214,0.07)] px-[18px] py-[16px]">
            <div className="flex items-center justify-between gap-[12px]">
              <div>
                <p className="text-[15px] font-semibold text-[var(--color-cream)]">{currentMeta.label}</p>
                <p className="mt-[4px] text-[11px] text-[rgba(245,237,214,0.38)]">{currentMeta.description}</p>
              </div>
              <span className="rounded-full bg-[rgba(245,237,214,0.06)] px-[8px] py-[3px] text-[10px] text-[rgba(245,237,214,0.5)]">
                {filteredRecords.length}
              </span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${currentMeta.label.toLowerCase()}…`}
              className="mt-[14px] w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.28)] focus:outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div className="max-h-[calc(100vh-290px)] overflow-y-auto px-[10px] py-[10px]">
            {filteredRecords.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-[rgba(245,237,214,0.08)] px-[14px] py-[18px] text-center text-[12px] text-[rgba(245,237,214,0.35)]">
                No records match the current search.
              </div>
            ) : filteredRecords.map((record) => {
              const isActive = !isCreating && record.id === selectedRecordId;
              return (
                <button
                  key={`${record.collection}:${record.id}`}
                  onClick={() => {
                    setSelectedRecordId(record.id);
                    setIsCreating(false);
                    setIsEditing(false);
                    setEditorMode(null);
                    setDetailTab("details");
                    setMutationError("");
                    setMutationNotice("");
                  }}
                  className={`mb-[8px] w-full rounded-[10px] border px-[12px] py-[12px] text-left transition ${
                    isActive
                      ? "border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.08)]"
                      : "border-[rgba(245,237,214,0.06)] bg-[rgba(245,237,214,0.02)] hover:border-[rgba(245,237,214,0.14)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-[10px]">
                    <p className={`text-[13px] font-semibold ${isActive ? "text-[var(--color-gold)]" : "text-[var(--color-cream)]"}`}>
                      {record.label}
                    </p>
                    <span className="text-[10px] text-[rgba(245,237,214,0.25)]">{record.id.slice(-8)}</span>
                  </div>
                  <p className="mt-[5px] text-[11px] leading-relaxed text-[rgba(245,237,214,0.42)]">{record.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[12px] border border-[rgba(245,237,214,0.07)] bg-[var(--color-dark-surface)]">
          <div className="border-b border-[rgba(245,237,214,0.07)] px-[20px] py-[18px]">
            <div className="flex flex-wrap items-start justify-between gap-[14px]">
              <div>
                <div className="flex items-center gap-[8px]">
                  <p className="text-[18px] font-semibold text-[var(--color-cream)]">
                    {isCreating ? `New ${currentMeta.label}` : (selectedRecord?.label ?? `Select a ${currentMeta.label.slice(0, -1).toLowerCase() || "record"}`)}
                  </p>
                  {currentMeta.readOnlyReason ? (
                    <span className="rounded-full bg-[rgba(245,237,214,0.08)] px-[7px] py-[2px] text-[10px] font-semibold text-[rgba(245,237,214,0.45)]">
                      Read only
                    </span>
                  ) : null}
                </div>
                <p className="mt-[5px] text-[12px] text-[rgba(245,237,214,0.4)]">
                  {isCreating ? currentMeta.description : (selectedRecord?.subtitle ?? currentMeta.description)}
                </p>
                {selectedRecord && !isCreating ? (
                  <p className="mt-[6px] font-mono text-[11px] text-[rgba(245,237,214,0.28)]">{selectedRecord.path}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-[8px]">
                {currentMeta.createMode !== "none" ? (
                  <button
                    onClick={handleStartCreate}
                    className="rounded-[7px] bg-[var(--color-gold)] px-[12px] py-[8px] text-[12px] font-semibold text-[var(--color-dark-bg)] hover:brightness-110 transition"
                  >
                    + New Record
                  </button>
                ) : null}
                {selectedRecord && !isCreating && currentMeta.canEdit && currentTypedConfig ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditorMode("typed");
                      setDetailTab("details");
                      setMutationError("");
                      setMutationNotice("");
                    }}
                    className="rounded-[7px] border border-[rgba(245,237,214,0.12)] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.72)] hover:text-[var(--color-cream)] transition"
                  >
                    Edit Record
                  </button>
                ) : null}
                {selectedRecord && !isCreating && currentMeta.canEdit ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditorMode("json");
                      setDetailTab("json");
                      setMutationError("");
                      setMutationNotice("");
                    }}
                    className="rounded-[7px] border border-[rgba(245,237,214,0.12)] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.72)] hover:text-[var(--color-cream)] transition"
                  >
                    Edit JSON
                  </button>
                ) : null}
                {selectedRecord && currentMeta.canArchive ? (
                  <button
                    onClick={handleArchiveToggle}
                    disabled={submitting}
                    className="rounded-[7px] border border-[rgba(245,237,214,0.12)] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.72)] hover:text-[var(--color-cream)] transition disabled:opacity-50"
                  >
                    {selectedCollection === "discounts" && selectedRecord.raw.status === "archived" ? "Restore" : "Archive"}
                  </button>
                ) : null}
                {selectedRecord && currentMeta.canRestore ? (
                  <button
                    onClick={handleArchiveToggle}
                    disabled={submitting}
                    className="rounded-[7px] border border-[rgba(245,237,214,0.12)] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.72)] hover:text-[var(--color-cream)] transition disabled:opacity-50"
                  >
                    Restore
                  </button>
                ) : null}
                {selectedRecord && currentMeta.canHardDelete ? (
                  <button
                    onClick={handleHardDelete}
                    disabled={submitting}
                    className="rounded-[7px] border border-[rgba(220,38,38,0.22)] px-[12px] py-[8px] text-[12px] text-[#F87171] hover:bg-[rgba(220,38,38,0.08)] transition disabled:opacity-50"
                  >
                    Hard Delete
                  </button>
                ) : null}
              </div>
            </div>

            {currentMeta.readOnlyReason ? (
              <div className="mt-[14px] rounded-[8px] border border-[rgba(245,237,214,0.08)] bg-[rgba(245,237,214,0.04)] px-[12px] py-[10px] text-[12px] text-[rgba(245,237,214,0.48)]">
                {currentMeta.readOnlyReason}
              </div>
            ) : null}
            {currentMeta.helperText ? (
              <div className="mt-[10px] rounded-[8px] border border-[rgba(245,237,214,0.08)] bg-[rgba(245,237,214,0.04)] px-[12px] py-[10px] text-[12px] text-[rgba(245,237,214,0.48)]">
                {currentMeta.helperText}
              </div>
            ) : null}
            {mutationError ? (
              <div className="mt-[10px] rounded-[8px] border border-[rgba(220,38,38,0.24)] bg-[rgba(220,38,38,0.08)] px-[12px] py-[10px] text-[12px] text-[#F87171]">
                {mutationError}
              </div>
            ) : null}
            {mutationNotice ? (
              <div className="mt-[10px] rounded-[8px] border border-[rgba(122,174,173,0.22)] bg-[rgba(122,174,173,0.08)] px-[12px] py-[10px] text-[12px] text-[var(--color-teal)]">
                {mutationNotice}
              </div>
            ) : null}

            {(selectedRecord || isCreating) ? (
              <div className="mt-[16px] flex items-center gap-[8px]">
                <button
                  onClick={() => setDetailTab("details")}
                  className={`rounded-full px-[12px] py-[6px] text-[11px] font-medium transition ${detailTab === "details" ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[rgba(245,237,214,0.06)] text-[rgba(245,237,214,0.48)] hover:text-[rgba(245,237,214,0.72)]"}`}
                >
                  Details
                </button>
                <button
                  onClick={() => setDetailTab("json")}
                  className={`rounded-full px-[12px] py-[6px] text-[11px] font-medium transition ${detailTab === "json" ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[rgba(245,237,214,0.06)] text-[rgba(245,237,214,0.48)] hover:text-[rgba(245,237,214,0.72)]"}`}
                >
                  JSON
                </button>
              </div>
            ) : null}
          </div>

          <div className="px-[20px] py-[18px]">
            {!selectedRecord && !isCreating ? (
              <div className="rounded-[10px] border border-dashed border-[rgba(245,237,214,0.08)] px-[16px] py-[26px] text-center text-[13px] text-[rgba(245,237,214,0.35)]">
                Choose a record from the left pane to inspect it here.
              </div>
            ) : detailTab === "details" ? (
              <div className="space-y-[18px]">
                {isCreating && currentMeta.createMode === "custom" ? (
                  <div>
                    <label className="mb-[6px] block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">Record ID</label>
                    <input
                      type="text"
                      value={customRecordId}
                      onChange={(event) => setCustomRecordId(event.target.value)}
                      placeholder="Enter a custom ID"
                      className="w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.28)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                ) : null}

                {currentTypedConfig && (isCreating || isEditing || selectedRecord) ? (
                  <div className="space-y-[18px]">
                    <DatabaseTypedEditor
                      fields={currentTypedConfig.fields}
                      values={typedFormValues}
                      onChange={(fieldKey, value) => {
                        setTypedFormValues((current) => ({
                          ...current,
                          [fieldKey]: value,
                        }));
                      }}
                      readOnly={!isCreating && !isEditing}
                    />
                    {!isCreating && !isEditing && selectedRecord ? (
                      <div className="rounded-[10px] border border-[rgba(245,237,214,0.06)] bg-[rgba(245,237,214,0.02)] px-[14px] py-[14px] text-[13px] text-[rgba(245,237,214,0.5)]">
                        Typed fields are shown here for faster editing. Switch to JSON if you need raw payload control.
                      </div>
                    ) : null}
                    {(isCreating || isEditing) ? (
                      <div className="flex flex-wrap justify-end gap-[8px]">
                        <button
                          onClick={handleCancelEdit}
                          disabled={submitting}
                          className="rounded-[7px] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.55)] hover:text-[var(--color-cream)] transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={submitting}
                          className="rounded-[7px] bg-[var(--color-gold)] px-[12px] py-[8px] text-[12px] font-semibold text-[var(--color-dark-bg)] hover:brightness-110 transition disabled:opacity-50"
                        >
                          {submitting ? "Saving…" : (isCreating ? "Create Record" : "Save Changes")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : selectedRecord ? (
                  <div className="grid gap-[10px] md:grid-cols-2">
                    {Object.entries(selectedRecord.raw).map(([key, value]) => (
                      <div key={key} className="rounded-[10px] border border-[rgba(245,237,214,0.06)] bg-[rgba(245,237,214,0.02)] px-[12px] py-[11px]">
                        <p className="text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)]">{formatFieldLabel(key)}</p>
                        <p className="mt-[6px] break-words text-[13px] text-[var(--color-cream)]">{formatValue(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[10px] border border-[rgba(245,237,214,0.06)] bg-[rgba(245,237,214,0.02)] px-[14px] py-[14px] text-[13px] text-[rgba(245,237,214,0.5)]">
                    New record draft ready. Switch to JSON if you want full control before saving.
                  </div>
                )}

                {relatedLinks.length > 0 ? (
                  <div>
                    <p className="mb-[10px] text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.32)]">Related Records</p>
                    <div className="flex flex-wrap gap-[8px]">
                      {relatedLinks.map((link) => (
                        <button
                          key={`${link.collection}:${link.id}:${link.label}`}
                          onClick={() => handlePivot(link.collection, link.id)}
                          className="rounded-full bg-[rgba(201,168,76,0.08)] px-[10px] py-[6px] text-[11px] text-[var(--color-gold)] hover:brightness-110 transition"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                {isCreating && currentMeta.createMode === "custom" ? (
                  <div className="mb-[12px]">
                    <label className="mb-[6px] block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">Record ID</label>
                    <input
                      type="text"
                      value={customRecordId}
                      onChange={(event) => setCustomRecordId(event.target.value)}
                      placeholder="Enter a custom ID"
                      className="w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.28)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                ) : null}
                <textarea
                  value={draftJson}
                  onChange={(event) => setDraftJson(event.target.value)}
                  readOnly={editorMode !== "json"}
                  rows={24}
                  className="w-full rounded-[10px] border border-[rgba(245,237,214,0.08)] bg-[var(--color-dark-bg)] px-[14px] py-[14px] font-mono text-[12px] leading-relaxed text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                />
                {editorMode === "json" && (isEditing || isCreating) ? (
                  <div className="mt-[12px] flex flex-wrap justify-end gap-[8px]">
                    <button
                      onClick={handleCancelEdit}
                      disabled={submitting}
                      className="rounded-[7px] px-[12px] py-[8px] text-[12px] text-[rgba(245,237,214,0.55)] hover:text-[var(--color-cream)] transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={submitting}
                      className="rounded-[7px] bg-[var(--color-gold)] px-[12px] py-[8px] text-[12px] font-semibold text-[var(--color-dark-bg)] hover:brightness-110 transition disabled:opacity-50"
                    >
                      {submitting ? "Saving…" : (isCreating ? "Create Record" : "Save Changes")}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}