"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase-server"
import type { ActionResult, ContactMessage } from "@/types"

/* ─── Validation ─────────────────────────────────── */

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  date: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
})

export type ContactInput = z.infer<typeof ContactSchema>

/* ─── Submit ─────────────────────────────────────── */

export async function submitContactMessage(
  input: ContactInput
): Promise<ActionResult> {
  const parsed = ContactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, email, phone, date, guests, message } = parsed.data

  const supabase = createServerClient()
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    event_date: date || null,
    guests: guests || null,
    message,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/* ─── Fetch (admin only) ─────────────────────────── */

export async function getContactMessages(): Promise<ActionResult<ContactMessage[]>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data ?? []) as ContactMessage[] }
}

/* ─── Mark read (admin only) ─────────────────────── */

export async function markMessageRead(id: string): Promise<ActionResult> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
