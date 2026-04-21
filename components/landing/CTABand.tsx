"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

function MagnetCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.32);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.32);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        x,
        y,
        background:
          "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
        color: "#06141B",
        fontFamily: "var(--font-body)",
        boxShadow: "0 4px 32px rgba(201,168,76,0.28)",
        cursor: "pointer",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-2 rounded-sm px-8 py-4 text-sm font-medium tracking-wide"
    >
      {children}
    </motion.a>
  );
}

export default function CTABand() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ornament */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span
              className="h-px w-16 opacity-25"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.32em]"
              style={{
                color: "var(--gold-dim)",
                fontFamily: "var(--font-body)",
              }}
            >
              Begin Your Journey
            </span>
            <span
              className="h-px w-16 opacity-25"
              style={{ background: "var(--gold)" }}
            />
          </div>

          {/* Quote */}
          <blockquote
            className="mb-3 font-light italic leading-relaxed"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
              lineHeight: 1.35,
            }}
          >
            &ldquo;Every love story deserves a setting worthy of the
            telling.&rdquo;
          </blockquote>

          <p
            className="mb-10 text-sm"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Reserve your date today. Availability is limited.
          </p>

          <MagnetCTA href="/book">Begin Your Story →</MagnetCTA>
        </motion.div>
      </div>
    </section>
  );
}
