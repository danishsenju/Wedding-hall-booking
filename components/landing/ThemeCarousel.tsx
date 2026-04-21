"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
      "https://images.unsplash.com/photo-1526824267900-c8f39bd01e74?w=800&q=80",
    priceFrom: "RM 45,000",
    mood: "Regal · Majestic · Heritage",
  },
];

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
        background: "rgba(6,20,27,0.85)",
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
              background: "rgba(6,20,27,0.65)",
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
              color: "#06141B",
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

/* ─── Individual card ──────────────────────────────── */
function ThemeCard({
  theme,
  index,
  onSelect,
}: {
  theme: Theme;
  index: number;
  onSelect: (t: Theme) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09, duration: 0.5 }}
      whileHover={{ y: -5 }}
      onClick={() => onSelect(theme)}
      className="relative cursor-pointer overflow-hidden rounded-sm text-left"
      aria-label={`Explore ${theme.name} theme`}
      style={{
        width: "min(80vw, 320px)",
        flexShrink: 0,
        height: "460px",
        border: "1px solid var(--border)",
        scrollSnapAlign: "start",
      }}
    >
      <Image
        src={theme.imageUrl}
        alt={theme.name}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.04]"
        sizes="320px"
      />

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(6,20,27,0.92) 0%, rgba(6,20,27,0.25) 50%, transparent 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p
          className="mb-1.5 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          {theme.mood}
        </p>
        <h3
          className="mb-1 font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: "1.4rem",
          }}
        >
          {theme.name}
        </h3>
        <p
          className="mb-4 text-xs leading-snug"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {theme.tagline}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            From{" "}
            <span style={{ color: "var(--gold)" }}>{theme.priceFrom}</span>
          </span>
          <span
            className="rounded-sm px-2.5 py-1 text-[11px]"
            style={{
              border: "1px solid var(--border-hover)",
              color: "var(--gold)",
              fontFamily: "var(--font-body)",
            }}
          >
            Explore →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Main carousel component ─────────────────────── */
export default function ThemeCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const checkBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkBounds, { passive: true });
    checkBounds();
    return () => el.removeEventListener("scroll", checkBounds);
  }, [checkBounds]);

  const scroll = useCallback((direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 350 : -350,
      behavior: "smooth",
    });
  }, []);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scroll("right");
      if (e.key === "ArrowLeft") scroll("left");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scroll]);

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    startScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = startScrollLeft.current - (x - startX.current) * 1.4;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <section
      id="themes"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header row */}
        <div className="mb-12 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 flex items-center gap-3">
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

          {/* Arrow controls — desktop only */}
          <div className="hidden items-center gap-3 lg:flex" aria-label="Carousel navigation">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30"
              style={{
                border: "1px solid var(--border-hover)",
                color: "var(--text-muted)",
              }}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30"
              style={{
                border: "1px solid var(--border-hover)",
                color: "var(--text-muted)",
              }}
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: "grab",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {THEMES.map((theme, i) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={i}
              onSelect={setSelectedTheme}
            />
          ))}
          {/* Right padding buffer */}
          <div className="w-6 shrink-0" aria-hidden="true" />
        </div>

        <p
          className="mt-4 text-center text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Click any theme to explore · Use ← → keys to navigate
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
