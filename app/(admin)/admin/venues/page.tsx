import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { getAllVenues } from "@/app/actions/venue";
import VenueLocationManager from "@/components/admin/VenueLocationManager";

export const metadata = {
  title: "Venue Locations | Laman Troka Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminVenuesPage() {
  const token = cookies().get("admin-token")?.value;
  if (!token) redirect("/admin/login");

  const result = await getAllVenues();
  const venues = result.data ?? [];

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "var(--base)" }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-xs tracking-wide transition-colors"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={13} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div
            className="text-xs uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Laman Troka
          </div>
          <h1
            className="mt-0.5 flex items-center gap-3 text-3xl font-light"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            <MapPin size={24} style={{ color: "var(--gold)" }} />
            Venue Locations
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Set the address and GPS coordinates for each hall. These coordinates
            appear as pins on the public Map page.
          </p>
        </div>

        {/* Instructions */}
        <div
          className="mb-6 rounded-sm p-4 text-sm"
          style={{
            background: "rgba(109,40,217,0.07)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          <strong style={{ color: "var(--text)" }}>How to set coordinates:</strong>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs">
            <li>Enter the venue address in the Address field.</li>
            <li>Click <strong>Search</strong> to auto-fill GPS coordinates using OpenStreetMap.</li>
            <li>Or open Google Maps, right-click the location, and copy the coordinates into the Lat/Lng fields.</li>
            <li>Click <strong>Save Location</strong>. The pin will appear on the public globe immediately.</li>
          </ol>
        </div>

        {/* Venue cards */}
        <VenueLocationManager venues={venues} />
      </div>
    </div>
  );
}
