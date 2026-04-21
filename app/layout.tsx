import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import RouteProgress from "@/components/RouteProgress";

/* ─── Fonts ─────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

/* ─── Metadata ──────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://lumieresgrandhall.com"
  ),
  title: {
    default: "Lumières Grand Hall — Premium Wedding Venue, Kuala Lumpur",
    template: "%s | Lumières Grand Hall",
  },
  description:
    "Kuala Lumpur's most refined wedding hall. Timeless elegance, bespoke packages, and flawless event coordination for your perfect celebration.",
  keywords: [
    "wedding hall Kuala Lumpur",
    "premium wedding venue KL",
    "Lumières Grand Hall",
    "wedding booking Malaysia",
    "ballroom KL",
    "wedding package Malaysia",
  ],
  authors: [{ name: "Lumières Grand Hall" }],
  creator: "Lumières Grand Hall",
  openGraph: {
    type: "website",
    locale: "en_MY",
    siteName: "Lumières Grand Hall",
    title: "Lumières Grand Hall — Premium Wedding Venue, Kuala Lumpur",
    description:
      "Timeless elegance for your most memorable day. Book the finest wedding hall in Kuala Lumpur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumières Grand Hall — Premium Wedding Venue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumières Grand Hall",
    description:
      "Kuala Lumpur's most refined wedding hall. Bespoke packages from RM 18,000.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#06141B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ───────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased noise-overlay">
        <RouteProgress />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
