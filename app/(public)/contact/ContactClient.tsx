"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { submitContactMessage } from "@/app/actions/contact";

const Aurora = dynamic(() => import("@/components/ui/Aurora"), { ssr: false });

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Location",
    lines: ["Level 5, The Grand Tower", "Jalan Bukit Bintang", "55100 Kuala Lumpur"],
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+6019 277 4203"],
    href: "tel:+60192774203",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["danishfarhanzailan392@gmail.com"],
    href: "mailto:danishfarhanzailan392@gmail.com",
  },
  {
    icon: Clock,
    label: "Hours",
    lines: ["Mon – Sat: 9:00 AM – 8:00 PM", "Sunday: By Appointment"],
    href: undefined,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  guests: "",
  message: "",
};

function FieldWrapper({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <div
      className="relative transition-all duration-300"
      style={{
        border: `1px solid ${focused ? "rgba(109,40,217,0.42)" : "rgba(109,40,217,0.15)"}`,
        background: focused ? "rgba(43,27,82,0.12)" : "transparent",
      }}
    >
      {children}
    </div>
  );
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        date: form.date || undefined,
        guests: form.guests || undefined,
        message: form.message,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  };

  const inputClass =
    "w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:opacity-40";
  const inputStyle = {
    color: "var(--text)",
    fontFamily: "var(--font-body)",
  };
  const labelStyle: React.CSSProperties = {
    color: "var(--text-muted)",
    fontFamily: "var(--font-body)",
    fontSize: "0.68rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--base)" }}
    >
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[480px] opacity-[0.18]">
        <Aurora
          colorStops={["#4C1D95", "#6D28D9", "#2B1B52"]}
          amplitude={0.55}
          blend={0.38}
          speed={0.35}
        />
      </div>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,11,16,0.15) 0%, rgba(10,11,16,0.7) 35%, rgba(10,11,16,1) 90%)",
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative z-10 pt-36 pb-20 text-center">
        <motion.div initial="hidden" animate="visible">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-5 flex items-center justify-center gap-3"
          >
            <span className="h-px w-12" style={{ background: "var(--gold)" }} />
            <span
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              Get In Touch
            </span>
            <span className="h-px w-12" style={{ background: "var(--gold)" }} />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-5 text-6xl font-light md:text-8xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Let&apos;s Talk
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-md text-sm leading-relaxed"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Share your vision with us. Our team will reach out within 24 hours
            to begin crafting your celebration.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-36">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px] lg:gap-24">

          {/* ── Form ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="flex min-h-[480px] flex-col items-center justify-center gap-8 text-center px-10 py-16"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface-1)",
                }}
              >
                {/* Animated check */}
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle
                    className="h-14 w-14"
                    style={{ color: "var(--gold)" }}
                    strokeWidth={1}
                  />
                </motion.div>

                <div>
                  <h3
                    className="mb-3 text-3xl font-light"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                  >
                    Message Received
                  </h3>
                  <p
                    className="text-sm leading-loose"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Thank you, {form.name || "dear guest"}. A member of our
                    team will be in touch within 24 hours to discuss your celebration.
                  </p>
                </div>

                <div
                  className="h-px w-20"
                  style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
                />
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <FieldWrapper focused={focused === "name"}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                        placeholder="Your full name"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </FieldWrapper>
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <FieldWrapper focused={focused === "email"}>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </FieldWrapper>
                  </div>
                </div>

                {/* Row 2: Phone + Date */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <FieldWrapper focused={focused === "phone"}>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused(null)}
                        placeholder="+60 12 345 6789"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </FieldWrapper>
                  </div>
                  <div>
                    <label style={labelStyle}>Event Date</label>
                    <FieldWrapper focused={focused === "date"}>
                      <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        onFocus={() => setFocused("date")}
                        onBlur={() => setFocused(null)}
                        className={inputClass}
                        style={{ ...inputStyle, colorScheme: "dark" }}
                      />
                    </FieldWrapper>
                  </div>
                </div>

                {/* Row 3: Guests */}
                <div>
                  <label style={labelStyle}>Expected Guest Count</label>
                  <FieldWrapper focused={focused === "guests"}>
                    <input
                      name="guests"
                      type="number"
                      min="1"
                      max="2000"
                      value={form.guests}
                      onChange={handleChange}
                      onFocus={() => setFocused("guests")}
                      onBlur={() => setFocused(null)}
                      placeholder="e.g. 350"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </FieldWrapper>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Your Message</label>
                  <FieldWrapper focused={focused === "message"}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      required
                      rows={7}
                      placeholder="Tell us about your vision — theme, special requests, questions…"
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </FieldWrapper>
                </div>

                {/* Error */}
                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs"
                    style={{ color: "#F87171", fontFamily: "var(--font-body)" }}
                  >
                    {submitError}
                  </motion.p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: isPending ? 1 : 1.01 }}
                  whileTap={{ scale: isPending ? 1 : 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 py-4 text-sm font-medium tracking-widest transition-colors duration-300 disabled:opacity-60"
                  style={{
                    background: "var(--gold)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    />
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </motion.button>

                <p
                  className="text-center text-xs"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  We respond within 24 hours. All inquiries are treated with discretion.
                </p>
              </form>
            )}
          </motion.div>

          {/* ── Info Sidebar ──────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="space-y-10 lg:pt-1"
          >
            {CONTACT_INFO.map(({ icon: Icon, label, lines, href }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                animate="visible"
                custom={i + 3}
                variants={fadeUp}
                className="flex items-start gap-5"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface-1)",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: "var(--gold)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div
                    className="mb-1.5 text-xs uppercase tracking-[0.22em]"
                    style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
                  >
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="block text-sm transition-colors duration-200 hover:text-[var(--text)]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {lines[0]}
                    </a>
                  ) : (
                    lines.map((line, j) => (
                      <p
                        key={j}
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                      >
                        {line}
                      </p>
                    ))
                  )}
                </div>
              </motion.div>
            ))}

            {/* Divider */}
            <div
              className="h-px"
              style={{
                background:
                  "linear-gradient(to right, var(--border), transparent)",
              }}
            />

            {/* Map CTA */}
            <motion.a
              href="https://maps.google.com/?q=Jalan+Bukit+Bintang+Kuala+Lumpur"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:text-[var(--text)]"
              style={{
                border: "1px solid var(--border-hover)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <MapPin className="h-3.5 w-3.5" />
              View on Google Maps
            </motion.a>

            {/* Decorative tagline */}
            <p
              className="text-xs italic leading-relaxed"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", opacity: 0.6 }}
            >
              &ldquo;Every great celebration begins with a single conversation.&rdquo;
            </p>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
