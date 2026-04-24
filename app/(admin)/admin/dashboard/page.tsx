import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getBookings } from "@/lib/queries"
import { getAdminStats } from "@/app/actions/admin"
import { getContactMessages } from "@/app/actions/contact"
import DashboardClient from "./DashboardClient"

export const metadata = {
  title: "Dashboard | Laman Troka Admin",
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const token = cookies().get("admin-token")?.value
  if (!token) redirect("/admin/login")

  const [bookings, statsResult, messagesResult] = await Promise.all([
    getBookings(),
    getAdminStats(),
    getContactMessages(),
  ])

  const stats = statsResult.data ?? {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRevenue: 0,
    thisMonthBookings: 0,
  }

  const messages = messagesResult.data ?? []

  return (
    <DashboardClient
      initialBookings={bookings}
      initialStats={stats}
      initialMessages={messages}
    />
  )
}
