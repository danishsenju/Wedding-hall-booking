"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Theme } from "@/types";

/* ─── Hero ─────────────────────────────────────────── */

function ThemeHero({ theme }: { theme: Theme }) {
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
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const moodTags =
    theme.mood
      ?.split("·")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 scale-[1.12]"
        style={{ y: imageY }}
      >
        {theme.image_url && (
          <Image
            src={theme.image_url}
            alt={theme.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,11,16,0.18) 0%, rgba(10,11,16,0.5) 38%, rgba(10,11,16,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 50% 50%, transparent 25%, rgba(44,10,100,0.5) 100%)",
          }}
        />
      </motion.div>

      {/* Top bar */}
      <div
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pb-6 pt-8"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,11,16,0.65) 0%, transparent 100%)",
        }}
      >
        <Link href="/#themes">
          <motion.div
            className="flex items-center gap-2 text-sm"
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              color: "rgba(196,181,253,0.65)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            All Themes
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
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ y: contentY, opacity: scrollReady ? contentOpacity : 1 }}
      >
        {/* Mood pills */}
        {moodTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
          >
            {moodTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.2em]"
                style={{
                  background: "rgba(109,40,217,0.12)",
                  border: "1px solid rgba(109,40,217,0.38)",
                  color: "var(--rose)",
                  fontFamily: "var(--font-body)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-light leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: "clamp(3.5rem, 10vw, 8.5rem)",
            marginBottom: "1.5rem",
          }}
        >
          {theme.name}
        </motion.h1>

        {/* Tagline */}
        {theme.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-10 max-w-xl font-light italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--rose)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{theme.tagline}&rdquo;
          </motion.p>
        )}

        {/* Price badge */}
        {theme.price_from_rm && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32 }}
            className="inline-flex items-center gap-4 rounded-sm px-7 py-3.5"
            style={{
              background: "rgba(10,11,16,0.55)",
              border: "1px solid rgba(109,40,217,0.32)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.28em]"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Starting from
            </span>
            <span
              className="font-light"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--gold)",
                fontSize: "1.65rem",
              }}
            >
              RM {theme.price_from_rm.toLocaleString()}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
        style={{ opacity: scrollCueOpacity }}
      >
        <span
          className="text-xs uppercase tracking-[0.32em]"
          style={{
            color: "rgba(167,139,250,0.45)",
            fontFamily: "var(--font-body)",
          }}
        >
          Explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown
            size={15}
            strokeWidth={1.5}
            style={{ color: "rgba(167,139,250,0.45)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Story / Aesthetic ─────────────────────────────── */

function ThemeStory({ theme }: { theme: Theme }) {
  if (!theme.description) return null;

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 flex items-center gap-4">
            <span
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
            <span
              className="flex items-center gap-2 text-xs uppercase tracking-[0.32em]"
              style={{
                color: "var(--gold)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Sparkles size={11} />
              The Aesthetic
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
          </div>

          <p
            className="font-light leading-[2]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
            }}
          >
            {theme.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Gallery ───────────────────────────────────────── */

function GalleryImage({
  src,
  alt,
  index,
  className,
  style,
}: {
  src: string;
  alt: string;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-sm ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: "rgba(109,40,217,0.08)",
          border: "1px solid rgba(109,40,217,0.3)",
        }}
      />
    </motion.div>
  );
}

function ThemeGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <section
      className="py-20"
      style={{ background: "var(--surface-3, #0D0C1A)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span
            className="text-xs uppercase tracking-[0.32em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Gallery
          </span>
        </motion.div>

        {images.length === 1 && (
          <GalleryImage
            src={images[0]}
            alt="Gallery image 1"
            index={0}
            className="w-full"
            style={{ height: "480px" }}
          />
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((src, i) => (
              <GalleryImage
                key={i}
                src={src}
                alt={`Gallery image ${i + 1}`}
                index={i}
                style={{ height: "400px" }}
              />
            ))}
          </div>
        )}

        {images.length >= 3 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {/* First image spans 2 rows on lg */}
            <GalleryImage
              src={images[0]}
              alt="Gallery image 1"
              index={0}
              className="col-span-2 lg:col-span-1 lg:row-span-2"
              style={{ height: "332px" }}
            />
            {images.slice(1, 5).map((src, i) => (
              <GalleryImage
                key={i + 1}
                src={src}
                alt={`Gallery image ${i + 2}`}
                index={i + 1}
                style={{ height: "160px" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Features / What's Included ───────────────────── */

function ThemeFeatures({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              What&rsquo;s Included
            </span>
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
          </div>
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
            }}
          >
            Crafted in Every Detail
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-3%" }}
              transition={{
                delay: i * 0.055,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-4 rounded-sm p-4"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.055 + 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "rgba(109,40,217,0.15)",
                  border: "1px solid rgba(109,40,217,0.38)",
                }}
              >
                <Check
                  size={11}
                  strokeWidth={2.5}
                  style={{ color: "var(--gold)" }}
                />
              </motion.div>
              <span
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Strip ─────────────────────────────────────── */

function ThemeCTA({ theme }: { theme: Theme }) {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden py-28 lg:py-36"
      style={{ background: "var(--surface-1)" }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(109,40,217,0.1) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Highlight quote */}
        {theme.highlight_quote && (
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 font-light italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--rose)",
              fontSize: "clamp(1.4rem, 3vw, 2.25rem)",
              lineHeight: 1.55,
            }}
          >
            &ldquo;{theme.highlight_quote}&rdquo;
          </motion.blockquote>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.75 }}
        >
          <p
            className="mb-2 text-xs uppercase tracking-[0.32em]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Ready to make it yours?
          </p>

          <h2
            className="mb-8 font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.1,
            }}
          >
            Book {theme.name}
          </h2>

          {theme.price_from_rm && (
            <p
              className="mb-10 text-sm"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Starting from{" "}
              <span
                className="font-light"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold)",
                  fontSize: "1.3rem",
                }}
              >
                RM {theme.price_from_rm.toLocaleString()}
              </span>
            </p>
          )}

          <motion.button
            onClick={() =>
              router.push(`/book?theme=${encodeURIComponent(theme.name)}`)
            }
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            className="rounded-sm px-10 py-4 text-sm font-medium tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
              color: "#EDE9FE",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            Reserve This Experience →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Related Themes ────────────────────────────────── */

function RelatedThemes({ themes }: { themes: Theme[] }) {
  if (themes.length === 0) return null;

  return (
    <section
      className="py-20 lg:py-28"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span
            className="text-xs uppercase tracking-[0.32em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Discover More
          </span>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {themes.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link
                href={`/themes/${t.id}`}
                className="group relative block h-60 overflow-hidden rounded-sm"
                style={{ border: "1px solid var(--border)" }}
              >
                {t.image_url && (
                  <Image
                    src={t.image_url}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(10,11,16,0.88) 0%, transparent 55%)",
                  }}
                />
                <div className="absolute bottom-0 p-5">
                  <p
                    className="font-light leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text)",
                      fontSize: "1.3rem",
                    }}
                  >
                    {t.name}
                  </p>
                  {t.mood && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {t.mood}
                    </p>
                  )}
                </div>

                {/* Hover border glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ border: "1px solid rgba(109,40,217,0.45)" }}
                />

                {/* Arrow */}
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ background: "rgba(109,40,217,0.2)", border: "1px solid rgba(109,40,217,0.4)" }}>
                  <ArrowRight size={13} strokeWidth={1.5} style={{ color: "var(--rose)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Root ──────────────────────────────────────────── */

export default function ThemeDetailClient({
  theme,
  related,
}: {
  theme: Theme;
  related: Theme[];
}) {
  return (
    <div style={{ background: "var(--base)" }}>
      <ThemeHero theme={theme} />
      <ThemeStory theme={theme} />
      <ThemeGallery images={theme.gallery_images ?? []} />
      <ThemeFeatures features={theme.features ?? []} />
      <ThemeCTA theme={theme} />
      <RelatedThemes themes={related} />
    </div>
  );
}
