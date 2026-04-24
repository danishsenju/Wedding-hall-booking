"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 80);
  });

  return (
    <motion.div
      className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "none",
        boxShadow: visible ? "0 1px 0 rgba(109,40,217,0.15)" : "none",
        width: visible ? "90%" : "100%",
        background: visible ? "rgba(10,11,16,0.85)" : "transparent",
        y: visible ? 8 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: "800px" }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-6 py-2 lg:flex",
        visible ? "border border-[rgba(109,40,217,0.2)]" : "",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 transition-colors duration-200"
          style={{
            color: hovered === idx ? "var(--text)" : "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full"
              style={{ background: "var(--surface-2)" }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "none",
        WebkitBackdropFilter: visible ? "blur(16px)" : "none",
        width: visible ? "92%" : "100%",
        paddingRight: visible ? "16px" : "0px",
        paddingLeft: visible ? "16px" : "0px",
        borderRadius: visible ? "12px" : "0px",
        y: visible ? 8 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-3 lg:hidden",
        visible ? "border border-[rgba(109,40,217,0.2)]" : "",
        className,
      )}
      style={{
        background: visible ? "rgba(10,11,16,0.85)" : "transparent",
      }}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-xl px-6 py-8",
            "border border-[rgba(109,40,217,0.2)]",
            className,
          )}
          style={{ background: "var(--surface-1)" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <X
      className="cursor-pointer"
      style={{ color: "var(--text)" }}
      onClick={onClick}
    />
  ) : (
    <Menu
      className="cursor-pointer"
      style={{ color: "var(--text)" }}
      onClick={onClick}
    />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center px-2 py-1"
    >
      <Image
        src="/logo.png"
        alt="Laman Troka"
        width={120}
        height={28}
        className="object-contain"
        priority
      />
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide relative cursor-pointer transition duration-200 inline-block text-center";

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
      color: "#EDE9FE",
      fontFamily: "var(--font-body)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-muted)",
      fontFamily: "var(--font-body)",
    },
    dark: {
      background: "var(--surface-2)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      fontFamily: "var(--font-body)",
    },
    gradient: {
      background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
      color: "#EDE9FE",
      fontFamily: "var(--font-body)",
    },
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, className)}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </Tag>
  );
};
