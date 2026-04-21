"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { BookingFormValues } from "@/lib/validations"

/* ─── Constants ──────────────────────────────────── */
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "10:00 AM – 2:00 PM", booked: false },
  { id: "midday", label: "Mid-Day", time: "12:00 PM – 4:00 PM", booked: false },
  { id: "afternoon", label: "Afternoon", time: "2:00 PM – 6:00 PM", booked: true },
  { id: "afternoon-eve", label: "Afternoon-Eve", time: "4:00 PM – 9:00 PM", booked: false },
  { id: "evening", label: "Evening", time: "6:00 PM – 11:00 PM", booked: false },
  { id: "full-day", label: "Full Day", time: "10:00 AM – 11:00 PM", booked: false },
] as const

/* ─── Utils ──────────────────────────────────────── */
function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function getNextAvailableDate(blockedDates: string[]): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const limit = new Date(today)
  limit.setMonth(limit.getMonth() + 12)

  const d = new Date(today)
  d.setDate(d.getDate() + 1)

  while (d <= limit) {
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (!blockedDates.includes(str)) return str
    d.setDate(d.getDate() + 1)
  }
  return null
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return ""
  const [y, m, day] = dateStr.split("-").map(Number)
  return `${MONTHS[m - 1]} ${day}, ${y}`
}

/* ─── Calendar ───────────────────────────────────── */
interface CalendarProps {
  selectedDate: string
  blockedDates: string[]
  onSelect: (date: string) => void
}

