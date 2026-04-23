"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { NoiseBackground } from "@/components/ui/noise-background";

const RESERVE_GRADIENT = [
  "rgb(255, 100, 150)",
  "rgb(100, 150, 255)",
  "rgb(255, 200, 100)",
];

const NAV_ITEMS = [
  { name: "Venues", link: "/#venues" },
  { name: "Themes", link: "/#themes" },
  { name: "Features", link: "/#features" },
  { name: "Gallery", link: "/gallery" },
  { name: "Map", link: "/map" },
  { name: "Services", link: "/services" },
] as const;

const innerButtonClass =
  "h-full w-full cursor-pointer rounded-full bg-gradient-to-r from-black via-black to-neutral-900 px-4 py-2 text-white transition-all duration-100 active:scale-[0.98]";

const innerButtonStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  boxShadow:
    "0px 1px 0px 0px rgba(10,10,10,0.8) inset, 0px 1px 0px 0px rgba(38,38,38,0.8)",
};

export default function NavbarWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={[...NAV_ITEMS]} />
        <NoiseBackground
          containerClassName="!rounded-full p-2 w-fit"
          gradientColors={RESERVE_GRADIENT}
          speed={0.08}
        >
          <a
            href="/book"
            className={`${innerButtonClass} block whitespace-nowrap text-sm font-medium tracking-wide text-center`}
            style={innerButtonStyle}
          >
            Reserve Now
          </a>
        </NoiseBackground>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-1 text-sm tracking-wide transition-colors duration-200"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {item.name}
            </a>
          ))}
          <NoiseBackground
            containerClassName="!rounded-full p-2 w-full"
            gradientColors={RESERVE_GRADIENT}
            speed={0.08}
          >
            <Link
              href="/book"
              className={`${innerButtonClass} block text-sm font-medium tracking-wide text-center`}
              style={innerButtonStyle}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reserve Now
            </Link>
          </NoiseBackground>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
