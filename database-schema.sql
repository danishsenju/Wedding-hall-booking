-- ═══════════════════════════════════════════════════════════════
-- LUMIÈRES GRAND HALL — DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── VENUES ───────────────────────────────────────────────────
create table if not exists venues (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  capacity_min    int,
  capacity_max    int,
  size_sqft       int,
  ceiling_height_m numeric,
  parking_bays    int,
  location        text,
  hero_image_url  text,
  created_at      timestamptz default now()
);

-- ─── PACKAGES ─────────────────────────────────────────────────
create table if not exists packages (
  id              uuid primary key default gen_random_uuid(),
  venue_id        uuid references venues(id) on delete cascade,
  name            text not null, -- Silver | Gold | Platinum
  price_rm        int not null,
  capacity_max    int,
  duration_hours  int,
  created_at      timestamptz default now()
);

-- ─── ADDONS ───────────────────────────────────────────────────
create table if not exists addons (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price_rm    int not null,
  description text,
  created_at  timestamptz default now()
);

-- ─── BLOCKED DATES ────────────────────────────────────────────
create table if not exists blocked_dates (
  id           uuid primary key default gen_random_uuid(),
  venue_id     uuid references venues(id) on delete cascade,
  blocked_date date not null,
  reason       text,
  created_at   timestamptz default now()
);

-- ─── BOOKINGS ─────────────────────────────────────────────────
create table if not exists bookings (
  id                  uuid primary key default gen_random_uuid(),
  ref                 text unique not null,
  venue_id            uuid references venues(id),
  package_id          uuid references packages(id),
  bride_name          text not null,
  groom_name          text not null,
  email               text not null,
  phone               text not null,
  event_date          date not null,
  time_slot           text not null,
  guest_count         text not null,
  theme               text,
  layout_preference   text,
  special_requests    text,
  status              text not null default 'pending'
                        check (status in ('pending', 'approved', 'rejected')),
  total_rm            int,
  deposit_rm          int,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ─── BOOKING ADDONS ───────────────────────────────────────────
create table if not exists booking_addons (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete cascade,
  addon_id    uuid references addons(id),
  price_rm    int not null
);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at on bookings row change
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_updated_at on bookings;
create trigger bookings_updated_at
  before update on bookings
  for each row
  execute function update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- POSTGRES FUNCTION — BOOKING REF GENERATOR
-- Returns: LMR-YYYY-XXXX (sequential per year, race-safe)
-- ═══════════════════════════════════════════════════════════════

create or replace function generate_booking_ref()
returns text
language plpgsql
security definer
as $$
declare
  year_part text := to_char(now(), 'YYYY');
  seq_num   int;
begin
  -- Count existing bookings this year and increment
  -- Using FOR UPDATE to prevent duplicate refs under concurrent inserts
  select coalesce(max(right(ref, 4)::int), 0) + 1
    into seq_num
    from bookings
   where ref like 'LMR-' || year_part || '-%';

  return 'LMR-' || year_part || '-' || lpad(seq_num::text, 4, '0');
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- INDEXES — performance on most-queried columns
-- ═══════════════════════════════════════════════════════════════

create index if not exists idx_bookings_status     on bookings (status);
create index if not exists idx_bookings_event_date on bookings (event_date);
create index if not exists idx_bookings_ref        on bookings (ref);
create index if not exists idx_bookings_email      on bookings (email);
create index if not exists idx_blocked_dates_date  on blocked_dates (blocked_date);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table bookings      enable row level security;
alter table venues        enable row level security;
alter table packages      enable row level security;
alter table addons        enable row level security;
alter table blocked_dates enable row level security;
alter table booking_addons enable row level security;

-- Drop existing policies (safe to re-run)
drop policy if exists "public read venues"         on venues;
drop policy if exists "public read packages"       on packages;
drop policy if exists "public read addons"         on addons;
drop policy if exists "public read blocked"        on blocked_dates;
drop policy if exists "public insert bookings"     on bookings;
drop policy if exists "public insert booking_addons" on booking_addons;
drop policy if exists "admin all bookings"         on bookings;
drop policy if exists "admin all booking_addons"   on booking_addons;
drop policy if exists "admin all blocked"          on blocked_dates;

-- Public read (catalog data)
create policy "public read venues"    on venues        for select using (true);
create policy "public read packages"  on packages      for select using (true);
create policy "public read addons"    on addons        for select using (true);
create policy "public read blocked"   on blocked_dates for select using (true);

-- Public write (booking submission)
create policy "public insert bookings"
  on bookings for insert with check (true);
create policy "public insert booking_addons"
  on booking_addons for insert with check (true);

-- Admin full access (authenticated users — admin only)
create policy "admin all bookings"
  on bookings for all using (auth.role() = 'authenticated');
create policy "admin all booking_addons"
  on booking_addons for all using (auth.role() = 'authenticated');
create policy "admin all blocked"
  on blocked_dates for all using (auth.role() = 'authenticated');
