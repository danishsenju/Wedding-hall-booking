import AmenitiesTags from "@/components/venue/AmenitiesTags";
import FloorPlanMorph from "@/components/venue/FloorPlanMorph";
import GalleryStrip from "@/components/venue/GalleryStrip";
import InclusionsChecklist from "@/components/venue/InclusionsChecklist";
import SpecsGrid from "@/components/venue/SpecsGrid";
import VenueHero from "@/components/venue/VenueHero";
import { getAllHalls } from "@/app/actions/hall";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getAllHalls();
  const venues = result.success ? (result.data ?? []) : [];
  const venue = venues.find((v) => v.href === `/venues/${params.slug}`);

  if (!venue) return { title: "Venue Not Found — Laman Troka" };

  return {
    title: `${venue.name} — Laman Troka`,
    description: venue.description ?? `Discover ${venue.name} at Laman Troka, Kuala Lumpur's most refined wedding destination.`,
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const result = await getAllHalls();
  const venues = result.success ? (result.data ?? []) : [];
  const venue = venues.find((v) => v.href === `/venues/${params.slug}`);

  if (!venue) notFound();

  return (
    <main style={{ background: "var(--base)" }}>
      <VenueHero
        name={venue.name}
        subtitle={venue.subtitle ?? undefined}
        heroImageUrl={venue.hero_image_url ?? undefined}
        location={venue.location ?? undefined}
        capacityMax={venue.capacity_max}
      />
      <GalleryStrip images={venue.gallery_images ?? []} />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-20">
          <SpecsGrid
            capacityMin={venue.capacity_min}
            capacityMax={venue.capacity_max}
            sizeSqft={venue.size_sqft}
            ceilingHeight={venue.ceiling_height_m}
            parkingBays={venue.parking_bays}
            location={venue.location}
          />
          <AmenitiesTags />
          <InclusionsChecklist />
          <FloorPlanMorph />
        </div>
      </div>
    </main>
  );
}
