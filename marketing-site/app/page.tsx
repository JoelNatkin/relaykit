import type { Metadata } from "next";
import { AiSection } from "@/components/home/ai-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Paperwork } from "@/components/home/paperwork";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
import { Eyebrow } from "@/components/home/section-ui";
import { VariablesCallout } from "@/components/home/variables-callout";
import { ConfiguratorSection } from "@/components/configurator-section";
import { PreviewListMock } from "@/components/preview-list-mock";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RelayKit — The easiest way to add text messaging to your app",
  description:
    "Pick the messages your app needs. RelayKit handles registration, opt-outs, and the carrier rules behind the scenes. Your AI tool wires up the rest.",
};

// Recognition — the "expected vs discovered" compare. The simple expected
// steps get success-green arrows; the discovered friction markers get error-red
// dots; the closing resolve line is gold (D-427 accent system; green/red are
// D-405 semantic colors).
const EXPECTED = ["Write a message", "Add an API call", "Ship"];
const DISCOVERED = [
  "Registration",
  "Carrier review",
  "Consent requirements",
  "Build a compliance website",
  "STOP and HELP handling",
  "Message restrictions",
];

function Recognition() {
  return (
    <section
      id="why"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>Why RelayKit</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          The feature is small. The paperwork isn&apos;t.
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-7">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            You expected days
          </div>
          <ul className="grid gap-3">
            {EXPECTED.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base text-text-primary"
              >
                <span className="text-sm text-fg-success-primary" aria-hidden>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-7">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            You got weeks
          </div>
          <ul className="grid gap-3">
            {DISCOVERED.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base text-text-primary"
              >
                <span
                  className="size-1.5 flex-none rounded-full bg-fg-error-primary"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 text-center text-lg leading-relaxed text-text-secondary">
        Most developers discover the second column after they start building.
        <br />
        <span className="font-semibold text-gold">
          RelayKit handles them.
        </span>
      </p>
    </section>
  );
}

function Test() {
  return (
    <section
      id="test"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <Eyebrow>Prove</Eyebrow>
      <div className="mt-8 grid items-start gap-14 md:mt-10 lg:grid-cols-2">
        <PreviewListMock />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Run test messages through real phones.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Add yourself, your team, your beta testers. Each person verifies
            once. After that, your app&apos;s messages work for them exactly the
            way they&apos;ll work for customers.
          </p>
          <p className="mt-3.5 text-base leading-relaxed text-text-secondary">
            Trigger your real flows — a booking, a code, a reminder — and see the
            whole loop land: sent, delivered, your database updated.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusBand() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-8">
      <p className="max-w-3xl text-base leading-relaxed text-text-secondary">
        <span className="font-semibold text-text-primary">The message templates are live and free right now</span> — pick them, make the wording yours, and copy them into your app, no account. RelayKit&apos;s own sending — registration with carriers and delivery — arrives Summer 2026.
      </p>
    </section>
  );
}

export default function MarketingHome() {
  return (
    <div>
      <Hero />
      <StatusBand />
      <Recognition />
      <HowItWorks />

      {/* Configurator — the REAL <ConfiguratorSection/> (the exact component
          /messages renders) shown through a fixed-height clipped window; trust
          line + variables callout below. */}
      <section
        id="configurator"
        className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>The messages · live today</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Start with a complete message plan.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              RelayKit generates the messages most apps need, customized for your
              industry and use case.
            </p>
          </div>
          {/* Gold text affordance — D-427. */}
          <Link
            href="/messages"
            className="text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
          >
            Open Messages <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Clipped viewport into the live tool. overflow-hidden clips the lower
            categories (team alerts / login codes). The -mt offset trims the
            configurator's 80px pt-20 (deterministic) to ~24px so the window
            opens cleanly on its own header — no cut type. One instance only
            (shared localStorage with /messages = continuity of intent). Fully
            interactive; only the height is fixed. */}
        <div className="relative mt-8 h-[640px] overflow-hidden mx-[calc(50%-50vw)] md:mt-10">
          <div className="-mt-[56px]">
            <ConfiguratorSection />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-bg-primary md:h-20" />
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-text-tertiary">
          Copy the templates and use them anywhere today — no signup required.
          Twilio, Sinch, Telnyx, custom infrastructure, whatever you&apos;re
          already using.
        </p>
        <VariablesCallout />
      </section>

      <Paperwork />
      <AiSection />
      <Test />
      <Pricing />
      <FinalCta />
    </div>
  );
}
