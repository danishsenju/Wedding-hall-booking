-- ═══════════════════════════════════════════════════════════════
-- LUMIÈRES GRAND HALL — SEED DATA
-- Run AFTER database-schema.sql
-- ═══════════════════════════════════════════════════════════════

-- ─── VENUE ────────────────────────────────────────────────────
insert into venues (name, description, capacity_min, capacity_max, size_sqft, ceiling_height_m, parking_bays, location)
values (
  'The Grand Lumières Hall',
  'An opulent celebration space where golden light meets timeless elegance. Set in the heart of Kuala Lumpur, The Grand Lumières Hall redefines luxury weddings with cathedral ceilings, hand-crafted chandeliers, and floor-to-ceiling windows that bathe every moment in warm, cinematic light. Every detail — from the Italian marble foyer to the private bridal suite — is designed to make your day unforgettable.',
  300,
  1500,
  15000,
  9.5,
  400,
  'Jalan Ampang, 50450 Kuala Lumpur'
);

-- ─── PACKAGES ─────────────────────────────────────────────────
insert into packages (venue_id, name, price_rm, capacity_max, duration_hours)
select id, 'Silver',   28000,  500,  8 from venues where name = 'The Grand Lumières Hall'
union all
select id, 'Gold',     42000,  800, 10 from venues where name = 'The Grand Lumières Hall'
union all
select id, 'Platinum', 65000, 1500, 12 from venues where name = 'The Grand Lumières Hall';

-- ─── ADDONS ───────────────────────────────────────────────────
insert into addons (name, price_rm, description) values
  ('Live Band Performance',     4500, 'Professional 5-piece live band covering popular Malay, English, and ballad repertoire throughout your reception.'),
  ('Grand Floral Arch',         2800, 'Custom floral archway at the entrance, designed to match your wedding palette.'),
  ('Photobooth Station',        1200, 'Fully themed photobooth with unlimited prints, props, and digital sharing throughout the event.'),
  ('Drone Photography',         1800, 'Licensed drone operator capturing cinematic aerial footage of your ceremony and venue exterior.'),
  ('Fireworks Display',         3500, 'Professional outdoor fireworks show — 5-minute synchronized display to close your reception.'),
  ('Custom Monogram Lighting',   900, 'Bespoke gobo projection of your initials and wedding date across the ballroom ceiling.'),
  ('Valet Parking (50 Cars)',   1500, 'Dedicated valet team for up to 50 vehicles, ensuring seamless arrival for your guests.'),
  ('Pre-Wedding Photo Session', 2200, 'In-venue couple shoot with a dedicated photographer — 2 hours, 60 edited digital images delivered.');

-- ─── BLOCKED DATES ────────────────────────────────────────────
insert into blocked_dates (venue_id, blocked_date, reason)
select id, '2025-05-10', 'Private corporate event' from venues where name = 'The Grand Lumières Hall'
union all
select id, '2025-05-24', 'Scheduled maintenance'   from venues where name = 'The Grand Lumières Hall'
union all
select id, '2025-06-07', 'Private corporate event' from venues where name = 'The Grand Lumières Hall'
union all
select id, '2025-06-21', 'Venue anniversary gala'  from venues where name = 'The Grand Lumières Hall'
union all
select id, '2025-07-05', 'Private corporate event' from venues where name = 'The Grand Lumières Hall'
union all
select id, '2025-07-19', 'Scheduled deep clean'    from venues where name = 'The Grand Lumières Hall';

-- ─── SAMPLE BOOKINGS ─────────────────────────────────────────
-- 2 pending · 2 approved · 1 rejected · 1 new submission

-- Booking 1 — PENDING (Gold package)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Gold' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, theme, layout_preference, status, total_rm, deposit_rm)
select
  'LMR-2025-0001',
  v.id, p.id,
  'Nurul Ain Binti Zulkifli', 'Ahmad Faisal Bin Hassan',
  'nurul.ain@gmail.com', '+60123456789',
  '2025-08-15', '6:00 PM – 11:00 PM', '600–700',
  'Enchanted Garden', 'Theatre',
  'pending', 42000, 12600
