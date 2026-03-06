import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "SMS API for Developers | AI Build Spec, Free Sandbox — RelayKit",
  description:
    "Free SMS sandbox with AI build spec — pick your messages, generate a spec, and let your AI coding tool build the integration. RelayKit handles 10DLC registration and compliance. No credit card required.",
  openGraph: {
    title: "SMS API for Developers — RelayKit",
    description:
      "Free SMS sandbox with AI build spec. Pick your messages, generate a spec, and let your AI coding tool build the integration.",
    type: "website",
    url: "https://relaykit.com",
    siteName: "RelayKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMS API for Developers — RelayKit",
    description:
      "Free SMS sandbox with AI build spec. RelayKit handles 10DLC registration and compliance.",
  },
};

export default function Page() {
  return <LandingPage />;
}
