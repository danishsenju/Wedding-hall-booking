"use server";

import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase-server";
import type { ActionResult, Theme } from "@/types";

export interface ThemeInput {
  name: string;
  tagline?: string;
  description?: string;
  image_url?: string;
  price_from_rm?: number | null;
  mood?: string;
  sort_order?: number;
  highlight_quote?: string | null;
  features?: string[] | null;
  gallery_images?: string[] | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = () => createServerClient() as any;

export async function getAllThemes(): Promise<ActionResult<Theme[]>> {
  noStore();
  const { data, error } = await sb()
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data ?? []) as Theme[] };
}

export async function getThemeById(id: string): Promise<ActionResult<Theme>> {
  noStore();
  if (!id) return { success: false, error: "Theme ID is required." };

  const { data, error } = await sb()
    .from("themes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Theme };
}

export async function createTheme(input: ThemeInput): Promise<ActionResult<Theme>> {
  if (!input.name?.trim()) return { success: false, error: "Theme name is required." };

  const { data, error } = await sb()
    .from("themes")
    .insert([input])
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Theme };
}

export async function updateTheme(
  id: string,
  input: Partial<ThemeInput>
): Promise<ActionResult<Theme>> {
  if (!id) return { success: false, error: "Theme ID is required." };

  const { data, error } = await sb()
    .from("themes")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Theme };
}

export async function deleteTheme(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Theme ID is required." };

  const { error } = await sb().from("themes").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
