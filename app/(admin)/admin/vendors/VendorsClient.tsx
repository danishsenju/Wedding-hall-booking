"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  AtSign, Camera, Check, Flower2, Link2, Loader2,
  Pencil, Plus, Trash2, UtensilsCrossed, X,
} from "lucide-react"
import type { Vendor, VendorCategory } from "@/types"
import {
  createVendor,
  updateVendor,
  deleteVendor,
  type VendorInput,
} from "@/app/actions/vendor"

/* ─── Constants ──────────────────────────────────── */

const CATEGORIES: { key: VendorCategory; label: string; Icon: React.ElementType; color: string; bg: string }[] = [
  { key: "catering",    label: "Catering",       Icon: UtensilsCrossed, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { key: "photography", label: "Photography",     Icon: Camera,          color: "#2DD4BF", bg: "rgba(45,212,191,0.1)" },
  { key: "decor",       label: "Décor & Florals", Icon: Flower2,         color: "var(--gold)", bg: "rgba(109,40,217,0.1)" },
]

const EMPTY_FORM = { category: "catering" as VendorCategory, name: "", instagram: "", price_rm: "" }

function extractHandle(raw: string): string {
  const match = raw.match(/instagram\.com\/([^/?#]+)/)
  if (match) return match[1]
  return raw.replace(/^@/, "")
}

/* ─── Vendor Form Modal ──────────────────────────── */
function VendorFormModal({
  vendor, defaultCategory, onClose, onSave,
}: {
  vendor: Vendor | null
  defaultCategory: VendorCategory
  onClose: () => void
  onSave: (v: Vendor) => void
}) {
  const isEdit = Boolean(vendor)
  const [form, setForm] = useState(
    vendor
      ? { category: vendor.category, name: vendor.name, instagram: vendor.instagram ?? "", price_rm: vendor.price_rm.toString() }
      : { ...EMPTY_FORM, category: defaultCategory }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const cat = CATEGORIES.find((c) => c.key === form.category)!

  const set = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const rawHandle = form.instagram.trim()
    const payload: VendorInput = {
      category: form.category,
      name: form.name.trim(),
      instagram: rawHandle ? extractHandle(rawHandle) : null,
      price_rm: Number(form.price_rm),
    }
    const result = isEdit ? await updateVendor(vendor!.id, payload) : await createVendor(payload)
    setSaving(false)
    if (!result.success || !result.data) { setError(result.error ?? "Failed"); return }
    onSave(result.data as Vendor)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,11,16,0.88)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 28, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative w-full max-w-lg overflow-hidden rounded-sm"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${cat.color}88, transparent)` }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm" style={{ background: cat.bg, color: cat.color }}>
              <cat.Icon size={15} strokeWidth={1.5} />
            </div>
            <h2
              className="text-xl font-light"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {isEdit ? "Edit Vendor" : "Add New Vendor"}
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(109,40,217,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={15} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label-text">Category *</label>
            <select required value={form.category} onChange={set("category")} className="field">
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">Vendor Name *</label>
            <input type="text" required placeholder="e.g. Delicious Catering Co." value={form.name} onChange={set("name")} className="field" />
          </div>

          <div>
            <label className="label-text">Instagram Handle</label>
            <input type="text" placeholder="@handle (optional)" value={form.instagram} onChange={set("instagram")} className="field" />
          </div>

          <div>
            <label className="label-text">
              {form.category === "catering" ? "Price per Pax (RM) *" : form.category === "photography" ? "Price per Hour (RM) *" : "Fixed Price (RM) *"}
            </label>
            <input
              type="number" required min={0}
              placeholder={form.category === "catering" ? "35" : form.category === "photography" ? "800" : "5000"}
              value={form.price_rm} onChange={set("price_rm")} className="field"
            />
          </div>

          {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEdit ? "Save Changes" : "Add Vendor"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─── Vendor Card ────────────────────────────────── */
function VendorCard({ vendor, onEdit, onDelete, delay }: {
  vendor: Vendor
  onEdit: (v: Vendor) => void
  onDelete: (id: string) => void
  delay: number
}) {
  const [confirming, setConfirming] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-60, 60], [-4, 4]), { stiffness: 300, damping: 30 })

  function onMove(e: React.MouseEvent) {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - r.left - r.width / 2)
    mouseY.set(e.clientY - r.top - r.height / 2)
  }
  function onLeave() { mouseX.set(0); mouseY.set(0); setHovered(false) }

  const cat = CATEGORIES.find((c) => c.key === vendor.category)!

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ delay, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="relative"
    >
      <div
        className="relative overflow-hidden rounded-sm p-5 transition-shadow duration-300"
        style={{
          background: "var(--surface-1)",
          border: `1px solid ${hovered ? cat.color + "44" : "var(--border)"}`,
          boxShadow: hovered ? `0 8px 32px ${cat.color}18` : "none",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}
      >
        {/* Top category accent line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px"
          animate={{ scaleX: hovered ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* Radial spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}10, transparent 70%)` }}
        />

        <div className="relative z-10">
          {/* Header row */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm"
                  style={{ background: cat.bg, color: cat.color }}
                >
                  <cat.Icon size={12} strokeWidth={1.5} />
                </div>
                <span
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: cat.color, fontFamily: "var(--font-body)" }}
                >
                  {cat.label}
                </span>
              </div>
              <h3
                className="truncate text-lg font-light leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                {vendor.name}
              </h3>
              {vendor.instagram && (
                <a
                  href={`https://instagram.com/${extractHandle(vendor.instagram)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  <Link2 size={10} />
                  @{extractHandle(vendor.instagram)}
                </a>
              )}
            </div>

            {/* Price badge */}
            <div
              className="shrink-0 rounded-sm px-2.5 py-1 text-center"
              style={{ background: cat.bg, border: `1px solid ${cat.color}33` }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: cat.color, fontFamily: "var(--font-body)" }}
              >
                RM {vendor.price_rm.toLocaleString()}
              </div>
              <div
                className="text-[9px] uppercase tracking-wider"
                style={{ color: cat.color, opacity: 0.7, fontFamily: "var(--font-body)" }}
              >
                {vendor.category === "catering" ? "/ pax" : vendor.category === "photography" ? "/ hr" : "fixed"}
              </div>
            </div>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Actions */}
          <div className="mt-3">
            {confirming ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <p className="flex-1 text-xs" style={{ color: "#f87171", fontFamily: "var(--font-body)" }}>
                  Delete this vendor?
                </p>
                <button className="btn-secondary text-xs" onClick={() => setConfirming(false)}>No</button>
                <button
                  className="flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
                  onClick={() => onDelete(vendor.id)}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary flex flex-1 items-center justify-center gap-1.5"
                  onClick={() => onEdit(vendor)}
                >
                  <Pencil size={12} /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-1.5 px-3"
                  onClick={() => setConfirming(true)}
                  style={{ color: "#f87171" }}
                >
                  <Trash2 size={12} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Root Client ────────────────────────────────── */
export default function VendorsClient({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [activeTab, setActiveTab] = useState<VendorCategory>("catering")
  const [editing, setEditing] = useState<Vendor | null | "new">(null)

  const filtered = vendors.filter((v) => v.category === activeTab)
  const activeCat = CATEGORIES.find((c) => c.key === activeTab)!

  const handleSave = (vendor: Vendor) => {
    setVendors((prev) => {
      const idx = prev.findIndex((v) => v.id === vendor.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = vendor; return n }
      return [...prev, vendor].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteVendor(id)
    if (result.success) setVendors((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
        className="mb-8 flex items-end justify-between gap-4"
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div
              className="h-px w-6"
              style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Partner Management
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
            Vendors
          </h1>
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {vendors.length} partner{vendors.length !== 1 ? "s" : ""} across {CATEGORIES.length} categories
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(109,40,217,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setEditing("new")}
          className="btn-primary flex shrink-0 items-center gap-2"
        >
          <Plus size={14} />
          Add Vendor
        </motion.button>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 flex gap-1 rounded-sm p-1"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {CATEGORIES.map((cat) => {
          const count = vendors.filter((v) => v.category === cat.key).length
          const isActive = activeTab === cat.key
          return (
            <motion.button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-2.5 text-xs transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? cat.color : "var(--text-muted)",
                border: `1px solid ${isActive ? cat.color + "44" : "transparent"}`,
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="vendor-tab-indicator"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: cat.bg, border: `1px solid ${cat.color}33` }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <cat.Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      background: isActive ? cat.color + "22" : "var(--surface-2)",
                      color: isActive ? cat.color : "var(--text-muted)",
                    }}
                  >
                    {count}
                  </span>
                )}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Empty state */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-sm py-24 text-center"
            style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm"
              style={{ background: activeCat.bg, color: activeCat.color }}
            >
              <activeCat.Icon size={22} strokeWidth={1.5} />
            </motion.div>
            <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              No {activeCat.label.toLowerCase()} vendors yet
            </p>
            <p className="mt-1 text-xs" style={{ color: activeCat.color, opacity: 0.7, fontFamily: "var(--font-body)" }}>
              Click &ldquo;Add Vendor&rdquo; to get started
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {filtered.length > 0 && (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((vendor, i) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={setEditing}
                onDelete={handleDelete}
                delay={i * 0.07}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {editing !== null && (
          <VendorFormModal
            vendor={editing === "new" ? null : editing}
            defaultCategory={activeTab}
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
        .field:focus { border-color: var(--border-hover); }
        .field::placeholder { color: var(--text-muted); opacity: 0.6; }
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
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
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
        .btn-secondary:hover { border-color: var(--border-hover); color: var(--text); }
      `}</style>
    </div>
  )
}
