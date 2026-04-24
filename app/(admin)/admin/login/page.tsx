"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/app/actions/auth"
import Aurora from "@/components/ui/Aurora"

/* ─── Noise texture SVG (base64 inlined) ──────────────── */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/* ─── True Focus Input ─────────────────────────────────── */
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
        className="pointer-events-none absolute -inset-px rounded-xl"
        animate={{
          opacity: focused ? 1 : 0,
          boxShadow: focused
            ? "0 0 0 1px rgba(196,181,253,0.5), 0 0 20px rgba(109,40,217,0.2)"
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
          color: focused ? "#C4B5FD" : "rgba(167,139,250,0.7)",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute left-4 top-3.5 origin-left text-sm"
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
        className="w-full rounded-xl pb-2 pt-6 pl-4 pr-10 text-sm outline-none transition-all disabled:opacity-50"
        style={{
          background: focused
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.04)",
          border: focused
            ? "1px solid rgba(196,181,253,0.35)"
            : "1px solid rgba(255,255,255,0.1)",
          color: "var(--text)",
          fontFamily: "var(--font-body)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
}

/* ─── Login Page ───────────────────────────────────────── */
export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@lamantroka.com")
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

    setTimeout(() => router.push("/admin/dashboard"), 800)
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* ── Aurora WebGL background ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Aurora
          colorStops={["#3D1580", "#6D28D9", "#2B0F6B"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.4}
        />
      </div>

      {/* ── Vignette overlay so card reads clearly ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(10,11,16,0.75) 100%)",
        }}
      />

      {/* Back to website — hard nav intentional: crosses admin→public layout boundary */}
      <a
        href="/"
        className="absolute left-6 top-6 z-30 flex items-center gap-2 text-xs tracking-wide transition-colors hover:text-[#C4B5FD]"
        style={{ color: "rgba(167,139,250,0.7)", fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to website
      </a>

      {/* ── Liquid glass card ── */}
      <motion.div
        key={shakeKey.current}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
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
            : { duration: 0.65, ease: [0.33, 1, 0.68, 1] }
        }
        className="relative z-20 w-full max-w-md overflow-hidden rounded-2xl"
        style={{
          /* Liquid glass core */
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 50%, rgba(109,40,217,0.08) 100%)",
          /* Apple-style thin edge highlight */
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.06) inset, inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        {/* ── Noise texture overlay (removes plastic AI look) ── */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: NOISE_SVG,
            backgroundSize: "200px 200px",
          }}
        />

        {/* ── Specular sheen — top-left corner catch ── */}
        <div
          className="pointer-events-none absolute -top-px -left-px z-10 h-32 w-32 rounded-2xl opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, transparent 65%)",
          }}
        />

        {/* ── Bottom-right ambient tint ── */}
        <div
          className="pointer-events-none absolute -bottom-px -right-px z-10 h-40 w-40 rounded-2xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(109,40,217,0.22) 0%, transparent 65%)",
          }}
        />

        {/* ── Card content ── */}
        <div className="relative z-20 p-8">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <Image
                src="/logo.png"
                alt="Laman Troka"
                width={180}
                height={48}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 20px rgba(196,181,253,0.3))" }}
                priority
              />
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.35em]"
              style={{ color: "rgba(167,139,250,0.65)", fontFamily: "var(--font-body)" }}
            >
              Admin Portal
            </div>
            {/* Divider */}
            <div className="mx-auto mt-4 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{ background: "linear-gradient(to right, transparent, rgba(196,181,253,0.2))" }}
              />
              <div
                className="h-1 w-1 rounded-full"
                style={{ background: "rgba(196,181,253,0.4)" }}
              />
              <div
                className="h-px flex-1"
                style={{ background: "linear-gradient(to left, transparent, rgba(196,181,253,0.2))" }}
              />
            </div>
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
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#F87171",
                    fontFamily: "var(--font-body)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <AlertCircle size={14} strokeWidth={2} className="shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  style={{ color: "rgba(167,139,250,0.6)" }}
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
              whileHover={loading ? {} : { scale: 1.015, filter: "brightness(1.1)" }}
              whileTap={loading ? {} : { scale: 0.985 }}
              className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-medium tracking-wide transition-all disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, rgba(109,40,217,0.85) 0%, rgba(124,58,237,0.9) 100%)",
                color: loading ? "rgba(167,139,250,0.5)" : "#EDE9FE",
                fontFamily: "var(--font-body)",
                border: loading
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(196,181,253,0.25)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 32px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
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
            style={{ color: "rgba(167,139,250,0.45)", fontFamily: "var(--font-body)" }}
          >
            Demo credentials pre-filled above
          </p>
        </div>
      </motion.div>
    </div>
  )
}
