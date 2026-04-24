import AmenitiesTags from "@/components/venue/AmenitiesTags";
import FloorPlanMorph from "@/components/venue/FloorPlanMorph";
import GalleryStrip from "@/components/venue/GalleryStrip";
import InclusionsChecklist from "@/components/venue/InclusionsChecklist";
import PricingCard from "@/components/venue/PricingCard";
import SpecsGrid from "@/components/venue/SpecsGrid";
import VenueHero from "@/components/venue/VenueHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Details — Laman Troka",
  description:
    "Explore Laman Troka: 15,000 sq ft of timeless elegance in KLCC, Kuala Lumpur. Packages from RM 28,000.",
};

export default function VenuePage() {
  return (
    <main style={{ background: "var(--base)" }}>
      <VenueHero />
      <GalleryStrip />

      {/* Main content + sticky sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 xl:gap-20">
          {/* Left — scrollable content */}
          <div className="min-w-0 space-y-20">
            <SpecsGrid />
            <AmenitiesTags />
            <InclusionsChecklist />
            <FloorPlanMorph />
          </div>

          {/* Right — sticky pricing */}
          <aside className="w-full">
            <PricingCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
