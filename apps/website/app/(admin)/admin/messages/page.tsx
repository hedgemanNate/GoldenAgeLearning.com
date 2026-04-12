"use client";

import { useState, useEffect } from "react";
import TablePagination from "../../../../components/admin/TablePagination";
import { subscribeToMessages, createMessage } from "../../../../lib/firebase/db";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useAuthContext } from "../../../../context/AuthContext";
import { callSendAdminMessage } from "../../../../lib/functions/client";
import type { MessageWithId, MessageChannel } from "../../../../types/message";

type MsgChannel = "Email" | "SMS";
type MsgStatus = "Sent" | "Scheduled";

interface DisplayMessage {
  id: string;
  sentTo: string;
  channel: MsgChannel;
  subject: string;
  preview: string;
  dateValue: number;
  date: string;
  status: MsgStatus;
}

function recipientLabel(m: MessageWithId): string {
  if (m.recipientType === "all") return "All customers";
  if (m.recipientType === "active") return "Active customers";
  if (m.recipientType === "inactive") return "Inactive customers";
  if (m.recipientType === "class") return m.recipientId ?? "Class attendees";
  return m.recipientId ?? "Unknown";
}

const SMS_LIMIT = 160;

function messageDateValue(message: MessageWithId) {
  return message.sentAt ?? message.scheduledAt ?? message.createdAt;
}

