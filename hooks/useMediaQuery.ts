"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the given CSS media query matches.
 * SSR-safe: returns `defaultValue` on the server and during hydration.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/* ─── Convenience hooks ──────────────────────────── */

/** < 480px */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 479px)");
}

/** 480px – 767px */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 480px) and (max-width: 767px)");
}

/** ≥ 768px */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** ≥ 1024px */
export function useIsLargeDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Prefers reduced motion */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
