import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Server-only Supabase client. Prefers service role key to bypass RLS.
 * Falls back to anon key — public tables need GRANT SELECT TO anon in that case.
 * Never import this in client components — it exposes the service key.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = serviceKey ?? anonKey

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    )
  }

  if (!serviceKey) {
    // Without service role key, queries rely on RLS + anon grants.
    // Run the GRANT statements in database-schema.sql to fix permission errors.
    console.warn("[supabase-server] SUPABASE_SERVICE_ROLE_KEY not set — using anon key. RLS policies + GRANTs must allow the query.")
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
