import type { Metadata } from "next";
import { getAllHalls } from "@/app/actions/hall";
import { getAllThemes } from "@/app/actions/theme";
import BentoFeatures from "@/components/landing/BentoFeatures";
import CTABand from "@/components/landing/CTABand";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import ThemeCarousel from "@/components/landing/ThemeCarousel";
import VenueShowcase from "@/components/landing/VenueShowcase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lumières Grand Hall — Premium Wedding Venue, Kuala Lumpur",
  openGraph: {
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Lumières Grand Hall — Premium Wedding Venue, Kuala Lumpur",
      },
    ],
  },
};

export default async function LandingPage() {
  const [hallsResult, themesResult] = await Promise.all([
    getAllHalls(),
    getAllThemes(),
  ]);

  return (
    <main>
      <Hero />
      <StatsStrip />
      <VenueShowcase initialVenues={hallsResult.data ?? []} />
      <ThemeCarousel initialThemes={themesResult.data ?? []} />
      <BentoFeatures />
      <CTABand />
    </main>
  );
}
