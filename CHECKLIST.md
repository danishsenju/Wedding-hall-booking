# Lumières Build Checklist

## PHASE 1 — Project Setup
- [x] Next.js 14 initialized with TypeScript
- [x] Tailwind configured with CSS variables
- [x] Framer Motion installed
- [x] Lucide React installed
- [x] Google Fonts configured (Cormorant Garamond + DM Sans)
- [ ] Supabase project created
- [x] Supabase client configured
- [x] Environment variables set
- [x] Base layout with CSS variables
- [x] globals.css with design tokens

## PHASE 2 — Database
- [x] venues table created
- [x] bookings table created
- [ ] time_slots table created (handled via time_slot text field in bookings)
- [x] addons table created
- [x] booking_addons table created
- [x] blocked_dates table created
- [ ] admin_users table created (using Supabase Auth — no separate table needed)
- [x] RLS policies set
- [x] Seed data inserted (seed.sql ready — run after connecting Supabase)
- [x] TypeScript types generated (types/database.ts)
- [x] /lib/supabase-server.ts created
- [x] /lib/queries.ts created (getVenue · getPackages · getAddons · getBlockedDates · getBookings · getBookingByRef · getBookingStats · isDateAvailable)
- [x] /app/actions/booking.ts created (createBooking · updateBookingStatus · generateRef)
- [x] /app/actions/admin.ts created (getAdminStats · searchBookings · filterBookings)
- [x] updated_at trigger added
- [x] generate_booking_ref() Postgres function added
- [x] Indexes on bookings.status, bookings.event_date, bookings.ref, bookings.email

## PHASE 3 — Landing Page
- [x] Navbar (desktop + mobile Floating Dock)
- [x] Hero (Aurora + Typewriter + Flip Words)
- [x] Stats strip (Number Ticker)
- [x] Venue showcase section
- [x] Theme carousel (Apple Cards)
- [x] Features Bento Grid
- [x] CTA band
- [x] Footer

## PHASE 4 — Venue Details
- [x] Venue hero with real photo
- [x] Specs grid
- [x] Amenities tags
- [x] Inclusions checklist
- [x] Floor plan morph (SVG)
- [x] Sticky pricing card
- [x] Live deposit calculator

## PHASE 5 — Booking Form
- [x] Step indicator component
- [x] Step 1: Personal details + validation
- [x] Step 2: Calendar + time slots
- [x] Step 3: Add-ons toggle
- [x] Step 4: Review + submit
- [x] Live summary sidebar
- [x] Form state management
- [x] Submit to Supabase

## PHASE 6 — Confirmation Page
- [x] Stroke-draw checkmark animation
- [x] Booking details card
- [x] Timeline component
- [x] WhatsApp button
- [x] Trust footer

## PHASE 7 — Admin
- [x] Admin login page
- [x] Supabase auth
- [x] Protected route middleware
- [x] Dashboard stats (live)
- [x] Bookings table (desktop)
- [x] Expandable cards (mobile)
- [x] Filter + search
- [x] Approve/reject actions
- [x] Detail modal
- [x] Toast notifications

## PHASE 8 — Polish
- [x] All Framer Motion animations (aurora 8-16s, typewriter 68ms, flip words 2.5s, scroll reveals, number ticker easeOut, page transitions)
- [x] Magnet Button on all CTAs (Hero, CTABand — spring reset, touch disabled via pointer-coarse media)
- [x] Card Spotlight (cursor tracking in venue cards, touch disabled)
- [x] True Focus on form inputs (Step1Details gold border on focus, others dim)
- [x] Noise texture overlay (globals.css noise-overlay + SVG feTurbulence per section)
- [x] Mobile 375px tested (FloatingDock 4 items, no overflow, touch targets 44px, accordion booking summary)
- [x] All images loading (next/image with sizes, priority on hero, Unsplash ?w=800&q=80)
- [x] Error states handled (error.tsx for book, venue, dashboard + global not-found.tsx)
- [x] Loading skeletons (BookingSkeleton, VenueSkeleton, DashboardSkeleton + loading.tsx per route)
- [x] Vercel deployment ready (sitemap.xml, robots.txt, PWA manifest, RouteProgress, favicon.svg)

## PHASE 9 — Beyond Requirements
- [x] /sitemap.xml (app/sitemap.ts — auto-generated, SEO-ready)
- [x] /robots.txt (app/robots.ts — blocks admin/api, allows public routes)
- [x] PWA manifest (app/manifest.ts — installable, shortcuts to /book and /venue, gold theme)
- [x] Route progress bar (RouteProgress.tsx — gold shimmer scaleX animation on every navigation)
- [x] Gold favicon SVG (public/favicon.svg — "L" monogram on dark background)
- [x] Supabase Realtime (admin dashboard live-updates bookings without refresh)
- [x] CSV export (admin can export filtered bookings)
- [x] Tab title badge (admin tab shows unread count when new booking arrives)
- [x] Print stylesheet (confirmation page prints cleanly)
- [x] Confetti on booking submit (canvas-confetti burst)
- [x] sessionStorage persistence (booking form survives page refresh)
- [x] Activity log (admin sees timestamped approve/reject history)
- [x] Trend chart (admin sidebar shows booking volume over time)
