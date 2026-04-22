"use server";

import { createServerClient } from "@/lib/supabase-server";
import type { ActionResult, GalleryImage } from "@/types";

export async function getGalleryImages(): Promise<ActionResult<GalleryImage[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data ?? []) as GalleryImage[] };
}

// Note: image insertion is handled by /api/gallery/upload (file upload via Route Handler)

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const supabase = createServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { error } = await sb.from("gallery").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateGalleryImage(
  id: string,
  title: string,
  image_url: string,
): Promise<ActionResult<GalleryImage>> {
  if (!title.trim()) return { success: false, error: "Title is required." };

  const supabase = createServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb
    .from("gallery")
    .update({ title: title.trim(), image_url })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as GalleryImage };
}
