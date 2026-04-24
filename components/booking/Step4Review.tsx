"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { Package, Vendor, Venue } from "@/types"
import { createBooking } from "@/app/actions/booking"
import { calculateDeposit, calculateVendorPrice, formatEventDate, formatRM, vendorPriceBreakdown, vendorUnitLabel } from "@/lib/utils"
import type { BookingFormValues } from "@/lib/validations"

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: "Morning · 10:00 AM – 2:00 PM",
  midday: "Mid-Day · 12:00 PM – 4:00 PM",
  afternoon: "Afternoon · 2:00 PM – 6:00 PM",
  "afternoon-eve": "Afternoon-Eve · 4:00 PM – 9:00 PM",
  evening: "Evening · 6:00 PM – 11:00 PM",
  "full-day": "Full Day · 10:00 AM – 11:00 PM",
}

/* ─── Section Block ──────────────────────────────── */
function ReviewSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        className="mb-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          {title}
        </span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span
        className="shrink-0 text-xs"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
      <span
        className="text-right text-sm"
        style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
      >
        {value || "—"}
      </span>
    </div>
  )
}

function PricingRow({
  label,
  value,
  highlight,
  large,
}: {
  label: string
  value: string
  highlight?: boolean
  large?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-xs ${large ? "uppercase tracking-wider" : ""}`}
        style={{
          color: large ? "var(--text-muted)" : "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: highlight ? "var(--gold)" : "var(--text)",
          fontFamily: large ? "var(--font-display)" : "var(--font-body)",
          fontSize: large ? "1.4rem" : "0.875rem",
          fontWeight: large ? 300 : 500,
          letterSpacing: large ? "0.02em" : "0",
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ─── Submit Button ──────────────────────────────── */
function SubmitButton({
  loading,
  onClick,
}: {
  loading: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      className="relative w-full overflow-hidden rounded-sm py-4 text-sm font-semibold tracking-wide"
      style={{
        background: loading
          ? "rgba(109,40,217,0.5)"
          : "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
        color: "#EDE9FE",
        fontFamily: "var(--font-body)",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 24px rgba(109,40,217,0.28)",
      }}
      aria-busy={loading}
    >
      {/* Shimmer */}
      {!loading && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={16} />
          </motion.div>
        )}
        {loading ? "Submitting Request…" : "Submit Booking Request"}
      </span>
    </motion.button>
  )
}

/* ─── Step 4 ─────────────────────────────────────── */
interface Step4Props {
  form: UseFormReturn<BookingFormValues>
  venue: Venue | null
  packages: Package[]
  vendors: Vendor[]
}

export default function Step4Review({ form, venue, packages, vendors }: Step4Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const values = form.getValues()

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

  const slotLabel = values.time_slot
    ? (TIME_SLOT_LABELS[values.time_slot] ?? values.time_slot)
    : "—"

  const handleSubmit = async () => {
    setSubmitting(true)
    setServerError(null)

    try {
      const result = await createBooking(values)

      if (!result.success) {
        setServerError(result.error ?? "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }

      /* Confetti burst */
      try {
        const confetti = (await import("canvas-confetti")).default
        const fire = (opts: object) =>
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#6D28D9", "#7C3AED", "#4C1D95", "#EDE9FE"],
            ...opts,
          })

        fire({ angle: 60, origin: { x: 0, y: 0.65 } })
        fire({ angle: 120, origin: { x: 1, y: 0.65 } })
        setTimeout(() => fire({ angle: 90, origin: { x: 0.5, y: 0.5 } }), 200)
      } catch {
        /* confetti is non-critical */
      }

      /* Clear sessionStorage */
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("lmr_booking_form")
      }

      /* Redirect after 1.2s to let confetti play */
      setTimeout(() => {
        router.push(`/confirmation?ref=${result.data?.ref}`)
      }, 1200)
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Personal Details ── */}
      <ReviewSection title="Your Details">
        <ReviewRow
          label="Bride"
          value={values.bride_name ?? "—"}
        />
        <ReviewRow
          label="Groom"
          value={values.groom_name ?? "—"}
        />
        <ReviewRow label="Phone" value={values.phone ?? "—"} />
        <ReviewRow label="Email" value={values.email ?? "—"} />
        <ReviewRow
          label="Guests"
          value={values.guest_count ? `${values.guest_count} pax` : "—"}
        />
        {values.theme && <ReviewRow label="Theme" value={values.theme} />}
        {values.layout_preference && (
          <ReviewRow label="Layout" value={values.layout_preference} />
        )}
        {values.special_requests && (
          <ReviewRow label="Notes" value={values.special_requests} />
        )}
      </ReviewSection>

      {/* ── Event Details ── */}
      <ReviewSection title="Date & Time">
        <ReviewRow
          label="Venue"
          value={venue?.name ?? "Laman Troka"}
        />
        <ReviewRow
          label="Date"
          value={values.event_date ? formatEventDate(values.event_date) : "—"}
        />
        <ReviewRow label="Time Slot" value={slotLabel} />
        <ReviewRow
          label="Package"
          value={pkg ? `${pkg.name} Package` : "—"}
        />
      </ReviewSection>

      {/* ── Add-ons ── */}
      {selectedAddons.length > 0 && (
        <ReviewSection title="Services">
          {selectedAddons.map((addon) => {
            const total = calculateVendorPrice(addon.category, addon.price_rm, guestCount, durationHours)
            const breakdown = vendorPriceBreakdown(addon.category, addon.price_rm, guestCount, durationHours)
            const isEstimate =
              (addon.category === "catering" && guestCount === 0) ||
              (addon.category === "photography" && durationHours === 0)
            return (
              <div key={addon.id}>
                <ReviewRow
                  label={addon.name}
                  value={isEstimate ? vendorUnitLabel(addon.category, addon.price_rm) : formatRM(total)}
                />
                {breakdown && (
                  <div
                    className="text-right text-[10px] -mt-1 mb-1"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {breakdown}
                  </div>
                )}
              </div>
            )
          })}
        </ReviewSection>
      )}

      {/* ── Pricing ── */}
      <div
        className="rounded-sm p-4 space-y-2"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
        <PricingRow
          label={`${pkg?.name ?? "Package"} Package`}
          value={formatRM(packagePrice)}
        />
        {selectedAddons.map((addon) => {
          const total = calculateVendorPrice(addon.category, addon.price_rm, guestCount, durationHours)
          const isEstimate =
            (addon.category === "catering" && guestCount === 0) ||
            (addon.category === "photography" && durationHours === 0)
          return (
            <PricingRow
              key={addon.id}
              label={`+ ${addon.name}`}
              value={isEstimate ? vendorUnitLabel(addon.category, addon.price_rm) : formatRM(total)}
            />
          )
        })}

        <div
          className="my-2 h-px"
          style={{ background: "var(--border)" }}
        />

        <PricingRow
          label="Grand Total"
          value={formatRM(totalPrice)}
          highlight
          large
        />

        <div
          className="mt-2 rounded-sm px-3 py-2"
          style={{
            background: "rgba(109,40,217,0.05)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Deposit required (30%)
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
            >
              {formatRM(deposit)}
            </span>
          </div>
          <p
            className="mt-1 text-[10px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Payable only after your booking is approved. No charge now.
          </p>
        </div>
      </div>

      {/* ── Server error ── */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex items-start gap-2 overflow-hidden rounded-sm px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "rgba(239,68,68,0.9)",
              fontFamily: "var(--font-body)",
            }}
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ── */}
      <SubmitButton loading={submitting} onClick={handleSubmit} />

      <p
        className="text-center text-[11px]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        By submitting, you agree to our booking terms. No payment is collected at this stage.
      </p>
    </div>
  )
}
