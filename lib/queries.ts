import { createServerClient } from "./supabase-server"
import type { Venue, Package, Addon, BookingWithDetails } from "@/types"

/* ─── Booking Stats ──────────────────────────────── */

export interface BookingStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

/* ─── Venue ──────────────────────────────────────── */

export async function getVenue(): Promise<Venue | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .limit(1)
    .single()

  if (error) {
    console.error("[getVenue]", error.message)
    return null
  }

  return data as Venue
}

/* ─── Packages ───────────────────────────────────── */

export async function getPackages(venueId?: string): Promise<Package[]> {
  const supabase = createServerClient()

  let query = supabase.from("packages").select("*").order("price_rm", { ascending: true })

  if (venueId) {
    query = query.eq("venue_id", venueId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPackages]", error.message)
    return []
  }

  return (data ?? []) as Package[]
}

/* ─── Addons ─────────────────────────────────────── */

export async function getAddons(): Promise<Addon[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("addons")
    .select("*")
    .order("price_rm", { ascending: true })

  if (error) {
    console.error("[getAddons]", error.message)
    return []
  }

  return (data ?? []) as Addon[]
}

/* ─── Blocked Dates ──────────────────────────────── */

export async function getBlockedDates(venueId?: string): Promise<string[]> {
  const supabase = createServerClient()

  let query = supabase.from("blocked_dates").select("blocked_date")

  if (venueId) {
    query = query.eq("venue_id", venueId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[getBlockedDates]", error.message)
    return []
  }

  return (data ?? []).map((d) => d.blocked_date)
}

/* ─── Bookings (admin — full join) ──────────────── */

export async function getBookings(): Promise<BookingWithDetails[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(*),
      package:packages(*),
      addons:booking_addons(
        *,
        addon:addons(*)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[getBookings]", error.message)
    return []
  }

  return (data ?? []) as BookingWithDetails[]
}

/* ─── Single Booking by Ref ──────────────────────── */

export async function getBookingByRef(ref: string): Promise<BookingWithDetails | null> {
  if (!ref?.trim()) return null

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(*),
      package:packages(*),
      addons:booking_addons(
        *,
        addon:addons(*)
      )
    `)
    .eq("ref", ref.toUpperCase().trim())
    .single()

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 = no rows — not a real error
      console.error("[getBookingByRef]", error.message)
    }
    return null
  }

  return data as BookingWithDetails
}

/* ─── Booking Stats (admin dashboard) ───────────── */

export async function getBookingStats(): Promise<BookingStats> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("bookings").select("status")

  if (error || !data) {
    console.error("[getBookingStats]", error?.message)
    return { total: 0, pending: 0, approved: 0, rejected: 0 }
  }

  return {
    total: data.length,
    pending: data.filter((b) => b.status === "pending").length,
    approved: data.filter((b) => b.status === "approved").length,
    rejected: data.filter((b) => b.status === "rejected").length,
  }
}

/* ─── Check Date Availability ────────────────────── */

export async function isDateAvailable(date: string, venueId: string): Promise<boolean> {
  const supabase = createServerClient()

  const [blockedResult, bookedResult] = await Promise.all([
    supabase
      .from("blocked_dates")
      .select("id")
      .eq("venue_id", venueId)
      .eq("blocked_date", date)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("id")
      .eq("event_date", date)
      .eq("status", "approved")
      .maybeSingle(),
  ])

  return !blockedResult.data && !bookedResult.data
}
