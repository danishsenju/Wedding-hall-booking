import type { Metadata } from "next"
import ConfirmationClient from "./ConfirmationClient"

export const metadata: Metadata = {
  title: "Booking Confirmed — Laman Troka",
  description: "Your wedding booking request has been received. We will be in touch within 24–48 hours.",
}

export const dynamic = "force-dynamic"

interface Props {
  searchParams: { ref?: string }
}

export default function ConfirmationPage({ searchParams }: Props) {
  const ref = searchParams.ref ?? ""
  return <ConfirmationClient ref_code={ref} />
}
