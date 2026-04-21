import type { Metadata } from "next"
import { getAddons, getBlockedDates, getPackages, getVenue } from "@/lib/queries"
import BookingFlow from "@/components/booking/BookingFlow"

export const metadata: Metadata = {
  title: "Book Your Date — Lumières Grand Hall",
  description:
    "Reserve your dream wedding at Lumières Grand Hall. Premium packages from RM 18,000 with bespoke add-ons.",
}

export const dynamic = "force-dynamic"

export default async function BookPage() {
  const [venue, packages, addons, blockedDates] = await Promise.all([
    getVenue(),
    getPackages(),
    getAddons(),
    getBlockedDates(),
  ])

  return (
    <BookingFlow
      venue={venue}
      packages={packages}
      addons={addons}
      blockedDates={blockedDates}
    />
  )
}
