"use client";

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

/* ── Appointments-specific content (stub 1 category as the primary example) ── */

const HERO = {
  badge: "Appointments",
  headline: "Your customers already expect appointment texts.",
  subheadline:
    "Confirmations, reminders, rescheduling, cancellations — these are the messages people actually want. RelayKit gives you the full message library, pre-registered and ready to send.",
};

const WHAT_YOU_GET = [
  {
    icon: MessageSmileSquare,
    title: "Pre-written message library",
    description:
      "Booking confirmations, 24-hour reminders, rescheduling links, cancellation notices, no-show follow-ups — all carrier-approved templates.",
  },
  {
    icon: FileCheck02,
    title: "SMS Blueprint for your AI tool",
    description:
      "A complete integration guide with your API key, messages, and setup instructions. Drop it into Claude Code or Cursor and start building.",
  },
  {
    icon: Shield01,
    title: "Carrier registration handled",
    description:
      "10DLC brand verification, campaign registration, compliance site — we handle the infrastructure so carriers trust your traffic.",
  },
  {
    icon: Monitor01,
    title: "Compliance monitoring",
    description:
      "Every message is scanned before it reaches the carrier. Drift detection, consent enforcement, and automatic blocking keep your account protected.",
  },
];

const WHY_10DLC = [
  {
    question: "What is 10DLC?",
    answer:
      "10DLC (10-Digit Long Code) is the carrier-mandated registration system for business SMS. Without it, your messages get filtered, throttled, or blocked entirely.",
  },
  {
    question: "Why can't I just send texts from Twilio?",
    answer:
      "You can — but unregistered traffic gets heavily filtered. Carriers treat unregistered numbers as potential spam. Registration is what makes your traffic trusted.",
  },
  {
    question: "What does RelayKit handle?",
    answer:
      "Brand verification with The Campaign Registry, campaign registration with carriers, compliance site hosting, ongoing compliance monitoring, and the proxy that enforces rules on every message.",
  },
];

export default function CategoryLanding() {
  const { category } = useParams<{ category: string }>();

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
    <div className="mx-auto max-w-4xl px-6 py-16">
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
            href={`/sms/${category}/messages`}
            className="inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Browse messages
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/choose"
            className="rounded-lg border border-border-primary px-5 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            See all categories
          </Link>
        </div>
      </div>

      {/* What you get */}
      <div className="mt-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-text-brand-secondary">
          What you get
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {WHAT_YOU_GET.map((item, i) => (
            <div key={i} className="rounded-xl border border-border-secondary p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                <item.icon className="size-5 text-fg-brand-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-1 text-sm text-text-tertiary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

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
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-text-brand-secondary">
          Why registration matters
        </h2>
        <div className="mt-8 space-y-4">
          {WHY_10DLC.map((item, i) => (
            <div key={i} className="rounded-xl border border-border-secondary p-5">
              <h3 className="text-sm font-semibold text-text-primary">{item.question}</h3>
              <p className="mt-2 text-sm text-text-tertiary">{item.answer}</p>
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
