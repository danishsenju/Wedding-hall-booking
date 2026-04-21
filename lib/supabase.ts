import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export type { Database }

/* ─── Browser Client (for client components) ────── */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables.")
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export const supabase = createBrowserClient()
