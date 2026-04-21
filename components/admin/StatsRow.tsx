"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { CalendarCheck, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { AdminStats } from "@/app/actions/admin"

/* ─── Count-up ─────────────────────────────────────── */
function CountUp({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration * 60)
    const id = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(id)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(id)
  }, [inView, target, duration])

  return <span ref={ref}>{count}</span>
}

/* ─── Card Spotlight ───────────────────────────────── */
function SpotlightCard({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Spotlight */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity"
          style={{
            background: `radial-gradient(180px circle at ${pos.x}px ${pos.y}px, rgba(201,168,76,0.07) 0%, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/* ─── Stats Row ────────────────────────────────────── */
interface StatsRowProps {
  stats: AdminStats
}

export default function StatsRow({ stats }: StatsRowProps) {
  const cards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: <CalendarCheck size={18} strokeWidth={1.5} />,
      color: "var(--gold)",
      bg: "rgba(201,168,76,0.08)",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: <Clock size={18} strokeWidth={1.5} />,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: <CheckCircle2 size={18} strokeWidth={1.5} />,
      color: "#2DD4BF",
      bg: "rgba(45,212,191,0.08)",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <XCircle size={18} strokeWidth={1.5} />,
      color: "#F87171",
      bg: "rgba(248,113,113,0.08)",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, i) => (
        <SpotlightCard key={card.label} delay={i * 0.08}>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {card.label}
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-sm"
                style={{ background: card.bg, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            <div
              className="text-3xl font-light"
              style={{ fontFamily: "var(--font-display)", color: card.color }}
            >
              <CountUp target={card.value} />
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>
  )
}
