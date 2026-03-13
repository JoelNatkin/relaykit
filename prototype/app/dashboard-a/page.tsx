"use client";

import { useState } from "react";
import Link from "next/link";
import { StateToggle, type DashboardState } from "@/components/dashboard/state-toggle";
import { SAMPLE } from "@/components/dashboard/sample-data";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
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

function Annotation({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-text-quaternary italic mt-2">{children}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-xs ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-text-primary">{children}</h3>;
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear cursor-pointer"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border-secondary bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
    >
      {children}
    </button>
  );
}

function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PRE-REG sections
// ---------------------------------------------------------------------------

function PreRegWelcome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Your appointment reminder templates are ready
      </h1>
      <p className="mt-1 text-sm text-text-tertiary">
        Browse your message library, then verify your phone to start sending test messages.
      </p>
    </div>
  );
}

function MessagesLinkCard() {
  return (
    <div>
      <Link href="/c/appointments/messages" className="block group">
        <Card className="transition duration-100 ease-linear group-hover:border-border-brand">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-bg-brand-secondary text-fg-brand-primary">
              <MessageIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary group-hover:text-text-brand-secondary transition duration-100 ease-linear">
                View your message library
              </p>
              <p className="text-xs text-text-tertiary">
                6 templates for appointment reminders
              </p>
            </div>
            <span className="text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear">
              <ArrowRightIcon />
            </span>
          </div>
        </Card>
      </Link>
    </div>
  );
}

function GetStartedNudge() {
  return (
    <div>
      <Card>
        <CardTitle>Get started</CardTitle>
        <p className="mt-1 text-sm text-text-tertiary">
          Verify your phone number to unlock sandbox testing.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="flex-1 rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-border-brand"
          />
          <PrimaryButton>Verify</PrimaryButton>
        </div>
      </Card>
      <Annotation>
        Pre-reg is thin by design. The developer just chose their use case — now they see their
        messages are ready and have one clear next step.
      </Annotation>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SANDBOX sections
// ---------------------------------------------------------------------------

function SandboxWelcome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Your sandbox is ready
      </h1>
      <p className="mt-1 text-sm text-text-tertiary">
        Download your build spec and start sending test messages.
      </p>
    </div>
  );
}

function PhoneVerifiedBadge() {
  return (
    <div>
      <Card>
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-bg-success-solid text-fg-white">
            <CheckIcon className="size-3" />
          </span>
          <span className="text-sm text-text-primary font-medium">{SAMPLE.phone}</span>
          <span className="text-xs text-text-success-primary font-medium">Verified</span>
        </div>
      </Card>
    </div>
  );
}

function BuildSpecCard() {
  return (
    <div>
      <Card className="border-border-brand bg-bg-brand-section_subtle">
        <CardTitle>Your build spec is ready</CardTitle>
        <p className="mt-1 text-sm text-text-tertiary">
          Drop SMS_BUILD_SPEC.md in your project root and tell your AI coding assistant:
        </p>
        <div className="mt-3 rounded-lg bg-bg-secondary px-4 py-3">
          <code className="text-sm font-mono text-text-primary">
            Read SMS_BUILD_SPEC.md and build my messaging feature.
          </code>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <PrimaryButton>
            <span className="flex items-center gap-2">
              <DownloadIcon />
              Download SMS_BUILD_SPEC.md
            </span>
          </PrimaryButton>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          Works with Claude Code, Cursor, Windsurf, and any AI coding tool.
        </p>
      </Card>
      <Annotation>
        This is the key product moment. The build spec bridges &ldquo;I set up my messages&rdquo; and
        &ldquo;my app sends texts.&rdquo; It&apos;s designed to be good enough that even experienced
        devs prefer it over manual integration.
      </Annotation>
    </div>
  );
}

function SandboxApiKeyCard() {
  return (
    <div>
      <Card>
        <CardTitle>Your sandbox API key</CardTitle>
        <div className="mt-3 flex items-center gap-2">
          <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
            {SAMPLE.sandboxApiKey}
          </code>
          <CopyButton text={SAMPLE.sandboxApiKey} />
        </div>
        <p className="mt-3 text-sm text-text-tertiary">
          Your AI coding tool will use this key automatically when it reads your build spec. You can
          also find it in SMS_BUILD_SPEC.md.
        </p>
      </Card>
      <Annotation>
        No raw SDK commands. The build spec teaches the AI tool how to integrate.
      </Annotation>
    </div>
  );
}

