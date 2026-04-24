"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Download, Bell, Zap } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

import type { BookingWithDetails, BookingStatus, ContactMessage } from "@/types"
import type { AdminStats } from "@/app/actions/admin"
import { updateBookingStatus } from "@/app/actions/booking"
import { exportExcel } from "@/lib/exportExcel"
import { ToastProvider, useToast } from "@/components/admin/ToastProvider"
import StatsRow from "@/components/admin/StatsRow"
import FilterBar from "@/components/admin/FilterBar"
import BookingsTable from "@/components/admin/BookingsTable"
import BookingExpandable from "@/components/admin/BookingExpandable"
import BookingModal from "@/components/admin/BookingModal"
import TrendChart from "@/components/admin/TrendChart"
import ActivityLog, { logActivity } from "@/components/admin/ActivityLog"
import MessagesPanel from "@/components/admin/MessagesPanel"

/* ─── Dot-grid Background ──────────────────────────── */
function DotGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(109,40,217,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(109,40,217,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(10,11,16,0.95) 0%, transparent 60%)",
        }}
      />
    </div>
  )
}

/* ─── Revenue Card ─────────────────────────────────── */
function RevenueCard({ revenue, thisMonth }: { revenue: number; thisMonth: number }) {
  const [hovered, setHovered] = useState(false)
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 55, damping: 18 })
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => { if (inView) raw.set(revenue) }, [inView, revenue, raw])
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-sm p-5"
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? "rgba(109,40,217,0.45)" : "var(--border)"}`,
        transition: "border-color 0.3s",
      }}
    >
      {/* Glow orb */}
      <motion.div
        className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full"
        animate={{ opacity: hovered ? 0.5 : 0.15, scale: hovered ? 1.2 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "radial-gradient(circle, rgba(109,40,217,0.6) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />

      {/* Top shimmer line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(109,40,217,0.8), transparent)",
          transformOrigin: "center",
        }}
      />

      <div className="relative z-10">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Approved Revenue
          </span>
        </div>

        <motion.div
          className="font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          RM {display.toLocaleString()}
        </motion.div>

        <div className="mt-3 h-px" style={{ background: "var(--border)" }} />

        <div
          className="mt-2 flex items-center gap-1.5 text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ background: "#2DD4BF" }}
          />
          {thisMonth} booking{thisMonth !== 1 ? "s" : ""} this month
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Inner Dashboard ──────────────────────────────── */
type FilterValue = BookingStatus | "all"

function Dashboard({
  initialBookings,
  initialStats: _initialStats,
  initialMessages,
}: {
  initialBookings: BookingWithDetails[]
  initialStats: AdminStats
  initialMessages: ContactMessage[]
}) {
  const { toast } = useToast()

  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState<FilterValue>("all")
  const [search, setSearch] = useState("")
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null)
  const [activityRefresh, setActivityRefresh] = useState(0)
  const [newBadge, setNewBadge] = useState(0)
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [newMessageBadge, setNewMessageBadge] = useState(0)

  /* ── Filtered bookings ── */
  const filtered = useMemo(() => {
    let list = bookings
    if (filter !== "all") list = list.filter((b) => b.status === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (b) =>
          b.ref.toLowerCase().includes(q) ||
          b.bride_name.toLowerCase().includes(q) ||
          b.groom_name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q)
      )
    }
    return list
  }, [bookings, filter, search])

  /* ── Recalculate stats from live bookings ── */
  const liveStats = useMemo<AdminStats>(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    totalRevenue: bookings
      .filter((b) => b.status === "approved")
      .reduce((s, b) => s + (b.total_rm ?? 0), 0),
    thisMonthBookings: bookings.filter(
      (b) =>
        b.created_at >=
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    ).length,
  }), [bookings])

  /* ── Supabase realtime ── */
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return

    const client = createClient(supabaseUrl, supabaseKey)
    const channel = client
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const nb = payload.new as BookingWithDetails
            setBookings((prev) => [nb, ...prev])
            setNewBadge((n) => n + 1)
            toast(`New booking: ${nb.ref}`, "info")
          }
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as BookingWithDetails
            setBookings((prev) =>
              prev.map((b) =>
                b.id === updated.id ? { ...b, ...updated } : b
              )
            )
          }
          if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string }
            setBookings((prev) => prev.filter((b) => b.id !== deleted.id))
          }
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [toast])

  /* ── Contact messages realtime ── */
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return

    const client = createClient(supabaseUrl, supabaseKey)
    const channel = client
      .channel("admin-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          const msg = payload.new as ContactMessage
          setMessages((prev) => [msg, ...prev])
          setNewMessageBadge((n) => n + 1)
          toast(`New enquiry from ${msg.name}`, "info")
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [toast])

  /* ── Tab title notification ── */
  useEffect(() => {
    if (newBadge > 0) {
      document.title = `(${newBadge}) New — Laman Troka Admin`
    } else {
      document.title = "Laman Troka Admin"
    }
  }, [newBadge])

  /* ── Clear badge on focus ── */
  useEffect(() => {
    function onFocus() { setNewBadge(0) }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  /* ── Approve / Reject ── */
  const handleAction = useCallback(
    async (id: string, action: "approved" | "rejected") => {
      if (pendingId) return
      setPendingId(id)

      const booking = bookings.find((b) => b.id === id)
      const result = await updateBookingStatus(id, action)

      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: action } : b))
        )
        if (selectedBooking?.id === id) {
          setSelectedBooking((prev) =>
            prev ? { ...prev, status: action } : prev
          )
        }
        toast(
          `Booking ${booking?.ref ?? id} ${action}.`,
          action === "approved" ? "approve" : "reject"
        )
        if (booking) {
          logActivity({
            action,
            ref: booking.ref,
            couple: `${booking.bride_name} & ${booking.groom_name}`,
          })
          setActivityRefresh((n) => n + 1)
        }
      } else {
        toast(result.error ?? "Action failed. Try again.", "info")
      }

      setPendingId(null)
    },
    [pendingId, bookings, selectedBooking, toast]
  )

  const handleApprove = useCallback(
    (id: string) => handleAction(id, "approved"),
    [handleAction]
  )
  const handleReject = useCallback(
    (id: string) => handleAction(id, "rejected"),
    [handleAction]
  )

  const handleMessageRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    )
    setNewMessageBadge((n) => Math.max(0, n - 1))
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: "var(--base)" }}>
      <DotGrid />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <motion.div
                className="h-1.5 w-1.5 rounded-full"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "#2DD4BF" }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Laman Troka · Live
              </span>
            </div>
            <h1
              className="font-light leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text)",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                letterSpacing: "0.04em",
              }}
            >
              Admin Dashboard
            </h1>
            <p
              className="mt-1 text-[11px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {liveStats.pending > 0
                ? `${liveStats.pending} booking${liveStats.pending !== 1 ? "s" : ""} awaiting review`
                : "All bookings up to date"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {newMessageBadge > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs"
                style={{
                  background: "rgba(109,40,217,0.12)",
                  border: "1px solid rgba(109,40,217,0.4)",
                  color: "var(--gold)",
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 0 10px rgba(109,40,217,0.18)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                >
                  <Bell size={12} strokeWidth={2} />
                </motion.div>
                {newMessageBadge} enquir{newMessageBadge !== 1 ? "ies" : "y"}
              </motion.div>
            )}

            {newBadge > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs"
                style={{
                  background: "rgba(109,40,217,0.15)",
                  border: "1px solid rgba(109,40,217,0.45)",
                  color: "var(--gold)",
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 0 12px rgba(109,40,217,0.2)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                >
                  <Bell size={12} strokeWidth={2} />
                </motion.div>
                {newBadge} new
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03, borderColor: "rgba(109,40,217,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => exportExcel(filtered)}
              className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs tracking-wide"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface-1)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Download size={13} strokeWidth={1.5} />
              Export Excel
            </motion.button>

            {liveStats.pending > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#F59E0B",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Zap size={12} strokeWidth={2} />
                {liveStats.pending} pending
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-6">
          <StatsRow stats={liveStats} />
        </div>

        {/* Two-column: main + sidebar */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main column */}
          <div className="flex-1 space-y-4">
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              count={filtered.length}
            />

            <BookingsTable
              bookings={filtered}
              onView={setSelectedBooking}
              onApprove={handleApprove}
              onReject={handleReject}
              pendingId={pendingId}
              focusedId={focusedRowId}
              onFocusRow={setFocusedRowId}
            />

            <BookingExpandable
              bookings={filtered}
              onView={setSelectedBooking}
              onApprove={handleApprove}
              onReject={handleReject}
              pendingId={pendingId}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full space-y-4 lg:w-64 xl:w-72">
            <TrendChart bookings={bookings} />
            <ActivityLog refreshToken={activityRefresh} />
            <MessagesPanel messages={messages} onMessageRead={handleMessageRead} />
            <RevenueCard revenue={liveStats.totalRevenue} thisMonth={liveStats.thisMonthBookings} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <BookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        pendingId={pendingId}
      />
    </div>
  )
}

/* ─── Exported wrapper (provides Toast context) ────── */
export default function DashboardClient({
  initialBookings,
  initialStats,
  initialMessages,
}: {
  initialBookings: BookingWithDetails[]
  initialStats: AdminStats
  initialMessages: ContactMessage[]
}) {
  return (
    <ToastProvider>
      <Dashboard
        initialBookings={initialBookings}
        initialStats={initialStats}
        initialMessages={initialMessages}
      />
    </ToastProvider>
  )
}
