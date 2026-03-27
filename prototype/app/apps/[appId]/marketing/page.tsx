"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/context/session-context";

/* ── Marketing message previews (D-254: descriptive names, never "promotional") ── */

const MARKETING_MESSAGES = [
  {
    id: "discount",
    name: "Discount offer",
    body: "GlowStudio: Happy holidays! Enjoy 20% off your next Salon visit. Book at glowstudio.com. Reply STOP to opt out.",
  },
  {
    id: "birthday",
    name: "Birthday message",
    body: "GlowStudio: Happy birthday! Here\u2019s a special treat \u2014 15% off your next appointment. Book at glowstudio.com. Reply STOP to unsubscribe.",
  },
  {
    id: "reengagement",
    name: "Re-engagement",
    body: "GlowStudio: We miss you! It\u2019s been a while since your last visit. Book your next Salon appointment at glowstudio.com. Reply STOP to opt out.",
  },
  {
    id: "review",
    name: "Review request",
    body: "GlowStudio: Thanks for your visit today! We\u2019d love your feedback: glowstudio.com/review. Reply STOP to opt out.",
  },
];

/* ── Registration stepper for "In review" state ── */

interface ReviewStep {
  label: string;
  detail: string | null;
  status: "completed" | "active" | "upcoming";
}

const REVIEW_STEPS: ReviewStep[] = [
  { label: "Registration submitted", detail: "Mar 27", status: "completed" },
  { label: "Registration fee paid", detail: "$29", status: "completed" },
  { label: "Under carrier review", detail: "Usually approved in a few days", status: "active" },
  { label: "Approved", detail: null, status: "upcoming" },
];

