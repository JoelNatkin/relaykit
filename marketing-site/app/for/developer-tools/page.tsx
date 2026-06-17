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
  Rest,
  PaperworkFork,
  Farm,
  DEVTOOLS_VARIABLES_EXAMPLE,
} from "./sections";
import { findSubVertical } from "../../../../lib/constraints";

// Two decoupled slugs (D-436): the short, human-curated URL slug, and the
// canonical constraints data slug used to resolve the sub-vertical's data.
const URL_SLUG = "developer-tools";
const DATA_SLUG = "developer-tools-api-platforms-infrastructure-saas";

// Resolve the sub from /lib/constraints by its data slug — keeps the URL and
// the data aligned, and fails the build loudly if the constraints slug drifts.
const SUB = findSubVertical(DATA_SLUG);
if (!SUB) {
  throw new Error(`Unknown sub-vertical data slug: ${DATA_SLUG}`);
}

export const metadata: Metadata = {
  title: "SMS for developer tools & API platforms — RelayKit",
  description:
    "Add account-event text messages — payment failures, security alerts, trial endings — to your developer tool or API platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
  // Self-canonical (D-436) — points to this page's own path, never to `/`.
  alternates: { canonical: `/for/${URL_SLUG}` },
};

export default function DeveloperToolsLanding() {
  return (
    <div>
      <DevToolsHero />
      <StatusBand />
      <Moment />

      {/* Messages locked to the sub's dominant category (account events). */}
      <MessagesSection
        lockedCategory="account-events"
        heading="Account messages, ready to send."
        bridge="The events that decide whether a customer stays."
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
      <Rest />
      <FinalCta />
      {/* Farm — quiet directory below the Closing CTA (replaces the Related rack). */}
      <Farm />
    </div>
  );
}
