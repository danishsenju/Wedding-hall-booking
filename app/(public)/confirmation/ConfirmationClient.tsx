"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { BookingWithDetails } from "@/types"
import ActionButtons from "@/components/confirmation/ActionButtons"
import BookingDetails from "@/components/confirmation/BookingDetails"
import CheckmarkAnimation from "@/components/confirmation/CheckmarkAnimation"
import NextStepsTimeline from "@/components/confirmation/NextStepsTimeline"
import TrustFooter from "@/components/confirmation/TrustFooter"

interface Props {
  ref_code: string
}

export default function ConfirmationClient({ ref_code }: Props) {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null)

  useEffect(() => {
    if (!ref_code) return
    fetch(`/api/booking?ref=${encodeURIComponent(ref_code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: BookingWithDetails | null) => setBooking(d))
      .catch(() => null)
  }, [ref_code])

  return (
    <>
      {/* ─── Aurora Background ─────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{ background: "var(--base)" }}
        />
        {/* Gold blob */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Rose blob */}
        <motion.div
          className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-8"
          style={{ background: "radial-gradient(circle, #C5BAC4 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Warm gold bottom */}
        <motion.div
          className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl opacity-8"
          style={{ background: "radial-gradient(circle, #E8C97A 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* Noise texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
          <filter id="noise-conf">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-conf)" />
        </svg>
      </div>

      {/* ─── Print Styles ──────────────────────────── */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          [style*="--base"] { background: white !important; }
          [style*="--surface"] { background: #f8f8f8 !important; }
          [style*="--text"] { color: black !important; }
          [style*="--gold"] { color: #8A6F32 !important; }
        }
      `}</style>

      {/* ─── Content ──────────────────────────────── */}
      <main className="relative min-h-screen flex flex-col items-center justify-start px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Header card */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-4"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.08)",
            }}
          >
            <CheckmarkAnimation />

            <div className="text-center mb-6">
              <h1
                className="text-3xl md:text-4xl font-light mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                Request Received
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Thank you for choosing{" "}
                <span style={{ color: "var(--gold)" }}>Lumières Grand Hall</span>.
                <br />
                We&apos;ll review your request and be in touch within 24–48 hours.
              </p>
            </div>

            {/* Booking Details */}
            <BookingDetails ref_code={ref_code} />
          </div>

          {/* Timeline card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-2xl p-6 mb-4"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-base font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "1.1rem" }}
            >
              What Happens Next
            </h2>
            <NextStepsTimeline />
          </motion.div>

          {/* Actions card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
            }}
          >
            <ActionButtons booking={booking} ref_code={ref_code} />
          </motion.div>

          {/* Trust footer */}
          <TrustFooter />
        </motion.div>
      </main>
    </>
  )
}
