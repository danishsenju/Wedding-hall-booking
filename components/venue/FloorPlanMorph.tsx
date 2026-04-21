"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/* ─── Layout Config ──────────────────────────────── */
type LayoutKey = "banquet" | "theatre" | "cocktail";

interface LayoutMeta {
  label: string;
  capacity: string;
  description: string;
}

const LAYOUT_META: Record<LayoutKey, LayoutMeta> = {
  banquet: {
    label: "Banquet",
    capacity: "500–800 pax",
    description: "Round tables with elegant dining arrangement",
  },
  theatre: {
    label: "Theatre",
    capacity: "800–1,000 pax",
    description: "Rows of seats facing the main stage",
  },
  cocktail: {
    label: "Cocktail",
    capacity: "300–500 pax",
    description: "Open-floor reception with high-table arrangement",
  },
};

/* ─── SVG Shapes ─────────────────────────────────── */

// Banquet: 8 round tables in 2 rows × 4 cols
function BanquetPlan() {
  const tables = [
    { cx: 82, cy: 120 },
    { cx: 214, cy: 120 },
    { cx: 346, cy: 120 },
    { cx: 478, cy: 120 },
    { cx: 82, cy: 240 },
    { cx: 214, cy: 240 },
    { cx: 346, cy: 240 },
    { cx: 478, cy: 240 },
  ];

  // 6 chair dots per table
  const chairAngles = [0, 60, 120, 180, 240, 300];

  return (
    <motion.g
      key="banquet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Entrance label */}
      <motion.rect
        x="195" y="8" width="170" height="28" rx="3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ fill: "var(--surface-2)", stroke: "var(--border)", strokeWidth: 1 }}
      />
      <text x="280" y="27" textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body)" letterSpacing="2">ENTRANCE</text>

      {tables.map((t, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
        >
          {/* Table */}
          <circle
            cx={t.cx} cy={t.cy} r={34}
            style={{ fill: "var(--surface-2)", stroke: "var(--gold)", strokeWidth: 1 }}
          />
          {/* Chair dots */}
          {chairAngles.map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={j}
                cx={t.cx + Math.cos(rad) * 47}
                cy={t.cy + Math.sin(rad) * 47}
                r={7}
                style={{ fill: "var(--surface-3)", stroke: "var(--border)", strokeWidth: 1 }}
              />
            );
          })}
          {/* Table number */}
          <text x={t.cx} y={t.cy + 4} textAnchor="middle" fontSize="11" fill="var(--gold)" fontFamily="var(--font-body)" opacity={0.8}>
            {i + 1}
          </text>
        </motion.g>
      ))}
    </motion.g>
  );
}

// Theatre: Stage + 5 rows of 9 seats
function TheatrePlan() {
  const seatsPerRow = 9;
  const rows = 5;
  const seatW = 34;
  const seatH = 20;
  const rowGap = 38;
  const colGap = 56;
  const startX = 28;
  const startY = 120;

  return (
    <motion.g
      key="theatre"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Stage */}
      <motion.rect
        x={60} y={18} width={440} height={68} rx="3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        style={{ fill: "var(--surface-2)", stroke: "var(--gold)", strokeWidth: 1.5 }}
      />
      <text x="280" y="57" textAnchor="middle" fontSize="11" fill="var(--gold)" fontFamily="var(--font-body)" letterSpacing="3">STAGE</text>

      {/* Lectern */}
      <motion.rect
        x={252} y={30} width={56} height={30} rx="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fill: "var(--surface-3)", stroke: "var(--border-hover)", strokeWidth: 1 }}
      />

      {/* Seats */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: seatsPerRow }, (_, c) => {
          const x = startX + c * colGap;
          const y = startY + r * rowGap;
          const delay = 0.08 + r * 0.06 + c * 0.025;
          return (
            <motion.rect
              key={`${r}-${c}`}
              x={x} y={y}
              width={seatW} height={seatH}
              rx="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fill: "var(--surface-2)",
                stroke: "var(--border)",
                strokeWidth: 1,
                transformOrigin: `${x + seatW / 2}px ${y + seatH / 2}px`,
              }}
            />
          );
        })
      )}

      {/* Aisle guides */}
      {[1, 2, 3, 4].map((r) => (
        <line
          key={r}
          x1={28} y1={startY + r * rowGap - 9}
          x2={532} y2={startY + r * rowGap - 9}
          stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 6"
        />
      ))}
    </motion.g>
  );
}

