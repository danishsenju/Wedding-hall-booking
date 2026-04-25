"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import {
  CalendarCheck,
  Camera,
  ChefHat,
  Crown,
  Sparkles,
  Users,
  type LucideProps,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────── */
type IconComponent = React.FC<LucideProps>;

export interface BentoCardData {
  Icon: IconComponent;
  title: string;
  description: string;
  label: string;
  hasPattern?: boolean;
}

export interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

/* ─── Constants ───────────────────────────────────── */
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const PURPLE_GLOW = "109, 40, 217";
const MOBILE_BREAKPOINT = 768;

/* ─── Card data ──────────────────────────────────── */
const cardData: BentoCardData[] = [
  {
    Icon: Users,
    title: "Expert Coordination",
    description: "A dedicated wedding coordinator from day one through the final toast.",
    label: "Concierge",
  },
  {
    Icon: ChefHat,
    title: "Gourmet Catering",
    description: "Bespoke menus by Michelin-trained chefs. Western, Asian, and fusion stations.",
    label: "Cuisine",
  },
  {
    Icon: Crown,
    title: "Exclusive Venue",
    description:
      "Your wedding is the only event we host on your date. Every detail, every moment — yours alone. No shared lobbies, no competing celebrations.",
    label: "Signature",
    hasPattern: true,
  },
  {
    Icon: Camera,
    title: "Photography Studio",
    description:
      "In-house studio with award-winning photographers and cinematic videographers.",
    label: "Memories",
  },
  {
    Icon: Sparkles,
    title: "Luxury Décor",
    description:
      "From minimalist to maximalist — our design team transforms vision into breathtaking reality.",
    label: "Design",
  },
  {
    Icon: CalendarCheck,
    title: "Smart Booking",
    description:
      "Real-time availability, instant confirmation, and a seamless digital experience.",
    label: "Planning",
  },
];