function Calendar({ selectedDate, blockedDates, onSelect }: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const todayStr = useMemo(() => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  }, [today])

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [navDir, setNavDir] = useState<1 | -1>(1)

  const days = daysInMonth(viewYear, viewMonth)
  const startDay = firstDayOfMonth(viewYear, viewMonth)

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  const goPrev = useCallback(() => {
    setNavDir(-1)
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }, [viewMonth])

  const goNext = useCallback(() => {
    setNavDir(1)
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }, [viewMonth])

  const isPast = useCallback(
    (dateStr: string) => {
      return dateStr <= todayStr
    },
    [todayStr]
  )

  const isBlocked = useCallback(
    (dateStr: string) => blockedDates.includes(dateStr),
    [blockedDates]
  )

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth())

  const maxYear = today.getFullYear() + 2
  const canGoNext =
    viewYear < maxYear || (viewYear === maxYear && viewMonth < 11)

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors disabled:opacity-30"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.h3
            key={`${viewYear}-${viewMonth}`}
            initial={{ x: navDir * 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: navDir * -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-sm font-medium"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              letterSpacing: "0.06em",
              fontSize: "1.05rem",
            }}
          >
            {MONTHS[viewMonth]} {viewYear}
          </motion.h3>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors disabled:opacity-30"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[10px] uppercase tracking-wider py-1"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${viewYear}-${viewMonth}`}
          initial={{ x: navDir * 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: navDir * -30, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="grid grid-cols-7 gap-y-1"
        >
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />

            const dateStr = toDateStr(viewYear, viewMonth, day)
            const past = isPast(dateStr)
            const blocked = isBlocked(dateStr)
            const selected = dateStr === selectedDate
            const disabled = past || blocked

            return (
              <div key={dateStr} className="flex items-center justify-center py-0.5">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onSelect(dateStr)}
                  className="group relative flex h-9 w-9 flex-col items-center justify-center rounded-full text-xs transition-colors"
                  style={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: past ? 0.35 : 1,
                    background: selected
                      ? "var(--gold)"
                      : "transparent",
                    color: selected
                      ? "#06141B"
                      : past || blocked
                        ? "var(--text-muted)"
                        : "var(--text)",
                    border: selected
                      ? "1px solid var(--gold)"
                      : "1px solid transparent",
                    fontFamily: "var(--font-body)",
                    fontWeight: selected ? 600 : 400,
                  }}
                  title={
                    blocked
                      ? "This date is unavailable"
                      : past
                        ? "Date has passed"
                        : undefined
                  }
                  aria-label={`${dateStr}${disabled ? " (unavailable)" : ""}`}
                  aria-pressed={selected}
                >
                  {/* Hover ring */}
                  {!disabled && !selected && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ border: "1px solid var(--gold)" }}
                    />
                  )}

                  {day}

                  {/* Booked dot */}
                  {blocked && (
                    <span
                      className="absolute bottom-1 h-1 w-1 rounded-full"
                      style={{ background: "rgba(239,68,68,0.7)" }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── Time Slot Grid ─────────────────────────────── */
function TimeSlotGrid({
  selected,
  onSelect,
  disabled,
}: {
  selected: string
  onSelect: (id: string) => void
  disabled: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TIME_SLOTS.map((slot) => {
        const isSelected = selected === slot.id
        const isBooked = slot.booked

        return (
          <motion.button
            key={slot.id}
            type="button"
            disabled={isBooked || disabled}
            onClick={() => !isBooked && !disabled && onSelect(slot.id)}
            whileHover={!isBooked && !disabled ? { y: -1 } : {}}
            whileTap={!isBooked && !disabled ? { scale: 0.97 } : {}}
            className="relative flex flex-col items-center justify-center rounded-sm p-3 text-center transition-colors"
            style={{
              background: isSelected
                ? "rgba(201,168,76,0.08)"
                : "var(--surface-1)",
              border: `1px solid ${
                isSelected
                  ? "var(--gold)"
                  : isBooked
                    ? "rgba(239,68,68,0.3)"
                    : "var(--border)"
              }`,
              cursor: isBooked || disabled ? "not-allowed" : "pointer",
              opacity: disabled && !isSelected ? 0.5 : 1,
            }}
            aria-pressed={isSelected}
            aria-disabled={isBooked}
          >
            <span
              className="text-xs font-medium"
              style={{
                color: isSelected
                  ? "var(--gold)"
                  : isBooked
                    ? "rgba(239,68,68,0.7)"
                    : "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {slot.label}
            </span>
            <span
              className="mt-0.5 text-[10px] leading-snug"
              style={{
                color: isBooked ? "rgba(239,68,68,0.5)" : "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {slot.time}
            </span>
            {isBooked && (
              <span
                className="mt-1 rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "rgba(239,68,68,0.8)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Booked
              </span>
            )}

            {isSelected && (
              <motion.div
                layoutId="slot-indicator"
                className="absolute inset-0 rounded-sm"
                style={{
                  background: "rgba(201,168,76,0.04)",
                  boxShadow: "0 0 0 1px var(--gold)",
                }}
                initial={false}
                transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/* ─── Step 2 ─────────────────────────────────────── */
interface Step2Props {
  form: UseFormReturn<BookingFormValues>
  blockedDates: string[]
}

export default function Step2DateTime({ form, blockedDates }: Step2Props) {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form

  const eventDate = watch("event_date")
  const timeSlot = watch("time_slot")

  const nextAvailable = useMemo(
    () => getNextAvailableDate(blockedDates),
    [blockedDates]
  )

  const jumpToNext = useCallback(() => {
    if (nextAvailable) {
      setValue("event_date", nextAvailable, { shouldValidate: true })
    }
  }, [nextAvailable, setValue])

  return (
    <div className="space-y-6">
      {/* ── Calendar ── */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Select Your Date *
          </span>
          {errors.event_date && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs"
              style={{ color: "rgba(239,68,68,0.9)", fontFamily: "var(--font-body)" }}
            >
              <AlertCircle size={11} />
              {errors.event_date.message}
            </motion.span>
          )}
        </div>

        {/* Next available suggestion */}
        {!eventDate && nextAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={jumpToNext}
              className="group flex items-center gap-2 rounded-sm px-3 py-2 text-xs transition-colors"
              style={{
                border: "1px solid rgba(201,168,76,0.25)",
                background: "rgba(201,168,76,0.04)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Sparkles
                size={11}
                style={{ color: "var(--gold)" }}
                className="shrink-0"
              />
              <span>
                Next available:{" "}
                <span style={{ color: "var(--gold)" }}>
                  {formatDateDisplay(nextAvailable)}
                </span>
              </span>
              <ArrowRight
                size={11}
                style={{ color: "var(--gold)" }}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </motion.div>
        )}

        <div
          className="rounded-sm p-4"
          style={{
            background: "var(--surface-1)",
            border: `1px solid ${errors.event_date ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
          }}
        >
          <Calendar
            selectedDate={eventDate ?? ""}
            blockedDates={blockedDates}
            onSelect={(date) => setValue("event_date", date, { shouldValidate: true })}
          />
        </div>

        {/* Selected date display */}
        <AnimatePresence>
          {eventDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Selected:{" "}
                <span style={{ color: "var(--gold)" }}>
                  {formatDateDisplay(eventDate)}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Time slots ── */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Select Time Slot *
          </span>
          {errors.time_slot && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs"
              style={{ color: "rgba(239,68,68,0.9)", fontFamily: "var(--font-body)" }}
            >
              <AlertCircle size={11} />
              {errors.time_slot.message}
            </motion.span>
          )}
        </div>

        <TimeSlotGrid
          selected={timeSlot ?? ""}
          onSelect={(id) => setValue("time_slot", id, { shouldValidate: true })}
          disabled={!eventDate}
        />

        {!eventDate && (
          <p
            className="mt-2 text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Please select a date first to choose your time slot.
          </p>
        )}
      </div>
    </div>
  )
}
