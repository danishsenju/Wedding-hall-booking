"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Camera, Check, ChevronDown, Flower2, Info, Sparkles, Star, UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { Package, Theme, Vendor, VendorCategory } from "@/types"
import { calculateVendorPrice, formatRM, vendorUnitLabel } from "@/lib/utils"
import type { BookingFormValues } from "@/lib/validations"

/* ─── Category icon mapping ──────────────────────── */
function getIcon(category: VendorCategory): LucideIcon {
  if (category === "photography") return Camera
  if (category === "decor") return Flower2
  if (category === "catering") return UtensilsCrossed
  return Star
}

function getCategoryLabel(category: VendorCategory): string {
  if (category === "photography") return "Photography"
  if (category === "decor") return "Décor & Florals"
  if (category === "catering") return "Catering"
  return "Service"
}

/* ─── Multiplier hint ────────────────────────────── */
function MultiplierHint({
  category,
  guestCount,
  durationHours,
}: {
  category: VendorCategory
  guestCount: number
  durationHours: number
}) {
  if (category === "catering" && guestCount > 0)
    return (
      <div
        className="mt-1 flex items-center gap-1 text-[10px]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        <Info size={8} />
        × {guestCount} guests
      </div>
    )
  if (category === "photography" && durationHours > 0)
    return (
      <div
        className="mt-1 flex items-center gap-1 text-[10px]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        <Info size={8} />
        × {durationHours} hrs (package)
      </div>
    )
  return null
}

