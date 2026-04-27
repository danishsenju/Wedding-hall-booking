import VenueDetailClient from "@/components/venue/VenueDetailClient";
import { getHallById } from "@/app/actions/hall";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getHallById(params.slug);
  if (!result.success || !result.data) return { title: "Venue Not Found — Laman Troka" };
  const venue = result.data;
  return {
    title: `${venue.name} — Laman Troka`,
    description:
      venue.description ??
      `Discover ${venue.name} at Laman Troka, Kuala Lumpur's most refined wedding destination.`,
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const result = await getHallById(params.slug);
  if (!result.success || !result.data) notFound();

  return <VenueDetailClient venue={result.data} />;
}
