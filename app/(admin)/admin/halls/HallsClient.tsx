"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Check, ImageIcon, Loader2,
  Building2, Sparkles,
} from "lucide-react";
import Image from "next/image";
import type { Venue, Theme } from "@/types";
import { createHall, updateHall, deleteHall } from "@/app/actions/hall";
import { createTheme, updateTheme, deleteTheme } from "@/app/actions/theme";
import { supabase } from "@/lib/supabase";

type Tab = "venues" | "themes";
type VenueExtended = Venue;

/* ─── Image upload ───────────────────────────────── */
async function uploadImage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("site-assets")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return data.publicUrl;
}

/* ─── Shared image input (URL or file upload) ────── */
function ImageInput({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, folder);
      onChange(url ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Check Supabase Storage bucket 'site-assets' exists and is public.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="label-text">Image</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-2 h-36 w-full overflow-hidden rounded-sm">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-sm p-1"
            style={{ background: "rgba(10,11,16,0.7)", color: "var(--text-muted)" }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Mode toggle */}
      <div
        className="mb-2 flex gap-1 rounded-sm p-0.5"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        {(["url", "file"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); }}
            className="flex-1 rounded-sm py-1.5 text-xs transition-all"
            style={
              mode === m
                ? { background: "rgba(109,40,217,0.2)", color: "var(--text)", fontFamily: "var(--font-body)", border: "1px solid var(--border-hover)" }
                : { color: "var(--text-muted)", fontFamily: "var(--font-body)", border: "1px solid transparent" }
            }
          >
            {m === "url" ? "Paste Link" : "Upload File"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field"
        />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-sm py-3 text-sm transition-colors"
            style={{
              border: "1px dashed var(--border-hover)",
              color: uploading ? "var(--text-muted)" : "var(--text)",
              fontFamily: "var(--font-body)",
              background: "var(--surface-2)",
            }}
          >
            {uploading ? (
              <><Loader2 size={14} className="animate-spin" /> Uploading…</>
            ) : (
              <><ImageIcon size={14} /> Click to choose an image file</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{error}</p>
      )}
    </div>
  );
}

/* ─── Shared chip ────────────────────────────────── */
function Chip({ label }: { label: string }) {
  return (
    <span
      className="rounded-sm px-2 py-0.5 text-xs"
      style={{
        background: "var(--surface-2)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   VENUE / HALL SECTION
═══════════════════════════════════════════════════ */

const EMPTY_HALL = {
  name: "", subtitle: "", description: "", tag: "", href: "",
  hero_image_url: "", capacity_min: "", capacity_max: "",
  size_sqft: "", ceiling_height_m: "", parking_bays: "",
};

function HallFormModal({
  hall, onClose, onSave,
}: {
  hall: VenueExtended | null;
  onClose: () => void;
  onSave: (h: VenueExtended) => void;
}) {
  const isEdit = Boolean(hall);
  const [form, setForm] = useState(
    hall
      ? {
          name: hall.name,
          subtitle: hall.subtitle ?? "",
          description: hall.description ?? "",
          tag: hall.tag ?? "",
          href: hall.href ?? "",
          hero_image_url: hall.hero_image_url ?? "",
          capacity_min: hall.capacity_min?.toString() ?? "",
          capacity_max: hall.capacity_max?.toString() ?? "",
          size_sqft: hall.size_sqft?.toString() ?? "",
          ceiling_height_m: hall.ceiling_height_m?.toString() ?? "",
          parking_bays: hall.parking_bays?.toString() ?? "",
        }
      : EMPTY_HALL
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY_HALL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim() || undefined,
      description: form.description.trim() || undefined,
      tag: form.tag.trim() || undefined,
      href: form.href.trim() || undefined,
      hero_image_url: form.hero_image_url.trim() || undefined,
      capacity_min: form.capacity_min ? Number(form.capacity_min) : null,
      capacity_max: form.capacity_max ? Number(form.capacity_max) : null,
      size_sqft: form.size_sqft ? Number(form.size_sqft) : null,
      ceiling_height_m: form.ceiling_height_m ? Number(form.ceiling_height_m) : null,
      parking_bays: form.parking_bays ? Number(form.parking_bays) : null,
    };
    const result = isEdit
      ? await updateHall(hall!.id, payload)
      : await createHall(payload);
    setSaving(false);
    if (!result.success || !result.data) { setError(result.error ?? "Failed"); return; }
    onSave(result.data as VenueExtended);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,11,16,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 32, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            {isEdit ? "Edit Venue" : "Add New Venue"}
          </h2>
          <button onClick={onClose} className="rounded-sm p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <ImageInput
            value={form.hero_image_url}
            onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
            folder="halls"
          />

          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Venue Name *</label><input type="text" required placeholder="Grand Ballroom" value={form.name} onChange={set("name")} className="field" /></div>
            <div><label className="label-text">Badge / Tag</label><input type="text" placeholder="Most Popular" value={form.tag} onChange={set("tag")} className="field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Subtitle</label><input type="text" placeholder="The Jewel of Laman Troka" value={form.subtitle} onChange={set("subtitle")} className="field" /></div>
            <div><label className="label-text">Detail Page URL</label><input type="text" placeholder="/venues/grand-ballroom" value={form.href} onChange={set("href")} className="field" /></div>
          </div>
          <div><label className="label-text">Description</label><textarea rows={3} placeholder="Describe the venue..." value={form.description} onChange={set("description")} className="field resize-none" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Capacity Min</label><input type="number" min={0} value={form.capacity_min} onChange={set("capacity_min")} className="field" /></div>
            <div><label className="label-text">Capacity Max</label><input type="number" min={0} value={form.capacity_max} onChange={set("capacity_max")} className="field" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-text">Floor Area (sq ft)</label><input type="number" min={0} value={form.size_sqft} onChange={set("size_sqft")} className="field" /></div>
            <div><label className="label-text">Ceiling Height (m)</label><input type="number" step="0.1" min={0} value={form.ceiling_height_m} onChange={set("ceiling_height_m")} className="field" /></div>
            <div><label className="label-text">Parking Bays</label><input type="number" min={0} value={form.parking_bays} onChange={set("parking_bays")} className="field" /></div>
          </div>

          {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEdit ? "Save Changes" : "Create Venue"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function HallCard({ hall, onEdit, onDelete }: { hall: VenueExtended; onEdit: (h: VenueExtended) => void; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? "rgba(109,40,217,0.4)" : "var(--border)"}`,
        boxShadow: hovered ? "0 8px 32px rgba(109,40,217,0.12)" : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {hall.hero_image_url ? (
          <Image src={hall.hero_image_url} alt={hall.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center" style={{ background: "var(--surface-2)" }}>
            <Building2 size={32} style={{ color: "var(--text-muted)" }} />
          </div>
        )}
        {hall.tag && (
          <div
            className="absolute left-3 top-3 rounded-sm px-2.5 py-1 text-xs uppercase tracking-widest"
            style={{ background: "rgba(109,40,217,0.15)", border: "1px solid var(--border-hover)", color: "var(--gold)", backdropFilter: "blur(8px)" }}
          >
            {hall.tag}
          </div>
        )}
      </div>

      <div className="p-4">
        {hall.subtitle && (
          <p className="mb-0.5 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
            {hall.subtitle}
          </p>
        )}
        <h3 className="mb-2 text-lg font-light" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
          {hall.name}
        </h3>
        {hall.description && (
          <p className="mb-3 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {hall.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-2">
          {hall.capacity_min != null && hall.capacity_max != null && <Chip label={`${hall.capacity_min}–${hall.capacity_max} pax`} />}
          {hall.size_sqft != null && <Chip label={`${hall.size_sqft.toLocaleString()} sq ft`} />}
          {hall.parking_bays != null && <Chip label={`${hall.parking_bays} bays`} />}
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <p className="flex-1 text-xs" style={{ color: "#f87171" }}>Delete this venue?</p>
            <button className="btn-secondary text-xs" onClick={() => setConfirming(false)}>Cancel</button>
            <button
              className="flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
              onClick={() => onDelete(hall.id)}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button className="btn-secondary flex flex-1 items-center justify-center gap-1.5" onClick={() => onEdit(hall)}>
              <Pencil size={13} /> Edit
            </button>
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => setConfirming(true)} style={{ color: "#f87171" }}>
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   THEME SECTION
═══════════════════════════════════════════════════ */

const EMPTY_THEME = {
  name: "", tagline: "", description: "", image_url: "",
  price_from_rm: "", mood: "", sort_order: "0",
};

function ThemeFormModal({
  theme, onClose, onSave,
}: {
  theme: Theme | null;
  onClose: () => void;
  onSave: (t: Theme) => void;
}) {
  const isEdit = Boolean(theme);
  const [form, setForm] = useState(
    theme
      ? {
          name: theme.name,
          tagline: theme.tagline ?? "",
          description: theme.description ?? "",
          image_url: theme.image_url ?? "",
          price_from_rm: theme.price_from_rm?.toString() ?? "",
          mood: theme.mood ?? "",
          sort_order: theme.sort_order?.toString() ?? "0",
        }
      : EMPTY_THEME
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY_THEME) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim() || undefined,
      description: form.description.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      price_from_rm: form.price_from_rm ? Number(form.price_from_rm) : null,
      mood: form.mood.trim() || undefined,
      sort_order: Number(form.sort_order) || 0,
    };
    const result = isEdit
      ? await updateTheme(theme!.id, payload)
      : await createTheme(payload);
    setSaving(false);
    if (!result.success || !result.data) { setError(result.error ?? "Failed"); return; }
    onSave(result.data);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,11,16,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 32, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            {isEdit ? "Edit Theme" : "Add New Theme"}
          </h2>
          <button onClick={onClose} className="rounded-sm p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <ImageInput
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            folder="themes"
          />

          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Theme Name *</label><input type="text" required placeholder="Garden Romance" value={form.name} onChange={set("name")} className="field" /></div>
            <div><label className="label-text">Mood Tags</label><input type="text" placeholder="Romantic · Natural · Whimsical" value={form.mood} onChange={set("mood")} className="field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Tagline</label><input type="text" placeholder="Where Nature Embraces Love" value={form.tagline} onChange={set("tagline")} className="field" /></div>
            <div><label className="label-text">Starting Price (RM)</label><input type="number" placeholder="22000" value={form.price_from_rm} onChange={set("price_from_rm")} className="field" /></div>
          </div>
          <div><label className="label-text">Description</label><textarea rows={3} placeholder="Describe this theme..." value={form.description} onChange={set("description")} className="field resize-none" /></div>
          <div className="w-28"><label className="label-text">Sort Order</label><input type="number" min={0} value={form.sort_order} onChange={set("sort_order")} className="field" /></div>

          {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEdit ? "Save Changes" : "Create Theme"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ThemeCard({ theme, onEdit, onDelete }: { theme: Theme; onEdit: (t: Theme) => void; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? "rgba(109,40,217,0.4)" : "var(--border)"}`,
        boxShadow: hovered ? "0 8px 32px rgba(109,40,217,0.12)" : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {theme.image_url ? (
          <Image src={theme.image_url} alt={theme.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center" style={{ background: "var(--surface-2)" }}>
            <Sparkles size={32} style={{ color: "var(--text-muted)" }} />
          </div>
        )}
        {theme.price_from_rm != null && (
          <div
            className="absolute right-3 top-3 rounded-sm px-2.5 py-1 text-xs font-medium"
            style={{ background: "rgba(10,11,16,0.75)", border: "1px solid var(--border)", color: "var(--rose)", backdropFilter: "blur(8px)", fontFamily: "var(--font-body)" }}
          >
            from RM {theme.price_from_rm.toLocaleString()}
          </div>
        )}
      </div>

      <div className="p-4">
        {theme.mood && (
          <p className="mb-0.5 text-xs uppercase tracking-[0.15em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
            {theme.mood}
          </p>
        )}
        <h3 className="mb-1 text-lg font-light" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
          {theme.name}
        </h3>
        {theme.tagline && (
          <p className="mb-2 text-xs italic" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {theme.tagline}
          </p>
        )}
        {theme.description && (
          <p className="mb-4 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {theme.description}
          </p>
        )}
        {confirming ? (
          <div className="flex items-center gap-2">
            <p className="flex-1 text-xs" style={{ color: "#f87171" }}>Delete this theme?</p>
            <button className="btn-secondary text-xs" onClick={() => setConfirming(false)}>Cancel</button>
            <button
              className="flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
              onClick={() => onDelete(theme.id)}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button className="btn-secondary flex flex-1 items-center justify-center gap-1.5" onClick={() => onEdit(theme)}>
              <Pencil size={13} /> Edit
            </button>
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => setConfirming(true)} style={{ color: "#f87171" }}>
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT CLIENT
═══════════════════════════════════════════════════ */

export default function HallsClient({
  initialHalls,
  initialThemes,
}: {
  initialHalls: Venue[];
  initialThemes: Theme[];
}) {
  const [tab, setTab] = useState<Tab>("venues");
  const [halls, setHalls] = useState<VenueExtended[]>(initialHalls as VenueExtended[]);
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [editingHall, setEditingHall] = useState<VenueExtended | null | "new">(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null | "new">(null);

  const handleSaveHall = (hall: VenueExtended) => {
    setHalls((prev) => {
      const idx = prev.findIndex((h) => h.id === hall.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = hall; return next; }
      return [hall, ...prev];
    });
  };

  const handleDeleteHall = async (id: string) => {
    const result = await deleteHall(id);
    if (result.success) setHalls((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSaveTheme = (theme: Theme) => {
    setThemes((prev) => {
      const idx = prev.findIndex((t) => t.id === theme.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = theme; return next; }
      return [theme, ...prev];
    });
  };

  const handleDeleteTheme = async (id: string) => {
    const result = await deleteTheme(id);
    if (result.success) setThemes((prev) => prev.filter((t) => t.id !== id));
  };

  const TABS = [
    { id: "venues" as Tab, label: "Our Venues", icon: <Building2 size={15} /> },
    { id: "themes" as Tab, label: "Wedding Themes", icon: <Sparkles size={15} /> },
  ];

  return (
    <>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
        className="mb-8 flex items-end justify-between gap-4"
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="h-px w-6" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
              Venue Management
            </span>
          </div>
          <h1
            className="font-light leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "0.04em" }}
          >
            Manage Halls
          </h1>
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {halls.length} venue{halls.length !== 1 ? "s" : ""} · {themes.length} wedding theme{themes.length !== 1 ? "s" : ""}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(109,40,217,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => tab === "venues" ? setEditingHall("new") : setEditingTheme("new")}
          className="btn-primary flex shrink-0 items-center gap-2"
        >
          <Plus size={14} />
          {tab === "venues" ? "Add Venue" : "Add Theme"}
        </motion.button>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 flex gap-1 rounded-sm p-1"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {TABS.map((t) => {
          const count = t.id === "venues" ? halls.length : themes.length
          const isActive = tab === t.id
          return (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm"
              style={{
                fontFamily: "var(--font-body)",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                border: "1px solid transparent",
                transition: "color 0.2s",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="halls-tab-indicator"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: "rgba(109,40,217,0.15)", border: "1px solid var(--border-hover)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {t.icon}
                {t.label}
                <span
                  className="rounded-sm px-1.5 py-0.5 text-[10px]"
                  style={{
                    background: isActive ? "rgba(109,40,217,0.2)" : "var(--surface-2)",
                    color: isActive ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {count}
                </span>
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "venues" && (
          <motion.div
            key="venues"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {halls.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-sm py-24 text-center mb-6"
                style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm"
                  style={{ background: "rgba(109,40,217,0.1)", color: "var(--gold)" }}
                >
                  <Building2 size={22} strokeWidth={1.5} />
                </motion.div>
                <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>No venues yet</p>
                <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7, fontFamily: "var(--font-body)" }}>Run the SQL seed or click &ldquo;Add Venue&rdquo;</p>
              </motion.div>
            )}
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {halls.map((h) => (
                  <HallCard key={h.id} hall={h} onEdit={setEditingHall} onDelete={handleDeleteHall} />
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {tab === "themes" && (
          <motion.div
            key="themes"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {themes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-sm py-24 text-center mb-6"
                style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm"
                  style={{ background: "rgba(109,40,217,0.1)", color: "var(--gold)" }}
                >
                  <Sparkles size={22} strokeWidth={1.5} />
                </motion.div>
                <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>No themes yet</p>
                <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7, fontFamily: "var(--font-body)" }}>Run the SQL seed or click &ldquo;Add Theme&rdquo;</p>
              </motion.div>
            )}
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {themes.map((t) => (
                  <ThemeCard key={t.id} theme={t} onEdit={setEditingTheme} onDelete={handleDeleteTheme} />
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {editingHall !== null && (
          <HallFormModal
            hall={editingHall === "new" ? null : editingHall}
            onClose={() => setEditingHall(null)}
            onSave={handleSaveHall}
          />
        )}
        {editingTheme !== null && (
          <ThemeFormModal
            theme={editingTheme === "new" ? null : editingTheme}
            onClose={() => setEditingTheme(null)}
            onSave={handleSaveTheme}
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
          color: #EDE9FE;
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
    </>
  );
}
