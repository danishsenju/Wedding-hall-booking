"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, X, ExternalLink, Locate, ZoomIn, ZoomOut } from "lucide-react";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";
import Particles from "@/components/ui/Particles";
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
  const [focusMarker, setFocusMarker] = useState<GlobeMarker | null>(null);

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

  function handleFindLocation() {
    if (markers.length === 0) return;
    // Spread to create a new object reference every click so the useEffect always fires
    setFocusMarker({ ...markers[0] });
  }

  const primaryVenue = venues[0] ?? null;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* Particles background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Particles
          particleColors={["#6D28D9", "#7C3AED", "#C4B5FD", "#A78BFA"]}
          particleCount={180}
          particleSpread={14}
          speed={0.04}
          particleBaseSize={70}
          moveParticlesOnHover={false}
          alphaParticles
          sizeRandomness={1.2}
          disableRotation={false}
          cameraDistance={22}
        />
      </div>

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(10,11,16,0.7) 100%)",
        }}
      />

      {/* Page header */}
      <div className="relative z-10 pt-28 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="mb-2 text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Our Location
          </div>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Find Laman Troka
          </h1>
          <p
            className="mx-auto mt-3 max-w-sm text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {markers.length > 0
              ? "Spin the globe · scroll to zoom · click the pin for directions"
              : "Location details coming soon."}
          </p>
        </motion.div>
      </div>

      {/* Globe section */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {markers.length > 0 ? (
          <>
            {/* Circular globe wrapper — border-radius + overflow:hidden clips canvas to circle */}
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none z-10"
                style={{
                  boxShadow:
                    "0 0 60px 16px rgba(109,40,217,0.25), 0 0 120px 40px rgba(109,40,217,0.1)",
                }}
              />

              {/* Scroll to zoom badge */}
              <motion.div
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 pointer-events-none"
                style={{
                  background: "rgba(10,11,16,0.7)",
                  border: "1px solid rgba(109,40,217,0.2)",
                  backdropFilter: "blur(6px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <ZoomIn size={11} style={{ color: "var(--text-muted)" }} />
                <ZoomOut size={11} style={{ color: "var(--text-muted)" }} />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Scroll to zoom
                </span>
              </motion.div>

              {/*
                Circle container: clips the Three.js canvas to a circle so the globe
                always appears as a full sphere — no rectangular corners at any zoom level.
                minDistance in Globe3D (5.5) ensures the sphere never overflows this circle.
              */}
              <div
                className="overflow-hidden rounded-full"
                style={{ width: "min(90vw, 520px)", aspectRatio: "1 / 1" }}
              >
                <Globe3D
                  markers={markers}
                  focusMarker={focusMarker}
                  config={{
                    atmosphereColor: "#7C3AED",
                    atmosphereIntensity: 0.5,
                    atmosphereBlur: 3,
                    bumpScale: 4,
                    autoRotateSpeed: 0.25,
                    showAtmosphere: true,
                    enableZoom: true,
                    minDistance: 5.5,
                    maxDistance: 18,
                  }}
                  className="h-full w-full"
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>

            {/* Find Our Location button — below the globe circle */}
            <motion.button
              onClick={handleFindLocation}
              className="mt-6 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all"
              style={{
                background: "rgba(109,40,217,0.85)",
                border: "1px solid rgba(196,181,253,0.25)",
                color: "#EDE9FE",
                fontFamily: "var(--font-body)",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ scale: 1.05, background: "rgba(124,58,237,0.95)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Locate size={14} />
              Find Our Location
            </motion.button>

            <motion.p
              className="mt-2 text-center text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Drag to rotate · scroll to zoom · click pin for directions
            </motion.p>
          </>
        ) : (
          <div
            className="flex h-64 w-full max-w-sm items-center justify-center rounded-sm"
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
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Location not yet configured
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Persistent venue info card */}
      {primaryVenue && primaryVenue.latitude && primaryVenue.longitude && (
        <motion.div
          className="relative z-10 mx-auto mt-8 mb-16 max-w-sm px-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div
            className="rounded-sm p-5"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-hover)",
              boxShadow: "0 16px 48px rgba(109,40,217,0.15)",
            }}
          >
            <div className="mb-4 flex items-start gap-3">
              <div
                className="mt-0.5 shrink-0 rounded p-2"
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
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {primaryVenue.name}
                </h3>
                {primaryVenue.location && (
                  <p
                    className="mt-0.5 text-xs leading-relaxed"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {primaryVenue.location}
                  </p>
                )}
                <p
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {primaryVenue.latitude.toFixed(6)}, {primaryVenue.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={buildWazeUrl(primaryVenue.latitude, primaryVenue.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all hover:opacity-80"
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
                  primaryVenue.latitude,
                  primaryVenue.longitude,
                  primaryVenue.name,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all hover:opacity-80"
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
          </div>
        </motion.div>
      )}

      {/* Pin-click modal */}
      <AnimatePresence>
        {selectedVenue && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(10,11,16,0.75)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVenue(null)}
            />

            <motion.div
              className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-sm p-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-hover)",
                boxShadow: "0 24px 64px rgba(109,40,217,0.3)",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
            >
              <button
                onClick={() => setSelectedVenue(null)}
                className="absolute right-3 top-3 rounded p-1 transition-colors hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>

              <div className="mb-4 flex items-start gap-3">
                <div
                  className="mt-0.5 shrink-0 rounded p-2"
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
                    style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                  >
                    {selectedVenue.name}
                  </h3>
                  {selectedVenue.location && (
                    <p
                      className="mt-0.5 text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
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

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={buildWazeUrl(selectedVenue.latitude!, selectedVenue.longitude!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all hover:opacity-80"
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
                  className="flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium tracking-wide transition-all hover:opacity-80"
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
