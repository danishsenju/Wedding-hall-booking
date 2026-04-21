"use server"

import { cookies } from "next/headers"
import { createAuthClient } from "@/lib/supabase-auth"
import type { ActionResult } from "@/types"

const COOKIE_NAME = "admin-token"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function adminLogin(
  email: string,
  password: string
): Promise<ActionResult> {
  if (!email?.trim() || !password?.trim()) {
    return { success: false, error: "Email and password are required." }
  }

  const supabase = createAuthClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error || !data.session) {
    return {
      success: false,
      error: "Invalid credentials. Please try again.",
    }
  }

  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return { success: true }
}

export async function adminLogout(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}
