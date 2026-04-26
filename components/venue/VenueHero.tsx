"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80";

interface VenueHeroProps {
  name?: string;
  subtitle?: string;
  heroImageUrl?: string;
  location?: string | null;
  capacityMax?: number | null;
}

export default function VenueHero({
  name = "Laman Troka",
  subtitle = "An architectural masterpiece where refined elegance meets flawless hospitality. Every celebration here becomes a story told forever.",
  heroImageUrl = FALLBACK_IMAGE,
  location = "KLCC, Kuala Lumpur",
  capacityMax,
}: VenueHeroProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ["0%", "12%"]);

  // Delay applying scroll-based opacity until the page scroll has settled at 0.
  // Without this, a client-side navigation from a scrolled page carries over the
  // old scroll position, making scrollYProgress > 0 on mount → contentOpacity = 0.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setScrollReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const tags = [
    { icon: MapPin, label: location ?? "Kuala Lumpur" },
    {
      icon: Users,
      label: capacityMax
        ? `Up to ${capacityMax.toLocaleString()} Guests`
        : "Up to 1,000 Guests",
    },
    { icon: Star, label: "15 Years of Excellence" },
    { icon: Clock, label: "8 AM – 12 AM Daily" },
  ];

  return (
    <section
      ref={ref}
      className="relative flex items-end overflow-hidden"
      style={{ height: "82vh", minHeight: 580 }}
    >
      {/* Parallax Photo */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: photoY, scale: 1.12 }}
      >
        <Image
          src={heroImageUrl || FALLBACK_IMAGE}
          alt={`${name} — elegant interior`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Multi-layer dark gradient */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,27,0.25) 0%, rgba(6,20,27,0.15) 30%, rgba(6,20,27,0.75) 65%, rgba(6,20,27,0.97) 100%)",
        }}
      />

      {/* Gold aurora glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(109,40,217,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: scrollReady ? contentOpacity : 1, y: contentY }}
        className="relative z-10 w-full px-6 pb-16 md:pb-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 flex items-center gap-3"
          >
            <span
              className="h-px w-10 opacity-60"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              The Venue
            </span>
          </motion.div>

          {/* Split-text animated title */}
          <h1
            className="mb-5 font-light"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
              lineHeight: 1.04,
              letterSpacing: "0.025em",
            }}
          >
            {name.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 44, rotateX: -55 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.35 + i * 0.028,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: char === " " ? "inline" : "inline-block",
                  transformOrigin: "bottom",
                }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-7 max-w-[44ch] text-base leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {subtitle}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-wrap gap-2.5"
          >
            {tags.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-wide"
                style={{
                  background: "rgba(17,33,45,0.75)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Icon size={11} style={{ color: "var(--gold)" }} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
