"use client";

import { motion } from "framer-motion";

const AMENITIES = [
  "Crystal Chandeliers",
  "Professional Sound System",
  "HD Projection & LED Screens",
  "Bridal Suite",
  "Full Air Conditioning",
  "VIP Lounge",
  "Built-in Stage",
  "Commercial Kitchen",
  "Guest Wi-Fi",
  "Valet Parking",
  "Prayer Room",
  "Baby Changing Room",
  "Coat Check Service",
  "Complimentary Water Station",
];

export default function AmenitiesTags() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <span
            className="h-px w-8 opacity-50"
            style={{ background: "var(--gold)" }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)" }}
          >
            Amenities
          </span>
        </div>
        <h2
          className="font-light"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            color: "var(--text)",
          }}
        >
          World-Class Facilities
        </h2>
      </motion.div>

      <div className="flex flex-wrap gap-2.5">
        {AMENITIES.map((amenity, i) => (
          <motion.div
            key={amenity}
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.4,
              delay: i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
            className="flex cursor-default items-center gap-2 rounded-full px-4 py-2 text-sm"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <span
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ background: "var(--gold)" }}
            />
            {amenity}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
