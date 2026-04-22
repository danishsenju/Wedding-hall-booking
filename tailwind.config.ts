import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        gold: "var(--gold)",
        "gold-hover": "var(--gold-hover)",
        "gold-dim": "var(--gold-dim)",
        base: "var(--base)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        rose: "var(--rose)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "0.02em" }],
        "display-xl": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-lg": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.15" }],
      },
      borderColor: {
        DEFAULT: "var(--border)",
        hover: "var(--border-hover)",
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, var(--gold) 0%, var(--gold-hover) 50%, var(--gold) 100%)",
        "gradient-surface":
          "linear-gradient(180deg, var(--surface-1) 0%, var(--base) 100%)",
        "gradient-radial-gold":
          "radial-gradient(ellipse at center, rgba(109,40,217,0.08) 0%, transparent 70%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(109,40,217,0.15), 0 4px 16px rgba(0,0,0,0.4)",
        "gold-lg": "0 0 40px rgba(109,40,217,0.2), 0 8px 32px rgba(0,0,0,0.5)",
        card: "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(109,40,217,0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% center" },
          to: { backgroundPosition: "-200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
