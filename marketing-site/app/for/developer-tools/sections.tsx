import Link from "next/link";
import { ArrowUpRight } from "@untitledui/icons";
import { Eyebrow, PrimaryCta, GhostCta } from "@/components/home/section-ui";
import type { VariablesExample } from "@/components/home/variables-section";
import { HeroNotificationMock } from "@/components/landing/hero-notification-mock";

// Authored, per-sub sections for the Developer-tools landing page (D-436,
// bucket 2a). Content is ported from the dev-tools landing mockup
// (explorations/landing-page-mockups/relaykit-devtools-landing-mockup.html).
// The shared chrome (status band, problem, paperwork, build, test, process,
// price, closing CTA) and the data-fed sections (messages, variables, numbers)
// are composed in ./page.tsx from the home components — not here.

// Dev-tools example data for the home VariablesSection (bucket 2b): an
// account-events payment-failed message. Card 1 previews card_last4; Card 2's
// open menu drops in account_link.
export const DEVTOOLS_VARIABLES_EXAMPLE: VariablesExample = {
  inputValue: "4242",
  card1Body: [
    { t: "Acme", kind: "value" },
    { t: ": Card ending " },
    { t: "4242", kind: "highlight" },
    { t: " was declined. Update payment to keep your account active: " },
    { t: "yourapp.com/billing", kind: "value" },
    { t: ". Reply STOP to opt out." },
  ],
  card2Body: [
    { t: "Acme", kind: "value" },
    { t: ": Card ending " },
    { t: "4242", kind: "value" },
    { t: " was declined. Update payment: " },
    { t: "yourapp.com/billing", kind: "highlight" },
    { t: ". Reply STOP to opt out." },
  ],
  menuRows: [
    { name: "workspace_name", value: "Acme" },
    { name: "card_last4", value: "4242" },
    { name: "account_link", value: "yourapp.com/billing", selected: true },
    { name: "days_remaining", value: "3" },
  ],
};

export function DevToolsHero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Developer tools</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Text messaging for developer tools apps.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Deploy alerts, quota warnings, payment failures — the messages that
            keep a production platform running.
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
          <HeroNotificationMock
            examples={[
              "prod deploy #4821 failed. Roll back or fix: yourapp.com/deploys/4821",
              "API calls at 80% of your monthly quota. Upgrade before requests start failing: yourapp.com/billing",
              "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
              "New sign-in from a new device in Berlin. Not you? Secure your account: yourapp.com/security",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export function Moment() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The moment</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          A text can change the outcome.
        </h2>
      </div>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-text-secondary">
          A production deploy fails at 2am. The on-call engineer gets a text
          before the first customer opens a support ticket.
        </p>
        <div className="space-y-3">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-border-secondary bg-surface-card px-4 py-3 text-sm leading-relaxed text-text-primary">
            <span className="font-semibold">BuildKit</span>: CRITICAL — prod
            deploy #4821 failed. Roll back or fix: yourapp.com/deploys/4821
          </div>
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-bg-gold px-4 py-2.5 text-sm font-medium text-text-on-gold">
            Fixed before anyone noticed
          </div>
        </div>
      </div>
    </section>
  );
}

const QA: { q: string; lead: string; body: string; list?: string[] }[] = [
  {
    q: "Can I send deploy alerts from a CI/CD pipeline directly, or does it need to go through my app's backend?",
    lead: "Either works — RelayKit is an API call, not a platform integration.",
    body: "You can call the RelayKit API from a GitHub Actions step, a build hook, or any webhook your pipeline fires. The message goes out the same way regardless of where the call originates. Most teams start with a direct pipeline call and move it behind their backend when they want delivery tracking or per-user routing.",
  },
  {
    q: "What's the difference between a system alert and an on-call page for deploy failures?",
    lead: "Urgency and what you expect the recipient to do.",
    body: "An on-call page fires when something is down and needs human attention now — it's the shortest message in the library and links straight to the incident. A system alert is for informational threshold events: quota at 80%, latency above baseline, a job that finished. Both use the same channel; the difference is the action you're asking for.",
  },
  {
    q: "Do verification texts for API key rotation need a STOP line?",
    lead: "No — step-up confirmation codes are 2FA traffic and carry the same carve-out as signup codes.",
    body: "The 2FA TCR exemption covers any code sent to verify a specific action, not just signup. Key rotation, ownership transfer, payment method changes — all qualify. No STOP language in the body.",
  },
  {
    q: "What's the right message for an API key rotation or ownership transfer?",
    lead: "A confirmation code sent to the account owner before the action completes.",
    body: "High-stakes actions — key rotation, billing-owner transfer, team permission changes — should require a step-up code. It's a one-time code sent to the verified number on the account, confirming the action before it goes through. Never put the key itself in the message body; link to the dashboard instead.",
  },
];

export function Details() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The details</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Q&amp;A: Account event messages
        </h2>
      </div>
      {/* Each Q&A is its own card; items-start so a card sizes to its own
          content height — no forced equal heights across a row. */}
      <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
        {QA.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-border-secondary bg-surface-card p-6"
          >
            <h3 className="text-lg font-semibold text-text-primary">
              {item.q}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">
                {item.lead}
              </span>{" "}
              {item.body}
            </p>
            {item.list ? (
              <ul className="mt-3 space-y-1.5">
                {item.list.map((li) => (
                  <li
                    key={li}
                    className="flex items-center gap-2.5 text-base text-text-secondary"
                  >
                    <span
                      className="size-1.5 flex-none rounded-sm bg-bg-gold"
                      aria-hidden
                    />
                    {li}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// (The authored "Rest" secondaries section was removed — the full home
// MessagesSection now renders in that slot, showing all 9 categories.)

// (PaperworkFork was consolidated onto the shared
// components/landing/paperwork-fork.tsx — page.tsx imports it from there.)

// ── Farm: a quiet directory below the Closing CTA — a directory, not a CTA.
// Low-contrast; links route to /messages for v1 (real targets noted inline).
const FARM_TYPES = [
  { name: "Identity & SSO platforms", href: "/messages" }, // intended: /for/identity-sso
  { name: "Helpdesk & support SaaS", href: "/messages" }, // intended: /for/helpdesk-support
  { name: "E-commerce platforms", href: "/messages" }, // intended: /for/ecommerce
];

const FARM_QUESTIONS = [
  {
    label: "What 10DLC registration actually involves",
    href: "/messages", // intended: /10dlc-registration
  },
  {
    label: "How opt-outs and consent stay handled for you",
    href: "/messages", // intended: /consent-and-opt-outs
  },
];

// A Farm directory link: label + a trailing northeast arrow that nudges
// up-right on hover (Supabase style). Arrow is inline so the label wraps
// naturally and the arrow trails the last word.
function FarmLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group text-sm text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="ml-0.5 inline-block size-3.5 align-[-2px] text-text-quaternary transition-transform duration-100 ease-linear group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function Farm() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-16 sm:py-20">
      <Eyebrow>Keep exploring</Eyebrow>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            RelayKit for other business types
          </h3>
          <ul className="mt-4 space-y-3">
            {FARM_TYPES.map((t) => (
              <li key={t.name}>
                <FarmLink href={t.href}>{t.name}</FarmLink>
              </li>
            ))}
            <li>
              {/* intended: the b2b-saas vertical hub */}
              <FarmLink href="/messages">All B2B SaaS</FarmLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Common questions
          </h3>
          <ul className="mt-4 space-y-3">
            {FARM_QUESTIONS.map((q) => (
              <li key={q.label}>
                <FarmLink href={q.href}>{q.label}</FarmLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
