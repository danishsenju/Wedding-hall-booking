"use client";

import { motion } from "framer-motion";

function Shimmer({ className }: { className: string }) {
  return (
    <motion.div
      className={`rounded-sm ${className}`}
      style={{ background: "var(--surface-2)" }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function VenueSkeleton() {
  return (
    <div style={{ background: "var(--base)" }}>
      {/* Hero skeleton */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Shimmer className="h-full w-full rounded-none" />
      </div>

      {/* Gallery strip skeleton */}
      <div className="flex gap-3 px-4 py-6 overflow-hidden max-w-7xl mx-auto">
        {[0, 1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-24 w-36 flex-shrink-0" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <div className="space-y-3">
              <Shimmer className="h-6 w-32" />
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <Shimmer key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Shimmer className="h-6 w-28" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Shimmer key={i} className="h-8 w-20" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Shimmer className="h-6 w-36" />
              {[0, 1, 2, 3, 4].map((i) => (
                <Shimmer key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>

          <div
            className="hidden lg:block rounded-2xl p-6 space-y-5 h-fit"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
          >
            <Shimmer className="h-6 w-40" />
            <Shimmer className="h-8 w-32" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex justify-between">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-4 w-20" />
                </div>
              ))}
            </div>
            <Shimmer className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
