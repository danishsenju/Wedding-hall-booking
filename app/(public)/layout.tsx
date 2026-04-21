import FloatingDock from "@/components/landing/FloatingDock";
import Navbar from "@/components/landing/Navbar";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <FloatingDock />
      {children}
    </>
  );
}
