"use client";

import { useState } from "react";
import Link from "next/link";
import { SAMPLE } from "./sample-data";

/* ── Shared primitives used across all three dashboard versions ── */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-md border border-border-secondary p-1.5 text-fg-quaternary hover:text-fg-quaternary_hover hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-xs ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-text-primary">{children}</h3>;
}

export function BlueprintHeroCard() {
  return (
    <Card className="border-border-brand bg-bg-brand-section_subtle">
      <CardTitle>Your {SAMPLE.businessName} SMS Blueprint is ready</CardTitle>
      <p className="mt-1 text-sm text-text-tertiary">
        Drop it in your project root and tell your AI coding tool:
      </p>
      <div className="mt-3 rounded-lg bg-bg-secondary px-4 py-3">
        <code className="text-sm font-mono text-text-primary">
          Read {SAMPLE.businessName.toLowerCase()}_sms_blueprint.md and build my messaging feature.
        </code>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">Works with</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-2">
            <p className="text-[11px] font-semibold text-text-primary">Claude Code</p>
            <p className="text-[10px] text-text-tertiary">Reads it automatically</p>
          </div>
          <div className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-2">
            <p className="text-[11px] font-semibold text-text-primary">Cursor</p>
            <p className="text-[10px] text-text-tertiary">Reference in chat</p>
          </div>
          <div className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-2">
            <p className="text-[11px] font-semibold text-text-primary">Windsurf</p>
            <p className="text-[10px] text-text-tertiary">Cascade picks it up</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SandboxApiKeyCard() {
  return (
    <Card>
      <CardTitle>Your sandbox API key</CardTitle>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
          {SAMPLE.sandboxApiKey}
        </code>
        <CopyButton text={SAMPLE.sandboxApiKey} />
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        Your AI coding tool will use this key automatically when it reads your SMS Blueprint. You can also find it in {SAMPLE.businessName.toLowerCase()}_sms_blueprint.md.
      </p>
    </Card>
  );
}

export function DualApiKeysCard() {
  return (
    <Card>
      <CardTitle>API keys</CardTitle>
      <div className="mt-3 space-y-3">
        <div>
          <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">Sandbox</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
              {SAMPLE.sandboxApiKey}
            </code>
            <CopyButton text={SAMPLE.sandboxApiKey} />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">Live</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
              {SAMPLE.liveApiKey}
            </code>
            <CopyButton text={SAMPLE.liveApiKey} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GoLiveCTA() {
  return (
    <Card className="border-border-brand bg-bg-brand-section_subtle">
      <CardTitle>Ready to go live?</CardTitle>
      <p className="mt-1 text-sm text-text-tertiary">
        When you&apos;re ready to send to real users, register for carrier approval. Your sandbox stays active throughout the 2–3 week review.
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear cursor-pointer"
        >
          Register — $199 setup + $19/mo
        </button>
      </div>
    </Card>
  );
}

export function CelebrationCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Card className="border-border-success bg-bg-success-primary">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-text-primary">You&apos;re live</h3>
            <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-xs font-medium text-text-success-primary">
              Approved
            </span>
            <span className="text-xs text-text-tertiary">{SAMPLE.approvalDate}</span>
          </div>
          <p className="mt-1 text-sm text-text-tertiary">
            Most developers never get here. You did.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 text-fg-quaternary hover:text-fg-quaternary_hover hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer -mt-1 -mr-1"
          aria-label="Dismiss"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Card>
  );
}

export function UsageStatsCard() {
  const bars = [
    { day: "Mon", height: 60 },
    { day: "Tue", height: 75 },
    { day: "Wed", height: 45 },
    { day: "Thu", height: 90 },
    { day: "Fri", height: 80 },
    { day: "Sat", height: 70 },
    { day: "Sun", height: 85 },
  ];

  return (
    <Card>
      <CardTitle>Usage — March 2026</CardTitle>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-text-primary">{SAMPLE.messagesThisMonth.toLocaleString()}</p>
          <p className="text-xs text-text-tertiary">Messages this month</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{SAMPLE.deliveryRate}%</p>
          <p className="text-xs text-text-tertiary">Delivery rate</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{SAMPLE.optOutRate}%</p>
          <p className="text-xs text-text-tertiary">Opt-out rate</p>
        </div>
      </div>
      <div className="mt-5 flex items-end gap-3 h-24">
        {bars.map((bar) => (
          <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-sm bg-bg-brand-solid" style={{ height: `${bar.height}%` }} />
            <span className="text-[10px] text-text-quaternary">{bar.day}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        {SAMPLE.messagesIncluded} included · $15 per 1,000 additional
      </p>
    </Card>
  );
}

export function CanonMessagesCard() {
  return (
    <Card>
      <CardTitle>Registered messages</CardTitle>
      <p className="mt-1 text-xs text-text-tertiary">
        Carrier-approved templates. These are the ground truth for compliance monitoring.
      </p>
      <div className="mt-3 space-y-2">
        {SAMPLE.canonMessages.map((msg, i) => (
          <div key={i} className="rounded-lg border border-border-secondary bg-bg-secondary px-3 py-2">
            <p className="text-xs font-medium text-text-primary">{msg.name}</p>
            <p className="mt-1 text-xs text-text-tertiary font-mono">{msg.template}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MessagesLink() {
  return (
    <Link href={`/c/${SAMPLE.categoryId}/messages`} className="block group">
      <Card className="transition duration-100 ease-linear group-hover:border-border-brand">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary group-hover:text-text-brand-secondary transition duration-100 ease-linear">
            Open full message catalog
          </p>
          <svg className="size-4 text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
