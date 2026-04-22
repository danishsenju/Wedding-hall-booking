/* ─── Database Entity Types ──────────────────────── */

export type VenueId = string;
export type PackageId = string;
export type BookingId = string;
export type AddonId = string;

export interface Venue {
  id: VenueId;
  name: string;
  subtitle: string | null;
  tag: string | null;
  href: string | null;
  description: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  size_sqft: number | null;
  ceiling_height_m: number | null;
  parking_bays: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  hero_image_url: string | null;
  created_at: string;
}

export interface Package {
  id: PackageId;
  venue_id: VenueId;
  name: string; // Silver | Gold | Platinum
  price_rm: number;
  capacity_max: number | null;
  duration_hours: number | null;
  created_at: string;
}

export interface Addon {
  id: AddonId;
  name: string;
  price_rm: number;
  description: string | null;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  venue_id: VenueId;
  blocked_date: string; // ISO date string YYYY-MM-DD
  reason: string | null;
  created_at: string;
}

export type BookingStatus = "pending" | "approved" | "rejected";

export interface Booking {
  id: BookingId;
  ref: string; // LMR-YYYY-XXXX
  venue_id: VenueId;
  package_id: PackageId;
  bride_name: string;
  groom_name: string;
  email: string;
  phone: string;
  event_date: string; // ISO date string YYYY-MM-DD
  time_slot: string;
  guest_count: string;
  theme: string | null;
  layout_preference: string | null;
  special_requests: string | null;
  status: BookingStatus;
  total_rm: number | null;
  deposit_rm: number | null;
  created_at: string;
  updated_at: string;
}

export interface BookingAddon {
  id: string;
  booking_id: BookingId;
  addon_id: AddonId;
  price_rm: number;
}

/* ─── Join / Extended Types ──────────────────────── */

export interface BookingWithDetails extends Booking {
  venue?: Venue;
  package?: Package;
  addons?: (BookingAddon & { addon: Addon })[];
}

export interface VenueWithPackages extends Venue {
  packages: Package[];
}

/* ─── Form Types ─────────────────────────────────── */

export interface BookingFormData {
  // Step 1 — Personal Details
  bride_name: string;
  groom_name: string;
  email: string;
  phone: string;

  // Step 2 — Date & Time
  venue_id: VenueId;
  package_id: PackageId;
  event_date: string;
  time_slot: string;
  guest_count: string;

  // Step 3 — Add-ons
  selected_addons: AddonId[];

  // Step 4 — Extras
  theme: string;
  layout_preference: string;
  special_requests: string;
}

export type BookingStep = 1 | 2 | 3 | 4;

/* ─── Time Slot Types ────────────────────────────── */

export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  available: boolean;
}

/* ─── UI Types ───────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/* ─── Gallery Types ──────────────────────────────── */

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

/* ─── API Response Types ─────────────────────────── */

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type SupabaseError = {
  message: string;
  code?: string;
};

/* ─── Content / CMS Types ────────────────────────── */

export interface Theme {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  price_from_rm: number | null;
  mood: string | null;
  sort_order: number;
  created_at: string;
}

/** Venue row extended with fields used by VenueShowcase on the landing page */
export interface VenueShowcaseItem {
  id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  tag: string | null;
  href: string | null;
  hero_image_url: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  size_sqft: number | null;
  parking_bays: number | null;
}
