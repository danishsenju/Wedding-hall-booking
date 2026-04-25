"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface GalleryStripProps {
  images: string[];
}

export default function GalleryStrip({ images }: GalleryStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  if (images.length === 0) return null;

  return (
    <section
      ref={ref}
      className="overflow-hidden py-12"
      style={{ background: "var(--surface-1)" }}
    >
      <motion.div style={{ x }} className="flex gap-4 px-6">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex-shrink-0 overflow-hidden rounded-sm"
            style={{
              width: "clamp(280px, 35vw, 480px)",
              height: "clamp(180px, 22vw, 300px)",
              border: "1px solid var(--border)",
            }}
          >
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 280px, 35vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,20,27,0.8) 0%, transparent 55%)",
              }}
            />
            <span
              className="absolute bottom-4 left-5 text-xs"
              style={{
                color: "var(--gold)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                letterSpacing: "0.12em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
