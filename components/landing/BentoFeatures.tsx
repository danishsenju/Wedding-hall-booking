"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MagicBento from "./MagicBento";

export default function BentoFeatures() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="features"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* Ambient depth orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse at center, #6D28D9 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-[380px] h-[280px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(ellipse at center, #7C3AED 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 w-full">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{
                background: "linear-gradient(to right, transparent, rgba(109,40,217,0.6))",
              }}
            />
            <span
              style={{
                color: "rgba(196, 181, 253, 0.7)",
                fontFamily: "var(--font-body)",
                fontSize: "0.63rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              Why Laman Troka
            </span>
            <span
              className="h-px w-12"
              style={{
                background: "linear-gradient(to left, transparent, rgba(109,40,217,0.6))",
              }}
            />
          </div>

          <h2
            className="mb-5 font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.9rem, 4.5vw, 3.6rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
            }}
          >
            Everything Under One Roof
          </h2>

          <p
            className="mx-auto max-w-xl leading-relaxed"
            style={{
              color: "rgba(167, 139, 250, 0.6)",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
            }}
          >
            From the first consultation to the last dance, every element of your
            celebration is handled with obsessive attention to detail.
          </p>
        </motion.div>

        {/* Bento grid */}
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
    </section>
  );
}
