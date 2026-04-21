"use client"

import { motion } from "framer-motion"
import type { BookingWithDetails } from "@/types"

interface TrendChartProps {
  bookings: BookingWithDetails[]
}

function getLast7Days(): { label: string; key: string }[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      key: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-MY", { weekday: "short" }),
    })
  }
  return days
}

export default function TrendChart({ bookings }: TrendChartProps) {
  const days = getLast7Days()

  const counts = days.map((day) => ({
    ...day,
    count: bookings.filter((b) => b.created_at.startsWith(day.key)).length,
  }))

  const max = Math.max(...counts.map((d) => d.count), 1)

  return (
    <div
      className="rounded-sm p-5"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Booking Trend
          </div>
          <div
            className="mt-0.5 text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Last 7 days
          </div>
        </div>
        <div
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
        >
          {counts.reduce((s, d) => s + d.count, 0)}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5" style={{ height: 64 }}>
        {counts.map((day, i) => {
          const pct = max > 0 ? (day.count / max) * 100 : 0
          const today = i === 6

          return (
            <div
              key={day.key}
              className="group flex flex-1 flex-col items-center gap-1"
              title={`${day.label}: ${day.count} booking${day.count !== 1 ? "s" : ""}`}
            >
              <div className="relative flex w-full flex-1 items-end">
                <motion.div
                  className="w-full rounded-t-sm"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.5,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{
                    height: `${Math.max(pct, 6)}%`,
                    background: today
                      ? "linear-gradient(180deg, var(--gold-hover), var(--gold))"
                      : "var(--surface-2)",
                    border: today
                      ? "none"
                      : "1px solid var(--border)",
                    transformOrigin: "bottom",
                    minHeight: 4,
                  }}
                />
                {day.count > 0 && (
                  <div
                    className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      color: today ? "var(--gold)" : "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {day.count}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="mt-1.5 flex gap-1.5">
        {counts.map((day, i) => (
          <div
            key={day.key}
            className="flex-1 text-center text-[9px] uppercase"
            style={{
              color: i === 6 ? "var(--gold)" : "var(--text-muted)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            {day.label}
          </div>
        ))}
      </div>
    </div>
  )
}
