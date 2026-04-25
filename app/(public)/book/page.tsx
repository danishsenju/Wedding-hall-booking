import type { Metadata } from "next"
import { getBlockedDates, getPackages, getVenue } from "@/lib/queries"
import { getAllVendors } from "@/app/actions/vendor"
import { getAllThemes } from "@/app/actions/theme"
import BookingFlow from "@/components/booking/BookingFlow"

export const metadata: Metadata = {
  title: "Book Your Date — Laman Troka",
  description:
    "Reserve your dream wedding at Laman Troka. Premium packages from RM 18,000 with bespoke add-ons.",
}

export const dynamic = "force-dynamic"

export default async function BookPage() {
  const [venue, packages, vendorResult, blockedDates, themesResult] = await Promise.all([
    getVenue(),
    getPackages(),
    getAllVendors(),
    getBlockedDates(),
    getAllThemes(),
  ])

  return (
    <BookingFlow
      venue={venue}
      packages={packages}
      vendors={vendorResult.data ?? []}
      blockedDates={blockedDates}
      themes={themesResult.data ?? []}
    />
  )
}
