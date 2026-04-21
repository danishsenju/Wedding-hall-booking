# Admin Skill

Auth: Supabase email/password. Session in middleware.
Protected: middleware.ts checks session, redirects to /admin/login.
Stats: count bookings by status, recalculate on any update.
Table: desktop only. Mobile: expandable cards accordion.
Actions: approve/reject via server action, revalidatePath after.
Realtime: subscribe to bookings table for live updates.
Modal: Framer Motion scale+fade. Close on backdrop or X.
Toast: custom component, bottom-right, 3.5s auto-dismiss.
Search: client-side filter on name and ref fields.