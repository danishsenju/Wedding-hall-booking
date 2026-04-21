"use client";

import { motion, useInView } from "framer-motion";
import {
  CalendarCheck,
  Camera,
  ChefHat,
  Crown,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
  hasPattern?: boolean;
}

const FEATURES: Feature[] = [
  {
    icon: Crown,
    title: "Exclusive Venue",
    description:
      "Your wedding is the only event we host on your date. Every detail, every moment — yours alone. No shared lobbies, no competing celebrations.",
    colSpan: 2,
    rowSpan: 2,
    hasPattern: true,
  },
  {
    icon: Users,
    title: "Expert Coordination",
    description:
      "A dedicated wedding coordinator from day one through the final toast.",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    icon: ChefHat,
    title: "Gourmet Catering",
    description:
      "Bespoke menus by Michelin-trained chefs. Western, Asian, and fusion stations.",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    icon: Camera,
    title: "Photography Studio",
    description:
      "In-house studio with award-winning photographers and cinematic videographers.",
    colSpan: 1,
    rowSpan: 2,
  },
  {
    icon: Sparkles,
    title: "Luxury Décor",
    description:
      "From minimalist to maximalist — our design team transforms vision into breathtaking reality.",
    colSpan: 1,
    rowSpan: 2,
  },
  {
    icon: CalendarCheck,
    title: "Smart Booking",
    description:
      "Real-time availability, instant confirmation, and a seamless digital experience.",
    colSpan: 1,
    rowSpan: 1,
  },
];

/* ─── Card spotlight effect ──────────────────────── */
function CardSpotlight({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, show: false });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  };

  const onMouseLeave = () => setSpot((s) => ({ ...s, show: false }));

  return (
    <div
      ref={divRef}
      className={className}
      style={{ ...style, position: "relative", overflow: "hidden" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Spotlight radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.show ? 1 : 0,
          background: `radial-gradient(280px circle at ${spot.x}px ${spot.y}px, rgba(201,168,76,0.065) 0%, transparent 55%)`,
          zIndex: 1,
        }}
      />
      <div className="relative z-[2] h-full">{children}</div>
    </div>
  );
}

/* ─── Feature card ───────────────────────────────── */
function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.55, ease: "easeOut" }}
      className={[
        feature.colSpan === 2 ? "sm:col-span-2 lg:col-span-2" : "",
        feature.rowSpan === 2 ? "lg:row-span-2" : "",
      ]
        .join(" ")
        .trim()}
    >
      <CardSpotlight
        className="group h-full cursor-default rounded-sm p-6 transition-[border-color] duration-300 hover:border-[var(--border-hover)]"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          minHeight:
            feature.rowSpan === 2
              ? "280px"
              : feature.colSpan === 2
                ? "240px"
                : "180px",
        }}
      >
        {/* Subtle geometric pattern for tallest (exclusive) card */}
        {feature.hasPattern && (
          <div
            className="pointer-events-none absolute inset-0 rounded-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%23C9A84C' stroke-width='0.5' stroke-opacity='0.12'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "40px 40px",
              opacity: 0.4,
              zIndex: 0,
            }}
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        <div
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid var(--border)",
          }}
        >
          <Icon size={19} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
        </div>

        {/* Text */}
        <h3
          className="mb-2 font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: feature.colSpan === 2 ? "1.5rem" : "1.2rem",
          }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          {feature.description}
        </p>
      </CardSpotlight>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────── */
export default function BentoFeatures() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="features"
      className="relative py-24 lg:py-32"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Why Lumières
            </span>
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
          </div>
          <h2
            className="mb-4 font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            Everything Under One Roof
          </h2>
          <p
            className="mx-auto max-w-xl text-base leading-relaxed"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            From the first consultation to the last dance, every element of your
            celebration is handled with obsessive attention to detail.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
