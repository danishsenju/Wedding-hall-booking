import { getGalleryImages } from "@/app/actions/gallery";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const result = await getGalleryImages();
  const images = result.success ? (result.data ?? []) : [];

  return <GalleryClient initialImages={images} />;
}