export default function AdminMessages() {
  const { classes } = useAdminData();
  const { user: adminUser } = useAuthContext();
  const [rawMessages, setRawMessages] = useState<MessageWithId[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [composeOpen, setComposeOpen] = useState(false);
  const [sendTo, setSendTo] = useState("all");
  const [channel, setChannel] = useState<MsgChannel>("Email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMessages(setRawMessages);
    return () => unsub();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const messages: DisplayMessage[] = [...rawMessages]
    .sort((a, b) => messageDateValue(b) - messageDateValue(a))
    .map((m) => ({
      id: m.id,
      sentTo: recipientLabel(m),
      channel: m.channel === "sms" ? "SMS" : "Email",
      subject: m.subject ?? "",
      preview: m.body.slice(0, 100),
      dateValue: messageDateValue(m),
      date: new Date(messageDateValue(m)).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: m.status === "scheduled" ? "Scheduled" : "Sent",
    }));

  const filteredMessages = messages.filter((message) => {
    if (!search.trim()) return true;
    return message.subject.toLowerCase().includes(search.toLowerCase());
  });

  const PAGE_SIZE = 25;
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const upcomingClasses = classes.filter((c) => c.status === "upcoming").map((c) => ({ id: c.id, name: c.name }));

  function resetForm() {
    setSendTo("all"); setChannel("Email"); setSubject(""); setBody("");
    setScheduled(false); setScheduleDate(""); setSendError(""); setSendSuccess(false);
  }

  async function handleSendMessage() {
    if (!adminUser || !body.trim()) {
      setSendError("Message body is required.");
      return;
    }
    if (scheduled && !scheduleDate) {
      setSendError("Please select a schedule date.");
      return;
    }
    setSending(true);
    setSendError("");
    try {
      if (!scheduled) {
        await callSendAdminMessage({
          sendTo,
          channel: channel.toLowerCase() as "email" | "sms",
          subject: channel === "Email" ? subject || null : null,
          body,
        });
      } else {
        await createMessage({
          subject: channel === "Email" ? subject || null : null,
          body,
          channel: channel.toLowerCase() as MessageChannel,
          recipientType: sendTo === "all" ? "all" : sendTo === "active" ? "active" : "class",
          recipientId: (sendTo !== "all" && sendTo !== "active") ? sendTo : null,
          recipients: {} as Record<string, true>,
          recipientCount: 0,
          status: "scheduled",
          scheduledAt: new Date(scheduleDate).getTime(),
          sentAt: null,
          createdAt: Date.now(),
          createdBy: adminUser.uid,
        });
      }
      setSendSuccess(true);
      setTimeout(() => { setComposeOpen(false); resetForm(); }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send message.";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Messages</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Email and SMS communication history.</p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + New Message
        </button>
      </div>

      <div className="flex items-center gap-[10px] mb-[20px] flex-wrap">
        <input
          type="text"
          placeholder="Search message titles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[7px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[240px]"
        />
      </div>

      {/* Sent history */}
      <TablePagination
        currentPage={currentPage}
        totalItems={filteredMessages.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <div className="flex flex-col gap-[8px]">
        {paginatedMessages.map((m) => (
          <div key={m.id} className="bg-[var(--color-dark-surface)] rounded-[8px] px-[20px] py-[16px] flex items-center gap-[16px]">
            {/* Channel badge */}
            {m.channel === "Email" ? (
              <span className="px-[8px] py-[3px] rounded-full bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)] text-[10px] font-semibold flex-shrink-0">Email</span>
            ) : (
              <span className="px-[8px] py-[3px] rounded-full bg-[rgba(201,168,76,0.12)] text-[var(--color-gold)] text-[10px] font-semibold flex-shrink-0">SMS</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[8px]">
                {m.subject && <p className="text-[13px] font-semibold text-[var(--color-cream)] truncate">{m.subject}</p>}
                {!m.subject && <p className="text-[13px] font-semibold text-[var(--color-cream)] truncate">{m.preview}</p>}
                {m.status === "Scheduled" && (
                  <span className="px-[7px] py-[2px] rounded-full bg-[rgba(245,237,214,0.08)] text-[rgba(245,237,214,0.4)] text-[10px] font-semibold flex-shrink-0">Scheduled</span>
                )}
              </div>
              <p className="text-[11px] text-[rgba(245,237,214,0.35)] mt-[2px]">To: {m.sentTo}</p>
            </div>
            <p className="text-[12px] text-[rgba(245,237,214,0.35)] flex-shrink-0">{m.date}</p>
          </div>
        ))}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalItems={filteredMessages.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setComposeOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[500px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">New Message</h2>
              <button onClick={() => setComposeOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] space-y-[16px]">
              {/* Send to */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Send To</label>
                <select
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="all">All customers</option>
                  <option value="active">Active customers (last 45 days)</option>
                  {upcomingClasses.map((c) => <option key={c.id} value={c.id}>{c.name} — class attendees</option>)}
                </select>
              </div>

              {/* Channel toggle */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Channel</label>
                <div className="flex rounded-[6px] overflow-hidden border border-[rgba(245,237,214,0.1)]">
                  {(["Email", "SMS"] as MsgChannel[]).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={`flex-1 py-[8px] text-[12px] font-semibold transition ${channel === ch ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)]"}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject — email only */}
              {channel === "Email" && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject…"
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
              )}

              {/* Message body */}
              <div>
                <div className="flex justify-between items-center mb-[6px]">
                  <label className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">Message</label>
                  {channel === "SMS" && (
                    <span className={`text-[11px] ${body.length > SMS_LIMIT ? "text-[#F87171]" : "text-[rgba(245,237,214,0.35)]"}`}>{body.length}/{SMS_LIMIT}</span>
                  )}
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder={channel === "SMS" ? "Type your SMS message… (160 chars)" : "Type your email message…"}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[10px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                />
              </div>

              {/* Schedule toggle */}
              <div className="flex items-center gap-[10px]">
                <button
                  onClick={() => setScheduled(!scheduled)}
                  className={`w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 relative ${scheduled ? "bg-[var(--color-gold)]" : "bg-[rgba(245,237,214,0.1)]"}`}
                >
                  <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all ${scheduled ? "left-[19px]" : "left-[3px]"}`} />
                </button>
                <span className="text-[13px] text-[rgba(245,237,214,0.6)]">Schedule for later</span>
              </div>
              {scheduled && (
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                />
              )}
            </div>
            <div className="px-[24px] pb-[24px] flex flex-col gap-[10px]">
              {sendSuccess && (
                <p className="text-[12px] text-[var(--color-teal)] text-right">{scheduled ? "Message scheduled!" : "Message sent!"}</p>
              )}
              {sendError && <p className="text-[12px] text-[#E57373] text-right">{sendError}</p>}
              <div className="flex justify-end gap-[10px]">
                <button onClick={() => { setComposeOpen(false); resetForm(); }} disabled={sending} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition disabled:opacity-50">Cancel</button>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !body.trim()}
                  className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition disabled:opacity-50"
                >
                  {sending ? (scheduled ? "Scheduling…" : "Sending…") : (scheduled ? "Schedule" : "Send Now")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

