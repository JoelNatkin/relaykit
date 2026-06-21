import type { Metadata } from "next";
// Shared chrome (bucket 1) — imported as-is from the home; home copy verbatim.
import { StatusBand } from "@/components/home/status-band";
import { Recognition } from "@/components/home/recognition";
import { Prove } from "@/components/home/prove";
import { Paperwork } from "@/components/home/paperwork";
import { AiSection } from "@/components/home/ai-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
// Same component, sub-specific data (bucket 2b).
import { MessagesSection } from "@/components/home/messages-section";
import { VariablesSection } from "@/components/home/variables-section";
import { NumbersSection } from "@/components/home/numbers-section";
// Authored, per-sub sections (bucket 2a) + the dev-tools Variables example.
import {
  DevToolsHero,
  Moment,
  Details,
  PaperworkFork,
  Farm,
  DEVTOOLS_VARIABLES_EXAMPLE,
} from "./sections";
// The short, human-curated URL slug (D-436). Constraints-data resolution is
// deferred to the dynamic /for/[slug] route (Phase 1C A2); this static page only
// needs its own canonical path.
const URL_SLUG = "developer-tools";

export const metadata: Metadata = {
  title: "SMS for developer tools & API platforms — RelayKit",
  description:
    "Add account-event text messages — payment failures, security alerts, trial endings — to your developer tool or API platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
  // Self-canonical (D-436) — points to this page's own path, never to `/`.
  alternates: { canonical: `/for/${URL_SLUG}` },
  // Deferred near-twin of /messages/account-events — reachable, but kept out of
  // search and the sitemap (noindex) until the /for/{slug} program ships.
  robots: { index: false, follow: true },
};

export default function DeveloperToolsLanding() {
  return (
    <div>
      <DevToolsHero />
      <StatusBand />
      <Moment />

      {/* The full message browser, opened on the sub's dominant category
          (account events) — the visitor can switch to any of the 9. This single
          instance replaces the former locked-here + full-browser-at-bottom pair. */}
      <MessagesSection
        defaultCategory="account-events"
        eyebrow="The messages"
        heading="Developer tools & API platforms messages. And all of the others."
        bridge="All nine message categories are included — one registration."
      />
      {/* Variables sits right after Messages (D-436 placement) with a
          sub-matched account-events example. */}
      <VariablesSection example={DEVTOOLS_VARIABLES_EXAMPLE} />

      <Details />
      <NumbersSection />
      <Recognition />
      <Paperwork />
      {/* Fork — landing-owned link composed AFTER the verbatim <Paperwork />. */}
      <PaperworkFork />
      <AiSection />
      <Prove />
      {/* HowItWorks (#how) — bucket-1 chrome; the hero "How it works" CTA
          targets #how. Placed in the process cluster (Test → How → Price),
          mirroring the home's Test→How adjacency. */}
      <HowItWorks />
      <Pricing />
      <FinalCta />
      {/* Farm — quiet directory below the Closing CTA (replaces the Related rack). */}
      <Farm />
    </div>
  );
}
