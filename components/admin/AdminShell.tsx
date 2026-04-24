"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Images,
  LayoutGrid,
  LogOut,
  MapPin,
  Package,
} from "lucide-react"
import { adminLogout } from "@/app/actions/auth"
import Image from "next/image"

/* ─── Nav config ─────────────────────────────────── */
const NAV = [
  { label: "Dashboard",       href: "/admin/dashboard", Icon: LayoutGrid },
  { label: "Manage Halls",    href: "/admin/halls",     Icon: Building2 },
  { label: "Content Editor",  href: "/admin/content",   Icon: FileEdit },
  { label: "Venue Locations", href: "/admin/venues",    Icon: MapPin },
  { label: "Gallery",         href: "/admin/gallery",   Icon: Images },
  { label: "Vendors",         href: "/admin/vendors",   Icon: Briefcase },
  { label: "Packages",        href: "/admin/packages",  Icon: Package },
]

/* ─── Live clock ─────────────────────────────────── */
function useLiveClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-MY", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ─── Sidebar ────────────────────────────────────── */
function AdminSidebar({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const time = useLiveClock()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await adminLogout()
    router.push("/admin/login")
  }

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ type: "spring", stiffness: 280, damping: 32 }}
      className="relative z-20 flex h-full flex-col overflow-hidden shrink-0"
      style={{
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(109,40,217,0.5), transparent)",
        }}
      />

      {/* Logo */}
      <div className="flex h-16 items-center px-4 shrink-0">
        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-col"
            >
              <Image
                src="/logo.png"
                alt="Laman Troka"
                width={130}
                height={36}
                className="object-contain"
              />
              <div
                className="mt-0.5 whitespace-nowrap text-[9px] uppercase tracking-[0.28em]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Admin Portal
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-8 w-8 items-center justify-center rounded-sm"
              style={{
                background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
                boxShadow: "0 0 16px rgba(109,40,217,0.4)",
              }}
            >
              <span className="text-xs font-semibold" style={{ color: "#EDE9FE", fontFamily: "var(--font-display)" }}>
                LT
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px shrink-0" style={{ background: "var(--border)" }} />

      {/* Nav */}
      <nav className="mt-3 flex flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto px-2">
        {NAV.map(({ label, href, Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/")
          return (
            <motion.a
              key={href}
              href={href}
              whileHover={{ x: expanded ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="group relative flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors"
              style={{
                background: isActive
                  ? "rgba(109,40,217,0.1)"
                  : "transparent",
                color: isActive ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "var(--font-body)",
                textDecoration: "none",
              }}
            >
              {/* Animated active bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                    style={{
                      background: "var(--gold)",
                      boxShadow: "0 0 10px rgba(109,40,217,0.7)",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <Icon
                size={16}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? "var(--gold)" : "var(--text-muted)",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
              />

              {/* Label */}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="whitespace-nowrap text-xs font-medium tracking-wide"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Hover glow */}
              {!isActive && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: "rgba(109,40,217,0.05)" }}
                />
              )}
            </motion.a>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 p-3 space-y-1">
        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Live clock */}
        <AnimatePresence initial={false}>
          {expanded && time && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2.5 rounded-sm px-3 py-2 mt-1"
                style={{ background: "rgba(109,40,217,0.05)" }}
              >
                {/* Pulsing live dot */}
                <div className="relative flex h-2 w-2 shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: "rgba(45,212,191,0.6)" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: "#2DD4BF" }}
                  />
                </div>
                <span
                  className="font-mono text-[11px] tracking-[0.12em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {time}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <motion.button
          whileHover={{ x: expanded ? 3 : 0 }}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-xs transition-colors hover:bg-red-500/5"
          style={{
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            textAlign: "left",
          }}
        >
          <LogOut
            size={15}
            strokeWidth={1.5}
            style={{ flexShrink: 0, color: "rgba(248,113,113,0.7)" }}
          />
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="whitespace-nowrap tracking-wide"
                style={{ color: "rgba(248,113,113,0.7)" }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Toggle button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3.5 top-20 z-30 flex h-7 w-7 items-center justify-center rounded-full"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-hover)",
          color: "var(--text-muted)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          cursor: "pointer",
        }}
      >
        <motion.div
          animate={{ rotate: expanded ? 0 : 180 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronLeft size={13} />
        </motion.div>
      </motion.button>
    </motion.aside>
  )
}

/* ─── Shell ──────────────────────────────────────── */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  )

  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      <AdminSidebar expanded={expanded} onToggle={() => setExpanded((e) => !e)} />

      {/* Main content */}
      <main
        className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
        style={{ background: "var(--base)" }}
      >
        {children}
      </main>
    </div>
  )
}
