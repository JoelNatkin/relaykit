"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  CheckCircle,
  Shield01,
  FileCheck02,
  MessageSmileSquare,
  Monitor01,
} from "@untitledui/icons";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";

/* ── Appointments-specific content (stub 1 category as the primary example) ── */

const HERO = {
  badge: "Appointments",
  headline: "Appointment texts in minutes.",
  subheadline:
    "Your AI coding tool builds the integration. RelayKit handles the carriers.",
};

const WHAT_YOU_GET = [
  {
    icon: MessageSmileSquare,
    title: "Messages that get approved",
    description:
      "Booking confirmations, reminders, cancellation notices — pre-written for your use case, formatted for carriers.",
  },
  {
    icon: FileCheck02,
    title: "A build spec your AI tool reads",
    description:
      "Drop two files into Claude Code or Cursor. It builds your SMS integration and asks the right questions first.",
  },
  {
    icon: Shield01,
    title: "Registration you don\u2019t touch",
    description:
      "10DLC brand verification, campaign submission, compliance site — submitted and managed for you.",
  },
  {
    icon: Monitor01,
    title: "Compliance that runs itself",
    description:
      "Every message scanned before delivery. Opt-out enforcement, content rules, drift detection. Included, not upsold.",
  },
];

/* ── Style toggle + message preview cards ── */

type StyleId = "brand-first" | "action-first" | "context-first";

const STYLE_TABS: { id: StyleId; label: string }[] = [
  { id: "brand-first", label: "Brand-first" },
  { id: "action-first", label: "Action-first" },
  { id: "context-first", label: "Context-first" },
];

const PREVIEW_MESSAGES: {
  name: string;
  trigger: string;
  texts: Record<StyleId, string>;
}[] = [
  {
    name: "Booking confirmation",
    trigger: "Sent when appointment booked",
    texts: {
      "brand-first":
        "{app_name}: Your {service_type} appointment is confirmed for {date} at {time}. Reply STOP to opt out.",
      "action-first":
        "Confirmed — {service_type} appointment on {date} at {time}. {app_name} has you on the books. Reply STOP to opt out.",
      "context-first":
        "You just booked a {service_type} appointment. {app_name} confirms {date} at {time}. Reply STOP to opt out.",
    },
  },
  {
    name: "Appointment reminder",
    trigger: "Sent 24h before appointment",
    texts: {
      "brand-first":
        "{app_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply STOP to opt out.",
      "action-first":
        "Tomorrow at {time} — your {service_type} appointment with {app_name}. Reply STOP to opt out.",
      "context-first":
        "Your {service_type} appointment is coming up. {app_name} reminder: tomorrow at {time}. Reply STOP to opt out.",
    },
  },
  {
    name: "Cancellation notice",
    trigger: "Sent when appointment cancelled",
    texts: {
      "brand-first":
        "{app_name}: Your {service_type} appointment on {date} has been cancelled. To rebook, visit {website_url}. Reply STOP to opt out.",
      "action-first":
        "Cancelled — your {service_type} appointment on {date}. Rebook at {website_url}. {app_name}. Reply STOP to opt out.",
      "context-first":
        "Your {service_type} appointment on {date} won't be happening. {app_name}: rebook at {website_url}. Reply STOP to opt out.",
    },
  },
];

