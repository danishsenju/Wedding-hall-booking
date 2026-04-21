"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import type { BookingWithDetails, BookingStatus } from "@/types"

/* ─── Status Badge (shared) ────────────────────────── */
export function StatusBadge({ status }: { status: BookingStatus }) {
  const CONFIG: Record<
    BookingStatus,
    { dot: string; label: string; border: string; bg: string; text: string }
  > = {
    pending: {
      dot: "#F59E0B",
      label: "Pending",
      border: "rgba(245,158,11,0.35)",
      bg: "rgba(245,158,11,0.08)",
      text: "#F59E0B",
    },
    approved: {
      dot: "#2DD4BF",
      label: "Approved",
      border: "rgba(45,212,191,0.35)",
      bg: "rgba(45,212,191,0.08)",
      text: "#2DD4BF",
    },
    rejected: {
      dot: "#F87171",
      label: "Rejected",
      border: "rgba(248,113,113,0.35)",
      bg: "rgba(248,113,113,0.08)",
      text: "#F87171",
    },
  }
  const s = CONFIG[status]

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-medium"
      style={{
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.text,
        fontFamily: "var(--font-body)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  )
}

/* ─── Props ────────────────────────────────────────── */
interface BookingsTableProps {
  bookings: BookingWithDetails[]
  onView: (b: BookingWithDetails) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  pendingId: string | null
  focusedId: string | null
  onFocusRow: (id: string | null) => void
}

const COLS = [
  "Ref",
  "Couple",
  "Date",
  "Slot",
  "Package",
  "Guests",
  "Status",
  "Actions",
]

/* ─── Table ────────────────────────────────────────── */
export default function BookingsTable({
  bookings,
  onView,
  onApprove,
  onReject,
  pendingId,
  focusedId,
  onFocusRow,
}: BookingsTableProps) {
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())

  // Keyboard shortcuts: A = approve, R = reject on focused row
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (!focusedId) return

      const booking = bookings.find((b) => b.id === focusedId)
      if (!booking || booking.status !== "pending") return

      if (e.key === "a" || e.key === "A") {
        e.preventDefault()
        onApprove(focusedId)
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        onReject(focusedId)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [focusedId, bookings, onApprove, onReject])

  if (bookings.length === 0) {
    return (
      <div
        className="hidden rounded-sm py-16 text-center md:block"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          No bookings found.
        </p>
      </div>
    )
  }

  return (
    <div
      className="hidden overflow-hidden rounded-sm md:block"
      style={{ border: "1px solid var(--border)" }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ background: "var(--surface-2)" }}>
            {COLS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em]"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, i) => {
            const isFocused = focusedId === booking.id
            const isActing = pendingId === booking.id

            return (
              <motion.tr
                key={booking.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(booking.id, el)
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                onClick={() => onFocusRow(isFocused ? null : booking.id)}
                className="cursor-pointer transition-colors"
                style={{
                  background: isFocused
                    ? "rgba(201,168,76,0.04)"
                    : "var(--surface-1)",
                  borderBottom: "1px solid var(--border)",
                  outline: isFocused ? "1px solid rgba(201,168,76,0.2)" : "none",
                  outlineOffset: "-1px",
                }}
                onMouseEnter={(e) =>
                  !isFocused &&
                  (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  !isFocused &&
                  (e.currentTarget.style.background = "var(--surface-1)")
                }
              >
                {/* Ref */}
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.ref}
                  </span>
                </td>

                {/* Couple */}
                <td className="px-4 py-3.5">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
                  >
                    {booking.bride_name} & {booking.groom_name}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.email}
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-3.5">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
                  >
                    {new Date(booking.event_date).toLocaleDateString("en-MY", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>

                {/* Slot */}
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.time_slot}
                  </span>
                </td>

                {/* Package */}
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.package?.name ?? "—"}
                  </span>
                </td>

                {/* Guests */}
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
                  >
                    {booking.guest_count}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={booking.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {booking.status === "pending" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onApprove(booking.id)}
                          disabled={!!pendingId}
                          title="Approve (A)"
                          className="flex h-7 w-7 items-center justify-center rounded-sm transition-all disabled:opacity-40"
                          style={{
                            border: "1px solid rgba(45,212,191,0.35)",
                            background: "rgba(45,212,191,0.07)",
                            color: "#2DD4BF",
                          }}
                        >
                          {isActing ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={12} strokeWidth={2} />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onReject(booking.id)}
                          disabled={!!pendingId}
                          title="Reject (R)"
                          className="flex h-7 w-7 items-center justify-center rounded-sm transition-all disabled:opacity-40"
                          style={{
                            border: "1px solid rgba(248,113,113,0.35)",
                            background: "rgba(248,113,113,0.07)",
                            color: "#F87171",
                          }}
                        >
                          {isActing ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <XCircle size={12} strokeWidth={2} />
                          )}
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onView(booking)}
                      title="View details"
                      className="flex h-7 w-7 items-center justify-center rounded-sm transition-all"
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--surface-2)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Eye size={12} strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {/* Keyboard shortcut hint */}
      {focusedId &&
        bookings.find((b) => b.id === focusedId)?.status === "pending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t px-4 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface-2)",
            }}
          >
            <p
              className="text-[10px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Keyboard:{" "}
              <kbd
                className="rounded px-1 py-0.5 text-[10px]"
                style={{ background: "var(--surface-1)", color: "var(--gold)" }}
              >
                A
              </kbd>{" "}
              Approve ·{" "}
              <kbd
                className="rounded px-1 py-0.5 text-[10px]"
                style={{ background: "var(--surface-1)", color: "#F87171" }}
              >
                R
              </kbd>{" "}
              Reject
            </p>
          </motion.div>
        )}
    </div>
  )
}
