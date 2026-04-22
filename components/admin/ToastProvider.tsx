"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, CheckCircle2, XCircle, Info } from "lucide-react"

/* ─── Types ────────────────────────────────────────── */
export type ToastVariant = "approve" | "reject" | "info"

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

/* ─── Context ──────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return ctx
}

/* ─── Config ───────────────────────────────────────── */
const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; icon: React.ReactNode; bg: string }
> = {
  approve: {
    border: "rgba(20,184,166,0.45)",
    bg: "rgba(20,184,166,0.07)",
    icon: <CheckCircle2 size={15} strokeWidth={2} style={{ color: "#2DD4BF" }} />,
  },
  reject: {
    border: "rgba(239,68,68,0.4)",
    bg: "rgba(239,68,68,0.07)",
    icon: <XCircle size={15} strokeWidth={2} style={{ color: "#F87171" }} />,
  },
  info: {
    border: "var(--border-hover)",
    bg: "rgba(109,40,217,0.07)",
    icon: <Info size={15} strokeWidth={2} style={{ color: "var(--gold)" }} />,
  },
}

/* ─── Individual Toast ─────────────────────────────── */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const s = VARIANT_STYLES[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.94 }}
      transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
      className="flex w-72 items-start gap-3 rounded-sm px-3.5 py-3 shadow-xl"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="mt-0.5 shrink-0">{s.icon}</div>
      <p
        className="flex-1 text-sm leading-snug"
        style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
      >
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 transition-opacity hover:opacity-60"
        style={{ color: "var(--text-muted)" }}
        aria-label="Dismiss"
      >
        <X size={13} strokeWidth={2} />
      </button>
    </motion.div>
  )
}

/* ─── Provider ─────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((prev) => [...prev.slice(-4), { id, message, variant }])

      const timer = setTimeout(() => dismiss(id), 3500)
      timers.current.set(id, timer)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Portal-like fixed container */}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
