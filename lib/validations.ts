import { z } from "zod"

const PHONE_RE = /^(\+?60|0)[0-9]{8,10}$/

/* ─── Step 1 — Personal Details ─────────────────── */
export const Step1Schema = z.object({
  bride_name: z.string().min(2, "Bride name must be at least 2 characters"),
  groom_name: z.string().min(2, "Groom name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_RE, "Enter a valid Malaysian number e.g. 012-345 6789"),
  guest_count: z
    .string()
    .min(1, "Guest count is required")
    .refine(
      (v) => {
        const n = parseInt(v, 10)
        return !isNaN(n) && n >= 50 && n <= 2000
      },
      { message: "Guest count must be between 50 and 2,000" }
    ),
  package_id: z.string().min(1, "Please select a package"),
  theme: z.string().optional(),
  layout_preference: z.string().optional(),
  special_requests: z.string().optional(),
})

/* ─── Step 2 — Date & Time ───────────────────────── */
export const Step2Schema = z.object({
  event_date: z
    .string()
    .min(1, "Please select a date")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time_slot: z.string().min(1, "Please select a time slot"),
})

/* ─── Step 3 — Add-ons ───────────────────────────── */
export const Step3Schema = z.object({
  selected_addons: z.array(z.string()),
})

/* ─── Full Booking Schema (combined) ─────────────── */
export const BookingSchema = z.object({
  venue_id: z.string().min(1, "Venue is required"),
  ...Step1Schema.shape,
  ...Step2Schema.shape,
  ...Step3Schema.shape,
})

export type Step1FormData = z.infer<typeof Step1Schema>
export type Step2FormData = z.infer<typeof Step2Schema>
export type Step3FormData = z.infer<typeof Step3Schema>
export type BookingFormValues = z.infer<typeof BookingSchema>

/* ─── Step field map for trigger() ──────────────── */
export const STEP_FIELDS: Record<number, (keyof BookingFormValues)[]> = {
  1: ["bride_name", "groom_name", "email", "phone", "guest_count", "package_id"],
  2: ["event_date", "time_slot"],
  3: [],
  4: [],
}
