"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, CreditCard, Star } from "lucide-react"

const steps = [
  {
    icon: CheckCircle2,
    title: "Request Received",
    description: "Your booking request is in our system",
    active: true,
  },
  {
    icon: Clock,
    title: "Under Review",
    description: "Our team reviews within 24–48 hours",
    active: false,
  },
  {
    icon: CreditCard,
    title: "Approval & Deposit",
    description: "Confirm with a 30% deposit payment",
    active: false,
  },
  {
    icon: Star,
    title: "Confirmed!",
    description: "Your date is officially reserved",
    active: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
}

export default function NextStepsTimeline() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Vertical connecting line */}
      <div
        className="absolute left-[19px] top-6 bottom-6 w-px"
        style={{ background: "var(--border)" }}
      >
        {/* Filled portion — covers only first step */}
        <motion.div
          className="w-full"
          style={{ background: "var(--gold)", height: "0%" }}
          initial={{ height: "0%" }}
          animate={{ height: "16%" }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative flex items-start gap-4 py-3 pl-1"
            >
              {/* Circle node */}
              <div
                className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all"
                style={{
                  background: step.active
                    ? "linear-gradient(135deg, var(--gold-dim), var(--gold))"
                    : "var(--surface-2)",
                  border: step.active
                    ? "none"
                    : "1px solid var(--border)",
                  boxShadow: step.active
                    ? "0 0 20px rgba(109,40,217,0.25)"
                    : "none",
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: step.active ? "var(--base)" : "var(--text-muted)",
                  }}
                />
              </div>

              {/* Text */}
              <div className="pt-1.5">
                <p
                  className="text-sm font-medium leading-tight"
                  style={{
                    color: step.active ? "var(--gold)" : "var(--text-muted)",
                    fontFamily: step.active ? "var(--font-display)" : undefined,
                    fontSize: step.active ? "0.95rem" : undefined,
                  }}
                >
                  {step.title}
                  {i === 1 && (
                    <span
                      className="ml-2 text-xs font-normal"
                      style={{ color: "var(--text-muted)" }}
                    >
                      (24–48 hrs)
                    </span>
                  )}
                </p>
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: step.active ? "var(--text)" : "var(--surface-2)" }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
