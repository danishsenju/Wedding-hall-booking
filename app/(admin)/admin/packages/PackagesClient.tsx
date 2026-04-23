"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, X, Check, Loader2, Package, Calculator, UtensilsCrossed, Camera, Flower2 } from "lucide-react"
import type { Package as PkgType, Venue, Vendor } from "@/types"
import {
  createPackage,
  updatePackage,
  deletePackage,
  type PackageInput,
} from "@/app/actions/package"

/* ─── Package Form Modal ─────────────────────────── */

const EMPTY_FORM = {
  venue_id: "",
  name: "",
  price_rm: "",
  capacity_max: "",
  duration_hours: "",
}

function PackageFormModal({
  pkg,
  venues,
  onClose,
  onSave,
}: {
  pkg: PkgType | null
  venues: Venue[]
  onClose: () => void
  onSave: (p: PkgType) => void
}) {
  const isEdit = Boolean(pkg)
  const [form, setForm] = useState(
    pkg
      ? {
          venue_id: pkg.venue_id,
          name: pkg.name,
          price_rm: pkg.price_rm.toString(),
          capacity_max: pkg.capacity_max?.toString() ?? "",
          duration_hours: pkg.duration_hours?.toString() ?? "",
        }
      : { ...EMPTY_FORM, venue_id: venues[0]?.id ?? "" }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const set =
    (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload: PackageInput = {
      venue_id: form.venue_id,
      name: form.name.trim(),
      price_rm: Number(form.price_rm),
      capacity_max: form.capacity_max ? Number(form.capacity_max) : null,
      duration_hours: form.duration_hours ? Number(form.duration_hours) : null,
    }

    const result = isEdit
      ? await updatePackage(pkg!.id, payload)
      : await createPackage(payload)

    setSaving(false)
    if (!result.success || !result.data) {
      setError(result.error ?? "Failed")
      return
    }
    onSave(result.data as PkgType)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,11,16,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 32, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="text-xl font-light"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {isEdit ? "Edit Package" : "Add New Package"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 transition-colors hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Venue */}
          <div>
            <label className="label-text">Venue *</label>
            {venues.length === 0 ? (
              <p className="text-xs" style={{ color: "#f87171" }}>
                No venues found. Create a venue first in Manage Halls.
              </p>
            ) : (
              <select
                required
                value={form.venue_id}
                onChange={set("venue_id")}
                className="field"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="label-text">Package Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Silver, Gold, Platinum"
              value={form.name}
              onChange={set("name")}
              className="field"
            />
          </div>

          {/* Price */}
          <div>
            <label className="label-text">Price (RM) *</label>
            <input
              type="number"
              required
              min={1}
              placeholder="25000"
              value={form.price_rm}
              onChange={set("price_rm")}
              className="field"
            />
          </div>

          {/* Capacity + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Max Guests</label>
              <input
                type="number"
                min={0}
                placeholder="500"
                value={form.capacity_max}
                onChange={set("capacity_max")}
                className="field"
              />
            </div>
            <div>
              <label className="label-text">Duration (hours)</label>
              <input
                type="number"
                min={1}
                placeholder="8"
                value={form.duration_hours}
                onChange={set("duration_hours")}
                className="field"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || venues.length === 0}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEdit ? "Save Changes" : "Create Package"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─── Package Card ───────────────────────────────── */

function PackageCard({
  pkg,
  venueName,
  onEdit,
  onDelete,
}: {
  pkg: PkgType
  venueName: string
  onEdit: (p: PkgType) => void
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-sm p-5"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div
            className="mb-0.5 text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            {venueName}
          </div>
          <h3
            className="text-xl font-light"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {pkg.name}
          </h3>
        </div>
        <div
          className="shrink-0 rounded-sm px-3 py-1 text-sm font-medium"
          style={{
            background: "rgba(109,40,217,0.1)",
            border: "1px solid var(--border-hover)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
          }}
        >
          RM {pkg.price_rm.toLocaleString()}
        </div>
      </div>

      {/* Chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {pkg.capacity_max != null && (
          <span
            className="rounded-sm px-2 py-0.5 text-xs"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              border: "1px solid var(--border)",
            }}
          >
            Up to {pkg.capacity_max} guests
          </span>
        )}
        {pkg.duration_hours != null && (
          <span
            className="rounded-sm px-2 py-0.5 text-xs"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              border: "1px solid var(--border)",
            }}
          >
            {pkg.duration_hours}h
          </span>
        )}
      </div>

      {/* Actions */}
      {confirming ? (
        <div className="flex items-center gap-2">
          <p className="flex-1 text-xs" style={{ color: "#f87171" }}>
            Delete this package?
          </p>
          <button className="btn-secondary text-xs" onClick={() => setConfirming(false)}>
            Cancel
          </button>
          <button
            className="flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
            }}
            onClick={() => onDelete(pkg.id)}
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="btn-secondary flex flex-1 items-center justify-center gap-1.5"
            onClick={() => onEdit(pkg)}
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            className="btn-secondary flex items-center gap-1.5"
            onClick={() => setConfirming(true)}
            style={{ color: "#f87171" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Bundle Calculator ──────────────────────────── */

const VENDOR_CATS = [
  { key: "catering"    as const, label: "Catering",       icon: <UtensilsCrossed size={13} strokeWidth={1.5} /> },
  { key: "photography" as const, label: "Photography",    icon: <Camera          size={13} strokeWidth={1.5} /> },
  { key: "decor"       as const, label: "Décor & Florals", icon: <Flower2        size={13} strokeWidth={1.5} /> },
]

function vendorUnitLabel(v: Vendor): string {
  if (v.category === "catering") return ` / pax`
  if (v.category === "photography") return ` / hr`
  return ""
}

function vendorEffectivePrice(v: Vendor, pax: number, hours: number): number {
  if (v.category === "catering") return v.price_rm * pax
  if (v.category === "photography") return v.price_rm * hours
  return v.price_rm
}

function vendorBreakdownLabel(v: Vendor, pax: number, hours: number): string {
  if (v.category === "catering") return `RM ${v.price_rm.toLocaleString()} × ${pax} pax`
  if (v.category === "photography") return `RM ${v.price_rm.toLocaleString()} × ${hours} hrs`
  return ""
}

function BundleCalculator({
  packages,
  vendors,
  venueMap,
}: {
  packages: PkgType[]
  vendors: Vendor[]
  venueMap: Record<string, string>
}) {
  const [selectedPkgId, setSelectedPkgId] = useState(packages[0]?.id ?? "")
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set())
  const [discountPct, setDiscountPct] = useState(10)
  const [paxCount, setPaxCount] = useState(200)
  const [photoHours, setPhotoHours] = useState(() => {
    const pkg = packages[0]
    return pkg?.duration_hours ?? 8
  })

  const hasCatering = vendors.some((v) => v.category === "catering")
  const hasPhotography = vendors.some((v) => v.category === "photography")

  const handlePkgChange = (id: string) => {
    setSelectedPkgId(id)
    const pkg = packages.find((p) => p.id === id)
    if (pkg?.duration_hours) setPhotoHours(pkg.duration_hours)
  }

  const toggleVendor = (id: string) =>
    setSelectedVendorIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const summary = useMemo(() => {
    const pkg = packages.find((p) => p.id === selectedPkgId)
    const pkgPrice = pkg?.price_rm ?? 0
    const selectedVendors = vendors.filter((v) => selectedVendorIds.has(v.id))
    const vendorLines = selectedVendors.map((v) => ({
      vendor: v,
      effectivePrice: vendorEffectivePrice(v, paxCount, photoHours),
      breakdown: vendorBreakdownLabel(v, paxCount, photoHours),
    }))
    const vendorTotal = vendorLines.reduce((s, l) => s + l.effectivePrice, 0)
    const originalTotal = pkgPrice + vendorTotal
    const discount = Math.min(100, Math.max(0, discountPct))
    const bundlePrice = Math.round(originalTotal * (1 - discount / 100))
    const savings = originalTotal - bundlePrice
    return { pkg, pkgPrice, vendorLines, originalTotal, bundlePrice, savings, discount }
  }, [packages, vendors, selectedPkgId, selectedVendorIds, discountPct, paxCount, photoHours])

  if (vendors.length === 0) {
    return (
      <div
        className="mt-10 rounded-sm p-6 text-center"
        style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
      >
        <Calculator size={28} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Add vendors first to use the Bundle Calculator.
        </p>
      </div>
    )
  }

  return (
    <div
      className="mt-10 rounded-sm"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-6 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Calculator size={16} style={{ color: "var(--gold)" }} />
        <h2
          className="text-lg font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          Bundle Calculator
        </h2>
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          — estimate savings when bundling a package with vendors
        </span>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Left: controls */}
        <div className="space-y-5">
          {/* Select package */}
          <div>
            <label className="label-text">Select Package</label>
            {packages.length === 0 ? (
              <p className="text-xs" style={{ color: "#f87171" }}>No packages yet.</p>
            ) : (
              <select
                value={selectedPkgId}
                onChange={(e) => handlePkgChange(e.target.value)}
                className="field"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {venueMap[p.venue_id] ?? "Unknown"} (RM {p.price_rm.toLocaleString()})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vendor checkboxes by category */}
          {VENDOR_CATS.map((cat) => {
            const catVendors = vendors.filter((v) => v.category === cat.key)
            if (catVendors.length === 0) return null
            return (
              <div key={cat.key}>
                <div className="label-text flex items-center gap-1.5">
                  {cat.icon} {cat.label}
                </div>
                <div className="space-y-1.5">
                  {catVendors.map((v) => (
                    <label
                      key={v.id}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 transition-colors"
                      style={{
                        background: selectedVendorIds.has(v.id) ? "rgba(109,40,217,0.08)" : "var(--surface-2)",
                        border: `1px solid ${selectedVendorIds.has(v.id) ? "var(--border-hover)" : "var(--border)"}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVendorIds.has(v.id)}
                        onChange={() => toggleVendor(v.id)}
                        className="accent-purple-600"
                      />
                      <span className="flex-1 text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
                        {v.name}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                        RM {v.price_rm.toLocaleString()}{vendorUnitLabel(v)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Guest count — shown only when catering vendors exist */}
          {hasCatering && (
            <div>
              <label className="label-text">Guest Count (pax)</label>
              <input
                type="number"
                min={1}
                placeholder="200"
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, Number(e.target.value)))}
                className="field"
              />
            </div>
          )}

          {/* Photography hours — shown only when photography vendors exist */}
          {hasPhotography && (
            <div>
              <label className="label-text">Photography Hours</label>
              <input
                type="number"
                min={1}
                placeholder="8"
                value={photoHours}
                onChange={(e) => setPhotoHours(Math.max(1, Number(e.target.value)))}
                className="field"
              />
            </div>
          )}

          {/* Discount */}
          <div>
            <label className="label-text">Bundle Discount (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="field"
            />
          </div>
        </div>

        {/* Right: summary */}
        <div
          className="rounded-sm p-5 self-start"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <p
            className="mb-4 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Price Summary
          </p>

          {/* Package line */}
          {summary.pkg && (
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
                {summary.pkg.name} ({venueMap[summary.pkg.venue_id] ?? "Unknown"})
              </span>
              <span className="shrink-0 text-sm font-medium" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
                RM {summary.pkgPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* Vendor lines */}
          {summary.vendorLines.map(({ vendor: v, effectivePrice, breakdown }) => (
            <div key={v.id} className="mb-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  + {v.name}
                </span>
                <span className="shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  RM {effectivePrice.toLocaleString()}
                </span>
              </div>
              {breakdown && (
                <div className="text-right text-xs" style={{ color: "var(--text-muted)", opacity: 0.6, fontFamily: "var(--font-body)" }}>
                  {breakdown}
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="my-3 h-px" style={{ background: "var(--border)" }} />

          {/* Original total */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Original total
            </span>
            <span className="shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              RM {summary.originalTotal.toLocaleString()}
            </span>
          </div>

          {/* Bundle price */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <span className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
              Bundle price ({summary.discount}% off)
            </span>
            <span
              className="shrink-0 text-base font-medium"
              style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
            >
              RM {summary.bundlePrice.toLocaleString()}
            </span>
          </div>

          {/* Savings callout */}
          {summary.savings > 0 && (
            <div
              className="flex items-center justify-between rounded-sm px-4 py-3"
              style={{ background: "rgba(109,40,217,0.12)", border: "1px solid var(--border-hover)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
                ✦ You save
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
                RM {summary.savings.toLocaleString()} ({summary.discount}% off)
              </span>
            </div>
          )}

          {summary.savings === 0 && (
            <p className="text-xs text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Set a discount % to see savings.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Root Client ────────────────────────────────── */

export default function PackagesClient({
  initialPackages,
  venues,
  initialVendors,
}: {
  initialPackages: PkgType[]
  venues: Venue[]
  initialVendors: Vendor[]
}) {
  const [packages, setPackages] = useState<PkgType[]>(initialPackages)
  const [editing, setEditing] = useState<PkgType | null | "new">(null)

  const venueMap = Object.fromEntries(venues.map((v) => [v.id, v.name]))

  const handleSave = (pkg: PkgType) => {
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p.id === pkg.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = pkg
        return next
      }
      return [...prev, pkg].sort((a, b) => a.price_rm - b.price_rm)
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deletePackage(id)
    if (result.success) setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div
            className="text-xs uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Lumières Grand Hall
          </div>
          <h1
            className="mt-0.5 text-3xl font-light"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Packages
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Manage the booking packages displayed on the reservation page.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditing("new")}
          className="btn-primary flex shrink-0 items-center gap-2"
        >
          <Plus size={15} />
          Add Package
        </motion.button>
      </div>

      {/* Empty state */}
      {packages.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-sm py-20 text-center"
          style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
        >
          <Package size={36} className="mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            No packages yet. Click &ldquo;Add Package&rdquo; to create the first one.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7, fontFamily: "var(--font-body)" }}>
            Packages you add here will appear on the booking form.
          </p>
        </div>
      )}

      {/* Grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              venueName={venueMap[pkg.venue_id] ?? "Unknown venue"}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Bundle Calculator */}
      <BundleCalculator packages={packages} vendors={initialVendors} venueMap={venueMap} />

      {/* Modal */}
      <AnimatePresence>
        {editing !== null && (
          <PackageFormModal
            pkg={editing === "new" ? null : editing}
            venues={venues}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .label-text {
          display: block;
          margin-bottom: 6px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          font-family: var(--font-body);
        }
        .field {
          width: 100%;
          border-radius: 2px;
          padding: 8px 12px;
          font-size: 13px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.15s;
        }
        .field:focus {
          border-color: var(--border-hover);
        }
        .field::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }
        .btn-primary {
          border-radius: 2px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%);
          color: #ede9fe;
          font-family: var(--font-body);
          transition: opacity 0.15s;
          cursor: pointer;
          border: none;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-secondary {
          border-radius: 2px;
          padding: 8px 14px;
          font-size: 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-family: var(--font-body);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover {
          border-color: var(--border-hover);
          color: var(--text);
        }
      `}</style>
    </>
  )
}
