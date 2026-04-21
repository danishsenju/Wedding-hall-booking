"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Users, Package, MapPin, Sparkles } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { BookingWithDetails } from "@/types"

interface Props {
  ref_code: string
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" as const },
  }),
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-4 h-4 rounded" style={{ background: "var(--surface-2)" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-20 rounded" style={{ background: "var(--surface-2)" }} />
        <div className="h-4 w-40 rounded" style={{ background: "var(--surface-3)" }} />
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: React.ElementType
  label: string
  value: string
  index: number
}) {
  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <Icon
        size={16}
        className="mt-0.5 shrink-0"
        style={{ color: "var(--gold)" }}
      />
      <div>
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

export default function BookingDetails({ ref_code }: Props) {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ref_code) {
      setError("No booking reference provided.")
      setLoading(false)
      return
    }

    async function fetchBooking() {
      try {
        const res = await fetch(`/api/booking?ref=${encodeURIComponent(ref_code)}`)
        if (!res.ok) throw new Error("Booking not found")
        const data = (await res.json()) as BookingWithDetails
        setBooking(data)
      } catch {
        setError("We couldn't find this booking. Please check your reference number.")
      } finally {
        setLoading(false)
      }
    }

    void fetchBooking()
  }, [ref_code])

  if (loading) {
    return (
      <div className="space-y-1 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (error || !booking) {
    return (
      <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>
        {error ?? "Booking not found."}
      </p>
    )
  }

  const eventDate = new Date(booking.event_date + "T00:00:00")
  const formattedDate = eventDate.toLocaleDateString("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const rows = [
    { icon: Calendar, label: "Event Date", value: formattedDate },
    { icon: Clock, label: "Time Slot", value: booking.time_slot },
    { icon: Users, label: "Couple", value: `${booking.bride_name} & ${booking.groom_name}` },
    { icon: Users, label: "Guest Count", value: `${booking.guest_count} guests` },
    {
      icon: Package,
      label: "Package",
      value: booking.package?.name
        ? `${booking.package.name} — RM ${booking.package.price_rm?.toLocaleString()}`
        : "—",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: booking.venue?.name ?? "Lumières Grand Hall",
    },
  ]

  if (booking.theme) {
    rows.push({ icon: Sparkles, label: "Theme", value: booking.theme })
  }

  const addonList =
    booking.addons?.map((a) => a.addon.name).join(", ") ?? ""
  if (addonList) {
    rows.push({ icon: Sparkles, label: "Add-ons", value: addonList })
  }

  const totalRm = booking.total_rm
    ? `RM ${booking.total_rm.toLocaleString()}`
    : null
  const depositRm = booking.deposit_rm
    ? `RM ${booking.deposit_rm.toLocaleString()}`
    : null

  return (
    <div>
      {/* Venue thumbnail */}
      {booking.venue?.hero_image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-32 rounded-xl overflow-hidden mb-4"
          style={{ border: "1px solid var(--border)" }}
        >
          <Image
            src={`${booking.venue.hero_image_url}?w=600&q=75`}
            alt={booking.venue.name}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--surface-1) 0%, transparent 60%)",
            }}
          />
          <p
            className="absolute bottom-2 left-3 text-xs font-medium"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              letterSpacing: "0.08em",
            }}
          >
            {booking.venue.name}
          </p>
        </motion.div>
      )}

      {/* Ref + Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
            Booking Reference
          </p>
          <p
            className="text-base font-semibold tracking-widest"
            style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
          >
            {booking.ref}
          </p>
        </div>

        {/* Amber pending badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(217, 119, 6, 0.12)",
            border: "1px solid rgba(217, 119, 6, 0.3)",
            color: "#F59E0B",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#F59E0B" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "#F59E0B" }}
            />
          </span>
          Pending Review
        </div>
      </div>

      {/* Detail rows */}
      <div className="divide-y" style={{ borderTop: "1px solid var(--border)" }}>
        {rows.map((row, i) => (
          <DetailRow key={row.label} {...row} index={i} />
        ))}
      </div>

      {/* Totals */}
      {(totalRm || depositRm) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rows.length * 0.08 + 0.2, duration: 0.4 }}
          className="mt-4 p-4 rounded-xl space-y-2"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          {totalRm && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-muted)" }}>Total Package</span>
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                {totalRm}
              </span>
            </div>
          )}
          {depositRm && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-muted)" }}>Deposit Due</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {depositRm}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
