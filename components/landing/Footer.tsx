import Link from "next/link";

const FOOTER_LINKS = {
  Venues: [
    { label: "Grand Ballroom", href: "/venues/grand-ballroom" },
    { label: "Garden Terrace", href: "/venues/garden-terrace" },
    { label: "Rustic Chapel", href: "/venues/rustic-chapel" },
  ],
  Services: [
    { label: "Wedding Packages", href: "/packages" },
    { label: "Catering", href: "/services/catering" },
    { label: "Photography", href: "/services/photography" },
    { label: "Décor & Florals", href: "/services/decor" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export default function Footer() {
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
              <span
                className="text-2xl font-light tracking-wide"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold)",
                }}
              >
                Lumières
              </span>
              <div
                className="mt-0.5 text-xs uppercase tracking-[0.2em]"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Grand Hall
              </div>
            </div>

            <p
              className="mb-5 text-sm leading-relaxed"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Kuala Lumpur&apos;s most refined wedding destination. Where timeless
              elegance meets modern luxury.
            </p>

            <address
              className="not-italic text-sm"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
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
                  href="mailto:hello@lumieres.com"
                  className="transition-colors duration-200 hover:text-[var(--gold)]"
                >
                  danishfarhanzailan392@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category}>
                <h4
                  className="mb-4 text-xs uppercase tracking-[0.22em]"
                  style={{
                    color: "var(--gold)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {category}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm transition-colors duration-200 hover:text-[var(--gold)]"
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            © {year} Lumières Grand Hall. All rights reserved.
          </p>

          <Link
            href="/admin"
            className="text-xs transition-colors duration-200 hover:text-[var(--gold)]"
            style={{
              color: "var(--gold-dim)",
              fontFamily: "var(--font-body)",
            }}
          >
            Admin Portal →
          </Link>
        </div>
      </div>
    </footer>
  );
}
