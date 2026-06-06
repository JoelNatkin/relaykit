import type { Metadata } from "next";
import { AiSection } from "@/components/home/ai-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Paperwork } from "@/components/home/paperwork";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
import { Eyebrow } from "@/components/home/section-ui";
import { VariablesCallout } from "@/components/home/variables-callout";
import { ConfiguratorPeek } from "@/components/configurator-peek";
import { PreviewListMock } from "@/components/preview-list-mock";

export const metadata: Metadata = {
  title: "RelayKit — The easiest way to ship SMS in your app",
  description:
    "Pick the messages your app needs. RelayKit handles registration, opt-outs, and the carrier rules behind the scenes. Your AI tool wires up the rest.",
};

// Recognition — the "expected vs discovered" compare. The closing accent line
// is monochrome per the locked gold rule (weight, not the accent).
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
        <div className="rounded-2xl border border-border-secondary bg-bg-primary p-7 dark:bg-bg-secondary">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            What you expected
          </div>
          <ul className="grid gap-3">
            {EXPECTED.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base text-text-primary"
              >
                <span className="text-sm text-text-tertiary" aria-hidden>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border-primary bg-bg-primary p-7 dark:bg-bg-secondary">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            What you discovered
          </div>
          <ul className="grid gap-3">
            {DISCOVERED.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base text-text-primary"
              >
                <span
                  className="size-1.5 flex-none rounded-full bg-fg-quaternary"
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
        <span className="font-semibold text-text-primary">
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
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <PreviewListMock />
        <div>
          <Eyebrow>Prove</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
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

export default function MarketingHome() {
  return (
    <div>
      <Hero />
      <Recognition />
      <HowItWorks />

      {/* Configurator — peek + trust line + variables callout */}
      <section
        id="configurator"
        className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
      >
        <ConfiguratorPeek />
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
