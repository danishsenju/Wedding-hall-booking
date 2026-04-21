"use client";

import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Car,
  Clock,
  MapPin,
  Maximize2,
  Users,
} from "lucide-react";

const SPECS = [
  {
    icon: Users,
    label: "Capacity",
    value: "100–1,000",
    unit: "Guests",
  },
  {
    icon: Maximize2,
    label: "Total Area",
    value: "15,000",
    unit: "sq ft",
  },
  {
    icon: ArrowUpDown,
    label: "Ceiling Height",
    value: "9.5",
    unit: "Metres",
  },
  {
    icon: Car,
    label: "Parking Bays",
    value: "400",
    unit: "Covered",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "KLCC",
    unit: "City Centre",
  },
  {
    icon: Clock,
    label: "Operating Hours",
    value: "8 AM",
    unit: "to 12 AM",
  },
];

export default function SpecsGrid() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <span
            className="h-px w-8 opacity-50"
            style={{ background: "var(--gold)" }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)" }}
          >
            Specifications
          </span>
        </div>
        <h2
          className="font-light"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            color: "var(--text)",
          }}
        >
          Venue at a Glance
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SPECS.map(({ icon: Icon, label, value, unit }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-sm p-5"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Hover shimmer */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)",
              }}
            />

            <Icon
              size={18}
              strokeWidth={1.5}
              style={{ color: "var(--gold)" }}
              className="mb-3"
            />
            <div
              className="mb-0.5 font-light leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--text)",
              }}
            >
              {value}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--gold)", letterSpacing: "0.06em" }}
            >
              {unit}
            </div>
            <div
              className="mt-1 text-[11px] uppercase tracking-[0.15em]"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
