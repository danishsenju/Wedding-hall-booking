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

export default function DashboardSkeleton() {
  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-8 w-48" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="h-9 w-24" />
            <Shimmer className="h-9 w-20" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-sm p-4 space-y-2"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            >
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-7 w-12" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Table */}
          <div className="flex-1 space-y-3">
            {/* Filter bar */}
            <div
              className="rounded-sm p-4 flex items-center gap-3"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            >
              <Shimmer className="h-9 flex-1" />
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <Shimmer key={i} className="h-9 w-20" />
                ))}
              </div>
            </div>

            {/* Table rows */}
            <div
              className="rounded-sm overflow-hidden"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3.5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <Shimmer className="h-4 w-24" />
                  <Shimmer className="h-4 flex-1" />
                  <Shimmer className="h-4 w-20" />
                  <Shimmer className="h-6 w-16" />
                  <Shimmer className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full space-y-4 lg:w-64">
            <div
              className="rounded-sm p-5 space-y-3"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            >
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-32 w-full" />
            </div>
            <div
              className="rounded-sm p-5 space-y-3"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            >
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
