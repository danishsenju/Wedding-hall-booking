"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Pencil,
  X,
  Check,
  Images,
  ExternalLink,
  ArrowLeft,
  ImagePlus,
} from "lucide-react";
import Link from "next/link";
import { deleteGalleryImage, updateGalleryImage } from "@/app/actions/gallery";
import type { GalleryImage } from "@/types";

interface Props {
  initialImages: GalleryImage[];
}

export default function GalleryClient({ initialImages }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isPending, startTransition] = useTransition();

  // Add form
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addError, setAddError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState("");

  function pickFile(picked: File) {
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setAddError("");
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) pickFile(dropped);
  }, []);

  async function handleAdd() {
    setAddError("");
    if (!title.trim()) { setAddError("Title is required."); return; }
    if (!file) { setAddError("Please select an image file."); return; }

    setUploading(true);
    const form = new FormData();
    form.append("title", title.trim());
    form.append("file", file);

    try {
      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddError(json.error ?? "Upload failed.");
      } else {
        setImages((prev) => [...prev, json.data as GalleryImage]);
        setTitle("");
        clearFile();
      }
    } catch {
      setAddError("Network error — please try again.");
    } finally {
      setUploading(false);
    }
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setEditTitle(img.title);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  function handleSaveEdit(id: string) {
    setEditError("");
    if (!editTitle.trim()) { setEditError("Title is required."); return; }
    startTransition(async () => {
      const existing = images.find((i) => i.id === id);
      if (!existing) return;
      const res = await updateGalleryImage(id, editTitle, existing.image_url);
      if (res.success && res.data) {
        setImages((prev) => prev.map((img) => (img.id === id ? res.data! : img)));
        setEditingId(null);
      } else {
        setEditError(res.error ?? "Failed to update.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteGalleryImage(id);
      if (res.success) setImages((prev) => prev.filter((img) => img.id !== id));
    });
  }

  const busy = uploading || isPending;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
        className="flex items-end justify-between mb-8 flex-wrap gap-4"
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="h-px w-6" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
              Media Library
            </span>
          </div>
          <h1
            className="font-light leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "0.04em" }}
          >
            Gallery
          </h1>
          <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {images.length} image{images.length !== 1 ? "s" : ""} · shown on the public gallery page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all hover:border-[var(--border-hover)]"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <Link
            href="/gallery"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
            style={{ background: "rgba(109,40,217,0.12)", border: "1px solid var(--border-hover)", color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            <ExternalLink size={14} />
            View Live
          </Link>
        </div>
      </motion.div>

      {/* Add Image Form */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
        className="mb-8 overflow-hidden rounded-sm"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {/* Upload area top accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(109,40,217,0.6), transparent)" }} />
        <div className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm" style={{ background: "rgba(109,40,217,0.1)", color: "var(--gold)" }}>
            <ImagePlus size={13} strokeWidth={1.5} />
          </div>
          <h2
            className="text-sm font-medium tracking-wide"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            Upload New Image
          </h2>
        </div>

        {/* Title input */}
        <div className="mb-4">
          <label
            className="block text-xs mb-1.5 uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grand Ballroom Setup"
            className="w-full rounded-sm px-3 py-2.5 text-sm outline-none transition-all"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* File drop zone */}
        <div className="mb-4">
          <label
            className="block text-xs mb-1.5 uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Image
          </label>

          {preview ? (
            /* Preview */
            <div
              className="relative rounded-sm overflow-hidden"
              style={{ border: "1px solid var(--border-hover)" }}
            >
              <img
                src={preview}
                alt="preview"
                className="w-full object-cover max-h-64"
              />
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 rounded p-1.5 transition-colors"
                style={{ background: "rgba(10,11,16,0.75)", color: "#f87171" }}
                title="Remove"
              >
                <X size={14} />
              </button>
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs"
                style={{
                  background: "rgba(10,11,16,0.7)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {file?.name}
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              className="relative flex flex-col items-center justify-center rounded-sm py-10 px-4 cursor-pointer transition-all"
              style={{
                border: `2px dashed ${isDragging ? "var(--gold)" : "var(--border)"}`,
                background: isDragging ? "rgba(109,40,217,0.06)" : "var(--surface-2)",
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus
                size={32}
                className="mb-3"
                style={{ color: isDragging ? "var(--gold)" : "var(--text-muted)" }}
              />
              <p
                className="text-sm text-center"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Drag & drop an image here, or{" "}
                <span style={{ color: "var(--gold)" }}>click to browse</span>
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", opacity: 0.6 }}
              >
                JPG, PNG, WebP — max 10 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) pickFile(f);
                }}
              />
            </div>
          )}
        </div>

        {addError && (
          <p className="text-xs mb-3" style={{ color: "#f87171", fontFamily: "var(--font-body)" }}>
            {addError}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(109,40,217,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-hover))", color: "#EDE9FE", fontFamily: "var(--font-body)", border: "none", cursor: busy ? "not-allowed" : "pointer" }}
        >
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload Image"}
        </motion.button>
        </div>
      </motion.div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-sm py-24 text-center"
          style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm"
            style={{ background: "rgba(109,40,217,0.1)", color: "var(--gold)" }}
          >
            <Images size={22} strokeWidth={1.5} />
          </motion.div>
          <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            No gallery images yet
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7, fontFamily: "var(--font-body)" }}>
            Upload your first image above
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                className="relative overflow-hidden rounded-sm group"
                style={{ border: "1px solid var(--border)" }}
                whileHover={{ borderColor: "rgba(109,40,217,0.4)" }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(10,11,16,0.92) 0%, rgba(10,11,16,0.2) 45%, transparent 70%)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                    <p
                      className="text-sm font-light truncate"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                    >
                      {img.title}
                    </p>
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEdit(img)}
                      className="flex h-7 w-7 items-center justify-center rounded-sm"
                      style={{ background: "rgba(10,11,16,0.8)", color: "var(--text-muted)", backdropFilter: "blur(8px)" }}
                      title="Rename"
                    >
                      <Pencil size={12} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(img.id)}
                      disabled={busy}
                      className="flex h-7 w-7 items-center justify-center rounded-sm"
                      style={{ background: "rgba(10,11,16,0.8)", color: "#f87171", backdropFilter: "blur(8px)" }}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Inline title edit */}
                <AnimatePresence>
                  {editingId === img.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                      style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}
                    >
                      <div className="p-3 flex flex-col gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          className="w-full rounded-sm px-2.5 py-1.5 text-xs outline-none"
                          style={{ background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-body)" }}
                        />
                        {editError && <p className="text-[11px]" style={{ color: "#f87171" }}>{editError}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(img.id)}
                            disabled={busy}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium flex-1 justify-center"
                            style={{ background: "var(--gold)", color: "#EDE9FE", fontFamily: "var(--font-body)" }}
                          >
                            <Check size={11} /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs flex-1 justify-center"
                            style={{ background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                          >
                            <X size={11} /> Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
