import { getAllVendors } from "@/app/actions/vendor"
import VendorsClient from "./VendorsClient"

export const dynamic = "force-dynamic"

export default async function VendorsPage() {
  const result = await getAllVendors()
  return <VendorsClient initialVendors={result.data ?? []} />
}
