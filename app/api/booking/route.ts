import { type NextRequest, NextResponse } from "next/server"
import { getBookingByRef } from "@/lib/queries"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")

  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 })
  }

  const booking = await getBookingByRef(ref)

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  return NextResponse.json(booking)
}
