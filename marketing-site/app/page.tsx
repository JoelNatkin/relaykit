"use client";

import {
  Announcement02,
  BellRinging01,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Code02,
  Globe01,
  MessageChatCircle,
  MessageCheckCircle,
  Package,
  Shield01,
  StopCircle,
  Target01,
  Users01,
} from "@untitledui/icons";
import type { FC } from "react";

const TOOLS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "cline", label: "Cline" },
  { id: "other", label: "Other" },
];

const TOOL_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};

function ToolLogo({ id }: { id: string }) {
  const logoSrc = TOOL_LOGO_MAP[id];
  if (!logoSrc) return <Code02 className="h-6 w-6 text-text-quaternary" />;
  const sizeClass = id === "windsurf" ? "w-[34px] h-[34px]" : "w-7 h-7";
  return (
    <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />
  );
}

interface Category {
  id: string;
  label: string;
  icon: FC<{ className?: string }>;
  examples: string;
}

const CATEGORIES: Category[] = [
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    examples: "Confirmations, reminders, reschedules, cancellations, no-show follow-ups",
  },
  {
    id: "verification",
    label: "Verification codes",
    icon: Shield01,
    examples: "Login OTPs, signup codes, password resets, MFA, new device alerts",
  },
  {
    id: "orders",
    label: "Order updates",
    icon: Package,
    examples: "Shipping confirmations, delivery alerts, return status, refund notices",
  },
  {
    id: "support",
    label: "Customer support",
    icon: MessageChatCircle,
    examples: "Ticket updates, resolution notices, satisfaction follow-ups",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Announcement02,
    examples: "Promos, re-engagement, product launches, seasonal campaigns",
  },
  {
    id: "internal",
    label: "Team alerts",
    icon: Users01,
    examples: "Shift reminders, system alerts, escalation pings, on-call notifications",
  },
  {
    id: "community",
    label: "Community",
    icon: Globe01,
    examples: "Event reminders, group updates, membership alerts, RSVP confirmations",
  },
  {
    id: "waitlist",
    label: "Waitlist",
    icon: ClipboardCheck,
    examples: "Spot available, queue position, reservation holds, invite codes",
  },
];

