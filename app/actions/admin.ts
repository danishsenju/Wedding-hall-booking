"use server"

import { createServerClient } from "@/lib/supabase-server"
import type { ActionResult, BookingWithDetails, BookingStatus } from "@/types"

/* ─── Admin Stats ────────────────────────────────── */

export interface AdminStats {
  total: number
  pending: number
  approved: number
  rejected: number
  totalRevenue: number
  thisMonthBookings: number
}

export async function getAdminStats(): Promise<ActionResult<AdminStats>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("status, total_rm, created_at")

  if (error) {
    return { success: false, error: error.message }
  }

  const rows = data ?? []
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  return {
    success: true,
    data: {
      total: rows.length,
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      rejected: rows.filter((r) => r.status === "rejected").length,
      totalRevenue: rows
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + (r.total_rm ?? 0), 0),
      thisMonthBookings: rows.filter((r) => r.created_at >= monthStart).length,
    },
  }
}

/* ─── Search Bookings ────────────────────────────── */

export async function searchBookings(query: string): Promise<ActionResult<BookingWithDetails[]>> {
  const q = query.trim()
  if (!q) {
    return { success: true, data: [] }
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(*),
      package:packages(*),
      addons:booking_addons(*, addon:addons(*))
    `)
    .or(
      `ref.ilike.%${q}%,bride_name.ilike.%${q}%,groom_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
    )
    .order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data ?? []) as BookingWithDetails[] }
}

/* ─── Filter Bookings ────────────────────────────── */

export async function filterBookings(
  status: BookingStatus | "all"
): Promise<ActionResult<BookingWithDetails[]>> {
  const supabase = createServerClient()

  let query = supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(*),
      package:packages(*),
      addons:booking_addons(*, addon:addons(*))
    `)
    .order("created_at", { ascending: false })

  if (status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data ?? []) as BookingWithDetails[] }
}
