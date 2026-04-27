import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { getAllHalls } from "@/app/actions/hall";
import type { Venue } from "@/types";

const STATIC_LINKS = {
  Services: [
    { label: "Catering", href: "/services" },
    { label: "Photography", href: "/services" },
    { label: "Décor & Florals", href: "/services" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

function VenueLinks({ venues }: { venues: Venue[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {venues.map((venue) => (
        <li key={venue.id}>
          <Link
            href={`/venues/${venue.id}`}
            className="transition-colors duration-200 hover:text-[var(--gold)]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
          >
            {venue.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function VenuesEmptyState() {
  return (
    <div
      className="flex flex-col gap-3 rounded-sm px-4 py-5"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2">
        <Sparkles
          size={13}
          strokeWidth={1.5}
          style={{ color: "var(--gold)", flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          className="text-sm italic leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            letterSpacing: "0.03em",
          }}
        >
          Curated venues coming soon
        </span>
      </div>

      <div
        className="h-px w-full opacity-40"
        style={{
          background: "linear-gradient(90deg, var(--gold), transparent)",
        }}
        aria-hidden="true"
      />

      <p
        className="text-xs leading-relaxed"
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        Our spaces are being prepared for your celebration. Contact us to
        arrange a private viewing.
      </p>

      <Link
        href="/contact"
        className="mt-1 inline-flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-[var(--gold-hover)]"
        style={{
          color: "var(--gold)",
          fontFamily: "var(--font-body)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Enquire now{" "}
        <span aria-hidden="true" style={{ fontSize: "10px" }}>
          →
        </span>
      </Link>
    </div>
  );
}

export default async function Footer() {
  const hallsResult = await getAllHalls();
  const venues = hallsResult.success ? (hallsResult.data ?? []) : [];
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative border-t"
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border)",
      }}
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(109,40,217,0.3), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Laman Troka"
                width={150}
                height={44}
                className="object-contain"
              />
            </div>

            <p
              className="mb-5 leading-relaxed"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.05rem",
                letterSpacing: "0.01em",
              }}
            >
              Kuala Lumpur&apos;s most refined wedding destination. Where timeless
              elegance meets modern luxury.
            </p>

            <address
              className="not-italic text-sm"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
            >
              <p>Level 5, The Grand Tower</p>
              <p>Jalan Bukit Bintang</p>
              <p className="mb-3">55100 Kuala Lumpur</p>
              <p>
                <a
                  href="tel:+60312345678"
                  className="transition-colors duration-200 hover:text-[var(--gold)]"
                >
                  +6019 2774203
                </a>
              </p>
              <p>
                <a
                  href="mailto:danishfarhanzailan392@gmail.com"
                  className="transition-colors duration-200 hover:text-[var(--gold)]"
                >
                  danishfarhanzailan392@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Venues column — dynamic */}
          <div>
            <h4
              className="mb-4 text-xs uppercase tracking-[0.28em]"
              style={{
                color: "var(--gold)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.28em",
              }}
            >
              Venues
            </h4>
            {venues.length > 0 ? (
              <VenueLinks venues={venues} />
            ) : (
              <VenuesEmptyState />
            )}
          </div>

          {/* Services & Company columns — static */}
          {(
            Object.entries(STATIC_LINKS) as [
              string,
              readonly { label: string; href: string }[],
            ][]
          ).map(([category, links]) => (
            <div key={category}>
              <h4
                className="mb-4 text-xs uppercase tracking-[0.28em]"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.28em",
                }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors duration-200 hover:text-[var(--gold)]"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
            }}
          >
            © {year} Laman Troka. All rights reserved.
          </p>

          <Link
            href="/admin"
            className="transition-colors duration-200 hover:text-[var(--gold)]"
            style={{
              color: "var(--gold-dim)",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
            }}
          >
            Admin Portal →
          </Link>
        </div>
      </div>
    </footer>
  );
}
