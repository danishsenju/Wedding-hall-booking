"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

/* ─── Tier Data ──────────────────────────────────── */
interface Tier {
  key: string;
  name: string;
  price: number;
  popular?: boolean;
  color: string;
  perks: string[];
}

const TIERS: Tier[] = [
  {
    key: "silver",
    name: "Silver",
    price: 28000,
    color: "#9BA8AB",
    perks: [
      "Up to 500 guests",
      "6-hour venue access",
      "Basic floral package",
      "Standard sound system",
      "1 event coordinator",
    ],
  },
  {
    key: "gold",
    name: "Gold",
    price: 42000,
    popular: true,
    color: "#6D28D9",
    perks: [
      "Up to 750 guests",
      "8-hour venue access",
      "Premium floral package",
      "Pro sound & lighting",
      "2 event coordinators",
      "Complimentary champagne toast",
    ],
  },
  {
    key: "platinum",
    name: "Platinum",
    price: 65000,
    color: "#CCD0CF",
    perks: [
      "Up to 1,000 guests",
      "Full-day venue access",
      "Luxury floral & decor",
      "Cinematic sound & LED walls",
      "3 dedicated coordinators",
      "Live band setup included",
      "Honeymoon suite (1 night)",
    ],
  },
];

const DEPOSIT_RATE = 0.3;

function formatRM(n: number) {
  return n.toLocaleString("en-MY", { minimumFractionDigits: 0 });
}

/* ─── Card Spotlight ─────────────────────────────── */
function SpotlightCard({
  children,
  active,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
      className="relative overflow-hidden rounded-sm"
      style={{
        border: `1px solid ${active ? color : "var(--border)"}`,
        background: active ? "rgba(109,40,217,0.06)" : "var(--surface-1)",
        transition: "border-color 0.25s, background 0.25s",
      }}
    >
      {inside && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(320px circle at ${mouse.x}px ${mouse.y}px, ${color}14 0%, transparent 65%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── Pricing Card ───────────────────────────────── */
export default function PricingCard() {
  const [selected, setSelected] = useState<string>("gold");
  const activeTier = TIERS.find((t) => t.key === selected)!;
  const deposit = Math.round(activeTier.price * DEPOSIT_RATE);

  // Scroll progress bar for the sticky card
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div className="lg:sticky lg:top-24">
      {/* Scroll progress bar */}
      <div
        className="mb-4 overflow-hidden rounded-full"
        style={{ height: 2, background: "var(--surface-2)" }}
      >
        <motion.div
          style={{
            scaleX: progress,
            transformOrigin: "left",
            height: "100%",
            background: "linear-gradient(90deg, var(--gold), var(--gold-hover))",
          }}
        />
      </div>

      <div
        className="overflow-hidden rounded-sm"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface-1)",
        }}
      >
        {/* Header */}
        <div
          className="border-b px-6 py-5"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="mb-0.5 text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)" }}
          >
            Reserve Your Date
          </p>
          <h3
            className="font-light"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.55rem",
              color: "var(--text)",
            }}
          >
            Choose a Package
          </h3>
        </div>

        {/* Tier selector */}
        <div className="space-y-2.5 p-4">
          {TIERS.map((tier) => (
            <SpotlightCard
              key={tier.key}
              active={selected === tier.key}
              color={tier.color}
            >
              <button
                onClick={() => setSelected(tier.key)}
                className="relative w-full px-4 py-3.5 text-left"
              >
                {tier.popular && (
                  <span
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      background: "rgba(109,40,217,0.18)",
                      color: "var(--gold)",
                    }}
                  >
                    <Sparkles size={9} />
                    Most Popular
                  </span>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className="block text-sm font-medium"
                      style={{
                        color:
                          selected === tier.key ? tier.color : "var(--text)",
                      }}
                    >
                      {tier.name}
                    </span>
                    <span
                      className="mt-0.5 block"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.4rem",
                        color: "var(--text)",
                        lineHeight: 1,
                      }}
                    >
                      RM {formatRM(tier.price)}
                    </span>
                  </div>
                  {/* Radio dot */}
                  <span
                    className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border"
                    style={{
                      borderColor:
                        selected === tier.key ? tier.color : "var(--border)",
                      background:
                        selected === tier.key
                          ? `${tier.color}22`
                          : "transparent",
                    }}
                  >
                    {selected === tier.key && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: tier.color }}
                      />
                    )}
                  </span>
                </div>

                {/* Perks (visible when selected) */}
                <AnimatePresence>
                  {selected === tier.key && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-3 overflow-hidden space-y-1.5"
                    >
                      {tier.perks.map((perk, i) => (
                        <motion.li
                          key={perk}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Check
                            size={10}
                            strokeWidth={2.5}
                            style={{ color: tier.color, flexShrink: 0 }}
                          />
                          {perk}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </button>
            </SpotlightCard>
          ))}
        </div>

        {/* Live Deposit Calculator */}
        <div
          className="border-t px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mb-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-muted)" }}>Package Total</span>
                  <span style={{ color: "var(--text)" }}>
                    RM {formatRM(activeTier.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-muted)" }}>
                    30% Deposit
                  </span>
                  <span style={{ color: "var(--gold)" }}>
                    RM {formatRM(deposit)}
                  </span>
                </div>
                <div
                  className="h-px"
                  style={{ background: "var(--border)" }}
                />
                <div className="flex justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Due Today
                  </span>
                  <span
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      color: "var(--gold)",
                    }}
                  >
                    RM {formatRM(deposit)}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Reserve Button */}
          <Link href={`/book?package=${selected}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm py-3.5 text-sm font-medium tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 100%)",
                color: "var(--base)",
                boxShadow: "0 4px 20px rgba(109,40,217,0.25)",
              }}
            >
              Reserve This Date
            </motion.div>
          </Link>

          {/* Trust note */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <Lock size={10} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Free cancellation within 72 hours of booking
            </span>
          </div>
        </div>

        {/* Footer note */}
        <div
          className="border-t px-6 py-3 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Questions?{" "}
            <a
              href="mailto:hello@lamantroka.my"
              className="underline underline-offset-2 transition-colors hover:text-[var(--gold)]"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
