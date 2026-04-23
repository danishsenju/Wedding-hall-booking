"use server"

import { unstable_noStore as noStore } from "next/cache"
import { createServerClient } from "@/lib/supabase-server"
import type { ActionResult, Package } from "@/types"

export interface PackageInput {
  venue_id: string
  name: string
  price_rm: number
  capacity_max?: number | null
  duration_hours?: number | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = () => createServerClient() as any

export async function getAllPackages(): Promise<ActionResult<Package[]>> {
  noStore()
  const { data, error } = await sb()
    .from("packages")
    .select("*")
    .order("price_rm", { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data: (data ?? []) as Package[] }
}

export async function createPackage(input: PackageInput): Promise<ActionResult<Package>> {
  if (!input.name?.trim()) return { success: false, error: "Package name is required." }
  if (!input.venue_id) return { success: false, error: "Venue is required." }
  if (!input.price_rm || input.price_rm <= 0) return { success: false, error: "Price must be greater than 0." }

  const { data, error } = await sb()
    .from("packages")
    .insert([input])
    .select("*")
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Package }
}

export async function updatePackage(
  id: string,
  input: Partial<PackageInput>
): Promise<ActionResult<Package>> {
  if (!id) return { success: false, error: "Package ID is required." }

  const { data, error } = await sb()
    .from("packages")
    .update(input)
    .eq("id", id)
    .select("*")
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Package }
}

export async function deletePackage(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Package ID is required." }

  const { error } = await sb().from("packages").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
