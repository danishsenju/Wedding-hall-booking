"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

export default function CheckmarkAnimation() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const animation = path.animate(
      [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
      { duration: 800, easing: "ease-out", fill: "forwards", delay: 300 }
    )

    return () => animation.cancel()
  }, [])

  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid var(--gold)" }}
        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid var(--gold)" }}
        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />

      {/* Gold circle */}
      <motion.div
        className="relative flex items-center justify-center w-20 h-20 rounded-full"
        style={{ background: "linear-gradient(135deg, var(--gold-dim), var(--gold))" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        {/* Checkmark SVG */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          className="overflow-visible"
        >
          <path
            ref={pathRef}
            d="M8 18 L15.5 25.5 L28 11"
            stroke="var(--base)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  )
}
