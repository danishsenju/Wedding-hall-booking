"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    alt: "Grand ceremony hall setup",
    caption: "Ceremony Hall",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    alt: "Elegant banquet table arrangement",
    caption: "Banquet Setup",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    alt: "Luxury ballroom with chandeliers",
    caption: "Grand Ballroom",
  },
];

export default function GalleryStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={ref}
      className="overflow-hidden py-12"
      style={{ background: "var(--surface-1)" }}
    >
      <motion.div style={{ x }} className="flex gap-4 px-6">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.caption}
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
              src={photo.src}
              alt={photo.alt}
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
              className="absolute bottom-4 left-5 text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              {photo.caption}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
