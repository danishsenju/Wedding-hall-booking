"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pencil, Trash2, X, Check, Loader2,
  UtensilsCrossed, Camera, Flower2, AtSign,
} from "lucide-react"
import type { Vendor, VendorCategory } from "@/types"
import {
  createVendor,
  updateVendor,
  deleteVendor,
  type VendorInput,
} from "@/app/actions/vendor"

/* ─── Constants ──────────────────────────────────── */

const CATEGORIES: { key: VendorCategory; label: string; icon: React.ReactNode }[] = [
  { key: "catering",     label: "Catering",       icon: <UtensilsCrossed size={15} strokeWidth={1.5} /> },
  { key: "photography",  label: "Photography",     icon: <Camera          size={15} strokeWidth={1.5} /> },
  { key: "decor",        label: "Décor & Florals", icon: <Flower2         size={15} strokeWidth={1.5} /> },
]

const CATEGORY_LABEL: Record<VendorCategory, string> = {
  catering:    "Catering",
  photography: "Photography",
  decor:       "Décor & Florals",
}

const EMPTY_FORM = {
  category: "catering" as VendorCategory,
  name: "",
  instagram: "",
  price_rm: "",
}

/* ─── Vendor Form Modal ──────────────────────────── */

function VendorFormModal({
  vendor,
  defaultCategory,
  onClose,
  onSave,
}: {
  vendor: Vendor | null
  defaultCategory: VendorCategory
  onClose: () => void
  onSave: (v: Vendor) => void
}) {
  const isEdit = Boolean(vendor)
  const [form, setForm] = useState(
    vendor
      ? {
          category: vendor.category,
          name: vendor.name,
          instagram: vendor.instagram ?? "",
          price_rm: vendor.price_rm.toString(),
        }
      : { ...EMPTY_FORM, category: defaultCategory }
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

    const instagram = form.instagram.trim().replace(/^@/, "") || null

    const payload: VendorInput = {
      category: form.category,
      name: form.name.trim(),
      instagram,
      price_rm: Number(form.price_rm),
    }

    const result = isEdit
      ? await updateVendor(vendor!.id, payload)
      : await createVendor(payload)

    setSaving(false)
    if (!result.success || !result.data) {
      setError(result.error ?? "Failed")
      return
    }
    onSave(result.data as Vendor)
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
        className="w-full max-w-lg rounded-sm"
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
            {isEdit ? "Edit Vendor" : "Add New Vendor"}
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
          {/* Category */}
          <div>
            <label className="label-text">Category *</label>
            <select
              required
              value={form.category}
              onChange={set("category")}
              className="field"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="label-text">Vendor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Delicious Catering Co."
              value={form.name}
              onChange={set("name")}
              className="field"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="label-text">Instagram Handle</label>
            <input
              type="text"
              placeholder="@handle (optional)"
              value={form.instagram}
              onChange={set("instagram")}
              className="field"
            />
          </div>

          {/* Price */}
          <div>
            <label className="label-text">
              {form.category === "catering"
                ? "Price per Pax (RM) *"
                : form.category === "photography"
                ? "Price per Hour (RM) *"
                : "Fixed Price (RM) *"}
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder={
                form.category === "catering"
                  ? "35"
                  : form.category === "photography"
                  ? "800"
                  : "5000"
              }
              value={form.price_rm}
              onChange={set("price_rm")}
              className="field"
            />
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
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
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

function VendorCard({
  vendor,
  onEdit,
  onDelete,
}: {
  vendor: Vendor
  onEdit: (v: Vendor) => void
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
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="text-lg font-light truncate"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {vendor.name}
          </h3>
          {vendor.instagram && (
            <a
              href={`https://instagram.com/${vendor.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              <AtSign size={11} />
              {vendor.instagram}
            </a>
          )}
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
          RM {vendor.price_rm.toLocaleString()}
          {vendor.category === "catering" && " / pax"}
          {vendor.category === "photography" && " / hr"}
        </div>
      </div>

      {confirming ? (
        <div className="flex items-center gap-2">
          <p className="flex-1 text-xs" style={{ color: "#f87171" }}>
            Delete this vendor?
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
            onClick={() => onDelete(vendor.id)}
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="btn-secondary flex flex-1 items-center justify-center gap-1.5"
            onClick={() => onEdit(vendor)}
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

/* ─── Root Client ────────────────────────────────── */

export default function VendorsClient({
  initialVendors,
}: {
  initialVendors: Vendor[]
}) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [activeTab, setActiveTab] = useState<VendorCategory>("catering")
  const [editing, setEditing] = useState<Vendor | null | "new">(null)

  const filtered = vendors.filter((v) => v.category === activeTab)

  const handleSave = (vendor: Vendor) => {
    setVendors((prev) => {
      const idx = prev.findIndex((v) => v.id === vendor.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = vendor
        return next
      }
      return [...prev, vendor].sort((a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      )
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteVendor(id)
    if (result.success) setVendors((prev) => prev.filter((v) => v.id !== id))
  }

  const activeCategory = CATEGORIES.find((c) => c.key === activeTab)!

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
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
            Vendors
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Manage partner vendors for Catering, Photography, and Décor &amp; Florals.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditing("new")}
          className="btn-primary flex shrink-0 items-center gap-2"
        >
          <Plus size={15} />
          Add Vendor
        </motion.button>
      </div>

      {/* Tabs */}
      <div
        className="mb-6 flex gap-1 rounded-sm p-1"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {CATEGORIES.map((cat) => {
          const count = vendors.filter((v) => v.category === cat.key).length
          const isActive = activeTab === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-2 text-xs transition-all"
              style={{
                fontFamily: "var(--font-body)",
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                border: isActive ? "1px solid var(--border-hover)" : "1px solid transparent",
              }}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{
                    background: isActive ? "rgba(109,40,217,0.2)" : "var(--surface-2)",
                    color: isActive ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-sm py-20 text-center"
          style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
        >
          <div className="mb-3" style={{ color: "var(--text-muted)" }}>
            {activeCategory.icon}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            No {activeCategory.label.toLowerCase()} vendors yet.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7, fontFamily: "var(--font-body)" }}>
            Click &ldquo;Add Vendor&rdquo; to add the first one.
          </p>
        </div>
      )}

      {/* Grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

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
        .btn-secondary:hover {
          border-color: var(--border-hover);
          color: var(--text);
        }
      `}</style>
    </>
  )
}