function GettingStartedCard() {
  return (
    <div>
      <Card>
        <CardTitle>Start building</CardTitle>
        <ol className="mt-3 space-y-2.5">
          <li className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border-secondary bg-bg-primary text-xs font-medium text-text-quaternary mt-0.5">
              1
            </span>
            <p className="text-sm text-text-primary">
              Download your build spec
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border-secondary bg-bg-primary text-xs font-medium text-text-quaternary mt-0.5">
              2
            </span>
            <p className="text-sm text-text-primary">
              Drop it in your project root
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border-secondary bg-bg-primary text-xs font-medium text-text-quaternary mt-0.5">
              3
            </span>
            <p className="text-sm text-text-primary">
              Tell your AI: &ldquo;Read SMS_BUILD_SPEC.md and send a test message&rdquo;
            </p>
          </li>
        </ol>
        <p className="mt-4 text-xs text-text-tertiary">
          Works with Claude Code, Cursor, Windsurf, Copilot, and any AI coding assistant.
        </p>
      </Card>
      <Annotation>
        Designed for vibe coders. No npm commands, no SDK imports. The build spec handles integration
        instructions.
      </Annotation>
    </div>
  );
}

function SandboxMessagesLink() {
  return (
    <Link href="/c/appointments/messages" className="block group">
      <Card className="transition duration-100 ease-linear group-hover:border-border-brand">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary group-hover:text-text-brand-secondary transition duration-100 ease-linear">
            View your message library
          </p>
          <span className="text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear">
            <ArrowRightIcon />
          </span>
        </div>
      </Card>
    </Link>
  );
}

function ComplianceSiteLink() {
  return (
    <div>
      <Card>
        <CardTitle>Compliance site</CardTitle>
        <div className="mt-3 flex items-center gap-2">
          <a
            href={SAMPLE.complianceSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
          >
            {SAMPLE.complianceSiteUrl}
            <ExternalLinkIcon />
          </a>
        </div>
      </Card>
    </div>
  );
}

function GoLiveCTA() {
  return (
    <div>
      <Card className="border-border-brand bg-bg-brand-section_subtle">
        <CardTitle>Ready to go live?</CardTitle>
        <p className="mt-1 text-sm text-text-tertiary">
          When you&apos;re ready to send to real users, register for carrier approval. Your sandbox
          stays active throughout the 2–3 week review.
        </p>
        <div className="mt-4">
          <PrimaryButton>Register — $199 setup + $19/mo</PrimaryButton>
        </div>
      </Card>
      <Annotation>
        The big moment. This triggers Stripe checkout, then carrier registration.
      </Annotation>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LIVE sections
// ---------------------------------------------------------------------------

function LiveWelcome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        {SAMPLE.businessName}
      </h1>
      <p className="mt-1 text-sm text-text-tertiary">
        Appointment reminders — live and sending.
      </p>
    </div>
  );
}

function CelebrationCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div>
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
      <Annotation>
        Merged approval banner + celebration into one dismissible moment.
      </Annotation>
    </div>
  );
}

function UsageStatsCard() {
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
    <div>
      <Card>
        <CardTitle>Usage — March 2026</CardTitle>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {SAMPLE.messagesThisMonth.toLocaleString()}
            </p>
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
        {/* Simple bar chart mockup */}
        <div className="mt-5 flex items-end gap-3 h-24">
          {bars.map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-bg-brand-solid"
                style={{ height: `${bar.height}%` }}
              />
              <span className="text-[10px] text-text-quaternary">{bar.day}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          {SAMPLE.messagesIncluded} included · $15 per 1,000 additional
        </p>
      </Card>
      <Annotation>
        Stats with temporal context. Bar chart shows volume patterns.
      </Annotation>
    </div>
  );
}

