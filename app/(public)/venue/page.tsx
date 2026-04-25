import AmenitiesTags from "@/components/venue/AmenitiesTags";
import FloorPlanMorph from "@/components/venue/FloorPlanMorph";
import GalleryStrip from "@/components/venue/GalleryStrip";
import InclusionsChecklist from "@/components/venue/InclusionsChecklist";
import SpecsGrid from "@/components/venue/SpecsGrid";
import VenueHero from "@/components/venue/VenueHero";
import { getAllHalls } from "@/app/actions/hall";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Details — Laman Troka",
  description:
    "Explore our world-class event spaces at Laman Troka, Kuala Lumpur's most refined wedding destination.",
};

export default async function VenuePage() {
  const result = await getAllHalls();
  const venue = result.success && result.data?.length ? result.data[0] : null;

  return (
    <main style={{ background: "var(--base)" }}>
      <VenueHero
        name={venue?.name}
        subtitle={venue?.subtitle ?? undefined}
        heroImageUrl={venue?.hero_image_url ?? undefined}
        location={venue?.location ?? undefined}
        capacityMax={venue?.capacity_max}
      />
      <GalleryStrip images={venue?.gallery_images ?? []} />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-20">
          <SpecsGrid
            capacityMin={venue?.capacity_min}
            capacityMax={venue?.capacity_max}
            sizeSqft={venue?.size_sqft}
            ceilingHeight={venue?.ceiling_height_m}
            parkingBays={venue?.parking_bays}
            location={venue?.location}
          />
          <AmenitiesTags />
          <InclusionsChecklist />
          <FloorPlanMorph />
        </div>
      </div>
    </main>
  );
}
