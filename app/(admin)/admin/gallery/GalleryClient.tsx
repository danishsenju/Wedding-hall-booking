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
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div
            className="text-xs uppercase tracking-[0.25em] mb-1"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Admin
          </div>
          <h1
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Gallery
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Manage images shown on the public gallery page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <Link
            href="/gallery"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all"
            style={{
              background: "rgba(109,40,217,0.15)",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ExternalLink size={14} />
            View on Website
          </Link>
        </div>
      </div>

      {/* Add Image Form */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-sm p-6"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        <h2
          className="text-base font-medium mb-4"
          style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
        >
          Add New Image
        </h2>

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

        <button
          onClick={handleAdd}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "var(--gold)", color: "#EDE9FE", fontFamily: "var(--font-body)" }}
        >
          <Upload size={15} />
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
      </motion.div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-sm py-20"
          style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
        >
          <Images size={36} className="mb-3" style={{ color: "var(--gold)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            No gallery images yet. Upload your first image above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-sm overflow-hidden group"
                style={{ border: "1px solid var(--border)" }}
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(10,11,16,0.9) 0%, transparent 50%)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-4">
                    <p
                      className="text-sm font-light truncate"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                    >
                      {img.title}
                    </p>
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(img)}
                      className="rounded p-1.5"
                      style={{ background: "rgba(10,11,16,0.7)", color: "var(--text-muted)" }}
                      title="Rename"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={busy}
                      className="rounded p-1.5"
                      style={{ background: "rgba(10,11,16,0.7)", color: "#f87171" }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
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
                          style={{
                            background: "var(--surface-1)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontFamily: "var(--font-body)",
                          }}
                        />
                        {editError && (
                          <p className="text-[11px]" style={{ color: "#f87171" }}>{editError}</p>
                        )}
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
                            style={{
                              background: "var(--surface-1)",
                              border: "1px solid var(--border)",
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-body)",
                            }}
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
        </div>
      )}
    </div>
  );
}
