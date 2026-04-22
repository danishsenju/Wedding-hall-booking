"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Theme as DbTheme } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carousel from "@/components/ui/carousel";

interface Theme {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  priceFrom: string;
  mood: string;
}

const THEMES: Theme[] = [
  {
    id: "garden",
    name: "Garden Romance",
    tagline: "Where Nature Embraces Love",
    description:
      "Lush florals, soft whites, and the gentle rustle of leaves — a ceremony that feels like stepping into a fairytale garden at golden hour.",
    imageUrl:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    priceFrom: "RM 22,000",
    mood: "Romantic · Natural · Whimsical",
  },
  {
    id: "ballroom",
    name: "Grand Ballroom",
    tagline: "Timeless Opulence Redefined",
    description:
      "Crystal chandeliers, cascading floral arrangements, and a sweeping aisle that commands the room. The ultimate statement of love and luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    priceFrom: "RM 35,000",
    mood: "Opulent · Classic · Grand",
  },
  {
    id: "rustic",
    name: "Rustic Elegance",
    tagline: "Warmth in Every Detail",
    description:
      "Reclaimed wood, candlelight, and wild botanical arrangements. A celebration rooted in warmth, authenticity, and timeless charm.",
    imageUrl:
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80",
    priceFrom: "RM 18,000",
    mood: "Warm · Authentic · Intimate",
  },
  {
    id: "modern",
    name: "Modern Luxe",
    tagline: "Sleek. Refined. Unforgettable.",
    description:
      "Clean architectural lines, dramatic lighting, and a monochromatic palette accented with gold. For the couple who defines elegance on their own terms.",
    imageUrl:
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80",
    priceFrom: "RM 28,000",
    mood: "Contemporary · Dramatic · Refined",
  },
  {
    id: "royal",
    name: "Royal Heritage",
    tagline: "A Celebration Fit for Royalty",
    description:
      "Inspired by regal ceremonies of the past — deep jewel tones, gilded accents, and ceremonial grandeur that echoes through generations.",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    priceFrom: "RM 45,000",
    mood: "Regal · Majestic · Heritage",
  },
];

function dbThemesToLocal(items: DbTheme[]): Theme[] {
  return items.map((t) => ({
    id: t.id,
    name: t.name,
    tagline: t.tagline ?? "",
    description: t.description ?? "",
    imageUrl: t.image_url ?? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    priceFrom: t.price_from_rm ? `RM ${t.price_from_rm.toLocaleString()}` : "Contact us",
    mood: t.mood ?? "",
  }));
}

/* ─── Expanded modal card ──────────────────────────── */
function ExpandedCard({
  theme,
  onClose,
}: {
  theme: Theme;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleBook = () => {
    router.push(`/book?theme=${encodeURIComponent(theme.id)}`);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{
        background: "rgba(10,11,16,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${theme.name} details`}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-sm"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={theme.imageUrl}
            alt={theme.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, var(--surface-1) 0%, transparent 55%)",
            }}
          />
          <button
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{
              background: "rgba(10,11,16,0.65)",
              color: "var(--text)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p
            className="mb-1 text-xs uppercase tracking-[0.22em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            {theme.mood}
          </p>
          <h2
            className="mb-1 font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "1.75rem",
            }}
          >
            {theme.name}
          </h2>
          <p
            className="mb-4 text-sm italic"
            style={{
              color: "var(--rose)",
              fontFamily: "var(--font-display)",
            }}
          >
            &ldquo;{theme.tagline}&rdquo;
          </p>
          <p
            className="mb-6 text-sm leading-relaxed"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            {theme.description}
          </p>

          <div
            className="mb-6 flex items-center justify-between rounded-sm px-4 py-3"
            style={{ background: "var(--surface-2)" }}
          >
            <span
              className="text-xs uppercase tracking-[0.15em]"
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
                fontSize: "1.5rem",
              }}
            >
              {theme.priceFrom}
            </span>
          </div>

          <motion.button
            className="w-full rounded-sm py-3.5 text-sm font-medium tracking-wide"
            whileHover={{ opacity: 0.92 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background:
                "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
              color: "#EDE9FE",
              fontFamily: "var(--font-body)",
            }}
            onClick={handleBook}
          >
            Book This Theme →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ─── Main carousel component ─────────────────────── */
export default function ThemeCarousel({
  initialThemes,
}: {
  initialThemes?: DbTheme[];
} = {}) {
  const themes =
    initialThemes && initialThemes.length > 0
      ? dbThemesToLocal(initialThemes)
      : THEMES;

  const slideData = themes.map((theme) => ({
    title: theme.name,
    button: "Explore Theme",
    src: theme.imageUrl,
  }));

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  return (
    <section
      id="themes"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Wedding Themes
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
              fontSize: "clamp(1.8rem, 4vw, 3.25rem)",
            }}
          >
            Find Your Perfect Style
          </h2>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative overflow-hidden w-full pb-20">
          <Carousel
            slides={slideData}
            onSlideSelect={(index) => setSelectedTheme(themes[index])}
          />
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Click a slide to focus · Press the button to explore details
        </p>
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {selectedTheme && (
          <ExpandedCard
            theme={selectedTheme}
            onClose={() => setSelectedTheme(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
