"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

export default function SmartSplashCursor() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.innerWidth >= 1024;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (!prefersReduced && isDesktop && hasFinePointer) {
      setShouldMount(true);
    }
  }, []);

  if (!shouldMount) return null;
  return <SplashCursor />;
}
