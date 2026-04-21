"use client"

import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import type { BookingStatus } from "@/types"

type FilterValue = BookingStatus | "all"

interface FilterBarProps {
  filter: FilterValue
  onFilterChange: (f: FilterValue) => void
  search: string
  onSearchChange: (s: string) => void
  count: number
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
]

const FILTER_COLORS: Record<FilterValue, { active: string; dot: string }> = {
  all: { active: "var(--gold)", dot: "var(--gold)" },
  pending: { active: "#F59E0B", dot: "#F59E0B" },
  approved: { active: "#2DD4BF", dot: "#2DD4BF" },
  rejected: { active: "#F87171", dot: "#F87171" },
}

export default function FilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  count,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value
          const colors = FILTER_COLORS[f.value]
          return (
            <motion.button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all"
              style={{
                fontFamily: "var(--font-body)",
                border: active
                  ? `1px solid ${colors.active}`
                  : "1px solid var(--border)",
                background: active
                  ? `${colors.active}14`
                  : "var(--surface-1)",
                color: active ? colors.active : "var(--text-muted)",
              }}
            >
              {f.value !== "all" && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: active ? colors.dot : "var(--text-muted)" }}
                />
              )}
              {f.label}
            </motion.button>
          )
        })}

        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {count} booking{count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search
          size={14}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="search"
          placeholder="Search name or ref…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-sm border py-2 pl-8 pr-8 text-sm outline-none transition-colors"
          style={{
            background: "var(--surface-1)",
            borderColor: "var(--border)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            aria-label="Clear search"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}