const STEPS = [
  {
    title: "Pick your use case",
    description: "A full library of compliant messages.",
  },
  {
    title: "Hand it to your AI",
    description: "Drop two files in. Your AI handles the rest.",
  },
  {
    title: "Go live when you're ready",
    description: "Build in a fully functional sandbox. Free.",
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function MarketingHome() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-bg-tertiary py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Add SMS to your app in
            <br />
            minutes, not months.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-tertiary">
            Two files. Your AI coding tool. A working SMS feature.
          </p>

          {/* Logo row */}
          <div className="mt-8 flex items-center justify-center gap-5">
            {TOOLS.map((tool) => (
              <div key={tool.id} className="flex min-w-[56px] flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#999999] bg-white">
                  <ToolLogo id={tool.id} />
                </div>
                <span className="whitespace-nowrap text-[10px] font-medium text-text-tertiary">
                  {tool.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => scrollTo("compliance")}
              className="rounded-lg border border-border-primary bg-white px-5 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
            >
              Why RelayKit?
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="mx-auto mt-18 max-w-5xl scroll-mt-8 px-6">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">How it works</p>
        <h2 className="mt-1 text-center text-2xl font-bold text-text-primary">
          Shorter than your last standup.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-brand-secondary text-lg font-bold text-text-brand-secondary">
                {i + 1}
              </div>
              <h3 className="mt-4 text-base font-bold text-text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-text-tertiary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing context line */}
      <p className="py-8 text-center text-sm text-text-tertiary">
        Free to build and test. $49 to register, then $19/mo.
      </p>

      {/* Category grid — visual showcase, non-clickable */}
      <div id="categories" className="scroll-mt-8 bg-bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-text-primary">Explore use cases</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-tertiary">
            Every message is pre-written, tailored to your use case, and ready for carriers.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col rounded-xl border border-border-secondary bg-bg-primary p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary">
                    <cat.icon className="size-5 text-fg-brand-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">{cat.label}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-tertiary">{cat.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="mx-auto mt-24 max-w-5xl scroll-mt-8 px-6">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">
          Simple pricing
        </p>
        <h2 className="mt-1 text-center text-2xl font-bold text-text-primary">
          Free to build. Pay when you go live.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Free card */}
          <div className="flex flex-col rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-bold text-text-primary">Free</h3>
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
                "Works with Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, and others",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-text-secondary">
                  <CheckCircle className="mt-1 size-4 shrink-0 text-fg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Go live card */}
          <div className="flex flex-col rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-bold text-text-primary">Go live</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold text-text-primary">$49</span>
              <span className="ml-1 text-sm text-text-tertiary">to register</span>
              <span className="mx-1.5 text-sm text-text-tertiary">+</span>
              <span className="text-3xl font-bold text-text-primary">$19</span>
              <span className="text-sm text-text-tertiary">/mo</span>
            </div>
            <p className="mt-3 text-base text-text-tertiary">Full refund if not approved.</p>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                "Carrier registration handled for you — approved in days",
                "No credit card to start building",
                "500 messages included per month",
                "Dedicated phone number",
                "Every message scanned — issues caught and fixed before they reach carriers",
                "Need more messages? $8 per 500. Scales with usage.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-text-secondary">
                  <CheckCircle className="mt-1 size-4 shrink-0 text-fg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => scrollTo("categories")}
            className="w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover sm:w-[calc(50%-12px)]"
          >
            Start building free &rarr;
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-text-tertiary">
          Volume pricing available above 5,000 messages
        </p>
      </div>

      {/* Compliance — what happens after you go live */}
      <div id="compliance" className="mt-24 scroll-mt-8 bg-bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-semibold text-text-brand-secondary">
            Why RelayKit?
          </p>
          <h2 className="mx-auto mt-1 max-w-2xl text-center text-2xl font-bold text-text-primary">
            Your messages keep delivering. We make sure of it.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-text-tertiary">
            Other platforms send your messages and hope for the best. RelayKit checks every message
            before it goes out, watches for problems after delivery, and alerts you when something
            needs attention &mdash; before carriers do.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                icon: MessageCheckCircle,
                title: "Every message checked before sending",
                desc: "We scan outbound messages against carrier rules automatically. If something would cause a problem, we catch it before it reaches your users — not after.",
              },
              {
                icon: StopCircle,
                title: "Opt-outs handled for you",
                desc: "When someone replies STOP, their number is blocked immediately — no code on your end. If you accidentally try to text them again, we block it and tell you why.",
              },
              {
                icon: Target01,
                title: "We notice when things drift",
                desc: "As your app evolves, the messages it sends can gradually shift from what was originally approved. We use AI to spot this early and tell you what to fix — before carriers flag your number.",
              },
              {
                icon: BellRinging01,
                title: "You’ll know when something needs attention",
                desc: "If we block a message or detect a problem, you hear about it — dashboard alerts, email, or text. No issues sitting quietly on a dashboard waiting for you to notice.",
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
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{card.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-text-secondary">
            Every compliance feature is included for every customer. No paid tiers. No add-ons.
          </p>
        </div>
      </div>

      {/* Problem framing — why this exists */}
      <div className="mx-auto mt-24 max-w-5xl px-6">
        <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold text-text-primary">
          You shouldn&apos;t need a telecom degree to text your users.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-text-tertiary">
          Adding SMS should take an afternoon. Instead, you&apos;re stuck navigating carrier
          registration, building compliance pages, and hoping your submission doesn&apos;t get
          rejected. RelayKit handles all of it.
        </p>

        {/* Desktop column labels */}
        <div className="mx-auto mb-3 mt-10 hidden max-w-4xl px-5 sm:grid sm:grid-cols-[300px_1fr_1fr_1fr] sm:gap-5">
          <div />
          <p className="text-sm font-semibold text-text-primary">DIY</p>
          <p className="text-sm font-semibold text-text-primary">Others</p>
          <p className="text-sm font-semibold text-text-primary">RelayKit</p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-4 sm:mt-0">
          {[
            {
              topic: "Registration",
              desc: "Carriers require it before you can send a single text. Most people get rejected the first time.",
              diy: "Learn 10DLC. Fill out carrier forms. Wait weeks.",
              others: "Same forms. You’re on your own.",
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
              desc: "Reply STOP must actually stop. Get it wrong and you’re liable.",
              diy: "Build STOP/HELP yourself. Get TCPA wrong, you’re liable.",
              others: "Some offer it. Most don’t.",
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
            <div key={row.topic} className="rounded-xl border border-border-secondary p-5">
              <p className="text-sm font-bold text-text-primary">{row.topic}</p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[300px_1fr_1fr_1fr] sm:items-start sm:gap-5">
                <div className="sm:pr-4">
                  <p className="text-sm leading-relaxed text-text-tertiary">{row.desc}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-quaternary sm:hidden">
                    DIY
                  </p>
                  <p className="text-sm text-text-tertiary">{row.diy}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-quaternary sm:hidden">
                    Others
                  </p>
                  <p className="text-sm text-text-tertiary">{row.others}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-quaternary sm:hidden">
                    RelayKit
                  </p>
                  <p className="text-sm font-medium text-text-primary">{row.relaykit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance line */}
      <p className="mt-16 pb-16 text-center text-sm text-text-tertiary">
        No contracts. Cancel anytime. Your code stays yours.
      </p>
    </div>
  );
}
