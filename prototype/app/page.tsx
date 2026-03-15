"use client";

import Link from "next/link";
import {
  Calendar,
  Package,
  Shield01,
  MessageChatCircle,
  Announcement02,
  Users01,
  Globe01,
  ClipboardCheck,
  ArrowRight,
  CheckCircle,
  MessageCheckCircle,
  StopCircle,
  Target01,
  BellRinging01,
} from "@untitledui/icons";
import type { FC } from "react";

interface Category {
  id: string;
  label: string;
  icon: FC<{ className?: string }>;
  examples: string;
  ctaLabel: string;
}

const CATEGORIES: Category[] = [
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    examples: "Confirmations, reminders, reschedules, cancellations, no-show follow-ups",
    ctaLabel: "View appointment messages",
  },
  {
    id: "verification",
    label: "Verification codes",
    icon: Shield01,
    examples: "Login OTPs, signup codes, password resets, MFA, new device alerts",
    ctaLabel: "View verification messages",
  },
  {
    id: "orders",
    label: "Order updates",
    icon: Package,
    examples: "Shipping confirmations, delivery alerts, return status, refund notices",
    ctaLabel: "View order messages",
  },
  {
    id: "support",
    label: "Customer support",
    icon: MessageChatCircle,
    examples: "Ticket updates, resolution notices, satisfaction follow-ups",
    ctaLabel: "View support messages",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Announcement02,
    examples: "Promos, re-engagement, product launches, seasonal campaigns",
    ctaLabel: "View marketing messages",
  },
  {
    id: "internal",
    label: "Team alerts",
    icon: Users01,
    examples: "Shift reminders, system alerts, escalation pings, on-call notifications",
    ctaLabel: "View team alert messages",
  },
  {
    id: "community",
    label: "Community",
    icon: Globe01,
    examples: "Event reminders, group updates, membership alerts, RSVP confirmations",
    ctaLabel: "View community messages",
  },
  {
    id: "waitlist",
    label: "Waitlist",
    icon: ClipboardCheck,
    examples: "Spot available, queue position, reservation holds, invite codes",
    ctaLabel: "View waitlist messages",
  },
];

