import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getThemeById, getAllThemes } from "@/app/actions/theme";
import ThemeDetailClient from "@/components/themes/ThemeDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const result = await getThemeById(params.id);
  if (!result.success || !result.data) return { title: "Theme | Laman Troka" };
  const t = result.data;
  return {
    title: `${t.name} — Wedding Theme`,
    description:
      t.tagline ?? t.description ?? "An exclusive wedding theme at Laman Troka.",
    openGraph: {
      images: t.image_url
        ? [{ url: t.image_url, width: 1200, height: 630, alt: t.name }]
        : [],
    },
  };
}

export default async function ThemeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [themeResult, allResult] = await Promise.all([
    getThemeById(params.id),
    getAllThemes(),
  ]);

  if (!themeResult.success || !themeResult.data) notFound();

  const related = (allResult.data ?? [])
    .filter((t) => t.id !== params.id)
    .slice(0, 3);

  return <ThemeDetailClient theme={themeResult.data} related={related} />;
}
