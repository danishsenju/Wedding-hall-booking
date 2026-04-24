"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mail, Phone, Calendar, Users, ChevronDown, ChevronUp, Circle } from "lucide-react";
import { markMessageRead } from "@/app/actions/contact";
import type { ContactMessage } from "@/types";

interface Props {
  messages: ContactMessage[];
  onMessageRead: (id: string) => void;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function MessageItem({
  msg,
  onRead,
}: {
  msg: ContactMessage;
  onRead: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && !msg.is_read) {
        startTransition(async () => {
          await markMessageRead(msg.id);
          onRead(msg.id);
        });
      }
      return next;
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-sm transition-all duration-300"
      style={{
        border: `1px solid ${open ? "rgba(109,40,217,0.35)" : "var(--border)"}`,
        background: open ? "rgba(43,27,82,0.15)" : "var(--surface-3)",
      }}
    >
      {/* Header row */}
      <button
        onClick={toggle}
        className="flex w-full items-start gap-2.5 px-3 py-3 text-left"
      >
        {/* Unread dot */}
        <div className="mt-1 shrink-0">
          {!msg.is_read ? (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--gold)" }}
            />
          ) : (
            <Circle
              className="h-1.5 w-1.5 opacity-25"
              style={{ color: "var(--text-muted)" }}
              strokeWidth={2}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className="truncate text-xs font-medium"
              style={{
                color: msg.is_read ? "var(--text-muted)" : "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {msg.name}
            </span>
            <span
              className="shrink-0 text-[10px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {formatRelative(msg.created_at)}
            </span>
          </div>
          <div
            className="mt-0.5 truncate text-[10px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {msg.email}
          </div>
          {!open && (
            <div
              className="mt-1 truncate text-[10px] italic opacity-60"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {msg.message}
            </div>
          )}
        </div>

        <div className="shrink-0" style={{ color: "var(--text-muted)" }}>
          {open ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div
              className="border-t px-3 pb-3 pt-2.5"
              style={{ borderColor: "rgba(109,40,217,0.15)" }}
            >
              {/* Meta chips */}
              <div className="mb-2.5 flex flex-wrap gap-2">
                {msg.phone && (
                  <MetaChip icon={Phone} text={msg.phone} />
                )}
                {msg.event_date && (
                  <MetaChip icon={Calendar} text={msg.event_date} />
                )}
                {msg.guests && (
                  <MetaChip icon={Users} text={`${msg.guests} guests`} />
                )}
              </div>

              {/* Message body */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {msg.message}
              </p>

              {/* Reply link */}
              <a
                href={`mailto:${msg.email}?subject=Re: Your enquiry — Laman Troka`}
                className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 hover:text-[var(--text)]"
                style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
              >
                <Mail className="h-3 w-3" />
                Reply via Email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetaChip({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <span
      className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px]"
      style={{
        background: "rgba(109,40,217,0.1)",
        border: "1px solid rgba(109,40,217,0.2)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Icon className="h-2.5 w-2.5" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
      {text}
    </span>
  );
}

export default function MessagesPanel({ messages, onMessageRead }: Props) {
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div
      className="rounded-sm p-4"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Panel header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare
            className="h-3.5 w-3.5"
            style={{ color: "var(--gold)" }}
            strokeWidth={1.5}
          />
          <span
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Enquiries
          </span>
        </div>

        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[9px] font-semibold"
            style={{
              background: "var(--gold)",
              color: "#fff",
              fontFamily: "var(--font-body)",
            }}
          >
            {unread}
          </motion.span>
        )}
      </div>

      {/* Message list */}
      {messages.length === 0 ? (
        <p
          className="py-4 text-center text-[10px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          No enquiries yet
        </p>
      ) : (
        <div className="space-y-2">
          {messages.slice(0, 8).map((msg) => (
            <MessageItem key={msg.id} msg={msg} onRead={onMessageRead} />
          ))}
          {messages.length > 8 && (
            <p
              className="pt-1 text-center text-[10px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              +{messages.length - 8} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
