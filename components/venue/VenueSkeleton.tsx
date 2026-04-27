"use client";

import { motion } from "framer-motion";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`rounded-sm ${className ?? ""}`}
      style={{ background: "var(--surface-2)", ...style }}
      animate={{ opacity: [0.4, 0.65, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function VenueSkeleton() {
  return (
    <div style={{ background: "var(--base)" }}>
      {/* Hero skeleton — matches VenueHero height */}
      <div className="relative overflow-hidden" style={{ height: "82vh", minHeight: 580 }}>
        <Shimmer className="absolute inset-0 rounded-none" />
        {/* Gradient overlay so it looks like the real hero */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, rgba(10,11,16,0.7) 65%, rgba(10,11,16,0.97) 100%)",
          }}
        />
        {/* Bottom content placeholder */}
        <div className="absolute bottom-0 w-full px-6 pb-16 md:pb-20">
          <div className="mx-auto max-w-6xl space-y-4">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-14 w-72 md:w-96" />
            <Shimmer className="h-4 w-80 md:w-[44ch]" style={{ marginTop: 8 }} />
            <div className="flex gap-2 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <Shimmer key={i} className="h-7 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery strip skeleton */}
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-6">
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-24 w-36 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Content skeleton — matches max-w-5xl single-column layout */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {/* SpecsGrid placeholder */}
          <div className="space-y-4">
            <Shimmer className="h-4 w-28" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Shimmer key={i} className="h-20" />
              ))}
            </div>
          </div>

          {/* AmenitiesTags placeholder */}
          <div className="space-y-4">
            <Shimmer className="h-4 w-36" />
            <div className="flex flex-wrap gap-2">
              {[80, 96, 72, 112, 88, 64, 104, 76].map((w, i) => (
                <Shimmer key={i} className="h-8 rounded-full" style={{ width: w }} />
              ))}
            </div>
          </div>

          {/* InclusionsChecklist placeholder */}
          <div className="space-y-4">
            <Shimmer className="h-4 w-44" />
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Shimmer className="h-5 w-5 flex-shrink-0 rounded-full" />
                  <Shimmer className="h-4 flex-1" style={{ maxWidth: `${60 + i * 8}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* FloorPlanMorph placeholder */}
          <div className="space-y-4">
            <Shimmer className="h-4 w-32" />
            <Shimmer className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
