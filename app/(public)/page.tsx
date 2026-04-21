import type { Metadata } from "next";
import BentoFeatures from "@/components/landing/BentoFeatures";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import ThemeCarousel from "@/components/landing/ThemeCarousel";
import VenueShowcase from "@/components/landing/VenueShowcase";

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

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <VenueShowcase />
      <ThemeCarousel />
      <BentoFeatures />
      <CTABand />
      <Footer />
    </main>
  );
}
