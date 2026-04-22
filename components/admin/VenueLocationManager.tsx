"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Save,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import { updateVenueLocation } from "@/app/actions/venue";
import type { Venue } from "@/types";

// Leaflet requires browser APIs — load only on client
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface VenueLocationManagerProps {
  venues: Venue[];
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

type ToastState = { type: "success" | "error"; message: string } | null;

function Toast({ toast }: { toast: ToastState }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs"
          style={{
            background:
              toast.type === "success"
                ? "rgba(109,40,217,0.12)"
                : "rgba(239,68,68,0.1)",
            border: `1px solid ${toast.type === "success" ? "var(--border-hover)" : "rgba(239,68,68,0.3)"}`,
            color: toast.type === "success" ? "var(--gold)" : "#f87171",
            fontFamily: "var(--font-body)",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle size={12} />
          ) : (
            <AlertCircle size={12} />
          )}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  const [expanded, setExpanded] = useState(false);
  const [address, setAddress] = useState(venue.location ?? "");
  const [lat, setLat] = useState<string>(venue.latitude?.toString() ?? "");
  const [lng, setLng] = useState<string>(venue.longitude?.toString() ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hasCoords = venue.latitude != null && venue.longitude != null;

  const latNum = lat.trim() ? parseFloat(lat) : null;
  const lngNum = lng.trim() ? parseFloat(lng) : null;

  // Called when admin clicks or drags marker on the map
  const handleMapPick = useCallback(
    async (pickedLat: number, pickedLng: number) => {
      setLat(pickedLat.toFixed(6));
      setLng(pickedLng.toFixed(6));

      // Reverse geocode to auto-fill address
      setReversing(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pickedLat}&lon=${pickedLng}`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = await res.json();
        if (data?.display_name) {
          setAddress(data.display_name);
        }
      } catch {
        // silently ignore — admin can type address manually
      } finally {
        setReversing(false);
      }
    },
    [],
  );

  async function handleSearch() {
    const q = searchQuery.trim() || address.trim();
    if (!q) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const results: NominatimResult[] = await res.json();
      if (results.length > 0) {
        const r = results[0];
        setLat(parseFloat(r.lat).toFixed(6));
        setLng(parseFloat(r.lon).toFixed(6));
        if (!address.trim()) setAddress(r.display_name);
        showToast("success", "Coordinates found. Review and save.");
      } else {
        showToast("error", "No results found. Try a more specific address.");
      }
    } catch {
      showToast("error", "Geocoding failed. Enter coordinates manually.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSave() {
    const parsedLat = lat.trim() ? parseFloat(lat) : null;
    const parsedLng = lng.trim() ? parseFloat(lng) : null;

    if ((lat.trim() && isNaN(parsedLat!)) || (lng.trim() && isNaN(parsedLng!))) {
      showToast("error", "Invalid coordinates. Enter valid numbers.");
      return;
    }

    setSaving(true);
    const result = await updateVenueLocation({
      venueId: venue.id,
      location: address,
      latitude: parsedLat,
      longitude: parsedLng,
    });

    if (result.success) {
      showToast("success", "Location saved successfully.");
    } else {
      showToast("error", result.error ?? "Save failed.");
    }
    setSaving(false);
  }

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface-1)",
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors"
        style={{ color: "var(--text)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded p-1.5"
            style={{
              background: hasCoords ? "rgba(109,40,217,0.12)" : "rgba(109,40,217,0.05)",
              border: `1px solid ${hasCoords ? "var(--border-hover)" : "var(--border)"}`,
            }}
          >
            <MapPin
              size={14}
              style={{ color: hasCoords ? "var(--gold)" : "var(--text-muted)" }}
            />
          </div>
          <div>
            <div
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-body)", color: "var(--text)" }}
            >
              {venue.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {hasCoords
                ? `${venue.latitude!.toFixed(4)}, ${venue.longitude!.toFixed(4)}`
                : "No coordinates set"}
              {venue.location ? ` — ${venue.location}` : ""}
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </button>

      {/* Expanded form */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="space-y-4 border-t p-4"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Toast */}
              <Toast toast={toast} />

              {/* Interactive map */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    className="block text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Pin on Map
                  </label>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    <MousePointerClick size={11} />
                    Click map or drag pin to set location
                  </span>
                </div>
                <div
                  className="overflow-hidden rounded-sm"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <MapPicker
                    lat={latNum}
                    lng={lngNum}
                    onPick={handleMapPick}
                  />
                </div>
              </div>

              {/* Address field */}
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <label
                    className="block text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Address
                  </label>
                  {reversing && (
                    <Loader2
                      size={11}
                      className="animate-spin"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Auto-filled when you pin on map, or type manually"
                  className="w-full rounded-sm px-3 py-2 text-sm outline-none transition-colors"
                  style={{
                    background: "var(--surface-3)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              {/* Geocode search */}
              <div>
                <label
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Search by Place Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g. KLCC, Kuala Lumpur — moves the pin"
                    className="flex-1 rounded-sm px-3 py-2 text-sm outline-none"
                    style={{
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs transition-all disabled:opacity-50"
                    style={{
                      background: "rgba(109,40,217,0.15)",
                      border: "1px solid var(--border-hover)",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {searching ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Search size={13} />
                    )}
                    Search
                  </button>
                </div>
              </div>

              {/* Lat / Lng inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="3.1390"
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="101.6869"
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>
              </div>

              {/* Helper link */}
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(address || "Kuala Lumpur")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                <ExternalLink size={11} />
                Open in Google Maps for reference
              </a>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium tracking-wide transition-all disabled:opacity-50"
                  style={{
                    background: "var(--gold)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Save Location
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VenueLocationManager({ venues }: VenueLocationManagerProps) {
  if (venues.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-sm p-8 text-center"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface-1)",
        }}
      >
        <MapPin size={28} style={{ color: "var(--text-muted)" }} />
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          No venues found. Add a venue first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  );
}
