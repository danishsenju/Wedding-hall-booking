"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Building2,
  FileEdit,
  MapPin,
  Images,
  LogOut,
  Sparkles,
  Package,
  Briefcase,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { adminLogout } from "@/app/actions/auth";

const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutGrid size={18} strokeWidth={1.5} />,
  },
  {
    label: "Manage Halls",
    href: "/admin/halls",
    icon: <Building2 size={18} strokeWidth={1.5} />,
  },
  {
    label: "Content Editor",
    href: "/admin/content",
    icon: <FileEdit size={18} strokeWidth={1.5} />,
  },
  {
    label: "Venue Locations",
    href: "/admin/venues",
    icon: <MapPin size={18} strokeWidth={1.5} />,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: <Images size={18} strokeWidth={1.5} />,
  },
  {
    label: "Vendors",
    href: "/admin/vendors",
    icon: <Briefcase size={18} strokeWidth={1.5} />,
  },
  {
    label: "Packages",
    href: "/admin/packages",
    icon: <Package size={18} strokeWidth={1.5} />,
  },
];

function LumiLogo() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
        style={{ background: "var(--gold)", color: "#EDE9FE" }}
      >
        <Sparkles size={14} strokeWidth={2} />
      </div>
      <motion.span
        className="text-sm font-medium whitespace-pre"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        Lumières Admin
      </motion.span>
    </div>
  );
}

function LumiLogoIcon() {
  return (
    <div className="flex items-center justify-center px-1 py-3 mb-2">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
        style={{ background: "var(--gold)", color: "#EDE9FE" }}
      >
        <Sparkles size={14} strokeWidth={2} />
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Skip sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6">
          {/* Top: logo + links */}
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {open ? <LumiLogo /> : <LumiLogoIcon />}

            {/* Divider */}
            <div
              className="mb-4 h-px mx-2"
              style={{ background: "var(--border)" }}
            />

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <SidebarLink
                  key={link.href}
                  link={link}
                  active={pathname === link.href || pathname.startsWith(link.href + "/")}
                />
              ))}
            </nav>
          </div>

          {/* Bottom: logout */}
          <div className="pb-2">
            <div
              className="mb-3 h-px mx-2"
              style={{ background: "var(--border)" }}
            />
            <SidebarLink
              link={{
                label: "Sign Out",
                href: "#",
                icon: <LogOut size={18} strokeWidth={1.5} />,
              }}
              onClick={handleLogout}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto" style={{ background: "var(--base)" }}>
        {children}
      </main>
    </div>
  );
}
