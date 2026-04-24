"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { Package, Vendor, Venue } from "@/types"
import { BookingSchema, STEP_FIELDS, type BookingFormValues } from "@/lib/validations"
import ColorBends from "@/components/ui/color-bends"
import BookingSummary from "./BookingSummary"
import Step1Details from "./Step1Details"
import Step2DateTime from "./Step2DateTime"
import Step3Addons from "./Step3Addons"
import Step4Review from "./Step4Review"
import StepIndicator from "./StepIndicator"

/* ─── Session persistence ────────────────────────── */
const STORAGE_KEY = "lmr_booking_form"

function loadFromStorage(): Partial<BookingFormValues> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<BookingFormValues>) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data: Partial<BookingFormValues>) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* non-critical */
  }
}

/* ─── Slide variants ─────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

/* ─── Step metadata ──────────────────────────────── */
const STEP_META = [
  { title: "Your Details", subtitle: "Tell us about the happy couple" },
  { title: "Date & Time", subtitle: "Choose your perfect day" },
  { title: "Services", subtitle: "Optional — enhance your celebration" },
  { title: "Review & Confirm", subtitle: "One last look before we proceed" },
] as const

/* ─── Props ──────────────────────────────────────── */
interface BookingFlowProps {
  venue: Venue | null
  packages: Package[]
  vendors: Vendor[]
  blockedDates: string[]
}

export default function BookingFlow({
  venue,
  packages,
  vendors,
  blockedDates,
}: BookingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [slideDir, setSlideDir] = useState<1 | -1>(1)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      venue_id: venue?.id ?? "",
      bride_name: "",
      groom_name: "",
      email: "",
      phone: "",
      guest_count: "",
      package_id: "",
      theme: "",
      layout_preference: "",
      special_requests: "",
      event_date: "",
      time_slot: "",
      selected_addons: [],
    },
    mode: "onTouched",
  })

  const { watch, setValue, trigger } = form

  /* Hydrate from sessionStorage after mount */
  useEffect(() => {
    const saved = loadFromStorage()
    const savedKeys = Object.keys(saved) as (keyof BookingFormValues)[]
    savedKeys.forEach((key) => {
      const val = saved[key]
      if (val !== undefined && val !== "") {
        setValue(key, val as never)
      }
    })
  }, [setValue])

  /* Set venue_id whenever it loads */
  useEffect(() => {
    if (venue?.id) setValue("venue_id", venue.id)
  }, [venue?.id, setValue])

  /* Persist on every change */
  useEffect(() => {
    const sub = watch((data) => {
      saveToStorage(data as Partial<BookingFormValues>)
    })
    return () => sub.unsubscribe()
  }, [watch])

  const handleNext = async () => {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 ? true : await trigger(fields)
    if (!valid) return
    setSlideDir(1)
    setStep((s) => (Math.min(s + 1, 4) as 1 | 2 | 3 | 4))
  }

  const handleBack = () => {
    setSlideDir(-1)
    setStep((s) => (Math.max(s - 1, 1) as 1 | 2 | 3 | 4))
  }

  const formValues = watch()
  const meta = STEP_META[step - 1]

  return (
    <div className="relative min-h-screen pb-20 pt-28">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <ColorBends
          colors={["#1a098a"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent={false}
        />
        {/* Darken overlay so card content stays readable */}
        <div className="absolute inset-0" style={{ background: "rgba(10,11,16,0.65)" }} />
      </div>
      {/* Hidden registered input so venue_id is included in RHF resolver values */}
      <input type="hidden" {...form.register("venue_id")} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 opacity-40" style={{ background: "var(--gold)" }} />
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Reserve Your Day
            </span>
            <span className="h-px w-10 opacity-40" style={{ background: "var(--gold)" }} />
          </div>
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {venue?.name ?? "Laman Troka"}
          </h1>
        </motion.div>

        {/* ── Step indicator ── */}
        <motion.div
          className="mx-auto mb-10 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <StepIndicator currentStep={step} />
        </motion.div>

        {/* ── Layout: form + summary ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

          {/* Left column */}
          <div>
            {/* Mobile summary (collapsible) */}
            <div className="mb-6 lg:hidden">
              <BookingSummary
                venue={venue}
                packages={packages}
                vendors={vendors}
                values={formValues}
              />
            </div>

            {/* Step card */}
            <motion.div
              className="overflow-hidden rounded-sm"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Step card header */}
              <div
                className="border-b px-6 py-5"
                style={{ borderColor: "var(--border)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2
                      className="font-light"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--text)",
                        fontSize: "1.45rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {meta.title}
                    </h2>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {meta.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step content */}
              <div className="relative overflow-hidden p-6">
                <AnimatePresence mode="wait" custom={slideDir} initial={false}>
                  <motion.div
                    key={step}
                    custom={slideDir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {step === 1 && <Step1Details form={form} packages={packages} />}
                    {step === 2 && <Step2DateTime form={form} blockedDates={blockedDates} />}
                    {step === 3 && <Step3Addons form={form} vendors={vendors} packages={packages} />}
                    {step === 4 && (
                      <Step4Review
                        form={form}
                        venue={venue}
                        packages={packages}
                        vendors={vendors}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer nav */}
              <div
                className="flex items-center justify-between border-t px-6 py-4"
                style={{ borderColor: "var(--border)" }}
              >
                {step > 1 ? (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    <ChevronLeft size={15} />
                    {step === 4 ? "Edit Booking" : "Back"}
                  </motion.button>
                ) : (
                  <div />
                )}

                {step < 4 && (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden rounded-sm px-7 py-2.5 text-sm font-medium"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
                      color: "#EDE9FE",
                      fontFamily: "var(--font-body)",
                      boxShadow: "0 2px 16px rgba(109,40,217,0.25)",
                    }}
                  >
                    {/* Shimmer */}
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 2,
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      }}
                    />
                    <span className="relative">
                      {step === 3
                        ? (watch("selected_addons")?.length ?? 0) > 0
                          ? "Continue to Review"
                          : "Skip & Review"
                        : "Continue"}
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column — desktop sticky summary */}
          <div className="hidden lg:block">
            <BookingSummary
              venue={venue}
              packages={packages}
              vendors={vendors}
              values={formValues}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
