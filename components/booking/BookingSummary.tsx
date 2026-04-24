"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Gem, MapPin } from "lucide-react"
import { useState } from "react"
import type { Package, Vendor, Venue } from "@/types"
import { calculateDeposit, calculateVendorPrice, formatEventDate, formatRM, vendorUnitLabel } from "@/lib/utils"
import type { BookingFormValues } from "@/lib/validations"

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: "Morning · 10:00 AM – 2:00 PM",
  midday: "Mid-Day · 12:00 PM – 4:00 PM",
  afternoon: "Afternoon · 2:00 PM – 6:00 PM",
  "afternoon-eve": "Afternoon-Eve · 4:00 PM – 9:00 PM",
  evening: "Evening · 6:00 PM – 11:00 PM",
  "full-day": "Full Day · 10:00 AM – 11:00 PM",
}

interface BookingSummaryProps {
  venue: Venue | null
  packages: Package[]
  vendors: Vendor[]
  values: Partial<BookingFormValues>
}

interface SummaryRow {
  label: string
  value: string
  highlight?: boolean
}

function Row({ label, value, highlight }: SummaryRow) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span
        className="shrink-0 text-xs uppercase tracking-wider"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
      <span
        className="text-right text-sm leading-snug"
        style={{
          color: highlight ? "var(--gold)" : "var(--text)",
          fontFamily: "var(--font-body)",
          fontWeight: highlight ? 500 : 400,
        }}
      >
        {value || "—"}
      </span>
    </div>
  )
}

function Divider() {
  return (
    <div className="my-1 h-px" style={{ background: "var(--border)" }} />
  )
}

function SummaryContent({
  venue,
  packages,
  vendors,
  values,
}: BookingSummaryProps) {
  const pkg = packages.find((p) => p.id === values.package_id)
  const selectedAddons = (values.selected_addons ?? [])
    .map((id) => vendors.find((v) => v.id === id))
    .filter(Boolean) as Vendor[]

  const guestCount = parseInt(values.guest_count ?? "0", 10) || 0
  const durationHours = pkg?.duration_hours ?? 0

  const packagePrice = pkg?.price_rm ?? 0
  const addonsTotal = selectedAddons.reduce(
    (sum, v) => sum + calculateVendorPrice(v.category, v.price_rm, guestCount, durationHours),
    0
  )
  const totalPrice = packagePrice + addonsTotal
  const deposit = calculateDeposit(totalPrice)

  const coupleNames =
    values.bride_name && values.groom_name
      ? `${values.bride_name} & ${values.groom_name}`
      : values.bride_name
        ? values.bride_name
        : "—"

  const dateFormatted = values.event_date
    ? formatEventDate(values.event_date)
    : "—"

  const slotLabel = values.time_slot
    ? (TIME_SLOT_LABELS[values.time_slot] ?? values.time_slot)
    : "—"

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <MapPin size={13} style={{ color: "var(--gold)" }} />
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          {venue?.name ?? "Laman Troka"}
        </span>
      </div>

      <Divider />

      {/* Couple & Event */}
      <Row label="Couple" value={coupleNames} />
      <Row label="Date" value={dateFormatted} />
      <Row label="Slot" value={slotLabel} />
      <Row
        label="Guests"
        value={values.guest_count ? `${values.guest_count} pax` : "—"}
      />

      <Divider />

      {/* Package */}
      <Row
        label="Package"
        value={pkg ? `${pkg.name} · ${formatRM(pkg.price_rm)}` : "—"}
      />

      {/* Addons */}
      {selectedAddons.length > 0 && (
        <>
          {selectedAddons.map((addon) => {
            const total = calculateVendorPrice(addon.category, addon.price_rm, guestCount, durationHours)
            const needsMultiplier =
              (addon.category === "catering" && guestCount === 0) ||
              (addon.category === "photography" && durationHours === 0)
            return (
              <Row
                key={addon.id}
                label="+ Service"
                value={`${addon.name} · ${needsMultiplier ? vendorUnitLabel(addon.category, addon.price_rm) : formatRM(total)}`}
              />
            )
          })}
        </>
      )}

      <Divider />

      {/* Totals */}
      {packagePrice > 0 && (
        <div className="mt-1 flex items-end justify-between">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Est. Total
          </span>
          <motion.span
            key={totalPrice}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            {formatRM(totalPrice)}
          </motion.span>
        </div>
      )}

      {totalPrice > 0 && (
        <div
          className="mt-1 flex items-center justify-between pb-1 text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          <span>Deposit (30%)</span>
          <span style={{ color: "var(--text)" }}>{formatRM(deposit)}</span>
        </div>
      )}

      {/* Note */}
      <div
        className="mt-3 rounded-sm px-3 py-2 text-center text-[11px] leading-relaxed"
        style={{
          background: "rgba(109,40,217,0.06)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        <Gem
          size={10}
          className="mr-1.5 inline-block"
          style={{ color: "var(--gold)" }}
        />
        No payment required now · Subject to approval
      </div>
    </div>
  )
}

/* ─── Mobile Accordion ───────────────────────────── */
function MobileAccordion(props: BookingSummaryProps) {
  const [open, setOpen] = useState(false)

  const pkg = props.packages.find((p) => p.id === props.values.package_id)
  const guestCount = parseInt(props.values.guest_count ?? "0", 10) || 0
  const durationHours = pkg?.duration_hours ?? 0
  const addonsTotal = (props.values.selected_addons ?? [])
    .map((id) => props.vendors.find((v) => v.id === id))
    .filter(Boolean)
    .reduce((sum, v) => sum + calculateVendorPrice(v!.category, v!.price_rm, guestCount, durationHours), 0)
  const total = (pkg?.price_rm ?? 0) + addonsTotal

  return (
    <div
      className="overflow-hidden rounded-sm"
      style={{ border: "1px solid var(--border)", background: "var(--surface-1)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3"
        aria-expanded={open}
      >
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          Booking Summary
        </span>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span
              className="text-sm font-medium"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              {formatRM(total)}
            </span>
          )}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={15} style={{ color: "var(--text-muted)" }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 pb-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="pt-3">
                <SummaryContent {...props} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Desktop Sidebar ────────────────────────────── */
function DesktopSidebar(props: BookingSummaryProps) {
  return (
    <div
      className="sticky top-24 rounded-sm p-5"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="text-xs uppercase tracking-[0.22em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          Booking Summary
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <SummaryContent {...props} />
    </div>
  )
}

/* ─── Export ─────────────────────────────────────── */
export default function BookingSummary(props: BookingSummaryProps) {
  return (
    <>
      {/* Mobile accordion */}
      <div className="lg:hidden">
        <MobileAccordion {...props} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DesktopSidebar {...props} />
      </div>
    </>
  )
}
