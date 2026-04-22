"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BookingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--base)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(109,40,217,0.08)", border: "1px solid var(--border-hover)" }}
        >
          <AlertCircle size={28} style={{ color: "var(--gold)" }} strokeWidth={1.5} />
        </div>
        <h1
          className="mb-3 text-2xl font-light"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          Something went wrong
        </h1>
        <p className="mb-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          We couldn&apos;t load the booking form. This is usually a temporary issue.
        </p>
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={reset}
            className="rounded-sm px-6 py-2.5 text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--gold-hover))",
              color: "#EDE9FE",
              fontFamily: "var(--font-body)",
            }}
          >
            Try again
          </motion.button>
          <Link
            href="/"
            className="rounded-sm px-6 py-2.5 text-sm"
            style={{
              border: "1px solid var(--border-hover)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Go home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