function ReviewStepper({ steps }: { steps: ReviewStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            {step.status === "completed" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-success-secondary shrink-0">
                <svg className="size-3.5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : step.status === "active" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-brand-secondary shrink-0">
                <div className="w-2 h-2 rounded-full bg-fg-brand-primary" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-border-secondary shrink-0" />
            )}
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 min-h-[16px] ${step.status === "completed" ? "bg-fg-success-secondary" : "bg-border-secondary"}`} />
            )}
          </div>
          <div className="pb-4">
            <span className={`text-sm font-medium leading-6 ${
              step.status === "completed" ? "text-text-tertiary" :
              step.status === "active" ? "text-text-primary" :
              "text-text-quaternary"
            }`}>
              {step.label}
            </span>
            {step.detail && (
              <p className={`mt-0.5 text-sm leading-relaxed ${step.status === "active" ? "text-text-secondary" : "text-text-tertiary"}`}>
                {step.detail}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */

export default function MarketingPage() {
  const { appId } = useParams<{ appId: string }>();
  const { state: sessionState } = useSession();

  // D-247: Hide entire route for non-EIN users
  if (!sessionState.hasEIN) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-text-tertiary">Marketing messages are available for EIN-registered businesses.</p>
        <Link
          href={`/apps/${appId}/overview`}
          className="mt-3 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
        >
          Back to Overview
        </Link>
      </div>
    );
  }

  const [marketingState, setMarketingState] = useState<"info" | "in_review" | "active">("info");

  /* ── Active state: brief confirmation ── */
  if (marketingState === "active") {
    return (
      <div>
        {/* State switcher */}
        <div className="flex justify-end mb-4">
          <select
            value={marketingState}
            onChange={(e) => setMarketingState(e.target.value as "info" | "in_review" | "active")}
            className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="info">Info</option>
            <option value="in_review">In review</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="py-16 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-bg-success-secondary mb-4">
            <svg className="size-7 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Marketing messages are live</h1>
          <p className="mt-2 text-sm text-text-tertiary">Your app can now send marketing messages to opted-in recipients.</p>
          <Link
            href={`/apps/${appId}/messages`}
            className="mt-4 inline-flex items-center text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            View your marketing messages &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* State switcher */}
      <div className="flex justify-end mb-4">
        <select
          value={marketingState}
          onChange={(e) => setMarketingState(e.target.value as "info" | "in_review" | "active")}
          className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
        >
          <option value="info">Info</option>
          <option value="in_review">In review</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* Breadcrumb */}
      <p className="text-sm text-text-tertiary">
        <Link href={`/apps/${appId}/overview`} className="hover:text-text-secondary transition duration-100 ease-linear">GlowStudio</Link>
        {" / "}
        <span>Add marketing messages</span>
      </p>

      {/* Header */}
      <h1 className="mt-4 text-2xl font-semibold text-text-primary">Send marketing messages from your app</h1>
      <p className="mt-2 text-base text-text-secondary">Add marketing alongside your appointment reminders.</p>

      {/* ── Section 1: Message previews ── */}
      <div className="mt-10">
        <h2 className="text-base font-semibold text-text-primary">Messages you can send</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {MARKETING_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-border-secondary bg-bg-primary p-4 opacity-90"
            >
              <span className="text-sm font-medium text-text-primary">{msg.name}</span>
              <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
                {msg.body.split(/(GlowStudio|Salon|glowstudio\.com(?:\/review)?)/g).map((part, i) =>
                  /^(GlowStudio|Salon|glowstudio\.com(?:\/review)?)$/.test(part)
                    ? <span key={i} className="font-semibold text-text-secondary">{part}</span>
                    : part
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: How it works ── */}
      <div className="mt-10">
        <h2 className="text-base font-semibold text-text-primary">How it works</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-brand-secondary mb-3">
              <svg className="size-5 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">We handle the carrier registration</p>
            <p className="mt-1 text-sm text-text-tertiary">Your brand is already verified, so this usually takes a few days.</p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-brand-secondary mb-3">
              <svg className="size-5 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">Your compliance site updates</p>
            <p className="mt-1 text-sm text-text-tertiary">Marketing consent form activates automatically.</p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-brand-secondary mb-3">
              <svg className="size-5 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">Your files expand</p>
            <p className="mt-1 text-sm text-text-tertiary">Your AI tool reads the updated config and knows marketing is available.</p>
          </div>
        </div>
      </div>

      {/* ── Section 3: Consent ── */}
      <div className="mt-10">
        <h2 className="text-base font-semibold text-text-primary">How consent works</h2>
        <div className="mt-3 space-y-2">
          <p className="text-sm text-text-secondary">Marketing messages require separate recipient consent &mdash; that&rsquo;s federal law.</p>
          <p className="text-sm text-text-secondary">RelayKit generates the consent language. Your app collects it through our consent API. We store it and enforce it at send time.</p>
          <p className="text-sm text-text-secondary">If a recipient hasn&rsquo;t opted in to marketing, we block the message before it reaches carriers.</p>
        </div>
      </div>

      {/* ── Section 4: Pricing ── */}
      <div className="mt-10">
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <p className="text-2xl font-semibold text-text-primary">$29</p>
              <p className="mt-1 text-sm text-text-secondary">One-time registration fee. Your brand is already verified.</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-semibold text-text-primary">+$10/mo</p>
              <p className="mt-1 text-sm text-text-secondary">250 marketing messages. Separate from your transactional messages.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-text-tertiary">Same overage rates if you need more.</p>
        </div>
      </div>

      {/* ── CTA ── */}
      {marketingState === "in_review" ? (
        <div className="mt-10">
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-6">
            <h3 className="text-base font-semibold text-text-primary">Marketing registration</h3>
            <div className="mt-1 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
                Under review
              </span>
            </div>
            <ReviewStepper steps={REVIEW_STEPS} />
            <p className="mt-2 text-sm text-text-tertiary">
              Questions? <a href="mailto:hello@relaykit.ai" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">hello@relaykit.ai</a>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-10 mb-4">
          <Link
            href="#"
            className="inline-flex items-center rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Add marketing &rarr;
          </Link>
          <p className="mt-3 text-sm text-text-tertiary">
            Questions? <a href="mailto:hello@relaykit.ai" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">hello@relaykit.ai</a>
          </p>
        </div>
      )}
    </div>
  );
}
