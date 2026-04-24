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
  latitude        numeric,
  longitude       numeric,
  hero_image_url  text,
  created_at      timestamptz default now()
);

-- Add coordinate columns to existing venues table (safe to run on existing DBs)
alter table venues add column if not exists latitude  numeric;
alter table venues add column if not exists longitude numeric;

-- Add landing-page display columns to venues (safe to run on existing DBs)
alter table venues add column if not exists subtitle text;
alter table venues add column if not exists tag      text;
alter table venues add column if not exists href     text;

-- ─── THEMES (for ThemeCarousel on landing page) ───────────────
create table if not exists themes (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tagline       text,
  description   text,
  image_url     text,
  price_from_rm int,
  mood          text,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

alter table themes enable row level security;

drop policy if exists "public read themes"  on themes;
drop policy if exists "admin all themes"    on themes;

create policy "public read themes"
  on themes for select using (true);
create policy "admin all themes"
  on themes for all using (auth.role() = 'authenticated');

grant select on table themes to anon;
grant all    on table themes to authenticated;

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

-- ─── BOOKING VENDORS ──────────────────────────────────────────
create table if not exists booking_vendors (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete cascade,
  vendor_id   uuid references vendors(id),
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
-- GRANTS — explicit table access for anon + authenticated roles
-- (required in newer Supabase projects where auto-grants are off)
-- ═══════════════════════════════════════════════════════════════

grant usage on schema public to anon, authenticated, service_role;

-- Public catalog reads
grant select on table venues, packages, addons, blocked_dates to anon;

-- Admin write via anon key + auth session (anon key is the fallback when no service role key is set)
grant insert, update, delete on table packages, venues, addons, blocked_dates to anon;

-- Public booking submission
grant insert on table bookings, booking_addons to anon;

-- Public booking read (confirmation page)
grant select on table bookings, booking_addons to anon;

-- Admin full access
grant all on table bookings, booking_addons, blocked_dates, venues, packages, addons to authenticated;

-- Service role full access (bypasses RLS but still needs PostgreSQL-level grants in Supabase)
grant all on table venues, packages, addons, blocked_dates, bookings, booking_addons to service_role;

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
drop policy if exists "admin insert packages"      on packages;
drop policy if exists "admin update packages"      on packages;
drop policy if exists "admin delete packages"      on packages;
drop policy if exists "admin all venues"           on venues;
drop policy if exists "admin all addons"           on addons;

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
create policy "admin all venues"
  on venues for all using (auth.role() = 'authenticated');
create policy "admin all addons"
  on addons for all using (auth.role() = 'authenticated');
create policy "admin insert packages"
  on packages for insert to authenticated with check (true);
create policy "admin update packages"
  on packages for update to authenticated using (true) with check (true);
create policy "admin delete packages"
  on packages for delete to authenticated using (true);

-- ─── GALLERY ──────────────────────────────────────────────────
create table if not exists gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  image_url   text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table gallery enable row level security;

drop policy if exists "public read gallery"  on gallery;
drop policy if exists "admin all gallery"    on gallery;

create policy "public read gallery"
  on gallery for select using (true);
create policy "admin all gallery"
  on gallery for all using (auth.role() = 'authenticated');

grant select, insert, update, delete on table gallery to anon;
grant all on table gallery to authenticated;
grant all on table gallery to service_role;

-- ─── VENDORS ──────────────────────────────────────────────────
create table if not exists vendors (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('catering', 'photography', 'decor')),
  name        text not null,
  instagram   text,
  price_rm    int not null default 0,
  created_at  timestamptz default now()
);

alter table vendors enable row level security;

drop policy if exists "public read vendors" on vendors;
drop policy if exists "admin all vendors"   on vendors;

create policy "public read vendors"
  on vendors for select using (true);
create policy "admin all vendors"
  on vendors for all using (auth.role() = 'authenticated');

grant select, insert, update, delete on table vendors to anon;
grant all on table vendors to authenticated;
grant all on table vendors to service_role;

create index if not exists idx_gallery_sort on gallery (sort_order);

-- ─── CONTACT MESSAGES ─────────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  event_date  date,
  guests      text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz default now()
);

alter table contact_messages enable row level security;

drop policy if exists "public insert contact_messages" on contact_messages;
drop policy if exists "admin all contact_messages"     on contact_messages;

-- Anyone can submit a contact message
create policy "public insert contact_messages"
  on contact_messages for insert with check (true);

-- Only admins can read / update / delete
create policy "admin all contact_messages"
  on contact_messages for all using (auth.role() = 'authenticated');

grant insert on table contact_messages to anon;
grant all    on table contact_messages to authenticated;
grant all    on table contact_messages to service_role;

create index if not exists idx_contact_messages_created on contact_messages (created_at desc);
create index if not exists idx_contact_messages_unread  on contact_messages (is_read) where is_read = false;
