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
  Code01,
  CheckCircle,
  FileCheck02,
  Zap,
} from "@untitledui/icons";

const CATEGORIES = [
  { id: "verification", label: "Verification codes", icon: Shield01, description: "OTP, 2FA, login codes" },
  { id: "appointments", label: "Appointments", icon: Calendar, description: "Confirmations, reminders, rescheduling" },
  { id: "orders", label: "Order updates", icon: Package, description: "Shipping, delivery, returns" },
  { id: "support", label: "Customer support", icon: MessageChatCircle, description: "Ticket updates, follow-ups" },
  { id: "marketing", label: "Marketing", icon: Announcement02, description: "Promos, campaigns, re-engagement" },
  { id: "internal", label: "Team alerts", icon: Users01, description: "Internal notifications, ops alerts" },
  { id: "community", label: "Community", icon: Globe01, description: "Group updates, event reminders" },
  { id: "waitlist", label: "Waitlist", icon: ClipboardCheck, description: "Reservations, queue updates" },
];

const STEPS = [
  {
    icon: Code01,
    title: "Pick your category",
    description: "Choose what kind of messages your app sends. We'll show you the full message library.",
  },
  {
    icon: FileCheck02,
    title: "Get your SMS Blueprint",
    description: "A complete integration guide with your messages, API key, and setup instructions — ready for your AI coding tool.",
  },
  {
    icon: Zap,
    title: "Build and ship",
    description: "Drop the Blueprint into Claude Code or Cursor. Your messaging feature may just work on the first try.",
  },
  {
    icon: CheckCircle,
    title: "Go live when you're ready",
    description: "We handle carrier registration, compliance monitoring, and everything that makes SMS actually work at scale.",
  },
];

export default function MarketingHome() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Tell your AI coding tool to build<br />
          your messaging feature.
        </h1>
        <p className="mt-4 text-lg text-text-tertiary max-w-2xl mx-auto">
          It might just work on the first try. RelayKit gives you the SMS Blueprint,
          pre-written messages, and registered infrastructure so your app can send
          texts without the compliance maze.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/sms/appointments"
            className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            See how it works
          </Link>
          <Link
            href="/choose"
            className="rounded-lg border border-border-primary px-5 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            Browse categories
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-24">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-text-brand-secondary">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={i} className="rounded-xl border border-border-secondary p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                <step.icon className="size-5 text-fg-brand-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-text-tertiary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="mt-24">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-text-brand-secondary">
          What does your app send?
        </h2>
        <p className="mt-2 text-center text-sm text-text-tertiary">
          Each category comes with pre-written messages, compliance artifacts, and a ready-to-use Blueprint.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/sms/${cat.id}`}
              className="group flex items-start gap-3 rounded-xl border border-border-secondary p-4 transition duration-100 ease-linear hover:border-border-brand hover:bg-bg-brand-primary"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-secondary group-hover:bg-bg-brand-secondary">
                <cat.icon className="size-4 text-fg-secondary group-hover:text-fg-brand-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{cat.label}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-24 rounded-2xl bg-bg-brand-section p-10 text-center">
        <h2 className="text-2xl font-bold text-text-primary_on-brand">
          $199 setup · $19/month
        </h2>
        <p className="mt-2 text-sm text-text-secondary_on-brand">
          Registered brand, approved campaign, compliance monitoring, and a sandbox you can start building in today.
        </p>
        <Link
          href="/sms/appointments"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-bg-primary px-5 py-2.5 text-sm font-semibold text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
        >
          Get started
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
