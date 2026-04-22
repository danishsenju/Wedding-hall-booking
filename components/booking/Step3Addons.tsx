"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, Tag } from "lucide-react"
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { Addon } from "@/types"
import { formatRM } from "@/lib/utils"
import type { BookingFormValues } from "@/lib/validations"

/* ─── Addon Card — Desktop toggle ────────────────── */
function AddonCardDesktop({
  addon,
  selected,
  onToggle,
  savings,
}: {
  addon: Addon
  selected: boolean
  onToggle: () => void
  savings: number
}) {
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
      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors"
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
          {addon.description && (
            <div
              className="mt-1 text-xs leading-relaxed"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {addon.description}
            </div>
          )}

          {savings > 0 && (
            <div
              className="mt-1.5 flex items-center gap-1 text-[10px]"
              style={{ color: "rgba(74,222,128,0.8)", fontFamily: "var(--font-body)" }}
            >
              <Tag size={9} />
              Save {formatRM(savings)} vs. booking separately
            </div>
          )}
        </div>

        <div
          className="shrink-0 text-right"
          style={{
            fontFamily: "var(--font-display)",
            color: selected ? "var(--gold)" : "var(--text)",
            fontSize: "1.1rem",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          {formatRM(addon.price_rm)}
        </div>
      </div>
    </motion.button>
  )
}

/* ─── Addon Card — Mobile expandable ─────────────── */
function AddonCardMobile({
  addon,
  selected,
  onToggle,
  open,
  onOpenToggle,
  savings,
}: {
  addon: Addon
  selected: boolean
  onToggle: () => void
  open: boolean
  onOpenToggle: () => void
  savings: number
}) {
  return (
    <div
      className="overflow-hidden rounded-sm"
      style={{
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        background: selected ? "rgba(109,40,217,0.04)" : "var(--surface-1)",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={onOpenToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Checkbox */}
          <div
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors"
            style={{
              background: selected ? "var(--gold)" : "transparent",
              border: `1.5px solid ${selected ? "var(--gold)" : "rgba(109,40,217,0.4)"}`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
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

          <span
            className="truncate text-sm font-medium"
            style={{
              color: selected ? "var(--gold)" : "var(--text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {addon.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-display)",
              color: selected ? "var(--gold)" : "var(--text)",
              fontSize: "1rem",
              fontWeight: 300,
            }}
          >
            {formatRM(addon.price_rm)}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </motion.div>
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 pb-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {addon.description && (
                <p
                  className="mt-3 text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {addon.description}
                </p>
              )}

              {savings > 0 && (
                <div
                  className="mt-2 flex items-center gap-1 text-[10px]"
                  style={{ color: "rgba(74,222,128,0.8)", fontFamily: "var(--font-body)" }}
                >
                  <Tag size={9} />
                  Save {formatRM(savings)} vs. booking separately
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
                {selected ? "Remove Add-on" : "Add to Booking"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Step 3 ─────────────────────────────────────── */
interface Step3Props {
  form: UseFormReturn<BookingFormValues>
  addons: Addon[]
}

/* Hypothetical "separate" price markup for savings calc */
const SAVINGS_MARKUP = 1.25

export default function Step3Addons({ form, addons }: Step3Props) {
  const { watch, setValue } = form
  const selectedAddons = watch("selected_addons") ?? []
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)

  const toggleAddon = (id: string) => {
    const next = selectedAddons.includes(id)
      ? selectedAddons.filter((a) => a !== id)
      : [...selectedAddons, id]
    setValue("selected_addons", next, { shouldValidate: false })
  }

  const addonsTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price_rm, 0)

  const totalSavings = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + Math.round(a.price_rm * (SAVINGS_MARKUP - 1)), 0)

  if (addons.length === 0) {
    return (
      <div
        className="rounded-sm px-6 py-12 text-center"
        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <p style={{ fontFamily: "var(--font-body)" }}>
          No add-ons available at this time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Desktop 2-col grid ── */}
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
        {addons.map((addon) => (
          <AddonCardDesktop
            key={addon.id}
            addon={addon}
            selected={selectedAddons.includes(addon.id)}
            onToggle={() => toggleAddon(addon.id)}
            savings={Math.round(addon.price_rm * (SAVINGS_MARKUP - 1))}
          />
        ))}
      </div>

      {/* ── Mobile expandable stack ── */}
      <div className="flex flex-col gap-2 sm:hidden">
        {addons.map((addon) => (
          <AddonCardMobile
            key={addon.id}
            addon={addon}
            selected={selectedAddons.includes(addon.id)}
            onToggle={() => toggleAddon(addon.id)}
            open={openMobileId === addon.id}
            onOpenToggle={() =>
              setOpenMobileId((prev) => (prev === addon.id ? null : addon.id))
            }
            savings={Math.round(addon.price_rm * (SAVINGS_MARKUP - 1))}
          />
        ))}
      </div>

      {/* ── Running total ── */}
      <AnimatePresence>
        {selectedAddons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="rounded-sm px-4 py-3"
              style={{
                background: "rgba(109,40,217,0.05)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Add-ons subtotal ({selectedAddons.length})
                </span>
                <motion.span
                  key={addonsTotal}
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
                  {formatRM(addonsTotal)}
                </motion.span>
              </div>

              {totalSavings > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 flex items-center gap-1.5 text-xs"
                  style={{ color: "rgba(74,222,128,0.8)", fontFamily: "var(--font-body)" }}
                >
                  <Tag size={10} />
                  Saving {formatRM(totalSavings)} compared to booking separately
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
