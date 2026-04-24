"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";

const Particles = dynamic(() => import("@/components/ui/Particles"), { ssr: false });

const HEADLINE = ["Where", "Love", "Finds", "Its", "Grandest", "Stage"];

const STATS = [
  { value: "500+", label: "Weddings Celebrated" },
  { value: "15,000", label: "Sq Ft of Elegance" },
  { value: "7", label: "Years of Excellence" },
  { value: "98%", label: "Client Satisfaction" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Timeless Elegance",
    desc: "Every detail — from bespoke lighting to hand-selected florals — is curated to evoke an enduring grandeur that photographs for a lifetime.",
  },
  {
    icon: Heart,
    title: "Bespoke Moments",
    desc: "No two love stories are alike. We tailor every element of your celebration to reflect your unique journey and the vision you hold.",
  },
  {
    icon: Users,
    title: "White-Glove Service",
    desc: "Our dedicated coordinators stand invisibly beside you from the first consultation to the final dance — flawless, always.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const wordVariant = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.88, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function AboutClient() {
  return (
    <main className="relative overflow-hidden" style={{ background: "var(--base)" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Particle background */}
        <div className="pointer-events-none absolute inset-0">
          <Particles
            particleCount={130}
            particleSpread={13}
            speed={0.05}
            particleColors={["#6D28D9", "#C4B5FD", "#4C1D95"]}
            alphaParticles
            particleBaseSize={75}
            sizeRandomness={1.3}
            disableRotation={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(109,40,217,0.07) 0%, rgba(10,11,16,0.72) 70%)",
            }}
          />
        </div>

        {/* Decorative rings */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
          style={{ border: "1px solid var(--gold)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ border: "1px solid var(--gold)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 flex items-center justify-center gap-3"
          >
            <span className="h-px w-14" style={{ background: "var(--gold)" }} />
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Est. 2017 · Kuala Lumpur
            </span>
            <span className="h-px w-14" style={{ background: "var(--gold)" }} />
          </motion.div>

          {/* Word-reveal headline */}
          <motion.h1
            className="mb-8 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {HEADLINE.map((word, i) => (
              <span key={i} className="overflow-hidden" style={{ display: "inline-block" }}>
                <motion.span
                  variants={wordVariant}
                  className="inline-block text-5xl font-light leading-tight md:text-7xl lg:text-8xl"
                  style={{ color: "var(--text)" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            className="mx-auto mb-12 max-w-lg text-base leading-relaxed md:text-lg"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Kuala Lumpur&apos;s most celebrated wedding destination — where timeless elegance meets impeccable Malaysian hospitality.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.25 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 px-9 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
              style={{
                background: "var(--gold)",
                color: "#fff",
                fontFamily: "var(--font-body)",
              }}
            >
              Begin Your Journey
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-9 py-3.5 text-sm tracking-wide transition-all duration-300"
              style={{
                border: "1px solid var(--border-hover)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              View Gallery
            </Link>
          </motion.div>
        </div>

        {/* Scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Scroll
            </span>
            <div
              className="h-9 w-px"
              style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee Strip ─────────────────────────────────────── */}
      <div
        className="overflow-hidden border-y py-5"
        style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="flex gap-14 whitespace-nowrap"
        >
          {Array.from({ length: 2 }).flatMap((_, i) =>
            ["Elegance", "·", "Tradition", "·", "Excellence", "·", "Love", "·", "Moments", "·", "Kuala Lumpur", "·"].map(
              (w, j) => (
                <span
                  key={`${i}-${j}`}
                  className="text-xs uppercase tracking-[0.35em]"
                  style={{
                    color: w === "·" ? "var(--gold)" : "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {w}
                </span>
              )
            )
          )}
        </motion.div>
      </div>

      {/* ── Story ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          {/* Left: narrative */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-3 text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Our Story
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mb-8 text-4xl font-light leading-snug md:text-5xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Born from a Passion
              <br />
              <em>for Perfection</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mb-6 leading-loose"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}
            >
              Laman Troka was founded in 2017 with a singular conviction: that every couple deserves a wedding day that feels like a dream made tangible. Nestled in the heart of Kuala Lumpur, our 15,000 square foot venue is a canvas of refined architecture, draped in warm gold and natural light.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="leading-loose"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}
            >
              Over seven years and five hundred celebrations later, we have perfected the art of the unforgettable. Each event carries our promise — invisible service, exquisite detail, and memories that outlast the moment.
            </motion.p>
          </motion.div>

          {/* Right: editorial quote frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div
              className="relative h-[440px] w-full overflow-hidden"
              style={{ background: "var(--surface-2)" }}
            >
              {/* Corner accents */}
              {[
                "left-4 top-4 border-l border-t",
                "right-4 top-4 border-r border-t",
                "bottom-4 left-4 border-b border-l",
                "bottom-4 right-4 border-b border-r",
              ].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute h-8 w-8 opacity-50 ${pos}`}
                  style={{ borderColor: "var(--gold)" }}
                />
              ))}

              {/* Quote content */}
              <div className="flex h-full flex-col items-center justify-center gap-5 px-10 text-center">
                <div
                  className="h-px w-16"
                  style={{
                    background: "linear-gradient(to right, transparent, var(--gold), transparent)",
                  }}
                />
                <p
                  className="text-2xl font-light italic leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
                >
                  &ldquo;A wedding venue should feel like a world built just for you.&rdquo;
                </p>
                <div
                  className="h-px w-16"
                  style={{
                    background: "linear-gradient(to right, transparent, var(--gold), transparent)",
                  }}
                />
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                >
                  — Founder, Laman Troka
                </p>
              </div>

              {/* Bottom glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 85%, rgba(109,40,217,0.14), transparent)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values / Pillars ──────────────────────────────────── */}
      <section
        className="border-t py-28"
        style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-3 text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              What We Believe In
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-light md:text-5xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Our Pillars
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i}
                className="group relative p-9 transition-all duration-500"
                style={{
                  background: "var(--surface-3)",
                  border: "1px solid var(--border)",
                }}
                whileHover={{ borderColor: "rgba(109,40,217,0.38)" }}
              >
                {/* Top accent line on hover */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-px"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--gold), transparent)",
                  }}
                />

                <Icon
                  className="mb-7 h-5 w-5"
                  style={{ color: "var(--gold)" }}
                  strokeWidth={1.5}
                />
                <h3
                  className="mb-4 text-xl font-light"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="grid grid-cols-2 gap-10 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div
                  className="mb-3 text-5xl font-light tracking-tight md:text-6xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {value}
                </div>
                <div
                  className="h-px w-8 mx-auto mb-3"
                  style={{ background: "var(--gold)" }}
                />
                <div
                  className="text-xs uppercase tracking-[0.25em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section
        className="border-t py-36"
        style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl px-6 text-center"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-5 text-xs uppercase tracking-[0.35em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Begin Your Story
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-6 text-4xl font-light leading-snug md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Ready to Create Something
            <br />
            <em>Extraordinary?</em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mb-12 leading-loose"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Your wedding is a once-in-a-lifetime occasion. Let us help you craft every moment with the care and artistry it deserves.
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 px-11 py-4 text-sm font-medium tracking-wide transition-all duration-300"
              style={{
                background: "var(--gold)",
                color: "#fff",
                fontFamily: "var(--font-body)",
              }}
            >
              Reserve Your Date
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-11 py-4 text-sm tracking-wide transition-all duration-300 hover:text-[var(--text)]"
              style={{
                border: "1px solid var(--border-hover)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Speak With Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
