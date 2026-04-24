"use client";

import { motion } from "framer-motion";
import { FocusCards } from "@/components/ui/focus-cards";
import ColorBends from "@/components/ui/color-bends";
import type { GalleryImage } from "@/types";

interface Props {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: Props) {
  const cards = images.map((img) => ({ title: img.title, src: img.image_url }));

  return (
    <main className="relative min-h-screen" style={{ background: "var(--base)" }}>
      {/* ColorBends background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ColorBends
          colors={["#1a098a"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent={false}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,11,16,0.55)" }} />
      </div>

      {/* Page header */}
      <div className="relative z-10 pt-28 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="mb-2 text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Our Collection
          </div>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Gallery
          </h1>
          <p
            className="mx-auto mt-3 max-w-sm text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            A glimpse into the elegance and moments crafted at Laman Troka.
          </p>
        </motion.div>
      </div>

      {/* Gallery grid */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-4 pb-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {cards.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-sm py-24"
            style={{ border: "1px dashed var(--border)", background: "var(--surface-1)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Gallery coming soon. Check back shortly.
            </p>
          </div>
        ) : (
          <FocusCards cards={cards} />
        )}
      </motion.div>
    </main>
  );
}