/* ─── Addon Card — Desktop ───────────────────────── */
function AddonCardDesktop({
  addon,
  selected,
  onToggle,
  guestCount,
  durationHours,
}: {
  addon: Vendor
  selected: boolean
  onToggle: () => void
  guestCount: number
  durationHours: number
}) {
  const Icon = getIcon(addon.category)
  const unitLabel = vendorUnitLabel(addon.category, addon.price_rm)
  const totalPrice = calculateVendorPrice(addon.category, addon.price_rm, guestCount, durationHours)

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full rounded-sm p-4 text-left transition-colors"
      style={{
        background: selected ? "rgba(109,40,217,0.06)" : "var(--surface-1)",
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      aria-pressed={selected}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(109,40,217,0.5), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm"
          style={{
            background: selected ? "rgba(109,40,217,0.18)" : "rgba(109,40,217,0.07)",
            transition: "background 0.2s ease",
          }}
        >
          <Icon
            size={16}
            style={{
              color: selected ? "var(--gold)" : "var(--text-muted)",
              transition: "color 0.2s ease",
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-medium leading-snug"
            style={{
              color: selected ? "var(--gold)" : "var(--text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {addon.name}
          </div>
          <div
            className="mt-0.5 text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {getCategoryLabel(addon.category)}
          </div>
        </div>

        {/* Price column */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {/* Unit rate */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              color: selected ? "var(--gold)" : "var(--text)",
              fontSize: "1rem",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            {unitLabel}
          </div>

          {/* Calculated total (if multiplier applies) */}
          {(addon.category === "catering" && guestCount > 0) ||
          (addon.category === "photography" && durationHours > 0) ? (
            <div
              className="text-[10px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              = {formatRM(totalPrice)}
            </div>
          ) : null}

          {/* Checkbox */}
          <div
            className="flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
            style={{
              background: selected ? "var(--gold)" : "transparent",
              border: `1.5px solid ${selected ? "var(--gold)" : "rgba(109,40,217,0.4)"}`,
            }}
          >
            <AnimatePresence initial={false}>
              {selected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "backOut" }}
                >
                  <Check size={11} color="#06141B" strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

/* ─── Addon Card — Mobile ────────────────────────── */
function AddonCardMobile({
  addon,
  selected,
  onToggle,
  open,
  onOpenToggle,
  guestCount,
  durationHours,
}: {
  addon: Vendor
  selected: boolean
  onToggle: () => void
  open: boolean
  onOpenToggle: () => void
  guestCount: number
  durationHours: number
}) {
  const Icon = getIcon(addon.category)
  const unitLabel = vendorUnitLabel(addon.category, addon.price_rm)
  const totalPrice = calculateVendorPrice(addon.category, addon.price_rm, guestCount, durationHours)

  return (
    <div
      className="overflow-hidden rounded-sm"
      style={{
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        background: selected ? "rgba(109,40,217,0.04)" : "var(--surface-1)",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      <button
        type="button"
        onClick={onOpenToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
            style={{ background: selected ? "rgba(109,40,217,0.18)" : "rgba(109,40,217,0.07)" }}
            onClick={(e) => { e.stopPropagation(); onToggle() }}
          >
            <AnimatePresence initial={false} mode="wait">
              {selected ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <Check size={13} style={{ color: "var(--gold)" }} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Icon size={14} style={{ color: "var(--text-muted)" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span
            className="truncate text-sm font-medium"
            style={{ color: selected ? "var(--gold)" : "var(--text)", fontFamily: "var(--font-body)" }}
          >
            {addon.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span style={{ fontFamily: "var(--font-display)", color: selected ? "var(--gold)" : "var(--text)", fontSize: "0.95rem", fontWeight: 300 }}>
            {unitLabel}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p
                className="mt-3 text-xs capitalize"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {getCategoryLabel(addon.category)}
              </p>

              <MultiplierHint
                category={addon.category}
                guestCount={guestCount}
                durationHours={durationHours}
              />

              {((addon.category === "catering" && guestCount > 0) ||
                (addon.category === "photography" && durationHours > 0)) && (
                <div
                  className="mt-1 text-xs font-medium"
                  style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                >
                  Total: {formatRM(totalPrice)}
                </div>
              )}

              <motion.button
                type="button"
                onClick={onToggle}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full rounded-sm py-2 text-xs font-medium"
                style={{
                  background: selected ? "var(--gold)" : "transparent",
                  border: `1px solid ${selected ? "var(--gold)" : "rgba(109,40,217,0.4)"}`,
                  color: selected ? "#06141B" : "var(--gold)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {selected ? "Remove Service" : "Add Service"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Theme Card ─────────────────────────────────── */
function ThemeCard({
  theme,
  selected,
  onToggle,
}: {
  theme: Theme
  selected: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col overflow-hidden rounded-sm text-left"
      style={{
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        background: selected ? "rgba(109,40,217,0.06)" : "var(--surface-1)",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      aria-pressed={selected}
    >
      {/* Image */}
      <div
        className="relative h-20 w-full overflow-hidden"
        style={{ background: "var(--surface-2)" }}
      >
        {theme.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={theme.image_url}
            alt={theme.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Sparkles size={18} style={{ color: "var(--text-muted)" }} />
          </div>
        )}

        {/* Selected overlay */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-start justify-end p-1.5"
              style={{ background: "rgba(109,40,217,0.18)" }}
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: "var(--gold)" }}
              >
                <Check size={10} color="#06141B" strokeWidth={2.5} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-2">
        <div
          className="text-xs font-medium leading-snug"
          style={{
            color: selected ? "var(--gold)" : "var(--text)",
            fontFamily: "var(--font-body)",
          }}
        >
          {theme.name}
        </div>
        {theme.price_from_rm != null && (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            from RM {theme.price_from_rm.toLocaleString()}
          </div>
        )}
      </div>
    </motion.button>
  )
}

/* ─── Decor Fairy Card ───────────────────────────── */
function DecorFairyCard({
  vendor,
  themes,
  selectedThemeIds,
  onThemeToggle,
  isOpen,
  onToggle,
}: {
  vendor: Vendor
  themes: Theme[]
  selectedThemeIds: string[]
  onThemeToggle: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}) {
  const selectedCount = themes.filter((t) => selectedThemeIds.includes(t.id)).length
  const hasSelection = selectedCount > 0

  return (
    <div
      className="overflow-hidden rounded-sm"
      style={{
        border: `1px solid ${hasSelection ? "var(--gold)" : isOpen ? "rgba(109,40,217,0.35)" : "var(--border)"}`,
        background: hasSelection ? "rgba(109,40,217,0.04)" : "var(--surface-1)",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm"
            style={{
              background: hasSelection ? "rgba(109,40,217,0.18)" : "rgba(109,40,217,0.07)",
              transition: "background 0.2s ease",
            }}
          >
            <Flower2
              size={16}
              style={{
                color: hasSelection ? "var(--gold)" : "var(--text-muted)",
                transition: "color 0.2s ease",
              }}
            />
          </div>

          <div className="min-w-0">
            <div
              className="text-sm font-medium"
              style={{
                color: hasSelection ? "var(--gold)" : "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {vendor.name}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {hasSelection
                ? `${themes.find((t) => selectedThemeIds.includes(t.id))?.name ?? "Theme selected"}`
                : "Décor & Florals — choose your theme"}
            </div>
          </div>
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </button>

      {/* Theme picker */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
              {themes.length === 0 ? (
                <p
                  className="mt-4 text-center text-xs"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  No themes available at this time.
                </p>
              ) : (
                <>
                  <p
                    className="mt-3 mb-3 text-xs"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Select the theme(s) you&apos;d like for your décor.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {themes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        selected={selectedThemeIds.includes(theme.id)}
                        onToggle={() => onThemeToggle(theme.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Pricing hint banner ────────────────────────── */
function PricingHintBanner({ hasGuests, hasDuration }: { hasGuests: boolean; hasDuration: boolean }) {
  const needsGuests = !hasGuests
  const needsDuration = !hasDuration

  if (!needsGuests && !needsDuration) return null

  const hints = []
  if (needsGuests) hints.push("guest count (for catering)")
  if (needsDuration) hints.push("a package with hours (for photography)")

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-sm px-4 py-2.5 flex items-start gap-2.5"
      style={{ background: "rgba(109,40,217,0.04)", border: "1px solid rgba(109,40,217,0.1)" }}
    >
      <Info size={13} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        Totals for some services will be calculated once you&apos;ve entered your{" "}
        {hints.join(" and ")}.
      </p>
    </motion.div>
  )
}

/* ─── Step 3 ─────────────────────────────────────── */
interface Step3Props {
  form: UseFormReturn<BookingFormValues>
  vendors: Vendor[]
  packages: Package[]
  themes: Theme[]
}

export default function Step3Addons({ form, vendors, packages, themes }: Step3Props) {
  const { watch, setValue } = form
  const selectedIds = watch("selected_addons") ?? []
  const selectedThemeIds = watch("selected_themes") ?? []
  const guestCountRaw = watch("guest_count")
  const packageId = watch("package_id")
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [openDecorId, setOpenDecorId] = useState<string | null>(null)

  const guestCount = parseInt(guestCountRaw ?? "0", 10) || 0
  const selectedPackage = packages.find((p) => p.id === packageId)
  const durationHours = selectedPackage?.duration_hours ?? 0

  /* Separate decor vendors from regular vendors */
  const decorVendors = vendors.filter((v) => v.category === "decor")
  const regularVendors = vendors.filter((v) => v.category !== "decor")

  const toggleAddon = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((a) => a !== id)
      : [...selectedIds, id]
    setValue("selected_addons", next, { shouldValidate: false })
  }

  /* Single-select: clicking the same theme deselects it; clicking another replaces */
  const toggleTheme = (id: string) => {
    const isSelected = selectedThemeIds.includes(id)
    setValue("selected_themes", isSelected ? [] : [id], { shouldValidate: false })
  }

  const selectedVendors = regularVendors.filter((v) => selectedIds.includes(v.id))

  const vendorsTotal = selectedVendors.reduce(
    (sum, v) => sum + calculateVendorPrice(v.category, v.price_rm, guestCount, durationHours),
    0
  )

  const hasCatering = regularVendors.some((v) => v.category === "catering")
  const hasPhotography = regularVendors.some((v) => v.category === "photography")

  const hasAnySelection = selectedIds.length > 0 || selectedThemeIds.length > 0

  return (
    <div className="space-y-4">
      {/* ── Optional notice ── */}
      <div
        className="rounded-sm px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(109,40,217,0.04)", border: "1px solid rgba(109,40,217,0.12)" }}
      >
        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--gold)" }} />
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          All services are <span style={{ color: "var(--text)" }}>optional</span> — select what
          you&apos;d like or skip to review your booking.
        </p>
      </div>

      {/* ── Pricing hint ── */}
      <PricingHintBanner
        hasGuests={guestCount > 0 || !hasCatering}
        hasDuration={durationHours > 0 || !hasPhotography}
      />

      {vendors.length === 0 ? (
        <div
          className="rounded-sm px-6 py-12 text-center"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <p style={{ fontFamily: "var(--font-body)" }}>No services available at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* ── Regular vendors — Desktop grid ── */}
          {regularVendors.length > 0 && (
            <>
              <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
                {regularVendors.map((vendor) => (
                  <AddonCardDesktop
                    key={vendor.id}
                    addon={vendor}
                    selected={selectedIds.includes(vendor.id)}
                    onToggle={() => toggleAddon(vendor.id)}
                    guestCount={guestCount}
                    durationHours={durationHours}
                  />
                ))}
              </div>

              {/* ── Regular vendors — Mobile stack ── */}
              <div className="flex flex-col gap-2 sm:hidden">
                {regularVendors.map((vendor) => (
                  <AddonCardMobile
                    key={vendor.id}
                    addon={vendor}
                    selected={selectedIds.includes(vendor.id)}
                    onToggle={() => toggleAddon(vendor.id)}
                    open={openMobileId === vendor.id}
                    onOpenToggle={() =>
                      setOpenMobileId((prev) => (prev === vendor.id ? null : vendor.id))
                    }
                    guestCount={guestCount}
                    durationHours={durationHours}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── Decor Fairy — full-width on both breakpoints ── */}
          {decorVendors.map((vendor) => (
            <DecorFairyCard
              key={vendor.id}
              vendor={vendor}
              themes={themes}
              selectedThemeIds={selectedThemeIds}
              onThemeToggle={toggleTheme}
              isOpen={openDecorId === vendor.id}
              onToggle={() =>
                setOpenDecorId((prev) => (prev === vendor.id ? null : vendor.id))
              }
            />
          ))}
        </div>
      )}

      {/* ── Running total (regular vendors only) ── */}
      <AnimatePresence>
        {hasAnySelection && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="rounded-sm px-4 py-3 space-y-1.5"
              style={{ background: "rgba(109,40,217,0.05)", border: "1px solid var(--border)" }}
            >
              {/* Per-service breakdown */}
              {selectedVendors.map((v) => {
                const total = calculateVendorPrice(v.category, v.price_rm, guestCount, durationHours)
                const unit = vendorUnitLabel(v.category, v.price_rm)
                const isEstimate =
                  (v.category === "catering" && guestCount === 0) ||
                  (v.category === "photography" && durationHours === 0)
                return (
                  <div key={v.id} className="flex items-center justify-between text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    <span style={{ color: "var(--text-muted)" }}>{v.name}</span>
                    <span style={{ color: isEstimate ? "var(--text-muted)" : "var(--text)" }}>
                      {isEstimate ? unit : formatRM(total)}
                    </span>
                  </div>
                )
              })}

              {/* Selected theme summary */}
              {selectedThemeIds.length > 0 && (() => {
                const t = themes.find((th) => selectedThemeIds.includes(th.id))
                if (!t) return null
                return (
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Décor · {t.name}</span>
                    <span style={{ color: "var(--text)" }}>
                      {t.price_from_rm != null ? formatRM(t.price_from_rm) : "quoted"}
                    </span>
                  </div>
                )
              })()}

              {selectedVendors.length > 0 && (
                <>
                  <div className="h-px" style={{ background: "var(--border)" }} />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                    >
                      Services subtotal ({selectedIds.length})
                    </span>
                    <motion.span
                      key={vendorsTotal}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--gold)",
                        fontSize: "1.15rem",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {formatRM(vendorsTotal)}
                    </motion.span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
