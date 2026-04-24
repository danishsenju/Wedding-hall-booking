import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Laman Troka",
    short_name: "Laman Troka",
    description:
      "Kuala Lumpur's most refined wedding hall. Book your perfect celebration.",
    start_url: "/",
    display: "standalone",
    background_color: "#EDE9FE",
    theme_color: "#6D28D9",
    orientation: "portrait-primary",
    categories: ["lifestyle", "wedding", "events"],
    lang: "en-MY",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=390&q=80",
        sizes: "390x844",
        type: "image/jpeg",
      },
    ],
    shortcuts: [
      {
        name: "Book a Date",
        short_name: "Book",
        description: "Start your wedding booking",
        url: "/book",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Explore Venues",
        short_name: "Venues",
        description: "View our venue details",
        url: "/venue",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
    ],
  };
}
