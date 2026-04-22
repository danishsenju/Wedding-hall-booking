"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/app/actions/auth"

/* ─── Aurora Background ────────────────────────────── */
function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep base */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--base)" }}
      />
      {/* Aurora 1 — gold, very dim */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Aurora 2 — rose, ultra-dim */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1.04, 1, 1.04] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 85% 90%, rgba(197,186,196,0.05) 0%, transparent 70%)",
        }}
      />
      {/* Aurora 3 — gold centre pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(109,40,217,0.05) 0%, transparent 65%)",
        }}
      />
      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}

/* ─── True Focus Input ─────────────────────────────── */
interface TrueFocusInputProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  disabled?: boolean
  rightElement?: React.ReactNode
}

function TrueFocusInput({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  disabled,
  rightElement,
}: TrueFocusInputProps) {
  const [focused, setFocused] = useState(false)
  const isLifted = focused || value.length > 0

  return (
    <div className="relative">
      {/* Focus ring */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-sm"
        animate={{
          opacity: focused ? 1 : 0,
          boxShadow: focused
            ? "0 0 0 1.5px var(--gold), 0 0 16px rgba(109,40,217,0.15)"
            : "0 0 0 0px transparent",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={{
          y: isLifted ? -10 : 0,
          scale: isLifted ? 0.82 : 1,
          color: focused
            ? "var(--gold)"
            : isLifted
              ? "var(--text-muted)"
              : "var(--text-muted)",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute left-3.5 top-3.5 origin-left text-sm"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
      </motion.label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-sm border pb-2 pt-6 pl-3.5 pr-10 text-sm outline-none transition-colors disabled:opacity-50"
        style={{
          background: "var(--surface-2)",
          borderColor: focused ? "var(--gold)" : "var(--border)",
          color: "var(--text)",
          fontFamily: "var(--font-body)",
        }}
      />

      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
}

/* ─── Login Page ───────────────────────────────────── */
export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@lumiereswedding.com")
  const [password, setPassword] = useState("admin123")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const shakeKey = useRef(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError("")
    setLoading(true)

    const result = await adminLogin(email, password)

    if (!result.success) {
      shakeKey.current += 1
      setError(result.error ?? "Something went wrong.")
      setLoading(false)
      return
    }

    // 800ms spinner then redirect
    setTimeout(() => router.push("/admin/dashboard"), 800)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AuroraBackground />

      {/* Back to website */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 text-xs tracking-wide transition-colors"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to website
      </Link>

      {/* Gold radial glow behind card */}
      <div
        className="pointer-events-none absolute z-10 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Card */}
      <motion.div
        key={shakeKey.current}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={
          error && shakeKey.current > 0
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                x: [0, -12, 12, -8, 8, -4, 4, 0],
              }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        transition={
          error && shakeKey.current > 0
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
        }
        className="relative z-20 w-full max-w-md rounded-sm p-8"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(109,40,217,0.06)",
        }}
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <div
            className="mb-1 text-2xl font-light tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              letterSpacing: "0.12em",
            }}
          >
            LUMIÈRES
          </div>
          <div
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Admin Portal
          </div>
          <div
            className="mx-auto mt-3 h-px w-12"
            style={{ background: "var(--border-hover)" }}
          />
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#F87171",
                  fontFamily: "var(--font-body)",
                }}
              >
                <AlertCircle size={14} strokeWidth={2} className="shrink-0" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TrueFocusInput
            id="admin-email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            disabled={loading}
          />

          <TrueFocusInput
            id="admin-password"
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            disabled={loading}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
                tabIndex={-1}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff size={15} strokeWidth={1.5} />
                ) : (
                  <Eye size={15} strokeWidth={1.5} />
                )}
              </button>
            }
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.015 }}
            whileTap={loading ? {} : { scale: 0.985 }}
            className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-sm py-3 text-sm font-medium tracking-wide transition-all disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "var(--surface-2)"
                : "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
              color: loading ? "var(--text-muted)" : "#EDE9FE",
              fontFamily: "var(--font-body)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(109,40,217,0.25)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* Demo hint */}
        <p
          className="mt-5 text-center text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Demo credentials pre-filled above
        </p>
      </motion.div>
    </div>
  )
}
