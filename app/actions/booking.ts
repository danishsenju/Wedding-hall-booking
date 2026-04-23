"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase-server"
import type { ActionResult } from "@/types"

/* ─── Validation Schema ──────────────────────────── */

const BookingSchema = z.object({
  bride_name: z.string().min(2, "Bride name must be at least 2 characters"),
  groom_name: z.string().min(2, "Groom name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone format"),
  venue_id: z.string().uuid("Invalid venue"),
  package_id: z.string().uuid("Invalid package"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time_slot: z.string().min(1, "Please select a time slot"),
  guest_count: z.string().min(1, "Please enter guest count"),
  theme: z.string().optional(),
  layout_preference: z.string().optional(),
  special_requests: z.string().optional(),
  selected_addons: z.array(z.string().uuid()).default([]),
})

export type CreateBookingInput = z.infer<typeof BookingSchema>

/* ─── Ref Generator ──────────────────────────────── */

/**
 * Calls the Postgres generate_booking_ref() function.
 * Falls back to a random ref if the DB call fails.
 */
export async function generateRef(): Promise<string> {
  const supabase = createServerClient()
  const { data, error } = await supabase.rpc("generate_booking_ref")

  if (error || !data) {
    const year = new Date().getFullYear()
    const rand = String(Math.floor(Math.random() * 9000) + 1000)
    return `LMR-${year}-${rand}`
  }

  return data as string
}

/* ─── Create Booking ─────────────────────────────── */

export async function createBooking(
  input: unknown
): Promise<ActionResult<{ ref: string; id: string }>> {
  // Validate
  const parsed = BookingSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid booking data.",
    }
  }

  const data = parsed.data
  const supabase = createServerClient()

  // Guard: date must not be blocked
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("blocked_date", data.event_date)
    .maybeSingle()

  if (blocked) {
    return { success: false, error: "This date is unavailable. Please choose another date." }
  }

  // Guard: date must not already be approved
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("event_date", data.event_date)
    .eq("status", "approved")
    .maybeSingle()

  if (existing) {
    return { success: false, error: "This date is already booked. Please choose another date." }
  }

  // Resolve package price + duration
  const { data: pkg, error: pkgError } = await supabase
    .from("packages")
    .select("price_rm, duration_hours")
    .eq("id", data.package_id)
    .single()

  if (pkgError || !pkg) {
    return { success: false, error: "Invalid package selected." }
  }

  const guestCount = parseInt(data.guest_count, 10) || 0
  const durationHours = pkg.duration_hours ?? 0

  // Resolve vendor prices (selected_addons holds vendor IDs)
  let addonsTotal = 0
  const vendorRows: { id: string; price_rm: number }[] = []

  if (data.selected_addons.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vendors } = await (supabase as any)
      .from("vendors")
      .select("id, category, price_rm")
      .in("id", data.selected_addons)

    for (const v of (vendors ?? []) as { id: string; category: string; price_rm: number }[]) {
      let lineTotal = v.price_rm
      if (v.category === "catering") lineTotal = v.price_rm * Math.max(guestCount, 1)
      else if (v.category === "photography") lineTotal = v.price_rm * Math.max(durationHours, 1)
      vendorRows.push({ id: v.id, price_rm: lineTotal })
      addonsTotal += lineTotal
    }
  }

  const total_rm = pkg.price_rm + addonsTotal
  const deposit_rm = Math.round(total_rm * 0.3) // 30% deposit

  const ref = await generateRef()

  // Insert booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      ref,
      venue_id: data.venue_id,
      package_id: data.package_id,
      bride_name: data.bride_name,
      groom_name: data.groom_name,
      email: data.email,
      phone: data.phone,
      event_date: data.event_date,
      time_slot: data.time_slot,
      guest_count: data.guest_count,
      theme: data.theme ?? null,
      layout_preference: data.layout_preference ?? null,
      special_requests: data.special_requests ?? null,
      status: "pending",
      total_rm,
      deposit_rm,
    })
    .select("id, ref")
    .single()

  if (bookingError || !booking) {
    return {
      success: false,
      error: bookingError?.message ?? "Failed to create booking. Please try again.",
    }
  }

  // Insert booking vendors
  if (vendorRows.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("booking_vendors").insert(
      vendorRows.map((v) => ({
        booking_id: booking.id,
        vendor_id: v.id,
        price_rm: v.price_rm,
      }))
    )
  }

  return {
    success: true,
    data: { ref: booking.ref, id: booking.id },
  }
}

/* ─── Update Booking Status (admin) ─────────────── */

export async function updateBookingStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<ActionResult> {
  if (!id || !["approved", "rejected"].includes(status)) {
    return { success: false, error: "Invalid parameters." }
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
