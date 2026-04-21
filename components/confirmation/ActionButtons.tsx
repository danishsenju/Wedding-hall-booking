"use client"

import { motion } from "framer-motion"
import { Copy, Download, Home, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { BookingWithDetails } from "@/types"

interface Props {
  booking: BookingWithDetails | null
  ref_code: string
}

const WHATSAPP_NUMBER = "60123456789"

function buildWhatsAppMessage(booking: BookingWithDetails | null, ref: string): string {
  if (!booking) return `Hi, I'd like to enquire about my booking reference: ${ref}`

  const date = new Date(booking.event_date + "T00:00:00").toLocaleDateString("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return [
    `Hello, I'm reaching out regarding my booking at Lumières Grand Hall.`,
    ``,
    `📋 *Booking Reference:* ${ref}`,
    `💑 *Couple:* ${booking.bride_name} & ${booking.groom_name}`,
    `📅 *Date:* ${date}`,
    `⏰ *Time:* ${booking.time_slot}`,
    `👥 *Guests:* ${booking.guest_count}`,
    booking.package?.name ? `📦 *Package:* ${booking.package.name}` : "",
    ``,
    `Please let me know the next steps. Thank you! 🙏`,
  ]
    .filter(Boolean)
    .join("\n")
}

export default function ActionButtons({ booking, ref_code }: Props) {
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  function handleWhatsApp() {
    const message = buildWhatsAppMessage(booking, ref_code)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  function handleDownload() {
    showToast("PDF download coming soon")
  }

  async function handleCopyLink() {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showToast("Link copied — share with your family!")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      showToast("Could not copy link")
    }
  }

  return (
    <div className="relative space-y-3 print:hidden">
      {/* Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-lg text-sm z-20"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--gold)",
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* WhatsApp */}
      <motion.button
        onClick={handleWhatsApp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: "linear-gradient(135deg, #15803d, #16a34a)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(22, 163, 74, 0.25)",
        }}
      >
        <MessageCircle size={17} />
        Chat on WhatsApp
      </motion.button>

      {/* Share with family */}
      <motion.button
        onClick={handleCopyLink}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-hover)",
          color: "var(--gold)",
        }}
      >
        {copied ? <Copy size={15} /> : <Share2 size={15} />}
        {copied ? "Copied!" : "Share with Family"}
      </motion.button>

      {/* Download */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Download size={15} />
        Download Summary
      </motion.button>

      {/* Back to Home */}
      <Link href="/" className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <Home size={15} />
          Back to Home
        </motion.div>
      </Link>
    </div>
  )
}