/** Swap variable placeholders for bold preview values, returning React nodes */
function interpolate(text: string): React.ReactNode[] {
  const replacements: Record<string, string> = {
    "{app_name}": "GlowStudio",
    "{service_type}": "haircut",
    "{date}": "Mar 20, 2026",
    "{time}": "2:30 PM",
    "{website_url}": "glowstudio.com",
  };

  const pattern = /\{app_name\}|\{service_type\}|\{date\}|\{time\}|\{website_url\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="font-medium text-text-brand-tertiary">
        {replacements[match[0]]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

const MARKETING_EXAMPLES = [
  {
    name: "Promotional offer",
    text: "{app_name}: Book your next {service_type} appointment this week and get 15% off! Visit {website_url}. Reply STOP to unsubscribe.",
  },
  {
    name: "Feedback request",
    text: "{app_name}: How was your {service_type} appointment? Rate your experience: {website_url}/review. Reply STOP to opt out.",
  },
];

const WHY_10DLC = [
  {
    question: "Why can\u2019t I just register myself?",
    answer:
      "You can \u2014 but most developers don\u2019t get it right the first time. Registration spans multiple systems, carrier reviewers reject vague or misformatted submissions, and each rejection costs money and weeks. RelayKit pre-formats everything carriers look for: business verification, campaign descriptions, sample messages, and a hosted compliance site. First-try approval is the goal.",
  },
  {
    question: "What happens after I\u2019m approved?",
    answer:
      "Your messages flow through RelayKit\u2019s compliance layer on every send \u2014 opt-out enforcement, content scanning, quiet hours, and drift detection that catches messages gradually moving outside your approved use case. Registration gets you in the door. The proxy keeps you there.",
  },
];

export default function CategoryLanding() {
  const { category } = useParams<{ category: string }>();
  const [activeStyle, setActiveStyle] = useState<StyleId>("brand-first");

  // For now, only appointments has real content. Others get a placeholder.
  const isAppointments = category === "appointments";

  if (!isAppointments) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <Calendar className="mx-auto size-10 text-fg-quaternary" />
        <h1 className="mt-4 text-2xl font-bold text-text-primary capitalize">{category}</h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Category landing page coming soon. Check out the{" "}
          <Link href="/sms/appointments" className="text-text-brand-secondary hover:underline">
            appointments example
          </Link>{" "}
          to see the full layout.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl overflow-x-hidden px-6 py-16">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-3 py-1 text-xs font-medium text-text-brand-secondary">
          <Calendar className="size-3.5" />
          {HERO.badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {HERO.headline}
        </h1>
        <p className="mt-4 text-base text-text-tertiary max-w-2xl mx-auto">
          {HERO.subheadline}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg border border-border-primary px-5 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            See all categories
          </Link>
          <Link
            href={`/sms/${category}/messages`}
            className="inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Browse messages
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Message style preview */}
      <div className="mt-16">
        {/* Style toggle pills */}
        <div className="flex items-center justify-center gap-2">
          {STYLE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStyle(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                activeStyle === tab.id
                  ? "bg-bg-brand-secondary text-text-brand-secondary"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PREVIEW_MESSAGES.map((msg) => (
            <div
              key={msg.name}
              className="rounded-xl border border-border-secondary p-5"
            >
              <h3 className="text-sm font-semibold text-text-primary">
                {msg.name}
              </h3>
              <p className="mt-1 text-xs text-text-tertiary">{msg.trigger}</p>
              <div className="mt-3 rounded-lg bg-bg-secondary p-3">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {interpolate(msg.texts[activeStyle])}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="mt-6 text-center">
          <Link
            href={`/sms/${category}/messages`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
          >
            See all appointment messages
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Pricing context line */}
      <p className="mt-12 text-center text-sm text-text-tertiary">
        Free sandbox. No credit card. $49 to register, $150 + $19/mo after approval.
      </p>

      {/* What you get — full-width gray band */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-12 w-screen bg-bg-secondary py-12">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-sm font-semibold text-text-brand-secondary">
            What you get
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold text-text-primary">
            Everything you need to start sending.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={i} className="rounded-xl border border-border-secondary bg-bg-primary p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                  <item.icon className="size-5 text-fg-brand-primary" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-text-tertiary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration scope — D-230, D-231 */}
      {(() => {
        const useCaseData = USE_CASES[category as UseCaseId];
        if (!useCaseData) return null;
        return (
          <div className="mt-16">
            {/* Section eyebrow + heading */}
            <p className="text-center text-sm font-semibold text-text-brand-secondary">
              Your registration
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold text-text-primary">
              What&apos;s included from day one.
            </h2>

            {/* Block 1: What your registration covers */}
            <div className="mt-10">
              <h3 className="text-base font-semibold text-text-primary">
                What your registration covers
              </h3>
              <p className="mt-1 max-w-[600px] text-sm text-text-tertiary">
                Your registration with carriers includes all of these message types from day one.
              </p>
              <ul className="mt-4 space-y-3">
                {useCaseData.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="size-4 shrink-0 text-fg-success-primary mt-0.5" />
                    <span className="text-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Block 2: Need marketing messages too? */}
            <div className="mt-10">
              <h3 className="text-base font-semibold text-text-primary">
                Need marketing messages too?
              </h3>
              <p className="mt-1 max-w-[600px] text-sm text-text-tertiary">
                Promos and offers are registered as a separate campaign. Get your first registration approved, then add marketing when you&apos;re ready.
              </p>
              <p className="mt-2 max-w-[600px] text-sm text-gray-500">
                Note: adding a marketing campaign requires an EIN. Sole proprietor registrations are limited to one campaign.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {MARKETING_EXAMPLES.map((msg) => (
                  <div
                    key={msg.name}
                    className="rounded-xl border border-border-secondary p-4"
                  >
                    <p className="text-xs font-medium text-text-tertiary">{msg.name}</p>
                    <div className="mt-2 rounded-lg bg-bg-secondary p-3">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {interpolate(msg.text)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Message preview teaser */}
      <div className="mt-20 rounded-xl border border-border-secondary bg-bg-secondary p-6 text-center">
        <p className="text-sm font-medium text-text-primary">
          Preview the full appointment message library
        </p>
        <p className="mt-1 text-sm text-text-tertiary">
          Booking confirmations, reminders, rescheduling links, cancellation notices — ready to copy and integrate.
        </p>
        <Link
          href={`/sms/${category}/messages`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          View messages
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Why 10DLC — compliance education */}
      <div className="mt-20">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">
          Why registration matters
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold text-text-primary">
          Carriers require it. We handle it.
        </h2>
        <div className="mt-8 space-y-4">
          {WHY_10DLC.map((item, i) => (
            <div key={i} className="rounded-xl border border-border-secondary p-5">
              <h3 className="text-sm font-semibold text-text-primary">{item.question}</h3>
              <p className="mt-2 max-w-[600px] text-sm text-text-tertiary">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 flex items-center justify-between rounded-xl border border-border-brand bg-bg-brand-primary p-6">
        <div>
          <p className="text-sm font-semibold text-text-primary">Ready to build?</p>
          <p className="mt-1 text-sm text-text-tertiary">
            Browse the message library, grab your SMS Blueprint, and start sending.
          </p>
        </div>
        <Link
          href={`/sms/${category}/messages`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Get started
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
