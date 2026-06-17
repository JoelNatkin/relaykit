import Link from "next/link";
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
          <Eyebrow>For developer tools &amp; API platforms</Eyebrow>
          {/* H1 is a placeholder draft — refined on the preview. */}
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            User account text messaging for your app.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Payment failures, security alerts, trial endings — the events that
            decide whether a customer stays, sent where they&apos;ll actually
            see them.
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
          <HeroNotificationMock />
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
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-text-secondary">
          A renewal email lands in a spam folder. The account quietly lapses.
          One text the customer can&apos;t miss, fixes it before they churn.
        </p>
        <div className="space-y-3">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-border-secondary bg-surface-card px-4 py-3 text-sm leading-relaxed text-text-primary">
            <span className="font-semibold">Acme</span>: Card ending 4242 was
            declined. Update payment to keep your account active:
            yourapp.com/billing
          </div>
          <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-md bg-bg-gold px-4 py-3 text-right text-sm font-medium text-text-on-gold">
            Paid in minutes
          </div>
        </div>
      </div>
    </section>
  );
}

const QA = [
  {
    q: "Who should get a failed-payment text in a multi-seat app?",
    lead: "The billing owner — not every seat.",
    body: "A failed payment is one workspace's problem to fix, and texting all twelve seats just makes twelve confused users and one annoyed admin. Send each event to the one human who can act on it.",
  },
  {
    q: "Should a new-device sign-in alert go to the account owner or the person who signed in?",
    lead: "The person who signed in.",
    body: "It's their security event, and they're the one who can confirm it was them or lock things down. In a workspace, that means a new-laptop login from an admin shouldn't ping the billing owner — route security events to the person they're actually about.",
  },
  {
    q: "Which account events are worth a text?",
    lead: "The ones a customer has to act on, or has to know about right now.",
    list: ["A declined payment", "A new-device sign-in", "An account suspension"],
    body: "Receipts, weekly digests, and “your invoice is ready” can stay in email — texting those just trains people to ignore you. Rule of thumb: if it can wait until they next open the app, it doesn't need a text.",
  },
  {
    q: "What about users who never gave you a phone number?",
    lead: "The event falls back to email.",
    body: "Text is the escalation channel for the messages that matter most, not a replacement for all of them. Most apps collect a number at sign-up, or the first time security matters (a new-device prompt is a natural moment to ask). You decide the fallback; you pass the recipient, and the message goes where you send it.",
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
      <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {QA.map((item) => (
          <div key={item.q}>
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

// The secondaries — "feature becomes platform" (craft rule #4). Authored
// editorial framing of the honest pairs for dev tools (Verification + Team
// alerts), NOT a second interactive browser; the breadth lives one click away
// at /messages.
const PAIRS = [
  {
    name: "Verification",
    body: "Login codes, step-up confirmation, device verification — the same SDK, no separate auth vendor.",
  },
  {
    name: "Team alerts",
    body: "System alerts, on-call pages, escalation pings — operational messages your own team needs to see fast.",
  },
];

export function Rest() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The rest</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Account events are just the start.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          One integration sends every category. For a developer tool,
          verification codes and operational alerts pair most naturally with
          account events — but it&apos;s all there when you need it.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {PAIRS.map((pair) => (
          <div
            key={pair.name}
            className="rounded-2xl border border-border-secondary bg-surface-card p-6"
          >
            <h3 className="text-lg font-semibold text-text-primary">
              {pair.name}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">
              {pair.body}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/messages"
          className="text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
        >
          See all nine categories <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

// Sibling-sub chips. The target pages don't exist yet, so v1 points them at
// /messages; wire real /for/{slug} cross-links as sibling pages ship (D-436).
const RELATED = [
  "Identity & SSO platforms",
  "Helpdesk & support SaaS",
  "E-commerce platforms",
  "Subscription boxes",
];

export function Related() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="text-sm font-medium uppercase tracking-[0.14em] text-text-tertiary">
        Building a different app? Find yours.
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {RELATED.map((label) => (
          <Link
            key={label}
            href="/messages"
            className="rounded-full border border-border-secondary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:border-border-primary hover:text-text-primary"
          >
            {label} <span aria-hidden>↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
