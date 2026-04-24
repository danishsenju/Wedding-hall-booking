import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Laman Troka",
  description:
    "Reach out to the Laman Troka team. Share your wedding vision and we will craft an unforgettable celebration together. Located in Kuala Lumpur.",
};

export default function ContactPage() {
  return <ContactClient />;
}
