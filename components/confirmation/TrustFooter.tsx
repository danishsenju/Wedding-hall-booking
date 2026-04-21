"use client"

import { motion } from "framer-motion"
import { Lock, Phone, ShieldCheck } from "lucide-react"

const items = [
  {
    icon: Lock,
    label: "Secure",
    sub: "256-bit SSL",
  },
  {
    icon: ShieldCheck,
    label: "Protected",
    sub: "Data encrypted",
  },
  {
    icon: Phone,
    label: "+60 12-345 6789",
    sub: "Mon–Sat 9am–6pm",
  },
]

export default function TrustFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="flex items-center justify-center gap-6 flex-wrap print:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-2">
            <Icon size={14} style={{ color: "var(--text-muted)" }} />
            <div>
              <p className="text-xs font-medium leading-none" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: "var(--surface-2)" }}>
                {item.sub}
              </p>
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
