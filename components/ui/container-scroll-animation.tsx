"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

export const ScrollHeader = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const ScrollCard = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const specularRef = useRef<HTMLDivElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (specularRef.current) {
      specularRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 65%)`;
    }
    if (displacementRef.current) {
      const scale = Math.min((x / rect.width) * 100, (y / rect.height) * 100);
      displacementRef.current.setAttribute("scale", String(scale));
    }
  };

  const handleMouseLeave = () => {
    if (specularRef.current) specularRef.current.style.background = "none";
    if (displacementRef.current) displacementRef.current.setAttribute("scale", "77");
  };

  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full rounded-[30px] shadow-2xl relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden SVG distortion filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="scroll-card-glass">
            <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves={2} result="noise" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale={77} />
          </filter>
        </defs>
      </svg>

      {/* Layer 1 — glass blur + SVG distortion */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          backdropFilter: "blur(12px)",
          filter: "url(#scroll-card-glass) saturate(130%) brightness(1.08)",
          zIndex: 1,
        }}
      />

      {/* Layer 2 — animated floating shimmer */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(196,181,253,0.06) 0%, transparent 70%), radial-gradient(circle at 80% 70%, rgba(109,40,217,0.06) 0%, transparent 70%)",
          backgroundSize: "300% 300%",
          mixBlendMode: "overlay",
          zIndex: 2,
        }}
      />

      {/* Layer 3 — tinted glass overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: "rgba(20, 18, 38, 0.45)",
          border: "1px solid rgba(196,181,253,0.12)",
          zIndex: 2,
        }}
      />

      {/* Layer 4 — specular highlight (mouse-driven) */}
      <div
        ref={specularRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.12)",
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div className="relative h-full w-full overflow-auto rounded-[26px] p-2 md:p-6" style={{ zIndex: 4 }}>
        {children}
      </div>
    </motion.div>
  );
};
