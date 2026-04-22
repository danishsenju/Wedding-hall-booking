"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MagicBento from "./MagicBento";

/* ─── Section ────────────────────────────────────── */
export default function BentoFeatures() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="features"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-6xl px-4 w-full">
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
        <div className="flex justify-center">
        <MagicBento
          textAutoHide={true}
          enableStars
          enableSpotlight
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect
          spotlightRadius={400}
          particleCount={12}
          glowColor="109, 40, 217"
          disableAnimations={false}
        />
        </div>
      </div>
    </section>
  );
}
