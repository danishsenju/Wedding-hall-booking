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
} from "lucide-react";

/* ─── Types ───────────────────────────────────────── */
export interface BentoCardData {
  icon: React.ReactNode;
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
const GOLD_GLOW = "201, 168, 76";
const MOBILE_BREAKPOINT = 768;

/* ─── Card data (Laman Troka features) ──────────────── */
// Order matches 4-col react-bits grid: [0][1][2*][2*] / [3*][3*][2*][2*] / [3*][3*][4][5]
const cardData: BentoCardData[] = [
  {
    icon: <Users size={20} strokeWidth={1.4} />,
    title: "Expert Coordination",
    description:
      "A dedicated wedding coordinator from day one through the final toast.",
    label: "Concierge",
  },
  {
    icon: <ChefHat size={20} strokeWidth={1.4} />,
    title: "Gourmet Catering",
    description:
      "Bespoke menus by Michelin-trained chefs. Western, Asian, and fusion stations.",
    label: "Cuisine",
  },
  {
    icon: <Crown size={20} strokeWidth={1.4} />,
    title: "Exclusive Venue",
    description:
      "Your wedding is the only event we host on your date. Every detail, every moment — yours alone. No shared lobbies, no competing celebrations.",
    label: "Signature",
    hasPattern: true,
  },
  {
    icon: <Camera size={20} strokeWidth={1.4} />,
    title: "Photography Studio",
    description:
      "In-house studio with award-winning photographers and cinematic videographers.",
    label: "Memories",
  },
  {
    icon: <Sparkles size={20} strokeWidth={1.4} />,
    title: "Luxury Décor",
    description:
      "From minimalist to maximalist — our design team transforms vision into breathtaking reality.",
    label: "Design",
  },
  {
    icon: <CalendarCheck size={20} strokeWidth={1.4} />,
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
  card.style.setProperty(
    "--glow-x",
    `${((mx - rect.left) / rect.width) * 100}%`
  );
  card.style.setProperty(
    "--glow-y",
    `${((my - rect.top) / rect.height) * 100}%`
  );
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
  glowColor = GOLD_GLOW,
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
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
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
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
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
  }, [
    animateParticles,
    clearParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

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
  glowColor = GOLD_GLOW,
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

/* ─── Mobile detection hook ───────────────────────── */
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
  glowColor = GOLD_GLOW,
  clickEffect = true,
  enableMagnetism = false,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const noAnim = disableAnimations || isMobile;

  const cardBase = `mb-card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-colors duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] cursor-default${enableBorderGlow ? " mb-glow" : ""}`;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#120F17",
    borderColor: "#2F293A",
    color: "#ffffff",
    "--glow-x": "50%",
    "--glow-y": "50%",
    "--glow-intensity": "0",
    "--glow-radius": "200px",
  } as React.CSSProperties;

  return (
    <>
      <style suppressHydrationWarning>{`
        .mb-section {
          --glow-color: ${glowColor};
          --border-color: #2F293A;
          --background-dark: #120F17;
          --white: hsl(0, 0%, 100%);
          --purple-primary: rgba(${glowColor}, 1);
          --purple-glow: rgba(${glowColor}, 0.2);
          --purple-border: rgba(${glowColor}, 0.8);
          font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
        }

        /* Responsive grid layout */
        .mb-grid {
          grid-template-columns: repeat(2, 1fr);
          width: 100%;
          box-sizing: border-box;
        }

        /* Mobile/tablet: reorder cards — Concierge, Cuisine | Memories (full) | Signature (full) | Design, Planning */
        .mb-grid .mb-item:nth-child(1) { order: 1; }
        .mb-grid .mb-item:nth-child(2) { order: 2; }
        .mb-grid .mb-item:nth-child(3) { order: 4; grid-column: span 2; }
        .mb-grid .mb-item:nth-child(4) { order: 3; grid-column: span 2; }
        .mb-grid .mb-item:nth-child(5) { order: 5; }
        .mb-grid .mb-item:nth-child(6) { order: 6; }

        /* Remove aspect-ratio on mobile to prevent width overflow */
        @media (max-width: 1023px) {
          .mb-card {
            aspect-ratio: unset;
            min-height: 150px;
          }
          .mb-grid .mb-item:nth-child(3) .mb-card,
          .mb-grid .mb-item:nth-child(4) .mb-card {
            min-height: 200px;
          }
        }

        @media (min-width: 1024px) {
          .mb-grid { grid-template-columns: repeat(4, 1fr); }
          .mb-grid .mb-item:nth-child(1) { order: initial; }
          .mb-grid .mb-item:nth-child(2) { order: initial; }
          .mb-grid .mb-item:nth-child(3) { order: initial; grid-column: span 2; grid-row: span 2; }
          .mb-grid .mb-item:nth-child(4) { order: initial; grid-column: 1 / span 2; grid-row: 2 / span 2; }
          .mb-grid .mb-item:nth-child(5) { order: initial; }
          .mb-grid .mb-item:nth-child(6) { order: initial; grid-column: 4; grid-row: 3; }
        }

        /* Border glow via pseudo-element */
        .mb-glow {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
        }

        .mb-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
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

        .mb-glow:hover {
          box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
        }

        .mb-particle::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: rgba(${glowColor}, 0.2);
          border-radius: 50%;
          z-index: -1;
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
        className="mb-section grid mb-grid gap-2 p-3 w-full max-w-[54rem] select-none relative mx-auto"
      >
        {cardData.map((card, idx) => {
          const inner = (
            <>
              {/* Diamond pattern on hero card */}
              {card.hasPattern && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-[20px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%236D28D9' stroke-width='0.5' stroke-opacity='0.18'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "40px 40px",
                    zIndex: 0,
                  }}
                  aria-hidden
                />
              )}

              {/* Header: label (left) + icon (right) */}
              <div className="card__header flex justify-between gap-3 relative" style={{ color: "#ffffff" }}>
                <span
                  className="card__label text-base"
                  style={{ color: "var(--gold)", fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase" }}
                >
                  {card.label}
                </span>
                <div
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    background: "rgba(109,40,217,0.12)",
                    border: "1px solid rgba(109,40,217,0.25)",
                    color: "var(--gold)",
                  }}
                >
                  {card.icon}
                </div>
              </div>

              {/* Content: title + description at bottom */}
              <div className="card__content flex flex-col relative" style={{ color: "#ffffff" }}>
                <h3
                  className={`card__title font-normal m-0 mb-1 ${textAutoHide ? "line-clamp-1" : ""}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#ffffff",
                    fontSize: "1rem",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className={`card__description text-xs leading-5 ${textAutoHide ? "line-clamp-2" : ""}`}
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-body)",
                    opacity: 0.9,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </>
          );

          return (
            <div key={idx} className="mb-item">
              {enableStars ? (
                <ParticleCard
                  className={cardBase}
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
                <div className={cardBase} style={cardStyle}>
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
