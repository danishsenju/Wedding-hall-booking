"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 500, suffix: "+", label: "Weddings Hosted" },
  { value: 15, suffix: "", label: "Years of Excellence" },
  { value: 3, suffix: "", label: "Iconic Venues" },
  { value: 1200, suffix: "", label: "Guest Capacity" },
];

function NumberTicker({
  value,
  suffix,
  prefix,
  active,
}: StatItem & { active: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, value]);

  return (
    <>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      className="relative py-16"
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-[rgba(201,168,76,0.15)]">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}
              className="flex flex-col items-center gap-2 text-center lg:px-8"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold)",
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                <NumberTicker {...stat} active={isInView} />
              </span>
              <span
                className="text-xs uppercase tracking-[0.18em]"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
