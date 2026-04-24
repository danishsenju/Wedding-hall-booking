import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us — Laman Troka",
  description:
    "Discover the story behind Laman Troka — Kuala Lumpur's most refined wedding destination. Seven years of timeless elegance and over 500 celebrations crafted with white-glove care.",
};

export default function AboutPage() {
  return <AboutClient />;
}