/* ─── Helpers ─────────────────────────────────────── */
const createParticleElement = (
  x: number,
  y: number,
  color: string
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "mb-particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.7);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const updateCardGlow = (
  card: HTMLElement,
  mx: number,
  my: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--glow-x", `${((mx - rect.left) / rect.width) * 100}%`);
  card.style.setProperty("--glow-y", `${((my - rect.top) / rect.height) * 100}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

/* ─── ParticleCard ────────────────────────────────── */
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  style,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = PURPLE_GLOW,
  enableTilt = false,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismRef = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initParticles();

    memoizedParticles.current.forEach((particle, i) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.25,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, i * 80);
      timeoutsRef.current.push(id);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt)
        gsap.to(el, {
          rotateX: 4,
          rotateY: 4,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      if (enableTilt)
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism)
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (enableTilt)
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -8,
          rotateY: ((x - cx) / cx) * 8,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });

      if (enableMagnetism)
        magnetismRef.current = gsap.to(el, {
          x: (x - cx) * 0.04,
          y: (y - cy) * 0.04,
          duration: 0.3,
          ease: "power2.out",
        });
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const d = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position:absolute;
        width:${d * 2}px;height:${d * 2}px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(${glowColor},0.3) 0%,rgba(${glowColor},0.15) 30%,transparent 70%);
        left:${x - d}px;top:${y - d}px;
        pointer-events:none;z-index:1000;
      `;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearParticles();
    };
  }, [animateParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

/* ─── GlobalSpotlight ─────────────────────────────── */
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = PURPLE_GLOW,
}) => {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spot = document.createElement("div");
    spot.style.cssText = `
      position:fixed;width:700px;height:700px;border-radius:50%;
      pointer-events:none;
      background:radial-gradient(circle,
        rgba(${glowColor},0.12) 0%,rgba(${glowColor},0.07) 15%,
        rgba(${glowColor},0.03) 30%,rgba(${glowColor},0.01) 50%,transparent 65%);
      z-index:200;opacity:0;
      transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spot);
    spotRef.current = spot;

    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const onMove = (e: MouseEvent) => {
      if (!spotRef.current || !gridRef.current) return;
      const section = gridRef.current.closest(".mb-section");
      const rect = section?.getBoundingClientRect();
      const inside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll(".mb-card");

      if (!inside) {
        gsap.to(spotRef.current, { opacity: 0, duration: 0.3 });
        cards.forEach((c) =>
          (c as HTMLElement).style.setProperty("--glow-intensity", "0")
        );
        return;
      }

      let minDist = Infinity;
      cards.forEach((card) => {
        const el = card as HTMLElement;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.max(
          0,
          Math.hypot(e.clientX - cx, e.clientY - cy) -
            Math.max(r.width, r.height) / 2
        );
        minDist = Math.min(minDist, dist);

        const intensity =
          dist <= proximity
            ? 1
            : dist <= fadeDistance
              ? (fadeDistance - dist) / (fadeDistance - proximity)
              : 0;
        updateCardGlow(el, e.clientX, e.clientY, intensity, spotlightRadius);
      });

      gsap.to(spotRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDist <= proximity
          ? 0.75
          : minDist <= fadeDistance
            ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.75
            : 0;

      gsap.to(spotRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
      });
    };

    const onLeave = () => {
      gridRef.current
        ?.querySelectorAll(".mb-card")
        .forEach((c) =>
          (c as HTMLElement).style.setProperty("--glow-intensity", "0")
        );
      if (spotRef.current) gsap.to(spotRef.current, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotRef.current?.parentNode?.removeChild(spotRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

/* ─── Mobile detection ────────────────────────────── */
function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ─── Card style helpers ──────────────────────────── */
const getCardBackground = (idx: number): string => {
  if (idx === 2)
    return "linear-gradient(145deg, #2E1F62 0%, #1E1445 40%, #100C1E 100%)";
  if (idx === 3)
    return "linear-gradient(155deg, #1B1531 0%, #130F20 55%, #0D0A18 100%)";
  return "linear-gradient(145deg, #1C1530 0%, #110D1E 100%)";
};

const getCardBorder = (idx: number): string => {
  if (idx === 2) return "rgba(109, 40, 217, 0.38)";
  if (idx === 3) return "rgba(109, 40, 217, 0.22)";
  return "rgba(109, 40, 217, 0.14)";
};

/* ─── MagicBento ──────────────────────────────────── */
const MagicBento: React.FC<MagicBentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = PURPLE_GLOW,
  clickEffect = true,
  enableMagnetism = false,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const noAnim = disableAnimations || isMobile;

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("mb-visible"); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardBase = `mb-card flex flex-col justify-between relative w-full p-6 rounded-[22px] border border-solid overflow-hidden cursor-default${enableBorderGlow ? " mb-glow" : ""}`;

  return (
    <>
      <style suppressHydrationWarning>{`
        .mb-section {
          --glow-color: ${glowColor};
        }

        /* Grid layout */
        .mb-grid {
          grid-template-columns: repeat(2, 1fr);
          width: 100%;
          box-sizing: border-box;
        }

        /* Mobile card ordering */
        .mb-grid .mb-item:nth-child(1) { order: 1; }
        .mb-grid .mb-item:nth-child(2) { order: 2; }
        .mb-grid .mb-item:nth-child(3) { order: 4; grid-column: span 2; }
        .mb-grid .mb-item:nth-child(4) { order: 3; grid-column: span 2; }
        .mb-grid .mb-item:nth-child(5) { order: 5; }
        .mb-grid .mb-item:nth-child(6) { order: 6; }

        @media (max-width: 1023px) {
          .mb-card { aspect-ratio: unset; min-height: 160px; }
          .mb-grid .mb-item:nth-child(3) .mb-card,
          .mb-grid .mb-item:nth-child(4) .mb-card { min-height: 220px; }
        }

        @media (min-width: 1024px) {
          .mb-grid { grid-template-columns: repeat(4, 1fr); }
          .mb-grid .mb-item:nth-child(1) { order: initial; }
          .mb-grid .mb-item:nth-child(2) { order: initial; }
          .mb-grid .mb-item:nth-child(3) { order: initial; grid-column: span 2; grid-row: span 2; }
          .mb-grid .mb-item:nth-child(4) { order: initial; grid-column: 1 / span 2; grid-row: 2 / span 2; }
          .mb-grid .mb-item:nth-child(5) { order: initial; }
          .mb-grid .mb-item:nth-child(6) { order: initial; grid-column: 4; grid-row: 3; }

          /* Small cards get consistent aspect ratio */
          .mb-grid .mb-item:nth-child(1) .mb-card,
          .mb-grid .mb-item:nth-child(2) .mb-card,
          .mb-grid .mb-item:nth-child(5) .mb-card,
          .mb-grid .mb-item:nth-child(6) .mb-card {
            aspect-ratio: 4/3;
          }

          /* Spanning cards fill their grid area */
          .mb-grid .mb-item:nth-child(3) .mb-card,
          .mb-grid .mb-item:nth-child(4) .mb-card {
            height: 100%;
            aspect-ratio: unset;
          }
        }

        /* Card transitions */
        .mb-card {
          transition:
            transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.38s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.38s ease;
        }

        .mb-card:hover {
          transform: translateY(-4px);
          border-color: rgba(${glowColor}, 0.42) !important;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.55),
            0 0 40px rgba(${glowColor}, 0.12);
        }

        .mb-card-hero:hover {
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.65),
            0 0 70px rgba(${glowColor}, 0.28) !important;
        }

        /* Hero ambient pulse */
        @keyframes hero-ambience {
          0%, 100% { opacity: 0.35; transform: translateX(-50%) scale(1); }
          50%       { opacity: 0.60; transform: translateX(-50%) scale(1.08); }
        }
        .mb-hero-ambient {
          animation: hero-ambience 6s ease-in-out infinite;
        }

        /* Border glow overlay */
        .mb-glow {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 240px;
        }
        .mb-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.9)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.45)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .mb-glow:hover::after { opacity: 1; }

        /* Staggered entrance */
        @keyframes mb-enter {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mb-item {
          opacity: 0;
          animation: mb-enter 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-play-state: paused;
        }
        .mb-section.mb-visible .mb-item:nth-child(1) { animation-delay: 0ms;   animation-play-state: running; }
        .mb-section.mb-visible .mb-item:nth-child(2) { animation-delay: 80ms;  animation-play-state: running; }
        .mb-section.mb-visible .mb-item:nth-child(3) { animation-delay: 160ms; animation-play-state: running; }
        .mb-section.mb-visible .mb-item:nth-child(4) { animation-delay: 240ms; animation-play-state: running; }
        .mb-section.mb-visible .mb-item:nth-child(5) { animation-delay: 320ms; animation-play-state: running; }
        .mb-section.mb-visible .mb-item:nth-child(6) { animation-delay: 400ms; animation-play-state: running; }

        /* Particle halo */
        .mb-particle::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: rgba(${glowColor}, 0.2);
          border-radius: 50%;
          z-index: -1;
        }

        /* Divider between header and content */
        .mb-card-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(${glowColor}, 0.25), transparent);
          margin: 0 0 auto 0;
          flex-shrink: 0;
        }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={noAnim}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div
        ref={gridRef}
        className="mb-section grid mb-grid gap-3 w-full max-w-[62rem] select-none relative mx-auto"
      >
        {cardData.map((card, idx) => {
          const isHero = idx === 2;
          const isLarge = idx === 3;

          const cardStyle: React.CSSProperties = {
            background: getCardBackground(idx),
            borderColor: getCardBorder(idx),
            color: "#EDE9FE",
            "--glow-x": "50%",
            "--glow-y": "50%",
            "--glow-intensity": "0",
            "--glow-radius": isHero ? "380px" : "240px",
          } as React.CSSProperties;

          const iconSize = isHero ? 22 : 18;
          const titleSize = isHero
            ? "clamp(1.55rem, 2.8vw, 2.15rem)"
            : isLarge
              ? "clamp(1.1rem, 1.5vw, 1.25rem)"
              : "1rem";

          const inner = (
            <>
              {/* Hero: diamond trellis pattern */}
              {card.hasPattern && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-[22px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%236D28D9' stroke-width='0.7' stroke-opacity='0.22'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "40px 40px",
                    zIndex: 0,
                  }}
                  aria-hidden
                />
              )}

              {/* Hero: ambient top radial glow */}
              {isHero && (
                <div
                  className="mb-hero-ambient pointer-events-none absolute -top-8 left-1/2 w-4/5 h-56 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at center top, rgba(109,40,217,0.28) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)",
                    zIndex: 0,
                  }}
                  aria-hidden
                />
              )}

              {/* Large photo card: bottom fade vignette */}
              {isLarge && (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-[22px]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10, 7, 20, 0.6) 0%, transparent 100%)",
                    zIndex: 0,
                  }}
                  aria-hidden
                />
              )}

              {/* Card header: label + icon */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                <span
                  style={{
                    color: "rgba(196, 181, 253, 0.75)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.63rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.label}
                </span>
                <div
                  className="inline-flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: isHero ? "42px" : "34px",
                    height: isHero ? "42px" : "34px",
                    background: isHero
                      ? "linear-gradient(135deg, rgba(109,40,217,0.28), rgba(124,58,237,0.14))"
                      : "rgba(109, 40, 217, 0.1)",
                    border: `1px solid ${isHero ? "rgba(109,40,217,0.45)" : "rgba(109,40,217,0.22)"}`,
                    color: isHero ? "rgba(196, 181, 253, 0.9)" : "rgba(167, 139, 250, 0.8)",
                    boxShadow: isHero
                      ? "0 0 18px rgba(109,40,217,0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "none",
                  }}
                >
                  <card.Icon size={iconSize} strokeWidth={1.3} />
                </div>
              </div>

              {/* Thin divider */}
              <div className="mb-card-divider relative z-10" />

              {/* Card content: title + description */}
              <div className="flex flex-col gap-2 relative z-10">
                <h3
                  className={`m-0 leading-tight ${!isHero && textAutoHide ? "line-clamp-1" : ""}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#EDE9FE",
                    fontSize: titleSize,
                    fontWeight: 300,
                    fontStyle: isHero ? "italic" : "normal",
                    letterSpacing: isHero ? "-0.015em" : "0",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className={`m-0 leading-relaxed ${!isHero && !isLarge && textAutoHide ? "line-clamp-2" : ""}`}
                  style={{
                    color: "rgba(196, 181, 253, 0.55)",
                    fontFamily: "var(--font-body)",
                    fontSize: isHero ? "0.84rem" : "0.74rem",
                    lineHeight: 1.65,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </>
          );

          const cardClassName = `${cardBase}${isHero ? " mb-card-hero" : ""}`;

          return (
            <div key={idx} className="mb-item">
              {enableStars ? (
                <ParticleCard
                  className={cardClassName}
                  style={cardStyle}
                  disableAnimations={noAnim}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {inner}
                </ParticleCard>
              ) : (
                <div className={cardClassName} style={cardStyle}>
                  {inner}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MagicBento;
