"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { BookingWithDetails } from "@/types"
import { StatusBadge } from "./BookingsTable"

/* ─── Section ──────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        className="mb-2 text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {title}
      </div>
      <div
        className="rounded-sm p-3"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 first:pt-0 last:pb-0">
      <span
        className="shrink-0 text-xs"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
      <span
        className="text-right text-xs"
        style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
      >
        {value}
      </span>
    </div>
  )
}

/* ─── Props ────────────────────────────────────────── */
interface BookingModalProps {
  booking: BookingWithDetails | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  pendingId: string | null
}

/* ─── Modal ────────────────────────────────────────── */
export default function BookingModal({
  booking,
  onClose,
  onApprove,
  onReject,
  pendingId,
}: BookingModalProps) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (booking) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [booking])

  const isPending = booking?.status === "pending"
  const isActing = pendingId === booking?.id

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-MY", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(6,20,27,0.85)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-x-4 bottom-0 top-0 z-[101] mx-auto my-auto flex max-h-[90vh] max-w-lg flex-col overflow-hidden rounded-sm"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-start justify-between gap-4 border-b p-5"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h2
                  className="text-xl font-light"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text)",
                  }}
                >
                  {booking.bride_name} & {booking.groom_name}
                </h2>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="text-xs"
                    style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.ref}
                  </span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-sm p-1.5 transition-colors hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
                aria-label="Close"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <Section title="Booking Details">
                <Row label="Event Date" value={formatDate(booking.event_date)} />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row label="Time Slot" value={booking.time_slot} />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row label="Package" value={booking.package?.name ?? "—"} />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row label="Guests" value={booking.guest_count} />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row
                  label="Total"
                  value={
                    <span style={{ color: "var(--gold)" }}>
                      RM {(booking.total_rm ?? 0).toLocaleString()}
                    </span>
                  }
                />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row
                  label="Deposit"
                  value={`RM ${(booking.deposit_rm ?? 0).toLocaleString()}`}
                />
              </Section>

              <Section title="Contact">
                <Row label="Email" value={booking.email} />
                <div
                  className="my-1.5 h-px"
                  style={{ background: "var(--border)" }}
                />
                <Row label="Phone" value={booking.phone} />
              </Section>

              {booking.addons && booking.addons.length > 0 && (
                <Section title="Add-ons">
                  {booking.addons.map((a, i) => (
                    <div key={a.id}>
                      {i > 0 && (
                        <div
                          className="my-1.5 h-px"
                          style={{ background: "var(--border)" }}
                        />
                      )}
                      <Row
                        label={a.addon?.name ?? "Add-on"}
                        value={`RM ${a.price_rm.toLocaleString()}`}
                      />
                    </div>
                  ))}
                </Section>
              )}

              {(booking.theme ||
                booking.layout_preference ||
                booking.special_requests) && (
                <Section title="Notes">
                  {booking.theme && (
                    <Row label="Theme" value={booking.theme} />
                  )}
                  {booking.layout_preference && (
                    <>
                      <div
                        className="my-1.5 h-px"
                        style={{ background: "var(--border)" }}
                      />
                      <Row label="Layout" value={booking.layout_preference} />
                    </>
                  )}
                  {booking.special_requests && (
                    <>
                      <div
                        className="my-1.5 h-px"
                        style={{ background: "var(--border)" }}
                      />
                      <Row label="Requests" value={booking.special_requests} />
                    </>
                  )}
                </Section>
              )}
            </div>

            {/* Footer actions */}
            <div
              className="flex shrink-0 items-center justify-end gap-2.5 border-t p-4"
              style={{ borderColor: "var(--border)" }}
            >
              {isPending ? (
                <>
                  <motion.button
                    onClick={() => onReject(booking.id)}
                    disabled={!!isActing}
                    whileHover={isActing ? {} : { scale: 1.03 }}
                    whileTap={isActing ? {} : { scale: 0.97 }}
                    className="flex items-center gap-1.5 rounded-sm px-4 py-2 text-xs font-medium tracking-wide transition-all disabled:opacity-50"
                    style={{
                      border: "1px solid rgba(248,113,113,0.4)",
                      background: "rgba(248,113,113,0.07)",
                      color: "#F87171",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {isActing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <XCircle size={13} strokeWidth={2} />
                    )}
                    Reject
                  </motion.button>

                  <motion.button
                    onClick={() => onApprove(booking.id)}
                    disabled={!!isActing}
                    whileHover={isActing ? {} : { scale: 1.03 }}
                    whileTap={isActing ? {} : { scale: 0.97 }}
                    className="flex items-center gap-1.5 rounded-sm px-4 py-2 text-xs font-medium tracking-wide transition-all disabled:opacity-50"
                    style={{
                      border: "1px solid rgba(45,212,191,0.4)",
                      background: "rgba(45,212,191,0.07)",
                      color: "#2DD4BF",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {isActing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={13} strokeWidth={2} />
                    )}
                    Approve
                  </motion.button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="rounded-sm px-5 py-2 text-xs tracking-wide transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
