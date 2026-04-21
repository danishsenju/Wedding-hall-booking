"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RouteProgress() {
  const pathname = usePathname();
  const keyRef = useRef(0);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    keyRef.current += 1;
    if (counterRef.current) {
      counterRef.current.dataset.key = String(keyRef.current);
    }
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] overflow-hidden"
      aria-hidden="true"
      ref={counterRef}
    >
      <motion.div
        key={pathname}
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-hover) 100%)",
          boxShadow: "0 0 8px var(--gold)",
        }}
        initial={{ scaleX: 0, transformOrigin: "0% 50%", opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.25, delay: 0.45 },
        }}
      />
    </div>
  );
}
