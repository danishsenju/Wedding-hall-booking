import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import RouteProgress from "@/components/RouteProgress";
import DemoAdminButton from "@/components/DemoAdminButton";

/* ─── Fonts ─────────────────────────────────────── */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

/* ─── Metadata ──────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://lamantroka.com"
  ),
  title: {
    default: "Laman Troka — Premium Wedding Venue, Kuala Lumpur",
    template: "%s | Laman Troka",
  },
  description:
    "Kuala Lumpur's most refined wedding hall. Timeless elegance, bespoke packages, and flawless event coordination for your perfect celebration.",
  keywords: [
    "wedding hall Kuala Lumpur",
    "premium wedding venue KL",
    "Laman Troka",
    "wedding booking Malaysia",
    "ballroom KL",
    "wedding package Malaysia",
  ],
  authors: [{ name: "Laman Troka" }],
  creator: "Laman Troka",
  openGraph: {
    type: "website",
    locale: "en_MY",
    siteName: "Laman Troka",
    title: "Laman Troka — Premium Wedding Venue, Kuala Lumpur",
    description:
      "Timeless elegance for your most memorable day. Book the finest wedding hall in Kuala Lumpur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Laman Troka — Premium Wedding Venue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laman Troka",
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
  themeColor: "#0A0B10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      className={`${cinzel.variable} ${cormorant.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased noise-overlay">
<RouteProgress />
        <div className="relative z-10">
          {children}
        </div>
        <DemoAdminButton />
      </body>
    </html>
  );
}
