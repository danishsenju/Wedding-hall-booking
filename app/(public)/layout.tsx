import FloatingDock from "@/components/landing/FloatingDock";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const SplashCursor = dynamic(() => import("@/components/SplashCursor"), { ssr: false });

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SplashCursor />
      <Navbar />
      <FloatingDock />
      {children}
      <Footer />
    </>
  );
}
