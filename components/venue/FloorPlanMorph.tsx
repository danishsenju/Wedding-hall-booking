"use client";

import { motion } from "framer-motion";

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

  const chairAngles = [0, 60, 120, 180, 240, 300];

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Entrance label */}
      <motion.rect
        x="195" y="8" width="170" height="28" rx="3"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ fill: "var(--surface-2)", stroke: "var(--border)", strokeWidth: 1 }}
      />
      <text x="280" y="27" textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body)" letterSpacing="2">ENTRANCE</text>

      {tables.map((t, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
        >
          <circle
            cx={t.cx} cy={t.cy} r={34}
            style={{ fill: "var(--surface-2)", stroke: "var(--gold)", strokeWidth: 1 }}
          />
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
          <text x={t.cx} y={t.cy + 4} textAnchor="middle" fontSize="11" fill="var(--gold)" fontFamily="var(--font-body)" opacity={0.8}>
            {i + 1}
          </text>
        </motion.g>
      ))}
    </motion.g>
  );
}

export default function FloorPlanMorph() {
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
          Banquet Layout
        </h2>
      </motion.div>

      {/* Meta row */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Round tables with elegant dining arrangement
        </p>
        <span
          className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: "rgba(109,40,217,0.12)", color: "var(--gold)" }}
        >
          500–800 pax
        </span>
      </div>

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
                stroke="rgba(109,40,217,0.06)"
                strokeWidth={1}
              />
            ))}
            {[1, 2].map((n) => (
              <line
                key={`h-${n}`}
                x1={10} y1={10 + n * 113}
                x2={550} y2={10 + n * 113}
                stroke="rgba(109,40,217,0.06)"
                strokeWidth={1}
              />
            ))}

            <BanquetPlan />
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
              Laman Troka · Level 3
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