// Cocktail: open center dance floor + 12 high tables scattered
function CocktailPlan() {
  const highTables: Array<{ cx: number; cy: number }> = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    highTables.push({
      cx: 280 + Math.cos(angle) * 148,
      cy: 180 + Math.sin(angle) * 130,
    });
  }

  return (
    <motion.g
      key="cocktail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Dance floor */}
      <motion.ellipse
        cx={280} cy={180} rx={105} ry={90}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fill: "var(--surface-2)",
          stroke: "var(--gold)",
          strokeWidth: 1.5,
          transformOrigin: "280px 180px",
        }}
      />
      <motion.ellipse
        cx={280} cy={180} rx={80} ry={67}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          fill: "none",
          stroke: "var(--gold)",
          strokeWidth: 0.5,
          strokeDasharray: "6 8",
          transformOrigin: "280px 180px",
        }}
      />
      <text x="280" y="185" textAnchor="middle" fontSize="9" fill="var(--gold)" fontFamily="var(--font-body)" letterSpacing="2" opacity={0.8}>DANCE FLOOR</text>

      {/* High tables */}
      {highTables.map((t, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
        >
          <circle
            cx={t.cx} cy={t.cy} r={18}
            style={{ fill: "var(--surface-2)", stroke: "var(--border-hover)", strokeWidth: 1.2 }}
          />
          {/* Stools (tiny dots) */}
          {[0, 90, 180, 270].map((a, j) => {
            const r2 = (a * Math.PI) / 180;
            return (
              <circle key={j}
                cx={t.cx + Math.cos(r2) * 26}
                cy={t.cy + Math.sin(r2) * 26}
                r={5}
                style={{ fill: "var(--surface-3)", stroke: "var(--border)", strokeWidth: 0.8 }}
              />
            );
          })}
        </motion.g>
      ))}

      {/* Bar counter */}
      <motion.rect
        x={16} y={16} width={80} height={22} rx="2"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        style={{ fill: "var(--surface-3)", stroke: "var(--border-hover)", strokeWidth: 1 }}
      />
      <text x="56" y="31" textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontFamily="var(--font-body)" letterSpacing="1.5">BAR</text>
    </motion.g>
  );
}

/* ─── Main Component ─────────────────────────────── */
export default function FloorPlanMorph() {
  const [active, setActive] = useState<LayoutKey>("banquet");
  const meta = LAYOUT_META[active];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px w-8 opacity-50" style={{ background: "var(--gold)" }} />
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
            Floor Plan
          </span>
        </div>
        <h2
          className="font-light"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            color: "var(--text)",
          }}
        >
          Choose Your Layout
        </h2>
      </motion.div>

      {/* Layout selector cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {(Object.keys(LAYOUT_META) as LayoutKey[]).map((key) => {
          const isActive = active === key;
          return (
            <motion.button
              key={key}
              onClick={() => setActive(key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-sm px-4 py-4 text-left transition-colors"
              style={{
                background: isActive ? "rgba(201,168,76,0.08)" : "var(--surface-1)",
                border: `1px solid ${isActive ? "var(--gold)" : "var(--border)"}`,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="floor-active-bg"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span
                className="relative block text-sm font-medium"
                style={{ color: isActive ? "var(--gold)" : "var(--text)" }}
              >
                {LAYOUT_META[key].label}
              </span>
              <span
                className="relative mt-0.5 block text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                {LAYOUT_META[key].capacity}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Capacity + description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active + "-meta"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {meta.description}
          </p>
          <span
            className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "rgba(201,168,76,0.12)",
              color: "var(--gold)",
            }}
          >
            {meta.capacity}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* SVG Floor Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-sm"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Room boundary */}
        <div className="relative">
          <svg
            viewBox="0 0 560 360"
            className="w-full"
            style={{ display: "block", maxHeight: 360 }}
          >
            {/* Room outline */}
            <rect
              x="10" y="10" width="540" height="340" rx="4"
              style={{
                fill: "var(--surface-3)",
                stroke: "var(--border-hover)",
                strokeWidth: 1.5,
              }}
            />

            {/* Grid lines */}
            {[1, 2, 3, 4].map((n) => (
              <line
                key={`v-${n}`}
                x1={10 + n * 108} y1={10}
                x2={10 + n * 108} y2={350}
                stroke="rgba(201,168,76,0.06)"
                strokeWidth={1}
              />
            ))}
            {[1, 2].map((n) => (
              <line
                key={`h-${n}`}
                x1={10} y1={10 + n * 113}
                x2={550} y2={10 + n * 113}
                stroke="rgba(201,168,76,0.06)"
                strokeWidth={1}
              />
            ))}

            {/* Morphing content */}
            <AnimatePresence mode="wait">
              {active === "banquet" && <BanquetPlan />}
              {active === "theatre" && <TheatrePlan />}
              {active === "cocktail" && <CocktailPlan />}
            </AnimatePresence>
          </svg>

          {/* Legend */}
          <div
            className="flex items-center gap-4 border-t px-5 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
              Not to scale
            </span>
            <span className="h-px flex-1" style={{ background: "var(--border)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Lumières Grand Hall · Level 3
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
