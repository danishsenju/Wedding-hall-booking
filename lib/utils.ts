import { type ClassValue, clsx } from "clsx";

/* ─── Class Merge ────────────────────────────────── */
// Simple className merger (clsx without tailwind-merge to avoid extra dep)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/* ─── Booking Reference Generator ───────────────── */
export function generateBookingRef(year?: number): string {
  const y = year ?? new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LMR-${y}-${rand}`;
}

/* ─── Price Formatters ───────────────────────────── */
export function formatRM(amount: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRMShort(amount: number): string {
  if (amount >= 1_000_000) return `RM ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `RM ${(amount / 1_000).toFixed(0)}K`;
  return `RM ${amount}`;
}

/* ─── Date Utilities ─────────────────────────────── */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function isDateInPast(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function isDateWithinMonths(dateStr: string, months: number): boolean {
  const date = new Date(dateStr + "T00:00:00");
  const limit = new Date();
  limit.setMonth(limit.getMonth() + months);
  return date <= limit;
}

/* ─── Deposit Calculator ─────────────────────────── */
export function calculateDeposit(totalRm: number, rate = 0.3): number {
  return Math.ceil(totalRm * rate);
}

/* ─── String Utilities ───────────────────────────── */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ─── Phone Formatter ────────────────────────────── */
export function formatMalaysianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("60")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+60 ${cleaned.slice(1, 3)}-${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/* ─── WhatsApp Link Builder ──────────────────────── */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const normalized = cleaned.startsWith("0") ? `60${cleaned.slice(1)}` : cleaned;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/* ─── Time Slot Helpers ──────────────────────────── */
export const TIME_SLOTS = [
  { id: "morning", label: "Morning", start: "10:00", end: "14:00" },
  { id: "afternoon", label: "Afternoon", start: "14:00", end: "18:00" },
  { id: "evening", label: "Evening", start: "18:00", end: "23:00" },
] as const;

export type TimeSlotId = (typeof TIME_SLOTS)[number]["id"];
