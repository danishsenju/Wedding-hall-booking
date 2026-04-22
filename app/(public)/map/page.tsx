import { createServerClient } from "@/lib/supabase-server";
import type { Venue } from "@/types";
import MapClient from "./MapClient";

export const metadata = {
  title: "Find Us | Lumières Grand Hall",
  description: "Locate Lumières Grand Hall on the map and get directions.",
};

export const dynamic = "force-dynamic";

async function getVenuesWithCoordinates(): Promise<Venue[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("[getVenuesWithCoordinates]", error.message);
    return [];
  }

  return (data ?? []) as Venue[];
}

export default async function MapPage() {
  const venues = await getVenuesWithCoordinates();

  return <MapClient venues={venues} />;
}
