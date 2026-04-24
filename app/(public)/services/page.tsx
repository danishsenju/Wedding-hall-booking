import type { Metadata } from "next"
import { getAllVendors } from "@/app/actions/vendor"
import ServicesShowcase from "@/components/services/ServicesShowcase"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Services — Laman Troka",
  description:
    "Discover our bespoke wedding services — photography, décor, catering and more. Curated exclusively for Laman Troka celebrations.",
}

export default async function ServicesPage() {
  const result = await getAllVendors()
  const vendors = result.data ?? []

  return (
    <main style={{ background: "var(--base)" }}>
      <ServicesShowcase vendors={vendors} />
    </main>
  )
}
