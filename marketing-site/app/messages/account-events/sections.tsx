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
          <Eyebrow>Account events</Eyebrow>
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
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-text-secondary">
          A customer&apos;s card fails, the renewal email sits unread, and their
          account lapses. A text reaches them in time to fix it, before a missed
          payment turns into a cancelled account.
        </p>
        <div className="space-y-3">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-border-secondary bg-surface-card px-4 py-3 text-sm leading-relaxed text-text-primary">
            <span className="font-semibold">Acme</span>: Card ending 4242 was
            declined. Update payment to keep your account active:
            yourapp.com/billing
          </div>
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-bg-gold px-4 py-2.5 text-sm font-medium text-text-on-gold">
            Paid in minutes
          </div>
        </div>
      </div>
    </section>
  );
}

const QA = [
  {
    q: "Who should get the failed payment text?",
    lead: "The billing owner, not every seat.",
    body: "Texting all twelve seats makes twelve confused users and one annoyed admin. The person who can fix it is the one who needs the text.",
  },
  {
    q: "Who should get a new-device alert?",
    lead: "The person who signed in.",
    body: "It's their security event; they confirm it or lock things down. Don't ping anyone else.",
  },
  {
    q: "Which account events are worth a text?",
    lead: "The ones a customer has to act on right now.",
    list: ["A declined payment", "A new-device sign-in", "An account suspension"],
    body: "If it can wait until they next open the app, it doesn't need a text. Receipts and digests can stay in email; texting those only trains people to ignore them.",
  },
  {
    q: "What if we don't have a user's phone number?",
    lead: "They still get the email.",
    body: "Account messages matter enough to send as both a text and an email: the text reaches whoever will see it right away, the email is the record everyone gets.",
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

// ── Fork: a single landing-OWNED link rendered AFTER the verbatim <Paperwork />
// (the shared home component is never modified — home stays byte-identical). It
// forks the reader who wants the registration detail off the funnel.
export function PaperworkFork() {
  return (
    // Pulled up tight under Paperwork's bottom padding (so the link sits close
    // to the cards) and right-aligned to the card grid's right edge. Same
    // max-w-5xl px-6 container as Paperwork → matching right edge.
    <div className="mx-auto -mt-14 max-w-5xl px-6 pb-20 text-right sm:-mt-20 sm:pb-28">
      {/* v1 → /messages. Intended target: /10dlc-registration pain-point page
          (not built yet). */}
      <Link
        href="/messages"
        className="text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
      >
        What registration actually involves <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

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
