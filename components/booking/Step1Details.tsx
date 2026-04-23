"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { Package } from "@/types"
import type { BookingFormValues } from "@/lib/validations"

/* ─── TrueFocus Input ────────────────────────────── */
interface TrueFocusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  id: string
}

const TrueFocusInput = React.forwardRef<HTMLInputElement, TrueFocusInputProps>(
  function TrueFocusInput({ label, error, id, ...rest }, ref) {
  const [focused, setFocused] = useState(false)
  // register() doesn't return a value prop (uncontrolled), so track locally
  const [filled, setFilled] = useState(false)
  const hasValue = filled

  return (
    <div className="group relative w-full">
      <div className="relative">
        <input
          id={id}
          ref={ref}
          {...rest}
          onFocus={(e) => {
            setFocused(true)
            // Detect pre-existing value (e.g. from sessionStorage hydration)
            if (e.target.value) setFilled(true)
            rest.onFocus?.(e)
          }}
          onChange={(e) => {
            setFilled(Boolean(e.target.value))
            rest.onChange?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            setFilled(Boolean(e.target.value))
            rest.onBlur?.(e)
          }}
          placeholder=" "
          className="peer w-full rounded-sm bg-transparent px-3 pb-2 pt-5 text-sm outline-none transition-colors"
          style={{
            background: "var(--surface-1)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            border: `1px solid ${error ? "rgba(239,68,68,0.6)" : focused ? "var(--gold)" : "var(--border)"}`,
            transition: "border-color 0.2s ease",
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 text-sm transition-all"
          style={{
            color: error
              ? "rgba(239,68,68,0.8)"
              : focused || hasValue
                ? "var(--gold)"
                : "var(--text-muted)",
            fontFamily: "var(--font-body)",
            top: focused || hasValue ? "6px" : "50%",
            transform: focused || hasValue ? "translateY(0) scale(0.78)" : "translateY(-50%)",
            transformOrigin: "left top",
            transition: "all 0.18s ease",
            fontSize: focused || hasValue ? "0.68rem" : "0.875rem",
            letterSpacing: focused || hasValue ? "0.06em" : "0",
            textTransform: focused || hasValue ? "uppercase" : "none",
          }}
        >
          {label}
        </label>

        {/* Gold border glow on focus */}
        <AnimatePresence>
          {focused && !error && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                boxShadow: "0 0 0 3px rgba(109,40,217,0.1)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs"
            style={{ color: "rgba(239,68,68,0.9)", fontFamily: "var(--font-body)" }}
          >
            <AlertCircle size={11} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

/* ─── TrueFocus Textarea ─────────────────────────── */
interface TrueFocusTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  id: string
}

const TrueFocusTextarea = React.forwardRef<HTMLTextAreaElement, TrueFocusTextareaProps>(
  function TrueFocusTextarea({ label, error, id, ...rest }, ref) {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const hasValue = filled

  return (
    <div className="group relative w-full">
      <div className="relative">
        <textarea
          id={id}
          ref={ref}
          {...rest}
          onFocus={(e) => {
            setFocused(true)
            if (e.target.value) setFilled(true)
            rest.onFocus?.(e)
          }}
          onChange={(e) => {
            setFilled(Boolean(e.target.value))
            rest.onChange?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            setFilled(Boolean(e.target.value))
            rest.onBlur?.(e)
          }}
          placeholder=" "
          rows={3}
          className="w-full resize-none rounded-sm bg-transparent px-3 pb-3 pt-6 text-sm outline-none"
          style={{
            background: "var(--surface-1)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            border: `1px solid ${error ? "rgba(239,68,68,0.6)" : focused ? "var(--gold)" : "var(--border)"}`,
            transition: "border-color 0.2s ease",
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 text-sm transition-all"
          style={{
            color: error
              ? "rgba(239,68,68,0.8)"
              : focused || hasValue
                ? "var(--gold)"
                : "var(--text-muted)",
            fontFamily: "var(--font-body)",
            top: focused || hasValue ? "7px" : "16px",
            transform: focused || hasValue ? "scale(0.78)" : "scale(1)",
            transformOrigin: "left top",
            transition: "all 0.18s ease",
            fontSize: focused || hasValue ? "0.68rem" : "0.875rem",
            letterSpacing: focused || hasValue ? "0.06em" : "0",
            textTransform: focused || hasValue ? "uppercase" : "none",
          }}
        >
          {label}
        </label>

        <AnimatePresence>
          {focused && !error && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ boxShadow: "0 0 0 3px rgba(109,40,217,0.1)" }}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs"
            style={{ color: "rgba(239,68,68,0.9)", fontFamily: "var(--font-body)" }}
          >
            <AlertCircle size={11} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

/* ─── Package Card ───────────────────────────────── */
function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: Package
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full rounded-sm p-4 text-left"
      style={{
        background: selected ? "rgba(109,40,217,0.06)" : "var(--surface-1)",
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      aria-pressed={selected}
    >
      {selected && (
        <motion.div
          layoutId="pkg-indicator"
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: "var(--gold)" }}
          initial={false}
          transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#EDE9FE"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      <div
        className="text-sm font-medium"
        style={{
          color: selected ? "var(--gold)" : "var(--text)",
          fontFamily: "var(--font-body)",
        }}
      >
        {pkg.name}
      </div>

      <div
        className="mt-1 text-xs"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {pkg.capacity_max ? `Up to ${pkg.capacity_max} guests` : ""}
        {pkg.duration_hours ? ` · ${pkg.duration_hours}h` : ""}
      </div>

      <div
        className="mt-2"
        style={{
          fontFamily: "var(--font-display)",
          color: selected ? "var(--gold)" : "var(--text)",
          fontSize: "1.2rem",
          fontWeight: 300,
          letterSpacing: "0.02em",
        }}
      >
        RM {pkg.price_rm.toLocaleString()}
      </div>
    </motion.button>
  )
}

/* ─── Step 1 ─────────────────────────────────────── */
interface Step1Props {
  form: UseFormReturn<BookingFormValues>
  packages: Package[]
  firstInvalidRef?: React.RefObject<HTMLElement | null>
}

export default function Step1Details({ form, packages }: Step1Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form

  const packageId = watch("package_id")
  const shakeTarget = useRef<string | null>(null)

  /* Shake first invalid field */
  useEffect(() => {
    const firstErr = Object.keys(errors)[0]
    if (firstErr) {
      shakeTarget.current = firstErr
      const timer = setTimeout(() => {
        shakeTarget.current = null
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [errors])

  return (
    <div className="space-y-5">
      {/* Hidden registered input ensures package_id is in RHF resolver values */}
      <input type="hidden" {...register("package_id")} />

      {/* ── Couple names ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div
          animate={
            shakeTarget.current === "bride_name"
              ? { x: [0, -6, 6, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TrueFocusInput
            id="bride_name"
            label="Bride's Full Name *"
            error={errors.bride_name?.message}
            {...register("bride_name")}
          />
        </motion.div>

        <motion.div
          animate={
            shakeTarget.current === "groom_name"
              ? { x: [0, -6, 6, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TrueFocusInput
            id="groom_name"
            label="Groom's Full Name *"
            error={errors.groom_name?.message}
            {...register("groom_name")}
          />
        </motion.div>
      </div>

      {/* ── Contact ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div
          animate={
            shakeTarget.current === "phone"
              ? { x: [0, -6, 6, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TrueFocusInput
            id="phone"
            label="Phone Number *"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </motion.div>

        <motion.div
          animate={
            shakeTarget.current === "email"
              ? { x: [0, -6, 6, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TrueFocusInput
            id="email"
            label="Email Address *"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </motion.div>
      </div>

      {/* ── Guest count ── */}
      <motion.div
        animate={
          shakeTarget.current === "guest_count"
            ? { x: [0, -6, 6, -4, 4, 0] }
            : {}
        }
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="max-w-xs"
      >
        <TrueFocusInput
          id="guest_count"
          label="Expected Guest Count *"
          type="number"
          min="50"
          max="2000"
          error={errors.guest_count?.message}
          {...register("guest_count")}
        />
      </motion.div>

      {/* ── Package selection ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Select Package *
          </span>
          {errors.package_id && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs"
              style={{ color: "rgba(239,68,68,0.9)", fontFamily: "var(--font-body)" }}
            >
              <AlertCircle size={11} />
              {errors.package_id.message}
            </motion.span>
          )}
        </div>

        {packages.length === 0 ? (
          <div
            className="rounded-sm px-4 py-8 text-center"
            style={{
              border: "1px dashed var(--border-hover)",
              background: "rgba(109,40,217,0.03)",
              fontFamily: "var(--font-body)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No packages available yet.
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--gold)", opacity: 0.7 }}>
              Please contact us to enquire about our packages.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={packageId === pkg.id}
                onSelect={() => setValue("package_id", pkg.id, { shouldValidate: true })}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Optional fields ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TrueFocusInput
          id="theme"
          label="Preferred Theme (optional)"
          placeholder=" "
          error={errors.theme?.message}
          {...register("theme")}
        />
        <TrueFocusInput
          id="layout_preference"
          label="Layout Preference (optional)"
          placeholder=" "
          error={errors.layout_preference?.message}
          {...register("layout_preference")}
        />
      </div>

      <TrueFocusTextarea
        id="special_requests"
        label="Special Requests or Notes (optional)"
        error={errors.special_requests?.message}
        {...register("special_requests")}
      />
    </div>
  )
}
