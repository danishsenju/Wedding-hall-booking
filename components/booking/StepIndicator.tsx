"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"

const STEPS = [
  { n: 1 as const, label: "Your Details" },
  { n: 2 as const, label: "Date & Time" },
  { n: 3 as const, label: "Add-ons" },
  { n: 4 as const, label: "Review" },
]

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const totalSteps = STEPS.length
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full select-none">
      {/* ── Nodes + connector lines ── */}
      <div className="relative flex items-center justify-between">
        {/* Base track */}
        <div
          className="absolute inset-y-1/2 left-0 h-px w-full -translate-y-1/2"
          style={{ background: "var(--border)" }}
          aria-hidden="true"
        />

        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-1/2 left-0 h-px origin-left -translate-y-1/2"
          style={{
            background: "linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 100%)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progressPct / 100 }}
          transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
          aria-hidden="true"
        />

        {STEPS.map((step) => {
          const done = currentStep > step.n
          const active = currentStep === step.n
          const upcoming = currentStep < step.n

          return (
            <div
              key={step.n}
              className="relative z-10 flex flex-col items-center gap-2"
              aria-current={active ? "step" : undefined}
            >
              {/* Node circle */}
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
                animate={{
                  backgroundColor: done
                    ? "var(--gold)"
                    : active
                      ? "var(--surface-2)"
                      : "var(--surface-1)",
                  borderColor: done
                    ? "var(--gold)"
                    : active
                      ? "var(--gold)"
                      : "rgba(109,40,217,0.22)",
                  color: done
                    ? "#06141B"
                    : active
                      ? "var(--gold)"
                      : "var(--text-muted)",
                  scale: active ? 1.12 : 1,
                  boxShadow: active
                    ? "0 0 0 4px rgba(109,40,217,0.12)"
                    : "0 0 0 0px rgba(109,40,217,0)",
                }}
                style={{ border: "1px solid", fontFamily: "var(--font-body)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "backOut" }}
                    >
                      <Check size={15} strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`n-${step.n}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {step.n}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label — hidden on xs */}
              <motion.span
                className="hidden text-[10px] uppercase tracking-[0.18em] sm:block"
                animate={{
                  color: active
                    ? "var(--gold)"
                    : done
                      ? "var(--text-muted)"
                      : upcoming
                        ? "rgba(155,168,171,0.45)"
                        : "var(--text-muted)",
                  fontWeight: active ? 600 : 400,
                }}
                style={{ fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
                transition={{ duration: 0.25 }}
              >
                {step.label}
              </motion.span>
            </div>
          )
        })}
      </div>

      {/* ── Progress bar below ── */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Step {currentStep} of {totalSteps}
        </span>
        <motion.span
          className="text-[11px] font-medium"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          key={progressPct}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(progressPct)}% complete
        </motion.span>
      </div>

      <div
        className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--surface-2)" }}
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--gold-dim), var(--gold-hover))",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
        />
      </div>
    </div>
  )
}
