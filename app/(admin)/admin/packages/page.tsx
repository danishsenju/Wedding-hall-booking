import { getAllPackages } from "@/app/actions/package"
import { getAllHalls } from "@/app/actions/hall"
import { getAllVendors } from "@/app/actions/vendor"
import PackagesClient from "./PackagesClient"

export const dynamic = "force-dynamic"

export default async function PackagesPage() {
  const [pkgsResult, hallsResult, vendorsResult] = await Promise.all([
    getAllPackages(),
    getAllHalls(),
    getAllVendors(),
  ])

  return (
    <PackagesClient
      initialPackages={pkgsResult.data ?? []}
      venues={hallsResult.data ?? []}
      initialVendors={vendorsResult.data ?? []}
    />
  )
}