const STEPS = [
  {
    title: "Pick your use case",
    description:
      "A full library of compliant messages.",
  },
  {
    title: "Hand it to your AI",
    description:
      "Drop two files in. Your AI handles the rest.",
  },
  {
    title: "Go live when you're ready",
    description:
      "Build in a fully functional sandbox. Free.",
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function MarketingHome() {
  return (
    <div className="py-16">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Add SMS to your app<br />
          in minutes, not months.
        </h1>
        <p className="mt-4 text-lg text-text-tertiary max-w-2xl mx-auto">
          The fastest way to add compliant SMS to any app.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => scrollTo("compliance")}
            className="rounded-lg border border-border-primary px-5 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            Why RelayKit?
          </button>
          <button
            onClick={() => scrollTo("categories")}
            className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Pick your use case
          </button>
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="mx-auto max-w-5xl px-6 mt-18 scroll-mt-8">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">
          How it works
        </p>
        <h2 className="mt-1 text-center text-2xl font-bold text-text-primary">
          Shorter than your last standup.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-brand-secondary text-text-brand-secondary text-lg font-bold">
                {i + 1}
              </div>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-text-tertiary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category grid — the product showcase */}
      <div id="categories" className="mt-24 scroll-mt-8 bg-bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-text-primary">
            Explore use cases
          </h2>
          <p className="mt-2 text-center text-text-tertiary max-w-xl mx-auto">
            Every message is pre-written, tailored to your use case, and ready for carriers.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/sms/${cat.id}`}
                className="group flex flex-col rounded-xl border border-border-secondary bg-bg-primary p-6 transition duration-100 ease-linear hover:border-border-brand hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary group-hover:bg-bg-brand-primary">
                    <cat.icon className="size-5 text-fg-brand-primary group-hover:text-fg-white" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {cat.label}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-text-tertiary leading-relaxed">
                  {cat.examples}
                </p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1 self-end text-sm font-medium text-text-brand-secondary group-hover:text-text-brand-secondary_hover">
                  {cat.ctaLabel}
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="mx-auto max-w-5xl px-6 mt-24 scroll-mt-8">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">
          Simple pricing
        </p>
        <h2 className="mt-1 text-center text-2xl font-bold text-text-primary">
          Free to build. Pay when you go live.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Sandbox card */}
          <div className="flex flex-col rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-bold text-text-primary">Sandbox</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-primary">$0</span>
              <span className="text-sm text-text-tertiary">forever</span>
            </div>
            <p className="mt-3 text-sm text-text-tertiary">
              Build and test your SMS integration. No credit card, no time limit.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                "Test API key and sandbox phone number",
                "Pre-written messages for your use case",
                "Setup instructions your AI coding tool can follow",
                "Works with Claude Code, Cursor, Windsurf",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="size-4 shrink-0 text-fg-brand-primary mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <button
                onClick={() => scrollTo("categories")}
                className="w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
              >
                Start building &rarr;
              </button>
            </div>
          </div>

          {/* Live card */}
          <div className="flex flex-col rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-bold text-text-primary">Live</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold text-text-primary">$199</span>
              <span className="text-sm text-text-tertiary ml-1">one-time setup</span>
              <span className="text-sm text-text-tertiary mx-1.5">+</span>
              <span className="text-3xl font-bold text-text-primary">$19</span>
              <span className="text-sm text-text-tertiary">/mo</span>
            </div>
            <p className="mt-3 text-sm text-text-tertiary">
              Real messages to real users. We handle the carrier registration.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                "500 messages included per month",
                "Dedicated phone number",
                "Carrier registration handled for you (2\u20133 week process, we manage it all)",
                "Compliance monitoring and drift detection included",
                "Need more messages? $15 per 1,000. Scales with usage \u2014 up or down.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="size-4 shrink-0 text-fg-brand-primary mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <button
                onClick={() => scrollTo("categories")}
                className="w-full rounded-lg border border-border-brand px-5 py-2.5 text-sm font-semibold text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-brand-primary"
              >
                Start free, upgrade when ready
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-text-tertiary">
          Volume pricing available above 5,000 messages
        </p>
      </div>

      {/* Compliance — what happens after you go live */}
      <div id="compliance" className="mt-24 bg-bg-secondary py-16 scroll-mt-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-semibold text-text-brand-secondary">
            Why RelayKit?
          </p>
          <h2 className="mt-1 text-center text-2xl font-bold text-text-primary max-w-2xl mx-auto">
            Your messages keep delivering. We make sure of it.
          </h2>
          <p className="mt-4 text-center text-text-tertiary max-w-2xl mx-auto leading-relaxed">
            Other platforms send your messages and hope for the best. RelayKit checks every
            message before it goes out, watches for problems after delivery, and alerts you
            when something needs attention &mdash; before carriers do.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                icon: MessageCheckCircle,
                title: "Every message checked before sending",
                desc: "We scan outbound messages against carrier rules automatically. If something would cause a problem, we catch it before it reaches your users \u2014 not after.",
              },
              {
                icon: StopCircle,
                title: "Opt-outs handled for you",
                desc: "When someone replies STOP, their number is blocked immediately \u2014 no code on your end. If you accidentally try to text them again, we block it and tell you why.",
              },
              {
                icon: Target01,
                title: "We notice when things drift",
                desc: "As your app evolves, the messages it sends can gradually shift from what was originally approved. We use AI to spot this early and tell you what to fix \u2014 before carriers flag your number.",
              },
              {
                icon: BellRinging01,
                title: "You\u2019ll know when something needs attention",
                desc: "If we block a message or detect a problem, you hear about it \u2014 dashboard alerts, email, or text. No issues sitting quietly on a dashboard waiting for you to notice.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border-secondary bg-bg-primary p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                  <card.icon className="size-5 text-fg-brand-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-text-secondary">
            Every compliance feature is included for every customer. No paid tiers. No add-ons.
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-1 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
            >
              See how compliance works
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Problem framing — why this exists */}
      <div className="mx-auto max-w-5xl px-6 mt-24">
        <h2 className="text-center text-2xl font-bold text-text-primary max-w-2xl mx-auto">
          You shouldn&apos;t need a telecom degree to text your users.
        </h2>
        <p className="mt-4 text-center text-text-tertiary max-w-2xl mx-auto leading-relaxed">
          Adding SMS should take an afternoon. Instead, you&apos;re stuck navigating carrier
          registration, building compliance pages, and hoping your submission doesn&apos;t
          get rejected. RelayKit handles all of it.
        </p>

        {/* Desktop column labels */}
        <div className="hidden sm:grid sm:grid-cols-[300px_1fr_1fr_1fr] sm:gap-5 max-w-4xl mx-auto mt-10 mb-3 px-5">
          <div />
          <p className="text-sm font-semibold text-text-primary">DIY</p>
          <p className="text-sm font-semibold text-text-primary">Others</p>
          <p className="text-sm font-semibold text-text-primary">RelayKit</p>
        </div>

        <div className="mt-10 sm:mt-0 flex flex-col gap-4 max-w-4xl mx-auto">
          {[
            {
              topic: "Registration",
              desc: "Carriers require it before you can send a single text. Most people get rejected the first time.",
              diy: "Learn 10DLC. Fill out carrier forms. Wait weeks.",
              others: "Same forms. You\u2019re on your own.",
              relaykit: "Handled, or your money back.",
            },
            {
              topic: "Compliance website",
              desc: "Carriers require a public page with your privacy policy and opt-in terms. No page, no approval.",
              diy: "Build one from scratch.",
              others: "Still your problem.",
              relaykit: "Auto-generated and hosted for you.",
            },
            {
              topic: "Message content",
              desc: "Carriers review exactly what you plan to send. Write the wrong thing and your submission is denied.",
              diy: "Write messages. Hope carriers approve them.",
              others: "No guidance. No templates.",
              relaykit: "Pre-written but flexible options, tested for your use case.",
            },
            {
              topic: "Opt-out handling",
              desc: "Reply STOP must actually stop. Get it wrong and you\u2019re liable.",
              diy: "Build STOP/HELP yourself. Get TCPA wrong, you\u2019re liable.",
              others: "Some offer it. Most don\u2019t.",
              relaykit: "Handled automatically. No code needed.",
            },
            {
              topic: "Ongoing compliance",
              desc: "Messages must stay within the use case you registered for. Drift too far and carriers can suspend your number.",
              diy: "Hope nothing drifts.",
              others: "Hope nothing drifts.",
              relaykit: "Drift detection included for everyone.",
            },
          ].map((row) => (
            <div
              key={row.topic}
              className="rounded-xl border border-border-secondary p-5"
            >
              <p className="text-sm font-bold text-text-primary">{row.topic}</p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[300px_1fr_1fr_1fr] sm:gap-5 sm:items-start">
                <div className="sm:pr-4">
                  <p className="text-sm text-text-tertiary leading-relaxed">{row.desc}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide mb-1 sm:hidden">
                    DIY
                  </p>
                  <p className="text-sm text-text-tertiary">{row.diy}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide mb-1 sm:hidden">
                    Others
                  </p>
                  <p className="text-sm text-text-tertiary">{row.others}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide mb-1 sm:hidden">
                    RelayKit
                  </p>
                  <p className="text-sm font-medium text-text-primary">{row.relaykit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-border-secondary">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Product</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><button onClick={() => scrollTo("how-it-works")} className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">How it works</button></li>
                <li><button onClick={() => scrollTo("categories")} className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Use cases</button></li>
                <li><Link href="/compliance" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Company</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><Link href="/about" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">About</Link></li>
                <li><Link href="/blog" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Legal</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><Link href="/terms" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Terms</Link></li>
                <li><Link href="/privacy" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Privacy</Link></li>
                <li><Link href="/acceptable-use-policy" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Acceptable Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border-tertiary pt-6">
            <p className="text-xs text-text-quaternary">&copy; 2026 Vaulted Press LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
