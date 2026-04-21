"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useSectionSpy } from "@/hooks/use-section-spy";

const NAV_LINKS = [
  { label: "Venues", href: "#venues" },
  { label: "Themes", href: "#themes" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#footer" },
] as const;

const SECTION_IDS = ["hero", "venues", "themes", "features", "footer"] as const;

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const activeSection = useSectionSpy(SECTION_IDS);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* Scrolled backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: bgOpacity,
          background: "rgba(6, 20, 27, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-2">
          <span
            className="text-2xl font-light tracking-wide transition-opacity duration-200 group-hover:opacity-80"
            style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
          >
            Lumières
          </span>
          <span
            className="hidden text-xs uppercase tracking-[0.22em] sm:block"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Grand Hall
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex" role="menubar">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={label} role="none">
                <Link
                  href={href}
                  role="menuitem"
                  className="relative py-1 text-sm tracking-wide transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isActive ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "var(--gold)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link href="/book" className="hidden lg:block">
          <motion.div
            className="rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background:
                "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
              color: "#06141B",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Reserve Now
          </motion.div>
        </Link>
      </nav>
    </header>
  );
}
