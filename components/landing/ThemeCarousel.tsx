"use client";

import { motion } from "framer-motion";
import type { Theme as DbTheme } from "@/types";
import { useRouter } from "next/navigation";
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
    imageUrl:
      t.image_url ??
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    priceFrom: t.price_from_rm
      ? `RM ${t.price_from_rm.toLocaleString()}`
      : "Contact us",
    mood: t.mood ?? "",
  }));
}

/* ─── Main carousel component ─────────────────────── */
export default function ThemeCarousel({
  initialThemes,
}: {
  initialThemes?: DbTheme[];
} = {}) {
  const router = useRouter();
  const themes =
    initialThemes && initialThemes.length > 0
      ? dbThemesToLocal(initialThemes)
      : THEMES;

  const slideData = themes.map((theme) => ({
    title: theme.name,
    button: "Explore Theme",
    src: theme.imageUrl,
  }));

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

        {/* 3D Carousel — button navigates to detail page */}
        <div className="relative w-full overflow-hidden pb-20">
          <Carousel
            slides={slideData}
            onSlideSelect={(index) => router.push(`/themes/${themes[index].id}`)}
          />
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Click a slide to focus · Press the button to view the full experience
        </p>
      </div>
    </section>
  );
}
