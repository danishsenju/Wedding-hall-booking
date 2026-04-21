"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import type { BookingWithDetails } from "@/types"
import { StatusBadge } from "./BookingsTable"

/* ─── Props ────────────────────────────────────────── */
interface BookingExpandableProps {
  bookings: BookingWithDetails[]
  onView: (b: BookingWithDetails) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  pendingId: string | null
}

/* ─── Single Card ──────────────────────────────────── */
function ExpandableCard({
  booking,
  open,
  onToggle,
  onView,
  onApprove,
  onReject,
  pendingId,
}: {
  booking: BookingWithDetails
  open: boolean
  onToggle: () => void
  onView: (b: BookingWithDetails) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  pendingId: string | null
}) {
  const isActing = pendingId === booking.id
  const isPending = booking.status === "pending"

  return (
    <div
      className="overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: open ? "1px solid var(--border-hover)" : "1px solid var(--border)",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Collapsed header */}
      <button
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="truncate text-sm font-medium"
              style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
            >
              {booking.bride_name} & {booking.groom_name}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className="text-[11px]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              {booking.ref}
            </span>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="shrink-0"
        >
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            style={{ color: "var(--text-muted)" }}
          />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div
              className="space-y-2 border-t px-4 pb-4 pt-3"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Date", value: new Date(booking.event_date).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: "Slot", value: booking.time_slot },
                  { label: "Package", value: booking.package?.name ?? "—" },
                  { label: "Guests", value: booking.guest_count },
                  { label: "Total", value: `RM ${(booking.total_rm ?? 0).toLocaleString()}` },
                  { label: "Deposit", value: `RM ${(booking.deposit_rm ?? 0).toLocaleString()}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-sm p-2.5"
                    style={{ background: "var(--surface-2)" }}
                  >
                    <div
                      className="text-[10px] uppercase tracking-[0.15em]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div
                className="rounded-sm p-2.5 text-xs"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {booking.email} · {booking.phone}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {isPending && (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onApprove(booking.id)}
                      disabled={!!pendingId}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-medium tracking-wide transition-all disabled:opacity-40"
                      style={{
                        border: "1px solid rgba(45,212,191,0.35)",
                        background: "rgba(45,212,191,0.07)",
                        color: "#2DD4BF",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {isActing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={12} strokeWidth={2} />
                      )}
                      Approve
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReject(booking.id)}
                      disabled={!!pendingId}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-medium tracking-wide transition-all disabled:opacity-40"
                      style={{
                        border: "1px solid rgba(248,113,113,0.35)",
                        background: "rgba(248,113,113,0.07)",
                        color: "#F87171",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {isActing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <XCircle size={12} strokeWidth={2} />
                      )}
                      Reject
                    </motion.button>
                  </>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onView(booking)}
                  className="flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-xs tracking-wide transition-all"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Eye size={12} strokeWidth={1.5} />
                  Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Expandable List ──────────────────────────────── */
export default function BookingExpandable({
  bookings,
  onView,
  onApprove,
  onReject,
  pendingId,
}: BookingExpandableProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (bookings.length === 0) {
    return (
      <div
        className="block rounded-sm py-16 text-center md:hidden"
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
    <div className="block space-y-2 md:hidden">
      {bookings.map((booking) => (
        <ExpandableCard
          key={booking.id}
          booking={booking}
          open={openId === booking.id}
          onToggle={() =>
            setOpenId((prev) => (prev === booking.id ? null : booking.id))
          }
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          pendingId={pendingId}
        />
      ))}
    </div>
  )
}
