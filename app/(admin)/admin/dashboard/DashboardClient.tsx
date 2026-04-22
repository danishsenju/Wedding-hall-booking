"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Download, Bell } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

import type { BookingWithDetails, BookingStatus } from "@/types"
import type { AdminStats } from "@/app/actions/admin"
import { updateBookingStatus } from "@/app/actions/booking"
import { ToastProvider, useToast } from "@/components/admin/ToastProvider"
import StatsRow from "@/components/admin/StatsRow"
import FilterBar from "@/components/admin/FilterBar"
import BookingsTable from "@/components/admin/BookingsTable"
import BookingExpandable from "@/components/admin/BookingExpandable"
import BookingModal from "@/components/admin/BookingModal"
import TrendChart from "@/components/admin/TrendChart"
import ActivityLog, { logActivity } from "@/components/admin/ActivityLog"

/* ─── Dot-grid Background ──────────────────────────── */
function DotGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,27,0) 0%, var(--base) 70%)",
        }}
      />
    </div>
  )
}

/* ─── Export CSV ───────────────────────────────────── */
function exportCSV(bookings: BookingWithDetails[]) {
  const headers = [
    "Ref",
    "Bride",
    "Groom",
    "Email",
    "Phone",
    "Event Date",
    "Time Slot",
    "Package",
    "Guests",
    "Total (RM)",
    "Deposit (RM)",
    "Status",
    "Created At",
  ]

  const rows = bookings.map((b) => [
    b.ref,
    b.bride_name,
    b.groom_name,
    b.email,
    b.phone,
    b.event_date,
    b.time_slot,
    b.package?.name ?? "",
    b.guest_count,
    b.total_rm ?? 0,
    b.deposit_rm ?? 0,
    b.status,
    new Date(b.created_at).toLocaleDateString("en-MY"),
  ])

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `lumieres-bookings-${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Inner Dashboard ──────────────────────────────── */
type FilterValue = BookingStatus | "all"

function Dashboard({
  initialBookings,
  initialStats: _initialStats,
}: {
  initialBookings: BookingWithDetails[]
  initialStats: AdminStats
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

  /* ── Tab title notification ── */
  useEffect(() => {
    if (newBadge > 0) {
      document.title = `(${newBadge}) New — Lumières Admin`
    } else {
      document.title = "Lumières Admin"
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

  return (
    <div className="relative min-h-screen" style={{ background: "var(--base)" }}>
      <DotGrid />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <div>
            <div
              className="text-xs uppercase tracking-[0.28em]"
              style={{
                color: "var(--gold)",
                fontFamily: "var(--font-body)",
              }}
            >
              Lumières Grand Hall
            </div>
            <h1
              className="mt-0.5 text-3xl font-light"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text)",
              }}
            >
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {newBadge > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs"
                style={{
                  background: "rgba(109,40,217,0.12)",
                  border: "1px solid var(--border-hover)",
                  color: "var(--gold)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Bell size={12} strokeWidth={2} />
                {newBadge} new
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs tracking-wide transition-all"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface-1)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Download size={13} strokeWidth={1.5} />
              Export CSV
            </motion.button>
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

            {/* Revenue card */}
            <div
              className="rounded-sm p-5"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="mb-1 text-[10px] uppercase tracking-[0.2em]"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Approved Revenue
              </div>
              <div
                className="text-2xl font-light"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold)",
                }}
              >
                RM {liveStats.totalRevenue.toLocaleString()}
              </div>
              <div
                className="mt-1 text-xs"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {liveStats.thisMonthBookings} bookings this month
              </div>
            </div>
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
}: {
  initialBookings: BookingWithDetails[]
  initialStats: AdminStats
}) {
  return (
    <ToastProvider>
      <Dashboard
        initialBookings={initialBookings}
        initialStats={initialStats}
      />
    </ToastProvider>
  )
}
