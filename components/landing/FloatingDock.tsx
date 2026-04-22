"use client";

import { motion } from "framer-motion";
import { Building2, CalendarHeart, Home, Settings2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DockItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const DOCK_ITEMS: DockItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Building2, label: "Venues", href: "/#venues" },
  { icon: CalendarHeart, label: "Book", href: "/book" },
  { icon: Settings2, label: "Admin", href: "/admin" },
];

export default function FloatingDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 lg:hidden"
      style={{ transform: "translateX(-50%)" }}
      aria-label="Mobile navigation"
    >
      <div
        className="flex items-center gap-1 rounded-2xl px-3 py-2"
        style={{
          background: "rgba(17, 33, 45, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(109,40,217,0.08)",
        }}
      >
        {DOCK_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href.replace("/#", "/"));

          return (
            <Link key={label} href={href} aria-label={label}>
              <motion.div
                className="relative flex h-11 w-11 items-center justify-center rounded-xl"
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                style={{
                  background: isActive
                    ? "rgba(109,40,217,0.12)"
                    : "transparent",
                  color: isActive ? "var(--gold)" : "var(--text-muted)",
                  boxShadow: isActive
                    ? "0 0 16px rgba(109,40,217,0.15)"
                    : "none",
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
                {isActive && (
                  <motion.div
                    layoutId="dock-pip"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