function DualApiKeysCard() {
  return (
    <div>
      <Card>
        <CardTitle>API keys</CardTitle>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
              Sandbox
            </p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                {SAMPLE.sandboxApiKey}
              </code>
              <CopyButton text={SAMPLE.sandboxApiKey} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                Live
              </p>
              <span className="inline-flex items-center rounded-full bg-bg-warning-primary px-2 py-0.5 text-xs font-medium text-text-warning-primary">
                Shown once
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                {SAMPLE.liveApiKey}
              </code>
              <CopyButton text={SAMPLE.liveApiKey} />
            </div>
          </div>
        </div>
      </Card>
      <Annotation>
        Production keys are SHA-256 hashed — can&apos;t be retrieved after initial display.
      </Annotation>
    </div>
  );
}

function ComplianceMonitoringCard() {
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Compliance monitoring</CardTitle>
          <span className="inline-flex items-center rounded-full bg-bg-success-primary px-2 py-0.5 text-xs font-medium text-text-success-primary">
            Healthy
          </span>
        </div>
        <p className="mt-2 text-sm text-text-tertiary">
          No drift detected. Last checked 2 hours ago.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <a
            href={SAMPLE.complianceSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
          >
            {SAMPLE.complianceSiteUrl}
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border-tertiary pt-4">
          <p className="text-sm text-text-tertiary">Text me about compliance issues</p>
          <button
            type="button"
            role="switch"
            aria-checked={notifyEnabled}
            onClick={() => setNotifyEnabled(!notifyEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-100 ease-linear ${
              notifyEnabled ? "bg-bg-brand-solid" : "bg-bg-tertiary"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-bg-primary shadow-xs ring-0 transition duration-100 ease-linear ${
                notifyEnabled ? "translate-x-[22px]" : "translate-x-[2px]"
              } mt-[2px]`}
            />
          </button>
        </div>
      </Card>
      <Annotation>
        Compliance in live state is monitoring only — health, drift, alerts. Message content lives on
        the Messages page.
      </Annotation>
    </div>
  );
}

function LiveMessagesLink() {
  return (
    <Link href="/c/appointments/messages" className="block group">
      <Card className="transition duration-100 ease-linear group-hover:border-border-brand">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary group-hover:text-text-brand-secondary transition duration-100 ease-linear">
            View your message library
          </p>
          <span className="text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear">
            <ArrowRightIcon />
          </span>
        </div>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardAPage() {
  const [state, setState] = useState<DashboardState>("pre-reg");
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  const isSandbox = state === "sandbox";
  const isLive = state === "live";

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Version description strip */}
      <div className="border-b border-border-secondary bg-bg-primary px-6 py-3">
        <p className="mx-auto max-w-[720px] text-xs text-text-tertiary">
          Version A — Progressive single page. Pre-reg is thin (category already chosen). Sandbox
          centers the build spec as the hero affordance. Live merges celebration + status into one
          dismissible card.
        </p>
      </div>

      <div className="mx-auto max-w-[720px] px-6 py-8">
        {/* State toggle */}
        <div className="mb-8">
          <StateToggle state={state} onChange={setState} />
        </div>

        <div className="space-y-6">
          {/* ============================================================= */}
          {/* PRE-REG STATE                                                  */}
          {/* ============================================================= */}
          {state === "pre-reg" && (
            <>
              <PreRegWelcome />
              <MessagesLinkCard />
              <GetStartedNudge />
            </>
          )}

          {/* ============================================================= */}
          {/* SANDBOX STATE                                                  */}
          {/* ============================================================= */}
          {isSandbox && (
            <>
              <SandboxWelcome />
              <BuildSpecCard />
              <PhoneVerifiedBadge />
              <SandboxApiKeyCard />
              <GettingStartedCard />
              <SandboxMessagesLink />
              <ComplianceSiteLink />
              <GoLiveCTA />
            </>
          )}

          {/* ============================================================= */}
          {/* LIVE STATE                                                     */}
          {/* ============================================================= */}
          {isLive && (
            <>
              <LiveWelcome />
              {!celebrationDismissed && (
                <CelebrationCard onDismiss={() => setCelebrationDismissed(true)} />
              )}
              <UsageStatsCard />
              <DualApiKeysCard />
              <ComplianceMonitoringCard />
              <LiveMessagesLink />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
