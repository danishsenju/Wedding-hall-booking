import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAllHalls } from "@/app/actions/hall";
import { getAllThemes } from "@/app/actions/theme";
import HallsClient from "./HallsClient";

export const metadata = { title: "Manage Halls | Lumières Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHallsPage() {
  const token = cookies().get("admin-token")?.value;
  if (!token) redirect("/admin/login");

  const [hallsResult, themesResult] = await Promise.all([
    getAllHalls(),
    getAllThemes(),
  ]);

  return (
    <div className="relative min-h-screen" style={{ background: "var(--base)" }}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <HallsClient
          initialHalls={hallsResult.data ?? []}
          initialThemes={themesResult.data ?? []}
        />
      </div>
    </div>
  );
}
