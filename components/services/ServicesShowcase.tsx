"use client"

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Camera,
  Flower2,
  UtensilsCrossed,
  Star,
  ArrowRight,
  CalendarHeart,
  Link2,
} from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import type { Vendor, VendorCategory } from "@/types"
import { formatRM } from "@/lib/utils"

/* ─── Category config ────────────────────────────── */
const CATEGORY_CONFIG: Record<
  VendorCategory,
  { Icon: LucideIcon; label: string; desc: string; gradient: string }
> = {
  photography: {
    Icon: Camera,
    label: "Photography",
    desc: "Artisan storytelling through every frame of your journey",
    gradient: "from-violet-900/40 to-purple-950/20",
  },
  decor: {
    Icon: Flower2,
    label: "Décor & Florals",
    desc: "Lush arrangements and atmospheric design that transforms spaces",
    gradient: "from-purple-900/40 to-indigo-950/20",
  },
  catering: {
    Icon: UtensilsCrossed,
    label: "Catering",
    desc: "Curated menus crafted by our in-house culinary team",
    gradient: "from-indigo-900/40 to-violet-950/20",
  },
}

/* ─── Hero word reveal ───────────────────────────── */
function HeroTitle() {
  const words = ["Bespoke", "Services,", "Crafted", "For", "You"]
  return (
    <h1
      className="font-light leading-tight"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.8rem, 6vw, 5rem)",
        letterSpacing: "0.04em",
        color: "var(--text)",
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.1 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

/* ─── Featured category strip ────────────────────── */
function FeaturedCard({
  category,
  index,
}: {
  category: VendorCategory
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [hovered, setHovered] = useState(false)
  const cfg = CATEGORY_CONFIG[category]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.33, 1, 0.68, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${cfg.gradient} p-8 cursor-default`}
      style={{
        border: `1px solid ${hovered ? "rgba(109,40,217,0.5)" : "rgba(109,40,217,0.15)"}`,
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Background orb */}
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        animate={{ opacity: hovered ? 0.2 : 0.06, scale: hovered ? 1.2 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: "var(--gold)", filter: "blur(30px)" }}
      />

      {/* Animated border shimmer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-px origin-left"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(109,40,217,0.6), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 3 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm"
        style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(109,40,217,0.2)" }}
      >
        <cfg.Icon size={24} style={{ color: "var(--gold)" }} />
      </motion.div>

      <h3
        className="mb-2 font-light"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text)",
          fontSize: "1.5rem",
          letterSpacing: "0.04em",
        }}
      >
        {cfg.label}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {cfg.desc}
      </p>
    </motion.div>
  )
}

/* ─── Magnetic vendor card with 3-D tilt ─────────── */
function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), {
    stiffness: 280,
    damping: 28,
  })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 280,
    damping: 28,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
    setHovered(false)
  }

  const cfg = CATEGORY_CONFIG[vendor.category]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.33, 1, 0.68, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          border: "1px solid rgba(109,40,217,0.15)",
          cursor: "default",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-sm p-6 h-full flex flex-col"
        animate={{
          borderColor: hovered ? "rgba(109,40,217,0.55)" : "rgba(109,40,217,0.15)",
          backgroundColor: hovered ? "rgba(109,40,217,0.06)" : "#141226",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Glow orb */}
        <motion.div
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full"
          animate={{ opacity: hovered ? 0.18 : 0, scale: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.35 }}
          style={{ background: "var(--gold)", filter: "blur(24px)" }}
        />

        {/* Top shimmer line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(109,40,217,0.5), transparent)",
          }}
        />

        {/* Category badge + icon */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
            style={{
              background: "rgba(109,40,217,0.1)",
              color: "var(--gold)",
              fontFamily: "var(--font-body)",
              border: "1px solid rgba(109,40,217,0.2)",
            }}
          >
            {cfg.label}
          </span>

          <motion.div
            animate={{
              backgroundColor: hovered ? "rgba(109,40,217,0.2)" : "rgba(109,40,217,0.08)",
              rotate: hovered ? 8 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="flex h-9 w-9 items-center justify-center rounded-sm"
          >
            <cfg.Icon size={16} style={{ color: "var(--gold)" }} />
          </motion.div>
        </div>

        {/* Name */}
        <h3
          className="mb-1 font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: "1.3rem",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {vendor.name}
        </h3>

        {/* Instagram */}
        {vendor.instagram && (
          <a
            href={`https://instagram.com/${vendor.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center gap-1.5 text-xs w-fit"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Link2 size={11} />
            <span className="hover:underline" style={{ color: "var(--gold)" }}>
              @{vendor.instagram.replace(/^@/, "")}
            </span>
          </a>
        )}

        <div className="flex-1" />

        {/* Footer: price + CTA */}
        <div
          className="mt-4 flex items-end justify-between border-t pt-4"
          style={{ borderColor: "rgba(109,40,217,0.12)" }}
        >
          <div>
            <div
              className="text-[10px] uppercase tracking-wider mb-0.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              from
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--gold)",
                fontSize: "1.4rem",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              {formatRM(vendor.price_rm)}
            </div>
          </div>

          <motion.div
            animate={{ x: hovered ? 0 : 6, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Add at booking
            <ArrowRight size={11} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Group vendors by category ──────────────────── */
function groupByCategory(vendors: Vendor[]) {
  const order: VendorCategory[] = ["photography", "decor", "catering"]
  const grouped: Record<VendorCategory, Vendor[]> = {
    photography: [],
    decor: [],
    catering: [],
  }
  for (const v of vendors) {
    grouped[v.category].push(v)
  }
  return order.map((cat) => ({ category: cat, vendors: grouped[cat] })).filter((g) => g.vendors.length > 0)
}

/* ─── Empty state ─────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 py-20"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-sm"
        style={{ background: "rgba(109,40,217,0.08)", border: "1px solid var(--border)" }}
      >
        <Star size={24} style={{ color: "var(--text-muted)" }} />
      </div>
      <p
        className="text-sm"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        No services listed yet — check back soon.
      </p>
    </motion.div>
  )
}

/* ─── Main showcase ───────────────────────────────── */
export default function ServicesShowcase({ vendors }: { vendors: Vendor[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const groups = groupByCategory(vendors)

  /* Active categories for featured strip */
  const activeCategories = (Object.keys(CATEGORY_CONFIG) as VendorCategory[]).filter(
    (cat) => vendors.some((v) => v.category === cat)
  )
  const featuredCategories: VendorCategory[] = activeCategories.length > 0
    ? activeCategories
    : (Object.keys(CATEGORY_CONFIG) as VendorCategory[])

  return (
    <div className="min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Hero header ── */}
        <div className="mb-20 text-center">
          <motion.div
            className="mb-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="h-px w-12 opacity-30" style={{ background: "var(--gold)" }} />
            <span
              className="text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Laman Troka
            </span>
            <span className="h-px w-12 opacity-30" style={{ background: "var(--gold)" }} />
          </motion.div>

          <HeroTitle />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mx-auto mt-6 max-w-lg text-sm leading-relaxed"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Every detail, thoughtfully chosen. Our curated vendors are available exclusively
            for Laman Troka bookings — simply select what you need during reservation.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="mx-auto mt-10 h-px max-w-xs origin-center"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(109,40,217,0.4), transparent)",
            }}
          />
        </div>

        {/* ── Featured category cards ── */}
        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredCategories.map((cat, i) => (
            <FeaturedCard key={cat} category={cat} index={i} />
          ))}
        </div>

        {/* ── Vendors by category ── */}
        <div ref={sectionRef}>
          {vendors.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-14">
              {groups.map(({ category, vendors: catVendors }, groupIndex) => {
                const cfg = CATEGORY_CONFIG[category]
                return (
                  <div key={category}>
                    {/* Section heading */}
                    <motion.div
                      className="mb-6 flex items-center gap-4"
                      initial={{ opacity: 0, x: -16 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-sm"
                        style={{ background: "rgba(109,40,217,0.1)", border: "1px solid rgba(109,40,217,0.2)" }}
                      >
                        <cfg.Icon size={15} style={{ color: "var(--gold)" }} />
                      </div>
                      <h2
                        className="font-light"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--text)",
                          fontSize: "1.6rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {cfg.label}
                      </h2>
                      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                      >
                        {catVendors.length} vendor{catVendors.length !== 1 ? "s" : ""}
                      </span>
                    </motion.div>

                    {/* Vendor cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {catVendors.map((vendor, i) => (
                        <VendorCard key={vendor.id} vendor={vendor} index={i} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── CTA band ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
          className="mt-24 overflow-hidden rounded-sm text-center p-12 relative"
          style={{
            background: "var(--surface-2)",
            border: "1px solid rgba(109,40,217,0.2)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(109,40,217,0.08), transparent)",
            }}
          />

          <div className="relative mb-3 flex items-center justify-center gap-3">
            <CalendarHeart size={18} style={{ color: "var(--gold)" }} />
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Reserve your date
            </span>
          </div>

          <h2
            className="relative font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              letterSpacing: "0.04em",
            }}
          >
            Add these services when you book
          </h2>

          <p
            className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Select any combination during Step 3 of your booking — all services are optional
            and can be confirmed or adjusted later.
          </p>

          <Link href="/book">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-sm px-8 py-3 text-sm font-medium"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
                color: "#EDE9FE",
                fontFamily: "var(--font-body)",
                boxShadow: "0 4px 24px rgba(109,40,217,0.3)",
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2.5,
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                }}
              />
              <CalendarHeart size={15} />
              <span>Reserve Your Day</span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
