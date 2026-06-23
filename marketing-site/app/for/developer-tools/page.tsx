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
import { NumbersSection } from "@/components/home/numbers-section";
// Shared landing fork — the single PaperworkFork (also used by /messages/[category]).
import { PaperworkFork } from "@/components/landing/paperwork-fork";
// Authored, per-sub sections (bucket 2a).
import { DevToolsHero, Moment, Details, Farm } from "./sections";
// Messages + Workflows toggle (Phase 1C) — owns the heading + shared controls
// and swaps the curated workflows view with the full chromeless category browser.
import { MessagesWorkflowsSection } from "./messages-workflows-section";
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

      {/* Messages + Workflows toggle — Workflows (curated, default) / All
          messages (full 9-category browser). Replaces the standalone
          MessagesSection + VariablesSection pair. */}
      <MessagesWorkflowsSection />

      <Details />
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
      <NumbersSection />
      <Recognition />
      <FinalCta />
      {/* Farm — quiet directory below the Closing CTA (replaces the Related rack). */}
      <Farm />
    </div>
  );
}
