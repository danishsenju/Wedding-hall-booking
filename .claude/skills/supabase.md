# Supabase Skill

Client: /lib/supabase.ts (browser) + /lib/supabase-server.ts (server).
Always use server client in server components and actions.
Mutations: server actions only, never client-side direct.
RLS: enable on all tables, policies per role.
Auth: email/password for admin only. No public auth.
Realtime: use for admin dashboard booking updates.
Types: generate with supabase gen types, save to /types/database.ts.
Error handling: always check error object from supabase response.