from v, p;

-- Booking 2 — PENDING (Silver package)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Silver' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, theme, layout_preference, special_requests, status, total_rm, deposit_rm)
select
  'LMR-2025-0002',
  v.id, p.id,
  'Siti Hajar Binti Razali', 'Hafiz Izwan Bin Noor',
  'sitihajar.wedding@gmail.com', '+60187654321',
  '2025-09-20', '11:00 AM – 5:00 PM', '350–450',
  'Classic Ivory & Gold', 'Banquet',
  'Please prepare a halal dessert station',
  'pending', 28000, 8400
from v, p;

-- Booking 3 — APPROVED (Platinum package)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Platinum' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, theme, layout_preference, status, total_rm, deposit_rm)
select
  'LMR-2025-0003',
  v.id, p.id,
  'Farah Liyana Binti Azman', 'Izzat Naim Bin Roslan',
  'farahizzat2025@gmail.com', '+60112223344',
  '2025-07-12', '6:00 PM – 12:00 AM', '1000–1200',
  'Royal Midnight Blue', 'Theatre',
  'approved', 65000, 19500
from v, p;

-- Booking 4 — APPROVED (Gold package)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Gold' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, theme, layout_preference, special_requests, status, total_rm, deposit_rm)
select
  'LMR-2025-0004',
  v.id, p.id,
  'Nur Ain Binti Mazlan', 'Razlan Azri Bin Othman',
  'razlan.ain.wedding@gmail.com', '+60198765432',
  '2025-08-28', '5:00 PM – 11:00 PM', '700–800',
  'Botanical Romance', 'Banquet',
  'Floral centrepieces in blush pink and white only',
  'approved', 43700, 13110
from v, p;

-- Booking 5 — REJECTED (Silver package, requested blocked date)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Silver' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, status, total_rm, deposit_rm)
select
  'LMR-2025-0005',
  v.id, p.id,
  'Wani Nabilah Binti Kadir', 'Kamil Aizat Bin Sulaiman',
  'kamilwani.wed@gmail.com', '+60167778899',
  '2025-07-05', '11:00 AM – 5:00 PM', '250–350',
  'rejected', 28000, 8400
from v, p;

-- Booking 6 — NEW SUBMISSION (Gold package, with addons)
with v as (select id from venues where name = 'The Grand Lumières Hall'),
     p as (select id from packages where name = 'Gold' and venue_id = (select id from v))
insert into bookings (ref, venue_id, package_id, bride_name, groom_name, email, phone,
  event_date, time_slot, guest_count, theme, layout_preference, special_requests, status, total_rm, deposit_rm)
select
  'LMR-2025-0006',
  v.id, p.id,
  'Liyana Sofea Binti Ibrahim', 'Danial Aiman Bin Yusof',
  'danialliyana.reception@gmail.com', '+60195551234',
  '2025-10-10', '6:00 PM – 11:00 PM', '600–700',
  'Modern Luxe', 'Cocktail',
  'Vegan menu options required for 30 guests',
  'pending', 49200, 14760
from v, p;

-- Booking addons for Booking 4 (Approved, has addons in total)
insert into booking_addons (booking_id, addon_id, price_rm)
select
  (select id from bookings where ref = 'LMR-2025-0004'),
  id,
  price_rm
from addons
where name in ('Grand Floral Arch', 'Custom Monogram Lighting');

-- Booking addons for Booking 6 (New submission with addons)
insert into booking_addons (booking_id, addon_id, price_rm)
select
  (select id from bookings where ref = 'LMR-2025-0006'),
  id,
  price_rm
from addons
where name in ('Live Band Performance', 'Photobooth Station', 'Drone Photography');
