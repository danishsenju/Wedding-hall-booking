import { getGalleryImages } from "@/app/actions/gallery";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery — Lumières Grand Hall",
  description: "Explore our curated gallery of wedding moments and venue setups at Lumières Grand Hall, Kuala Lumpur.",
};

export default async function GalleryPage() {
  const result = await getGalleryImages();
  const images = result.success ? (result.data ?? []) : [];

  return <GalleryClient images={images} />;
}
