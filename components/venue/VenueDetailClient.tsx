"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Car,
  Clock,
  MapPin,
  Maximize2,
  Users,
} from "lucide-react";
import type { Venue } from "@/types";

/* ─── Hero ─────────────────────────────────────────────── */

function VenueHero({ venue }: { venue: Venue }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setScrollReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollReady ? ref : undefined,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative flex items-end overflow-hidden"
      style={{ height: "80vh", minHeight: 560, background: "var(--base)" }}
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-[1.12]" style={{ y: imageY }}>
        {venue.hero_image_url ? (
          <Image
            src={venue.hero_image_url}
            alt={venue.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full" style={{ background: "var(--surface-1)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,11,16,0.18) 0%, rgba(10,11,16,0.5) 38%, rgba(10,11,16,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(109,40,217,0.12) 0%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* Back link */}
      <div
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pb-6 pt-8"
        style={{
          background: "linear-gradient(to bottom, rgba(10,11,16,0.65) 0%, transparent 100%)",
        }}
      >
        <Link href="/#venues">
          <motion.div
            className="flex items-center gap-2 text-sm"
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ color: "rgba(196,181,253,0.65)", fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            All Venues
          </motion.div>
        </Link>
        <div
          className="text-xs uppercase tracking-[0.32em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          Laman Troka
        </div>
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 w-full px-6 pb-16 md:pb-20"
        style={{ y: scrollReady ? contentY : "0%", opacity: scrollReady ? contentOpacity : 1 }}
      >
        <div className="mx-auto max-w-5xl">
          {venue.tag && (
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-4 inline-block rounded-sm px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
              style={{
                background: "rgba(109,40,217,0.15)",
                border: "1px solid var(--border-hover)",
                color: "var(--gold)",
              }}
            >
              {venue.tag}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-light leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: "var(--text)",
              letterSpacing: "0.02em",
              marginBottom: "1rem",
            }}
          >
            {venue.name}
          </motion.h1>

          {venue.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl font-light italic"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--rose)",
                fontSize: "clamp(1rem, 2vw, 1.4rem)",
              }}
            >
              {venue.subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Specs ─────────────────────────────────────────────── */

function VenueSpecs({ venue }: { venue: Venue }) {
  const capacityLabel =
    venue.capacity_min && venue.capacity_max
      ? `${venue.capacity_min.toLocaleString()}–${venue.capacity_max.toLocaleString()}`
      : venue.capacity_max
        ? `Up to ${venue.capacity_max.toLocaleString()}`
        : "—";

  const specs = [
    { icon: Users, label: "Capacity", value: capacityLabel, unit: "Guests" },
    {
      icon: Maximize2,
      label: "Total Area",
      value: venue.size_sqft ? venue.size_sqft.toLocaleString() : "—",
      unit: "sq ft",
    },
    {
      icon: ArrowUpDown,
      label: "Ceiling Height",
      value: venue.ceiling_height_m ? String(venue.ceiling_height_m) : "—",
      unit: "Metres",
    },
    {
      icon: Car,
      label: "Parking Bays",
      value: venue.parking_bays ? venue.parking_bays.toLocaleString() : "—",
      unit: "Covered",
    },
    { icon: MapPin, label: "Location", value: venue.location ?? "—", unit: "Malaysia" },
    { icon: Clock, label: "Operating Hours", value: "8 AM – 12 AM", unit: "Daily" },
  ];

  return (
    <section className="py-24 lg:py-32" style={{ background: "var(--base)" }}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 opacity-50" style={{ background: "var(--gold)" }} />
            <span
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Specifications
            </span>
          </div>
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
            }}
          >
            Venue at a Glance
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {specs.map(({ icon: Icon, label, value, unit }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-4%" }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-sm p-5"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              <Icon size={18} strokeWidth={1.5} style={{ color: "var(--gold)" }} className="mb-3" />
              <div
                className="mb-0.5 font-light leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                  color: "var(--text)",
                }}
              >
                {value}
              </div>
              <div
                className="text-xs"
                style={{
                  color: "var(--gold)",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-body)",
                }}
              >
                {unit}
              </div>
              <div
                className="mt-1 text-[11px] uppercase tracking-[0.15em]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        {venue.description && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-4%" }}
            transition={{ duration: 0.7 }}
            className="mt-12 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {venue.description}
          </motion.p>
        )}
      </div>
    </section>
  );
}

/* ─── Root ──────────────────────────────────────────────── */

export default function VenueDetailClient({ venue }: { venue: Venue }) {
  return (
    <div style={{ background: "var(--base)" }}>
      <VenueHero venue={venue} />
      <VenueSpecs venue={venue} />
    </div>
  );
}
