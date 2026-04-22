"use server";

import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase-server";
import type { ActionResult, Venue } from "@/types";

export interface HallInput {
  name: string;
  subtitle?: string;
  description?: string;
  tag?: string;
  href?: string;
  hero_image_url?: string;
  capacity_min?: number | null;
  capacity_max?: number | null;
  size_sqft?: number | null;
  ceiling_height_m?: number | null;
  parking_bays?: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = () => createServerClient() as any;

export async function getAllHalls(): Promise<ActionResult<Venue[]>> {
  noStore();
  const { data, error } = await sb()
    .from("venues")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data ?? []) as Venue[] };
}

export async function createHall(input: HallInput): Promise<ActionResult<Venue>> {
  if (!input.name?.trim()) return { success: false, error: "Hall name is required." };

  const { data, error } = await sb()
    .from("venues")
    .insert([input])
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Venue };
}

export async function updateHall(
  id: string,
  input: Partial<HallInput>
): Promise<ActionResult<Venue>> {
  if (!id) return { success: false, error: "Hall ID is required." };

  const { data, error } = await sb()
    .from("venues")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Venue };
}

export async function deleteHall(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Hall ID is required." };

  const { error } = await sb().from("venues").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
