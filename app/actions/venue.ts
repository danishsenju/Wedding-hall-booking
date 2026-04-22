"use server";

import { createServerClient } from "@/lib/supabase-server";
import type { ActionResult, Venue } from "@/types";

/* ─── Get All Venues ─────────────────────────────── */

export async function getAllVenues(): Promise<ActionResult<Venue[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data ?? []) as Venue[] };
}

/* ─── Update Venue Location ──────────────────────── */

export interface VenueLocationInput {
  venueId: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

export async function updateVenueLocation(
  input: VenueLocationInput,
): Promise<ActionResult<Venue>> {
  const { venueId, location, latitude, longitude } = input;

  if (!venueId) return { success: false, error: "Venue ID is required." };

  const supabase = createServerClient();
  // Cast through unknown to satisfy strict Supabase generated-type constraints
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb
    .from("venues")
    .update({ location, latitude, longitude })
    .eq("id", venueId)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Venue };
}
