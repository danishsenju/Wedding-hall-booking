"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

/* ─── Types ────────────────────────────────────────── */
export interface ActivityEntry {
  id: string
  action: "approved" | "rejected"
  ref: string
  couple: string
  timestamp: number
}

const STORAGE_KEY = "lmr-admin-activity"
const MAX_ENTRIES = 5

/* ─── Helpers ──────────────────────────────────────── */
export function logActivity(entry: Omit<ActivityEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return
  const prev = loadActivity()
  const next: ActivityEntry[] = [
    { ...entry, id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() },
    ...prev,
  ].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

function loadActivity(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ActivityEntry[]) : []
  } catch {
    return []
  }
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

/* ─── Component ────────────────────────────────────── */
interface ActivityLogProps {
  /** Pass a refresh token (e.g. action counter) to trigger re-read from storage */
  refreshToken: number
}

export default function ActivityLog({ refreshToken }: ActivityLogProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([])

  useEffect(() => {
    setEntries(loadActivity())
  }, [refreshToken])

  return (
    <div
      className="rounded-sm p-5"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="mb-4 text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        Recent Activity
      </div>

      {entries.length === 0 ? (
        <div
          className="flex items-center gap-2 py-2 text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          <Clock size={13} strokeWidth={1.5} />
          No actions yet
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.22 }}
                className="flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  {e.action === "approved" ? (
                    <CheckCircle2
                      size={13}
                      strokeWidth={2}
                      style={{ color: "#2DD4BF" }}
                    />
                  ) : (
                    <XCircle
                      size={13}
                      strokeWidth={2}
                      style={{ color: "#F87171" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs leading-snug"
                    style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
                  >
                    <span
                      style={{
                        color:
                          e.action === "approved" ? "#2DD4BF" : "#F87171",
                      }}
                    >
                      {e.action === "approved" ? "Approved" : "Rejected"}
                    </span>{" "}
                    {e.couple}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {e.ref} · {timeAgo(e.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
