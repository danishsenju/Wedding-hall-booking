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

export default function BookingSkeleton() {
  return (
    <div
      className="min-h-screen px-4 py-12 md:py-16"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Step indicator skeleton */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Shimmer className="h-8 w-8 rounded-full" />
              {i < 3 && <Shimmer className="h-px w-12" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form skeleton */}
          <div
            className="rounded-2xl p-8 space-y-5"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
          >
            <Shimmer className="h-6 w-48" />
            <Shimmer className="h-12 w-full" />
            <Shimmer className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Shimmer className="h-12 w-full" />
              <Shimmer className="h-12 w-full" />
            </div>
            <Shimmer className="h-12 w-full" />
            <div className="flex justify-end gap-3 pt-2">
              <Shimmer className="h-11 w-28" />
              <Shimmer className="h-11 w-32" />
            </div>
          </div>

          {/* Summary skeleton */}
          <div
            className="hidden lg:block rounded-2xl p-6 space-y-4"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
          >
            <Shimmer className="h-5 w-32" />
            <div className="space-y-3 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Shimmer className="h-4 w-24" />
                  <Shimmer className="h-4 w-16" />
                </div>
              ))}
            </div>
            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between">
                <Shimmer className="h-5 w-16" />
                <Shimmer className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
