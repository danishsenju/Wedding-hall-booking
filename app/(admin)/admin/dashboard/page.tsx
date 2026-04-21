import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getBookings } from "@/lib/queries"
import { getAdminStats } from "@/app/actions/admin"
import DashboardClient from "./DashboardClient"

export const metadata = {
  title: "Dashboard | Lumières Admin",
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const token = cookies().get("admin-token")?.value
  if (!token) redirect("/admin/login")

  const [bookings, statsResult] = await Promise.all([
    getBookings(),
    getAdminStats(),
  ])

  const stats = statsResult.data ?? {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRevenue: 0,
    thisMonthBookings: 0,
  }

  return (
    <DashboardClient initialBookings={bookings} initialStats={stats} />
  )
}
