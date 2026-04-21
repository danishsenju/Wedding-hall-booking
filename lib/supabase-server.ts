import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Server-only Supabase client. Uses service role key to bypass RLS.
 * Never import this in client components — it exposes the service key.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables.")
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
