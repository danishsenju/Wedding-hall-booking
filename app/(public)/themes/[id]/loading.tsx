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

export default function ThemeDetailLoading() {
  return (
    <div style={{ background: "var(--base)" }}>
      {/* Hero skeleton */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Shimmer className="absolute inset-0 rounded-none" />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6">
          <Shimmer className="h-4 w-48" />
          <Shimmer className="h-24 w-80 md:w-[480px]" />
          <Shimmer className="h-5 w-64" />
          <Shimmer className="h-12 w-48" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-3xl px-6 py-24 space-y-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-4 w-full" />
        ))}
        <Shimmer className="h-4 w-3/4" />
      </div>
    </div>
  );
}
