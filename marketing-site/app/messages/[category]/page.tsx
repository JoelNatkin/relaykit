import type { Metadata } from "next";
import { notFound } from "next/navigation";
// Shared chrome (bucket 1) — imported as-is from the home; home copy verbatim.
import { StatusBand } from "@/components/home/status-band";
import { Recognition } from "@/components/home/recognition";
import { Prove } from "@/components/home/prove";
import { Paperwork } from "@/components/home/paperwork";
import { AiSection } from "@/components/home/ai-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
// Same component, per-category data (bucket 2b).
import { MessagesSection } from "@/components/home/messages-section";
import { VariablesSection } from "@/components/home/variables-section";
import { NumbersSection } from "@/components/home/numbers-section";
// Authored, per-category sections (bucket 2a).
import { CategoryHero } from "@/components/landing/category-hero";
import { CategoryMoment } from "@/components/landing/category-moment";
import { CategoryDetails } from "@/components/landing/category-details";
import { PaperworkFork } from "@/components/landing/paperwork-fork";
import { CategoryFarm } from "@/components/landing/category-farm";
import {
  categorySlugs,
  findCategoryLanding,
} from "@/lib/landing/categories";

// One static page per registry entry; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return categorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params; // the public urlSlug
  const entry = findCategoryLanding(category);
  if (!entry) return {};
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    // Self-canonical — points to this page's own path, never to `/`.
    alternates: { canonical: `/messages/${entry.urlSlug}` },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const entry = findCategoryLanding(category);
  if (!entry) notFound();

  return (
    <div>
      <CategoryHero entry={entry} />
      <StatusBand />
      <CategoryMoment entry={entry} />

      {/* The full message browser, opened on this category's pill — the visitor
          can switch to any of the 9. This single instance replaces the former
          locked-here + full-browser-at-bottom pair. */}
      <MessagesSection
        defaultCategory={entry.lockedCategory}
        eyebrow="The messages"
        heading={`${entry.name} messages — and every other kind.`}
        bridge="Every message your app sends. Copy them, customize them, or write your own."
      />
      {/* Variables right after Messages, with a category-matched example. */}
      <VariablesSection example={entry.variablesExample} />

      <CategoryDetails entry={entry} />
      <Paperwork />
      {/* Fork — landing-owned link composed AFTER the verbatim <Paperwork />. */}
      <PaperworkFork />
      <AiSection />
      <Prove />
      {/* HowItWorks (#how) — bucket-1 chrome; the hero "How it works" CTA
          targets #how. Placed in the process cluster (Test → How → Price). */}
      <HowItWorks />
      <Pricing />
      {/* Numbers + Problem sit at the tail on the category template (unlike the
          home / ship-it order) — the page leads on product, then closes with
          the case and the compliance reality right before the CTA. */}
      <NumbersSection />
      <Recognition />
      <FinalCta />
      {/* Farm — quiet sibling-category directory below the Closing CTA. */}
      <CategoryFarm currentSlug={entry.urlSlug} />
    </div>
  );
}
