"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Maximize2, ParkingCircle, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface VenueSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface VenueData {
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  specs: VenueSpec[];
  href: string;
  tag: string;
}

const VENUES: VenueData[] = [
  {
    name: "Grand Ballroom",
    subtitle: "The Jewel of Lumières",
    description:
      "Our crown jewel — an expansive 8,000 sq ft ballroom bathed in golden light, featuring 6.5m ceilings, crystal chandeliers, and a dedicated bridal suite. Seats up to 1,200 guests in absolute grandeur.",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    imageAlt: "Grand Ballroom at Lumières — crystal chandeliers and golden light",
    tag: "Most Popular",
    href: "/venues/grand-ballroom",
    specs: [
      { icon: Users, label: "Capacity", value: "400 – 1,200" },
      { icon: Maximize2, label: "Floor Area", value: "8,000 sq ft" },
      { icon: ParkingCircle, label: "Parking", value: "350 bays" },
    ],
  },
  {
    name: "Garden Terrace",
    subtitle: "Enchanting Outdoor Ceremony",
    description:
      "A sculpted tropical garden with a raised ceremony platform, reflecting pool, and panoramic city views at dusk. Perfect for intimate sunset ceremonies and garden parties up to 400 guests.",
    imageUrl:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    imageAlt: "Garden Terrace at Lumières — tropical garden ceremony space",
    tag: "Most Romantic",
    href: "/venues/garden-terrace",
    specs: [
      { icon: Users, label: "Capacity", value: "100 – 400" },
      { icon: Maximize2, label: "Floor Area", value: "3,500 sq ft" },
      { icon: ParkingCircle, label: "Parking", value: "150 bays" },
    ],
  },
];

function VenueCard({ venue, index }: { venue: VenueData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-sm"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative h-72 overflow-hidden lg:h-80">
        <Image
          src={venue.imageUrl}
          alt={venue.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Shimmer sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={
            hovered
              ? { opacity: 1, backgroundPosition: ["200% 0", "-200% 0"] }
              : { opacity: 0 }
          }
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.1) 50%, transparent 60%)",
            backgroundSize: "300% 100%",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(17,33,45,0.95) 0%, transparent 55%)",
          }}
        />

        {/* Badge */}
        <div
          className="absolute left-4 top-4 rounded-sm px-3 py-1 text-xs uppercase tracking-[0.16em]"
          style={{
            background: "rgba(201,168,76,0.1)",
            border: "1px solid var(--border-hover)",
            color: "var(--gold)",
            fontFamily: "var(--font-body)",
            backdropFilter: "blur(8px)",
          }}
        >
          {venue.tag}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p
          className="mb-1 text-xs uppercase tracking-[0.22em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
        >
          {venue.subtitle}
        </p>
        <h3
          className="mb-3 font-light"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
          }}
        >
          {venue.name}
        </h3>
        <p
          className="mb-6 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {venue.description}
        </p>

        {/* Specs */}
        <div
          className="mb-6 grid grid-cols-3 gap-4 border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          {venue.specs.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1 border-l-2 pl-3"
              style={{ borderColor: "var(--gold)" }}
            >
              <div className="flex items-center gap-1.5">
                <Icon
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: "var(--gold-dim)" }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {label}
                </span>
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={venue.href} aria-label={`View details for ${venue.name}`}>
          <motion.div
            className="flex items-center gap-2 text-sm font-medium"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            View Details
            <ArrowRight size={15} strokeWidth={1.5} />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
}

export default function VenueShowcase() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="venues"
      className="relative py-24 lg:py-32"
      style={{ background: "var(--base)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Our Venues
            </span>
            <span
              className="h-px w-10 opacity-40"
              style={{ background: "var(--gold)" }}
            />
          </div>
          <h2
            className="mb-4 font-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            Spaces That Take Your Breath Away
          </h2>
          <p
            className="mx-auto max-w-xl text-base leading-relaxed"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Each venue at Lumières is designed with a singular purpose — to
            make your wedding day feel like a scene from a dream.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {VENUES.map((venue, i) => (
            <VenueCard key={venue.name} venue={venue} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
