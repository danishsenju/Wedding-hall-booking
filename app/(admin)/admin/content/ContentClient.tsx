"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, X, Check, ImageIcon, Loader2, FileEdit,
  LayoutGrid, Sparkles, GripVertical, Plus, Trash2,
} from "lucide-react";
import Image from "next/image";
import type { Venue, Theme } from "@/types";
import { updateHall, createHall, deleteHall } from "@/app/actions/hall";
import { updateTheme, createTheme, deleteTheme } from "@/app/actions/theme";
import { createBrowserClient } from "@/lib/supabase";

/* ─── Image upload ───────────────────────────────── */
async function uploadImage(file: File, folder: string): Promise<string | null> {
  try {
    const supabase = createBrowserClient();
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

/* ─── Gallery images field (up to 6 slots) ──────── */
function GalleryImagesField({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const addSlot = () => {
    if (images.length < 6) onChange([...images, ""]);
  };
  const removeSlot = (i: number) =>
    onChange(images.filter((_, j) => j !== i));
  const updateSlot = (i: number, url: string) =>
    onChange(images.map((x, j) => (j === i ? url : x)));

  return (
    <div>
      <label className="label-text">
        Gallery Images — detail page (up to 6)
      </label>
      <div className="space-y-3">
        {images.map((url, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <ImageField
                value={url}
                onChange={(u) => updateSlot(i, u)}
                folder="themes"
              />
            </div>
            <button
              type="button"
              onClick={() => removeSlot(i)}
              className="btn-secondary mt-0 shrink-0"
              style={{ color: "#f87171" }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {images.length < 6 && (
          <button
            type="button"
            onClick={addSlot}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Plus size={12} /> Add gallery image
          </button>
        )}
        {images.length === 0 && (
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            No gallery images yet. Add up to 6 to populate the detail page gallery.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Shared image field ─────────────────────────── */
function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const url = await uploadImage(file, folder);
    setUploading(false);
    if (url) onChange(url);
    else setUploadError("Upload failed. Check Supabase Storage or paste a URL.");
  };

  return (
    <div>
      <label className="label-text">Image</label>
      {value && (
        <div className="relative mb-2 h-32 w-full overflow-hidden rounded-sm">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://... paste image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field flex-1"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary flex items-center gap-1.5 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImageIcon size={13} />}
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {uploadError && (
        <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{uploadError}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VENUE SHOWCASE TAB
═══════════════════════════════════════════════════ */

type VenueExtended = Venue;

function VenueEditRow({
  venue,
  onSaved,
  onDeleted,
}: {
  venue: VenueExtended;
  onSaved: (v: VenueExtended) => void;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: venue.name,
    subtitle: venue.subtitle ?? "",
    description: venue.description ?? "",
    tag: venue.tag ?? "",
    href: venue.href ?? "",
    hero_image_url: venue.hero_image_url ?? "",
    capacity_min: venue.capacity_min?.toString() ?? "",
    capacity_max: venue.capacity_max?.toString() ?? "",
    size_sqft: venue.size_sqft?.toString() ?? "",
    parking_bays: venue.parking_bays?.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
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
      parking_bays: form.parking_bays ? Number(form.parking_bays) : null,
    };
    const result = await updateHall(venue.id, payload);
    setSaving(false);
    if (!result.success || !result.data) { setError(result.error ?? "Failed"); return; }
    onSaved(result.data as VenueExtended);
    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteHall(venue.id);
    if (result.success) onDeleted(venue.id);
  };

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-3 p-4">
        <GripVertical size={16} style={{ color: "var(--border-hover)" }} className="shrink-0" />
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm">
          {form.hero_image_url ? (
            <Image src={form.hero_image_url} alt={form.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: "var(--surface-2)" }}>
              <ImageIcon size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
            {form.name}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {form.subtitle || "No subtitle"} {form.tag ? `· ${form.tag}` : ""}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-secondary flex items-center gap-1.5" onClick={() => setOpen(!open)}>
            <Pencil size={12} /> {open ? "Close" : "Edit"}
          </button>
          {confirming ? (
            <>
              <button className="btn-secondary text-xs" style={{ color: "#f87171" }} onClick={handleDelete}>
                Confirm
              </button>
              <button className="btn-secondary" onClick={() => setConfirming(false)}>
                <X size={12} />
              </button>
            </>
          ) : (
            <button className="btn-secondary" onClick={() => setConfirming(true)} style={{ color: "#f87171" }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded form */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSave}
              className="p-4 pt-0 space-y-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="pt-4">
                <ImageField
                  value={form.hero_image_url}
                  onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
                  folder="halls"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Hall Name *</label>
                  <input type="text" required value={form.name} onChange={set("name")} className="field" />
                </div>
                <div>
                  <label className="label-text">Badge / Tag</label>
                  <input type="text" placeholder="Most Popular" value={form.tag} onChange={set("tag")} className="field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Subtitle</label>
                  <input type="text" placeholder="The Jewel of Laman Troka" value={form.subtitle} onChange={set("subtitle")} className="field" />
                </div>
                <div>
                  <label className="label-text">Detail Page URL</label>
                  <input type="text" placeholder="/venues/grand-ballroom" value={form.href} onChange={set("href")} className="field" />
                </div>
              </div>

              <div>
                <label className="label-text">Description</label>
                <textarea rows={2} value={form.description} onChange={set("description")} className="field resize-none" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="label-text">Cap. Min</label>
                  <input type="number" value={form.capacity_min} onChange={set("capacity_min")} className="field" />
                </div>
                <div>
                  <label className="label-text">Cap. Max</label>
                  <input type="number" value={form.capacity_max} onChange={set("capacity_max")} className="field" />
                </div>
                <div>
                  <label className="label-text">Sq Ft</label>
                  <input type="number" value={form.size_sqft} onChange={set("size_sqft")} className="field" />
                </div>
                <div>
                  <label className="label-text">Parking</label>
                  <input type="number" value={form.parking_bays} onChange={set("parking_bays")} className="field" />
                </div>
              </div>

              {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Add venue showcase item ────────────────────── */
function AddVenueRow({ onAdded }: { onAdded: (v: VenueExtended) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subtitle: "", description: "", tag: "", href: "", hero_image_url: "", capacity_min: "", capacity_max: "", size_sqft: "", parking_bays: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await createHall({
      name: form.name.trim(),
      subtitle: form.subtitle.trim() || undefined,
      description: form.description.trim() || undefined,
      tag: form.tag.trim() || undefined,
      href: form.href.trim() || undefined,
      hero_image_url: form.hero_image_url.trim() || undefined,
      capacity_min: form.capacity_min ? Number(form.capacity_min) : null,
      capacity_max: form.capacity_max ? Number(form.capacity_max) : null,
      size_sqft: form.size_sqft ? Number(form.size_sqft) : null,
      parking_bays: form.parking_bays ? Number(form.parking_bays) : null,
    });
    setSaving(false);
    if (!result.success || !result.data) { setError(result.error ?? "Failed"); return; }
    onAdded(result.data as VenueExtended);
    setOpen(false);
    setForm({ name: "", subtitle: "", description: "", tag: "", href: "", hero_image_url: "", capacity_min: "", capacity_max: "", size_sqft: "", parking_bays: "" });
  };

  if (!open) {
    return (
      <button
        className="flex w-full items-center justify-center gap-2 rounded-sm py-3 text-sm transition-colors"
        style={{ border: "1px dashed var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        onClick={() => setOpen(true)}
      >
        <Plus size={15} /> Add Venue to Showcase
      </button>
    );
  }

  return (
    <div className="rounded-sm p-4 space-y-4" style={{ background: "var(--surface-1)", border: "1px solid var(--border-hover)" }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>New Venue Showcase Item</p>
        <button onClick={() => setOpen(false)} style={{ color: "var(--text-muted)" }}><X size={15} /></button>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <ImageField value={form.hero_image_url} onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))} folder="halls" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-text">Name *</label><input type="text" required value={form.name} onChange={set("name")} className="field" /></div>
          <div><label className="label-text">Tag</label><input type="text" value={form.tag} onChange={set("tag")} className="field" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-text">Subtitle</label><input type="text" value={form.subtitle} onChange={set("subtitle")} className="field" /></div>
          <div><label className="label-text">URL</label><input type="text" value={form.href} onChange={set("href")} className="field" /></div>
        </div>
        <div><label className="label-text">Description</label><textarea rows={2} value={form.description} onChange={set("description")} className="field resize-none" /></div>
        <div className="grid grid-cols-4 gap-3">
          <div><label className="label-text">Cap. Min</label><input type="number" value={form.capacity_min} onChange={set("capacity_min")} className="field" /></div>
          <div><label className="label-text">Cap. Max</label><input type="number" value={form.capacity_max} onChange={set("capacity_max")} className="field" /></div>
          <div><label className="label-text">Sq Ft</label><input type="number" value={form.size_sqft} onChange={set("size_sqft")} className="field" /></div>
          <div><label className="label-text">Parking</label><input type="number" value={form.parking_bays} onChange={set("parking_bays")} className="field" /></div>
        </div>
        {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   THEME CAROUSEL TAB
═══════════════════════════════════════════════════ */

function ThemeEditRow({
  theme,
  onSaved,
  onDeleted,
}: {
  theme: Theme;
  onSaved: (t: Theme) => void;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: theme.name,
    tagline: theme.tagline ?? "",
    description: theme.description ?? "",
    image_url: theme.image_url ?? "",
    price_from_rm: theme.price_from_rm?.toString() ?? "",
    mood: theme.mood ?? "",
    sort_order: theme.sort_order?.toString() ?? "0",
    highlight_quote: theme.highlight_quote ?? "",
  });
  const [galleryImages, setGalleryImages] = useState<string[]>(
    theme.gallery_images ?? []
  );
  const [featuresText, setFeaturesText] = useState(
    (theme.features ?? []).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await updateTheme(theme.id, {
      name: form.name.trim(),
      tagline: form.tagline.trim() || undefined,
      description: form.description.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      price_from_rm: form.price_from_rm ? Number(form.price_from_rm) : null,
      mood: form.mood.trim() || undefined,
      sort_order: Number(form.sort_order) || 0,
      highlight_quote: form.highlight_quote.trim() || null,
      features: featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      gallery_images: galleryImages.filter(Boolean),
    });
    setSaving(false);
    if (!result.success || !result.data) {
      if (result.error?.includes("column") && result.error?.includes("does not exist")) {
        setError(
          "Detail page fields need a DB migration. Run: ALTER TABLE themes ADD COLUMN highlight_quote text, ADD COLUMN features jsonb DEFAULT '[]', ADD COLUMN gallery_images jsonb DEFAULT '[]';"
        );
      } else {
        setError(result.error ?? "Failed");
      }
      return;
    }
    onSaved(result.data);
    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteTheme(theme.id);
    if (result.success) onDeleted(theme.id);
  };

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3 p-4">
        <GripVertical size={16} style={{ color: "var(--border-hover)" }} className="shrink-0" />
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm">
          {form.image_url ? (
            <Image src={form.image_url} alt={form.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: "var(--surface-2)" }}>
              <Sparkles size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>{form.name}</p>
          <p className="text-xs truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {form.mood || "No mood set"} {form.price_from_rm ? `· RM ${Number(form.price_from_rm).toLocaleString()}` : ""}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-secondary flex items-center gap-1.5" onClick={() => setOpen(!open)}>
            <Pencil size={12} /> {open ? "Close" : "Edit"}
          </button>
          {confirming ? (
            <>
              <button className="btn-secondary text-xs" style={{ color: "#f87171" }} onClick={handleDelete}>Confirm</button>
              <button className="btn-secondary" onClick={() => setConfirming(false)}><X size={12} /></button>
            </>
          ) : (
            <button className="btn-secondary" onClick={() => setConfirming(true)} style={{ color: "#f87171" }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="p-4 pt-0 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="pt-4">
                <ImageField value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} folder="themes" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-text">Theme Name *</label><input type="text" required value={form.name} onChange={set("name")} className="field" /></div>
                <div><label className="label-text">Mood Tags</label><input type="text" placeholder="Romantic · Natural" value={form.mood} onChange={set("mood")} className="field" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-text">Tagline</label><input type="text" placeholder="Where Nature Embraces Love" value={form.tagline} onChange={set("tagline")} className="field" /></div>
                <div><label className="label-text">Starting Price (RM)</label><input type="number" placeholder="22000" value={form.price_from_rm} onChange={set("price_from_rm")} className="field" /></div>
              </div>

              <div>
                <label className="label-text">Description</label>
                <textarea rows={2} value={form.description} onChange={set("description")} className="field resize-none" />
              </div>

              <div className="w-24">
                <label className="label-text">Sort Order</label>
                <input type="number" min={0} value={form.sort_order} onChange={set("sort_order")} className="field" />
              </div>

              {/* ── Detail page fields ── */}
              <div
                className="rounded-sm p-4 space-y-4"
                style={{ background: "rgba(109,40,217,0.04)", border: "1px solid var(--border)" }}
              >
                <p
                  className="text-xs uppercase tracking-[0.22em]"
                  style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                >
                  Detail Page Fields
                </p>

                <div>
                  <label className="label-text">Highlight Quote</label>
                  <input
                    type="text"
                    placeholder="Where every detail tells a story"
                    value={form.highlight_quote}
                    onChange={set("highlight_quote")}
                    className="field"
                  />
                </div>

                <div>
                  <label className="label-text">What&apos;s Included (one item per line)</label>
                  <textarea
                    rows={5}
                    placeholder={"Crystal chandelier setup\nFloral arrangements\nBridal suite access"}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="field resize-none"
                  />
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", opacity: 0.65 }}>
                    Each line = one feature item on the detail page.
                  </p>
                </div>

                <GalleryImagesField
                  images={galleryImages}
                  onChange={setGalleryImages}
                />
              </div>

              {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddThemeRow({ onAdded }: { onAdded: (t: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", image_url: "",
    price_from_rm: "", mood: "", sort_order: "0", highlight_quote: "",
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await createTheme({
      name: form.name.trim(),
      tagline: form.tagline.trim() || undefined,
      description: form.description.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      price_from_rm: form.price_from_rm ? Number(form.price_from_rm) : null,
      mood: form.mood.trim() || undefined,
      sort_order: Number(form.sort_order) || 0,
      highlight_quote: form.highlight_quote.trim() || null,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      gallery_images: galleryImages.filter(Boolean),
    });
    setSaving(false);
    if (!result.success || !result.data) {
      if (result.error?.includes("column") && result.error?.includes("does not exist")) {
        setError(
          "Detail page fields need a DB migration. Run: ALTER TABLE themes ADD COLUMN highlight_quote text, ADD COLUMN features jsonb DEFAULT '[]', ADD COLUMN gallery_images jsonb DEFAULT '[]';"
        );
      } else {
        setError(result.error ?? "Failed");
      }
      return;
    }
    onAdded(result.data);
    setOpen(false);
    setForm({ name: "", tagline: "", description: "", image_url: "", price_from_rm: "", mood: "", sort_order: "0", highlight_quote: "" });
    setGalleryImages([]);
    setFeaturesText("");
  };

  if (!open) {
    return (
      <button
        className="flex w-full items-center justify-center gap-2 rounded-sm py-3 text-sm transition-colors"
        style={{ border: "1px dashed var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        onClick={() => setOpen(true)}
      >
        <Plus size={15} /> Add Theme
      </button>
    );
  }

  return (
    <div className="rounded-sm p-4 space-y-4" style={{ background: "var(--surface-1)", border: "1px solid var(--border-hover)" }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>New Theme</p>
        <button onClick={() => setOpen(false)} style={{ color: "var(--text-muted)" }}><X size={15} /></button>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <ImageField value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} folder="themes" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-text">Name *</label><input type="text" required value={form.name} onChange={set("name")} className="field" /></div>
          <div><label className="label-text">Mood Tags</label><input type="text" value={form.mood} onChange={set("mood")} className="field" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-text">Tagline</label><input type="text" value={form.tagline} onChange={set("tagline")} className="field" /></div>
          <div><label className="label-text">Price (RM)</label><input type="number" value={form.price_from_rm} onChange={set("price_from_rm")} className="field" /></div>
        </div>
        <div><label className="label-text">Description</label><textarea rows={2} value={form.description} onChange={set("description")} className="field resize-none" /></div>

        {/* Detail page fields */}
        <div
          className="rounded-sm p-4 space-y-4"
          style={{ background: "rgba(109,40,217,0.04)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
            Detail Page Fields
          </p>
          <div>
            <label className="label-text">Highlight Quote</label>
            <input type="text" placeholder="Where every detail tells a story" value={form.highlight_quote} onChange={set("highlight_quote")} className="field" />
          </div>
          <div>
            <label className="label-text">What&apos;s Included (one item per line)</label>
            <textarea rows={4} placeholder={"Crystal chandelier setup\nFloral arrangements\nBridal suite access"} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="field resize-none" />
          </div>
          <GalleryImagesField images={galleryImages} onChange={setGalleryImages} />
        </div>

        {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT CLIENT COMPONENT
═══════════════════════════════════════════════════ */

type Tab = "venues" | "themes";

export default function ContentClient({
  initialHalls,
  initialThemes,
}: {
  initialHalls: Venue[];
  initialThemes: Theme[];
}) {
  const [tab, setTab] = useState<Tab>("venues");
  const [halls, setHalls] = useState<VenueExtended[]>(initialHalls as VenueExtended[]);
  const [themes, setThemes] = useState<Theme[]>(initialThemes);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "venues", label: "Venue Showcase", icon: <LayoutGrid size={15} /> },
    { id: "themes", label: "Theme Carousel", icon: <Sparkles size={15} /> },
  ];

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <div
          className="text-xs uppercase tracking-[0.28em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          Laman Troka
        </div>
        <h1
          className="mt-0.5 flex items-center gap-3 text-3xl font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          <FileEdit size={24} style={{ color: "var(--gold)" }} />
          Content Editor
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Edit the images, text, and pricing shown on the public landing page.
          Changes take effect immediately after saving.
        </p>
      </div>

      {/* Notice banner */}
      <div
        className="mb-6 rounded-sm p-4 text-sm"
        style={{
          background: "rgba(109,40,217,0.07)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        <strong style={{ color: "var(--text)" }}>Image upload:</strong> Requires a{" "}
        <code className="text-xs" style={{ color: "var(--gold)" }}>site-assets</code> bucket in
        Supabase Storage with public access. Alternatively, paste any image URL directly.
      </div>

      {/* Tab bar */}
      <div
        className="mb-6 flex gap-1 rounded-sm p-1"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm transition-all"
            style={
              tab === t.id
                ? {
                    background: "rgba(109,40,217,0.15)",
                    border: "1px solid var(--border-hover)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                  }
                : {
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    border: "1px solid transparent",
                  }
            }
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "venues" && (
          <motion.div
            key="venues"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {halls.length === 0 && (
              <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                No venues in the database yet. Add halls from the Manage Halls page, or add one below.
              </p>
            )}
            {halls.map((h) => (
              <VenueEditRow
                key={h.id}
                venue={h}
                onSaved={(v) => setHalls((prev) => prev.map((x) => (x.id === v.id ? v : x)))}
                onDeleted={(id) => setHalls((prev) => prev.filter((x) => x.id !== id))}
              />
            ))}
            <AddVenueRow onAdded={(v) => setHalls((prev) => [...prev, v])} />
          </motion.div>
        )}

        {tab === "themes" && (
          <motion.div
            key="themes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {themes.length === 0 && (
              <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                No themes yet. Add the first theme below — it will appear in the landing page carousel.
              </p>
            )}
            {themes.map((t) => (
              <ThemeEditRow
                key={t.id}
                theme={t}
                onSaved={(updated) => setThemes((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
                onDeleted={(id) => setThemes((prev) => prev.filter((x) => x.id !== id))}
              />
            ))}
            <AddThemeRow onAdded={(t) => setThemes((prev) => [...prev, t])} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shared field styles */}
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
          padding: 7px 12px;
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
