"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "hidden h-full shrink-0 flex-col px-3 py-4 md:flex",
        className
      )}
      animate={{ width: animate ? (open ? "220px" : "58px") : "220px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex h-12 w-full flex-row items-center justify-between px-4 md:hidden"
      )}
      style={{
        background: "var(--surface-1)",
        borderBottom: "1px solid var(--border)",
      }}
      {...props}
    >
      <div className="flex justify-end w-full">
        <Menu
          size={20}
          className="cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[100] flex flex-col justify-between p-8",
              className
            )}
            style={{ background: "var(--surface-1)" }}
          >
            <div
              className="absolute right-6 top-5 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={20} style={{ color: "var(--text-muted)" }} />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  active,
  onClick,
}: {
  link: Links;
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      onClick={onClick}
      className={cn(
        "group/sidebar flex items-center justify-start gap-2.5 rounded-sm px-2 py-2.5 transition-all duration-150",
        active ? "bg-[rgba(109,40,217,0.12)]" : "hover:bg-[rgba(109,40,217,0.07)]",
        className
      )}
    >
      <span
        className="shrink-0"
        style={{ color: active ? "var(--gold)" : "var(--text-muted)" }}
      >
        {link.icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-pre text-sm !m-0 !p-0 transition-all duration-150 group-hover/sidebar:translate-x-0.5"
        style={{
          color: active ? "var(--text)" : "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        {link.label}
      </motion.span>
    </a>
  );
};
