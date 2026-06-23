import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findSubVerticalLanding,
  subVerticalSlugs,
} from "@/lib/landing/sub-verticals";
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
// Shared landing fork (same one the dev-tools page + /messages/[category] use).
import { PaperworkFork } from "@/components/landing/paperwork-fork";
// Generic, data-driven per-sub sections (bucket 2a).
import { SubVerticalHero } from "@/components/landing/sub-vertical-hero";
import { SubVerticalMoment } from "@/components/landing/sub-vertical-moment";
import { SubVerticalDetails } from "@/components/landing/sub-vertical-details";
import { SubVerticalMessagesWorkflowsSection } from "@/components/landing/sub-vertical-messages-workflows-section";
// The B2B-SaaS Farm directory is shared as-is from the dev-tools page for v1
// (placeholder links → /messages; a per-vertical Farm is later Phase 1C work).
import { Farm } from "../developer-tools/sections";

// Only known slugs render; everything else 404s (matches /messages/[category]).
export const dynamicParams = false;

// developer-tools is served by its own bespoke static page (app/for/developer-tools);
// exclude it here so it isn't generated twice. Next resolves the static segment
// ahead of this dynamic one, so /for/developer-tools keeps hitting the static page.
export function generateStaticParams() {
  return subVerticalSlugs()
    .filter((slug) => slug !== "developer-tools")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findSubVerticalLanding(slug);
  if (!entry) return {};
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    // Self-canonical (D-436) — points to this page's own path, never to `/`.
    alternates: { canonical: `/for/${entry.urlSlug}` },
    robots: { index: true, follow: true },
  };
}

export default async function SubVerticalLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findSubVerticalLanding(slug);
  if (!entry) notFound();

  return (
    <div>
      <SubVerticalHero entry={entry} />
      <StatusBand />
      <SubVerticalMoment entry={entry} />

      {/* Messages + Workflows toggle — Workflows (curated, default) / All
          messages (full 9-category browser). */}
      <SubVerticalMessagesWorkflowsSection entry={entry} />

      <SubVerticalDetails entry={entry} />
      <Paperwork />
      {/* Fork — landing-owned link composed AFTER the verbatim <Paperwork />. */}
      <PaperworkFork />
      <AiSection />
      <Prove />
      {/* HowItWorks (#how) — bucket-1 chrome; the hero "How it works" CTA
          targets #how. */}
      <HowItWorks />
      <Pricing />
      <NumbersSection />
      <Recognition />
      <FinalCta />
      {/* Farm — quiet directory below the Closing CTA. */}
      <Farm />
    </div>
  );
}
