import type { Metadata } from "next"
import { getBlockedDates, getPackages, getVenue } from "@/lib/queries"
import { getAllVendors } from "@/app/actions/vendor"
import BookingFlow from "@/components/booking/BookingFlow"

export const metadata: Metadata = {
  title: "Book Your Date — Lumières Grand Hall",
  description:
    "Reserve your dream wedding at Lumières Grand Hall. Premium packages from RM 18,000 with bespoke add-ons.",
}

export const dynamic = "force-dynamic"

export default async function BookPage() {
  const [venue, packages, vendorResult, blockedDates] = await Promise.all([
    getVenue(),
    getPackages(),
    getAllVendors(),
    getBlockedDates(),
  ])

  return (
    <BookingFlow
      venue={venue}
      packages={packages}
      vendors={vendorResult.data ?? []}
      blockedDates={blockedDates}
    />
  )
}
