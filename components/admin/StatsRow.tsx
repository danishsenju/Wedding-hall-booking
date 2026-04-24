"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { CalendarCheck, CheckCircle2, Clock, TrendingUp, XCircle } from "lucide-react"
import type { AdminStats } from "@/app/actions/admin"

/* ─── Spring count-up ──────────────────────────────── */
function SpringCount({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 60, damping: 18, mass: 1 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    raw.set(target)
  }, [inView, target, raw])

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)))
  }, [spring])

  return <span ref={ref}>{display}</span>
}

/* ─── Orbital ring ─────────────────────────────────── */
function OrbitalRing({ color }: { color: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        border: `1px solid ${color}`,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
  )
}

/* ─── Stat card ────────────────────────────────────── */
interface CardDef {
  label: string
  value: number
  total: number
  icon: React.ReactNode
  color: string
  bg: string
  pulse?: boolean
}

function StatCard({ card, delay }: { card: CardDef; delay: number }) {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const pct = card.total > 0 ? Math.round((card.value / card.total) * 100) : 0

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? card.color + "44" : "var(--border)"}`,
        transition: "border-color 0.3s",
      }}
    >
      {/* Spotlight radial */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: `radial-gradient(160px circle at ${pos.x}px ${pos.y}px, ${card.color}12 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
          boxShadow: `0 0 8px ${card.color}`,
          transformOrigin: "center",
        }}
      />

      {/* Hover orbital ring */}
      {hovered && <OrbitalRing color={card.color + "55"} />}

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.22em] leading-tight"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {card.label}
          </span>

          {/* Icon badge */}
          <div
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
            style={{ background: card.bg, color: card.color }}
          >
            {card.pulse && (
              <motion.div
                className="absolute -inset-0.5 rounded-sm"
                animate={{ opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ border: `1px solid ${card.color}` }}
              />
            )}
            {card.icon}
          </div>
        </div>

        {/* Value */}
        <div
          className="mb-3 text-4xl font-light leading-none"
          style={{ fontFamily: "var(--font-display)", color: card.color, letterSpacing: "0.02em" }}
        >
          <SpringCount target={card.value} />
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div
            className="h-px w-full overflow-hidden rounded-full"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: delay + 0.3, duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
              style={{
                background: `linear-gradient(90deg, ${card.color}88, ${card.color})`,
                boxShadow: `0 0 6px ${card.color}66`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-[10px] tabular-nums"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {pct}% of total
            </span>
            {card.value > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.5, duration: 0.3 }}
                className="flex items-center gap-0.5"
                style={{ color: card.color }}
              >
                <TrendingUp size={10} strokeWidth={2} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Stats Row ────────────────────────────────────── */
export default function StatsRow({ stats }: { stats: AdminStats }) {
  const cards: CardDef[] = [
    {
      label: "Total Bookings",
      value: stats.total,
      total: stats.total,
      icon: <CalendarCheck size={16} strokeWidth={1.5} />,
      color: "var(--gold)",
      bg: "rgba(109,40,217,0.1)",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      total: stats.total,
      icon: <Clock size={16} strokeWidth={1.5} />,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
      pulse: true,
    },
    {
      label: "Approved",
      value: stats.approved,
      total: stats.total,
      icon: <CheckCircle2 size={16} strokeWidth={1.5} />,
      color: "#2DD4BF",
      bg: "rgba(45,212,191,0.1)",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      total: stats.total,
      icon: <XCircle size={16} strokeWidth={1.5} />,
      color: "#F87171",
      bg: "rgba(248,113,113,0.1)",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} card={card} delay={i * 0.09} />
      ))}
    </div>
  )
}
