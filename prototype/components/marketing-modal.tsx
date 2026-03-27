"use client";

import { useState } from "react";
import Link from "next/link";
import { XClose } from "@untitledui/icons";

/* ── Marketing message previews (D-254) ── */

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

/* ── Step circle (matches home page pattern) ── */

function StepNumber({ num }: { num: number }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-brand-solid text-text-white text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

/* ── Modal ── */

interface MarketingModalProps {
  onClose: () => void;
  appId: string;
}

export default function MarketingModal({ onClose, appId }: MarketingModalProps) {
  const [marketingState, setMarketingState] = useState<"info" | "in_review" | "active">("info");

  /* ── Active state: brief confirmation ── */
  if (marketingState === "active") {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-end gap-4 p-4 bg-white border-b border-border-secondary">
          <select
            value={marketingState}
            onChange={(e) => setMarketingState(e.target.value as "info" | "in_review" | "active")}
            className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="info">Info</option>
            <option value="in_review">In review</option>
            <option value="active">Active</option>
          </select>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-bg-success-secondary mb-4">
            <svg className="size-7 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Marketing messages are live</h1>
          <p className="mt-2 text-sm text-text-tertiary">Your app can now send marketing messages to opted-in recipients.</p>
          <Link
            href={`/apps/${appId}/messages`}
            onClick={onClose}
            className="mt-4 inline-flex items-center text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            View your marketing messages &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Sticky header with switcher + close */}
      <div className="sticky top-0 z-10 flex items-center justify-end gap-4 p-4 bg-white border-b border-border-secondary">
        <select
          value={marketingState}
          onChange={(e) => setMarketingState(e.target.value as "info" | "in_review" | "active")}
          className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
        >
          <option value="info">Info</option>
          <option value="in_review">In review</option>
          <option value="active">Active</option>
        </select>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label="Close"
        >
          <XClose className="size-5" />
        </button>
      </div>

      {/* ── Section 1: Hero (gray band) ── */}
      <div className="bg-bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Send marketing messages from your app</h1>
          <p className="mt-3 text-base text-text-secondary">Add marketing alongside your appointment reminders.</p>

          {marketingState === "in_review" ? (
            <div className="mt-8 mx-auto max-w-sm text-left">
              <div className="rounded-xl border border-border-secondary bg-bg-primary p-6">
                <h3 className="text-base font-semibold text-text-primary">Marketing registration</h3>
                <div className="mt-2 mb-4">
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
            <div className="mt-6">
              <Link
                href="#"
                className="inline-flex items-center rounded-lg bg-bg-brand-solid px-6 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
              >
                Add marketing &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Pricing (white) ── */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-center gap-16">
          <div className="text-center">
            <p className="text-3xl font-semibold text-text-primary">$29</p>
            <p className="mt-1 text-sm text-text-tertiary">one-time registration</p>
            <p className="mt-0.5 text-xs text-text-tertiary">Your brand is already verified</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-text-primary">+$10/mo</p>
            <p className="mt-1 text-sm text-text-tertiary">250 marketing messages</p>
            <p className="mt-0.5 text-xs text-text-tertiary">Same overage rates if you need more</p>
          </div>
        </div>
      </div>

      {/* ── Section 3: Message previews (gray band) ── */}
      <div className="bg-bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm font-semibold text-text-brand-secondary uppercase tracking-wide">Messages you&rsquo;ll unlock</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {MARKETING_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl border border-border-secondary bg-bg-primary p-4"
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
      </div>

      {/* ── Section 4: How it works (white) ── */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <StepNumber num={1} />
            <p className="mt-3 text-sm font-semibold text-text-primary">We handle the carrier registration</p>
            <p className="mt-1 text-sm text-text-tertiary">Your brand is already verified. Usually takes a few days.</p>
          </div>
          <div>
            <StepNumber num={2} />
            <p className="mt-3 text-sm font-semibold text-text-primary">Your compliance site updates</p>
            <p className="mt-1 text-sm text-text-tertiary">Marketing consent form activates automatically.</p>
          </div>
          <div>
            <StepNumber num={3} />
            <p className="mt-3 text-sm font-semibold text-text-primary">Your files expand</p>
            <p className="mt-1 text-sm text-text-tertiary">Your AI tool reads the updated config and knows marketing is available.</p>
          </div>
        </div>
      </div>

      {/* ── Section 5: Consent (gray band) ── */}
      <div className="bg-bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="text-base font-semibold text-text-primary">How consent works</h2>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-text-secondary">Marketing messages require separate recipient consent &mdash; that&rsquo;s federal law.</p>
            <p className="text-sm text-text-secondary">RelayKit generates the consent language. Your app collects it through our consent API. We store it and enforce it at send time.</p>
            <p className="text-sm text-text-secondary">If a recipient hasn&rsquo;t opted in to marketing, we block the message before it reaches carriers.</p>
          </div>
        </div>
      </div>

      {/* ── Section 6: Bottom CTA (white) ── */}
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        {marketingState === "in_review" ? (
          <p className="text-sm text-text-tertiary">
            Your marketing registration is under review. We&rsquo;ll email you when it&rsquo;s approved.
          </p>
        ) : (
          <>
            <Link
              href="#"
              className="inline-flex items-center rounded-lg bg-bg-brand-solid px-6 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Add marketing &rarr;
            </Link>
            <p className="mt-3 text-sm text-text-tertiary">
              Questions? <a href="mailto:hello@relaykit.ai" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">hello@relaykit.ai</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
