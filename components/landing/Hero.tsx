"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/* ─── Flip Words ─────────────────────────────────── */
const FLIP_WORDS = ["Timeless", "Magical", "Unforgettable", "Breathtaking"];
const HERO_TITLE = "Lumières Grand Hall";

function FlipWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2500
    );
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      className="relative inline-block overflow-visible"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 36, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -36, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          style={{ color: "var(--gold)" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Typewriter ─────────────────────────────────── */
function Typewriter({
  text,
  onComplete,
  skip,
}: {
  text: string;
  onComplete: () => void;
  skip: boolean;
}) {
  const [displayed, setDisplayed] = useState(skip ? text : "");
  const completedRef = useRef(false);

  const done = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (skip) {
      setDisplayed(text);
      done();
      return;
    }
    if (displayed.length >= text.length) {
      done();
      return;
    }
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 68);
    return () => clearTimeout(timeout);
  }, [displayed, text, skip, done]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          className="ml-0.5 inline-block w-[2px]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{
            background: "var(--gold)",
            height: "0.85em",
            verticalAlign: "middle",
            display: "inline-block",
          }}
        />
      )}
    </>
  );
}

/* ─── Magnet Button ──────────────────────────────── */
interface MagnetButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

function MagnetButton({ href, children, variant = "primary" }: MagnetButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={
        variant === "primary"
          ? {
              x,
              y,
              background:
                "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
              color: "#06141B",
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 24px rgba(201,168,76,0.3)",
            }
          : {
              x,
              y,
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
            }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-sm font-medium tracking-wide"
    >
      {children}
    </motion.a>
  );
}

/* ─── Hero Section ───────────────────────────────── */
type AnimPhase = "eyebrow" | "typing" | "subline" | "cta" | "done";

const PHASE_ORDER: AnimPhase[] = [
  "eyebrow",
  "typing",
  "subline",
  "cta",
  "done",
];

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<AnimPhase>("eyebrow");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Kickoff sequence (or skip all if reduced-motion)
  useEffect(() => {
    if (reducedMotion) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setPhase("typing"), 500);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Spotlight mouse tracking
  useEffect(() => {
    const update = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update, { passive: true });
    return () => window.removeEventListener("mousemove", update);
  }, []);

  const isVisible = (target: AnimPhase): boolean => {
    if (reducedMotion) return true;
    return PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(target);
  };

  const onTypewriterDone = useCallback(() => {
    setTimeout(() => setPhase("subline"), 250);
  }, []);

  const onSublineAnimDone = () => {
    if (phase === "subline") {
      setTimeout(() => setPhase("cta"), 350);
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80"
          alt="Lumières Grand Hall — elegant wedding ceremony"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.22 }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,20,27,0.65) 0%, rgba(6,20,27,0.45) 40%, rgba(6,20,27,0.9) 100%)",
          }}
        />
      </div>

      {/* ── Aurora layer 1 ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={reducedMotion ? {} : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(201,168,76,0.11) 0%, transparent 65%)",
        }}
      />

      {/* ── Aurora layer 2 ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={reducedMotion ? {} : { opacity: [0.3, 0.65, 0.3], scale: [1.05, 1, 1.05] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 85% 80%, rgba(197,186,196,0.06) 0%, transparent 65%)",
        }}
      />

      {/* ── Aurora layer 3 ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={
          reducedMotion
            ? {}
            : { opacity: [0.2, 0.5, 0.2], x: [-20, 20, -20], y: [-10, 10, -10] }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)",
        }}
      />

      {/* ── Noise texture overlay (SVG feTurbulence) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── Desktop mouse spotlight ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] hidden lg:block"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201,168,76,0.055) 0%, transparent 60%)`,
          transition: "background 0.08s ease",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible("eyebrow") ? 1 : 0, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <span
            className="h-px w-14 opacity-50"
            style={{ background: "var(--gold)" }}
          />
          <span
            className="text-xs uppercase tracking-[0.32em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Kuala Lumpur · Est. 2009
          </span>
          <span
            className="h-px w-14 opacity-50"
            style={{ background: "var(--gold)" }}
          />
        </motion.div>

        {/* Main title (typewriter) */}
        <h1
          className="mb-3 font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
            lineHeight: 1.06,
            letterSpacing: "0.03em",
          }}
        >
          {isVisible("typing") ? (
            <Typewriter
              text={HERO_TITLE}
              onComplete={onTypewriterDone}
              skip={reducedMotion}
            />
          ) : (
            <span className="opacity-0">{HERO_TITLE}</span>
          )}
        </h1>

        {/* Flip words line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isVisible("typing") ? 1 : 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.3rem, 3vw, 2rem)",
            color: "var(--text-muted)",
            fontWeight: 300,
          }}
        >
          <span>Where</span>
          {isVisible("typing") && <FlipWords words={FLIP_WORDS} />}
          <span>Memories Begin</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isVisible("subline") ? 1 : 0, y: 0 }}
          onAnimationComplete={onSublineAnimDone}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Kuala Lumpur&apos;s most refined wedding destination. Three iconic venues,
          bespoke packages from{" "}
          <span style={{ color: "var(--gold)" }}>RM 18,000</span>, and
          flawless coordination for your perfect celebration.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible("cta") ? 1 : 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagnetButton href="/book" variant="primary">
            Book Your Date
          </MagnetButton>
          <MagnetButton href="#venues" variant="outline">
            Explore Venues
          </MagnetButton>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible("cta") ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            style={{ color: "var(--gold)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
