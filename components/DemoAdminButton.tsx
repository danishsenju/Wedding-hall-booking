"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ChevronRight, Copy, Check } from "lucide-react"
import Link from "next/link"

export default function DemoAdminButton() {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState<"email" | "password" | null>(null)

  function copy(text: string, field: "email" | "password") {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
              className="w-72 overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(145deg, #1a0f2e 0%, #0d0b1a 100%)",
                border: "1px solid rgba(109,40,217,0.4)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.65), 0 0 40px rgba(109,40,217,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(109,40,217,0.28) 0%, rgba(109,40,217,0.08) 100%)",
                  borderBottom: "1px solid rgba(109,40,217,0.2)",
                }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} style={{ color: "#C4B5FD" }} strokeWidth={2} />
                  <span
                    className="text-[10px] font-medium uppercase"
                    style={{
                      color: "#C4B5FD",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.22em",
                    }}
                  >
                    Hackathon Demo
                  </span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] transition-all hover:bg-white/10"
                  style={{ color: "rgba(167,139,250,0.6)" }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="space-y-3 px-4 py-4">
                <p
                  className="text-[11px] leading-relaxed"
                  style={{
                    color: "rgba(167,139,250,0.65)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Use these credentials to access the admin dashboard:
                </p>

                {/* Email row */}
                <div
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(109,40,217,0.18)",
                  }}
                >
                  <div>
                    <div
                      className="mb-0.5 text-[9px] uppercase"
                      style={{
                        color: "rgba(167,139,250,0.45)",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.18em",
                      }}
                    >
                      Email
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "#EDE9FE", fontFamily: "var(--font-body)" }}
                    >
                      admin@lamantroka.com
                    </div>
                  </div>
                  <button
                    onClick={() => copy("admin@lamantroka.com", "email")}
                    className="flex h-6 w-6 items-center justify-center rounded-md transition-all hover:bg-white/10"
                    aria-label="Copy email"
                  >
                    {copied === "email" ? (
                      <Check size={12} style={{ color: "#86efac" }} />
                    ) : (
                      <Copy size={12} style={{ color: "#A78BFA" }} />
                    )}
                  </button>
                </div>

                {/* Password row */}
                <div
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(109,40,217,0.18)",
                  }}
                >
                  <div>
                    <div
                      className="mb-0.5 text-[9px] uppercase"
                      style={{
                        color: "rgba(167,139,250,0.45)",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.18em",
                      }}
                    >
                      Password
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "#EDE9FE", fontFamily: "var(--font-body)" }}
                    >
                      admin123
                    </div>
                  </div>
                  <button
                    onClick={() => copy("admin123", "password")}
                    className="flex h-6 w-6 items-center justify-center rounded-md transition-all hover:bg-white/10"
                    aria-label="Copy password"
                  >
                    {copied === "password" ? (
                      <Check size={12} style={{ color: "#86efac" }} />
                    ) : (
                      <Copy size={12} style={{ color: "#A78BFA" }} />
                    )}
                  </button>
                </div>

                {/* CTA */}
                <Link
                  href="/admin"
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-medium tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.9) 0%, rgba(124,58,237,0.95) 100%)",
                    color: "#EDE9FE",
                    fontFamily: "var(--font-body)",
                    border: "1px solid rgba(196,181,253,0.22)",
                    boxShadow:
                      "0 4px 20px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Enter Admin Dashboard
                  <ChevronRight size={13} strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="pill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              onClick={() => setExpanded(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5 rounded-full px-4 py-2.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(124,58,237,0.97) 100%)",
                border: "1px solid rgba(196,181,253,0.28)",
                boxShadow:
                  "0 8px 32px rgba(109,40,217,0.45), 0 0 0 1px rgba(109,40,217,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
                color: "#EDE9FE",
              }}
            >
              <ShieldCheck size={15} strokeWidth={1.5} />
              <span
                className="text-[12px] font-medium"
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}
              >
                Admin Demo
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
                style={{
                  background: "rgba(196,181,253,0.18)",
                  color: "#C4B5FD",
                  letterSpacing: "0.18em",
                }}
              >
                JUDGE
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
