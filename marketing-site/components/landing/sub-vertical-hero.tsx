import { Eyebrow, PrimaryCta, GhostCta } from "@/components/home/section-ui";
import { HeroNotificationMock } from "@/components/landing/hero-notification-mock";
import type { SubVerticalLanding } from "@/lib/landing/sub-verticals";

// Generic, data-driven sub-vertical hero (Phase 1C A2). Same layout/classes as
// the dev-tools <DevToolsHero/> in app/for/developer-tools/sections.tsx; the
// only difference is content comes from the registry entry. The CTAs and trust
// line are constant across every sub-vertical.
export function SubVerticalHero({ entry }: { entry: SubVerticalLanding }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>{entry.heroEyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            {entry.h1}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            {entry.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryCta href="#configurator">See the messages →</PrimaryCta>
            <GhostCta href="#how">How it works</GhostCta>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-tertiary">
            <span>Free to author &amp; test</span>
            <span aria-hidden>·</span>
            <span>No credit card</span>
            <span aria-hidden>·</span>
            <span>US &amp; Canada</span>
          </p>
        </div>
        <div className="lg:pl-6">
          <HeroNotificationMock examples={entry.heroExamples} />
        </div>
      </div>
    </section>
  );
}
