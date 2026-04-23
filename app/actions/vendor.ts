"use server"

import { unstable_noStore as noStore } from "next/cache"
import { createServerClient } from "@/lib/supabase-server"
import type { ActionResult, Vendor } from "@/types"

export interface VendorInput {
  category: 'catering' | 'photography' | 'decor'
  name: string
  instagram?: string | null
  price_rm: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = () => createServerClient() as any

export async function getAllVendors(): Promise<ActionResult<Vendor[]>> {
  noStore()
  const { data, error } = await sb()
    .from("vendors")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data: (data ?? []) as Vendor[] }
}

export async function createVendor(input: VendorInput): Promise<ActionResult<Vendor>> {
  if (!input.name?.trim()) return { success: false, error: "Vendor name is required." }
  if (!input.category) return { success: false, error: "Category is required." }
  if (input.price_rm < 0) return { success: false, error: "Price cannot be negative." }

  const { data, error } = await sb()
    .from("vendors")
    .insert([{
      ...input,
      instagram: input.instagram?.trim() || null,
    }])
    .select("*")
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Vendor }
}

export async function updateVendor(
  id: string,
  input: Partial<VendorInput>
): Promise<ActionResult<Vendor>> {
  if (!id) return { success: false, error: "Vendor ID is required." }

  const { data, error } = await sb()
    .from("vendors")
    .update({
      ...input,
      instagram: input.instagram?.trim() || null,
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Vendor }
}

export async function deleteVendor(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Vendor ID is required." }

  const { error } = await sb().from("vendors").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
