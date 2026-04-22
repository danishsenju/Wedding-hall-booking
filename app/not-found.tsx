import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Lumières Grand Hall",
};

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--base)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(109,40,217,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        <div
          className="mb-4 text-[8rem] font-light leading-none tracking-tighter select-none"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, var(--gold-dim), var(--gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: 0.6,
          }}
        >
          404
        </div>

        <div
          className="mb-2 text-xs uppercase tracking-[0.28em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          Lumières Grand Hall
        </div>

        <h1
          className="mb-4 text-3xl font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          Page Not Found
        </h1>

        <p
          className="mx-auto mb-10 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--gold-hover))",
              color: "#EDE9FE",
              fontFamily: "var(--font-body)",
            }}
          >
            Return Home
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center rounded-sm px-6 py-2.5 text-sm transition-all"
            style={{
              border: "1px solid var(--border-hover)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Book a Date
          </Link>
        </div>
      </div>
    </div>
  );
}
