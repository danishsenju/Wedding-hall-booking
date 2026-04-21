"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const INCLUSIONS = [
  "Round tables & Chiavari chairs",
  "White linen tablecloths",
  "Gold cutlery & fine crockery",
  "Basic floral centrepieces",
  "Stage draping & backdrop",
  "Welcome arch at entrance",
  "Complimentary bridal suite",
  "Dedicated event manager",
  "Setup & teardown crew",
  "Sound & lighting technician",
  "Complimentary parking (400 bays)",
  "Guest Wi-Fi access",
  "On-site security personnel",
  "Complimentary tasting session",
];

export default function InclusionsChecklist() {
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
            All Packages Include
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
          What&apos;s Included
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
        {INCLUSIONS.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-3 border-b py-3.5"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(201,168,76,0.12)" }}
            >
              <Check size={11} strokeWidth={2.5} style={{ color: "var(--gold)" }} />
            </span>
            <span className="text-sm leading-snug" style={{ color: "var(--text)" }}>
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
