"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, X, ExternalLink } from "lucide-react";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";
import type { Venue } from "@/types";

interface VenueMarker extends GlobeMarker {
  metadata: {
    venueId: string;
    address: string;
  };
}

interface MapClientProps {
  venues: Venue[];
}

function buildWazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

function buildGoogleMapsUrl(lat: number, lng: number, label: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(label)}`;
}

export default function MapClient({ venues }: MapClientProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const markers: VenueMarker[] = venues
    .filter((v) => v.latitude != null && v.longitude != null)
    .map((v) => ({
      lat: v.latitude!,
      lng: v.longitude!,
      label: v.name,
      metadata: {
        venueId: v.id,
        address: v.location ?? "",
      },
    }));

  function handleMarkerClick(marker: GlobeMarker) {
    const venue = venues.find(
      (v) =>
        (marker.metadata as VenueMarker["metadata"] | undefined)?.venueId === v.id,
    );
    if (venue) setSelectedVenue(venue);
  }

  return (
    <main
      className="relative min-h-screen"
      style={{ background: "var(--base)" }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(109,40,217,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Page header */}
      <div className="relative z-10 pt-28 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="mb-2 text-xs uppercase tracking-[0.3em]"
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-body)",
            }}
          >
            Our Location
          </div>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            Find Lumières Grand Hall
          </h1>
          <p
            className="mx-auto mt-3 max-w-sm text-sm"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            {markers.length > 0
              ? "Spin the globe and click the pin to get directions."
              : "Location details coming soon."}
          </p>
        </motion.div>
      </div>

      {/* Globe */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {markers.length > 0 ? (
          <Globe3D
            markers={markers}
            config={{
              atmosphereColor: "#7C3AED",
              atmosphereIntensity: 0.5,
              atmosphereBlur: 3,
              bumpScale: 4,
              autoRotateSpeed: 0.25,
              showAtmosphere: true,
            }}
            className="h-[520px]"
            onMarkerClick={handleMarkerClick}
          />
        ) : (
          <div
            className="flex h-64 items-center justify-center rounded-sm"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-1)",
            }}
          >
            <div className="text-center">
              <MapPin
                size={32}
                className="mx-auto mb-3"
                style={{ color: "var(--gold)" }}
              />
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Location not yet configured
              </p>
            </div>
          </div>
        )}

        {/* Hint text */}
        {markers.length > 0 && (
          <motion.p
            className="mt-3 text-center text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Drag to rotate • Click the glowing pin for directions
          </motion.p>
        )}
      </motion.div>

      {/* Venue popup modal */}
      <AnimatePresence>
        {selectedVenue && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(10,11,16,0.7)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVenue(null)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-sm p-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-hover)",
                boxShadow: "0 24px 64px rgba(109,40,217,0.25)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedVenue(null)}
                className="absolute right-3 top-3 rounded p-1 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>

              {/* Venue info */}
              <div className="mb-4 flex items-start gap-3">
                <div
                  className="mt-0.5 rounded p-2"
                  style={{
                    background: "rgba(109,40,217,0.12)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <MapPin size={18} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-light leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text)",
                    }}
                  >
                    {selectedVenue.name}
                  </h3>
                  {selectedVenue.location && (
                    <p
                      className="mt-0.5 text-xs leading-relaxed"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {selectedVenue.location}
                    </p>
                  )}
                  {selectedVenue.latitude && selectedVenue.longitude && (
                    <p
                      className="mt-1 text-[10px]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {selectedVenue.latitude.toFixed(6)}, {selectedVenue.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={buildWazeUrl(selectedVenue.latitude!, selectedVenue.longitude!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all"
                  style={{
                    background: "rgba(109,40,217,0.15)",
                    border: "1px solid var(--border-hover)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Navigation size={14} />
                  Waze
                </a>
                <a
                  href={buildGoogleMapsUrl(
                    selectedVenue.latitude!,
                    selectedVenue.longitude!,
                    selectedVenue.name,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all"
                  style={{
                    background: "rgba(109,40,217,0.15)",
                    border: "1px solid var(--border-hover)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <ExternalLink size={14} />
                  Google Maps
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
