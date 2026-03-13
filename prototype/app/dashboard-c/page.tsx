"use client";

import { useState } from "react";
import Link from "next/link";
import { StateToggle, type DashboardState } from "@/components/dashboard/state-toggle";
import { SAMPLE } from "@/components/dashboard/sample-data";

/* ── Reusable helpers ─────────────────────────────────────────────── */

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

/* ── Status dot ───────────────────────────────────────────────────── */

type DotColor = "green" | "gray" | "brand";

function StatusDot({ color }: { color: DotColor }) {
  const cls =
    color === "green"
      ? "bg-fg-success-secondary"
      : color === "brand"
        ? "bg-fg-brand-primary"
        : "bg-fg-quaternary";
  return <span className={`w-2 h-2 rounded-full inline-block ${cls}`} />;
}

/* ── Card chrome ──────────────────────────────────────────────────── */

type CardVariant = "default" | "prominent" | "completed" | "dim";

function Card({
  children,
  variant = "default",
  wide = false,
  dot,
  className = "",
}: {
  children: React.ReactNode;
  variant?: CardVariant;
  wide?: boolean;
  dot?: DotColor;
  className?: string;
}) {
  const base = {
    default: "rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-xs",
    prominent:
      "rounded-xl border-2 border-border-brand bg-bg-brand-primary p-5 shadow-xs",
    completed:
      "rounded-xl border border-border-secondary border-l-4 border-l-fg-success-secondary bg-bg-primary p-5 shadow-xs",
    dim: "rounded-xl border border-border-tertiary bg-bg-secondary p-5 opacity-60",
  }[variant];

  return (
    <div className={`${base} ${wide ? "md:col-span-2" : ""} relative ${className}`}>
      {dot && (
        <span className="absolute top-4 right-4">
          <StatusDot color={dot} />
        </span>
      )}
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-text-primary">{children}</h3>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-text-tertiary mt-2">{children}</div>;
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-bg-brand-solid px-3.5 py-2 text-sm font-semibold text-text-white shadow-xs hover:bg-bg-brand-solid_hover transition duration-100 ease-linear cursor-pointer"
    >
      {children}
    </button>
  );
}

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
    >
      {children}
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function GreenCheck() {
  return (
    <svg className="size-4 text-fg-success-primary inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "green" | "brand" | "gray" }) {
  const cls =
    color === "green"
      ? "bg-bg-success-secondary text-text-success-primary"
      : color === "brand"
        ? "bg-bg-brand-secondary text-text-brand-secondary"
        : "bg-bg-secondary text-text-tertiary";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

/* ── Inline code block ────────────────────────────────────────────── */

function CodeBlock({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 rounded-lg bg-bg-secondary px-3 py-2 font-mono text-xs text-text-secondary overflow-x-auto">
      <span className="flex-1 truncate">{text}</span>
      <CopyButton text={text} />
    </div>
  );
}

/* ── State annotations ────────────────────────────────────────────── */

const STATE_ANNOTATIONS: Record<DashboardState, string> = {
  "pre-reg": "2 cards. Messages are ready to browse. One action to unlock sandbox.",
  sandbox: "6 cards. Build spec is the hero. No raw code, no npm commands \u2014 designed for vibe coders.",
  live: "7 cards. All systems green. No duplicate message content \u2014 everything links to the message library.",
};

/* ── Card implementations per state ───────────────────────────────── */

/* --- Pre-reg: Welcome + Messages (wide) --- */

function WelcomeMessagesCard() {
  return (
    <Card variant="default" wide dot="brand">
      <CardTitle>Welcome + Messages</CardTitle>
      <CardBody>
        Your appointment reminder templates are ready. Browse your message library and see what
        we&rsquo;ve built for you.
      </CardBody>
      <div className="mt-2 text-xs text-text-quaternary">6 templates</div>
      <CardLink href="/c/appointments/messages">View message library</CardLink>
    </Card>
  );
}

/* --- Pre-reg: Get Started --- */

function GetStartedCard() {
  return (
    <Card variant="default" dot="brand">
      <CardTitle>Get started</CardTitle>
      <CardBody>
        Verify your phone number to unlock sandbox testing. You&rsquo;ll get a sandbox API key
        and build spec for your AI coding tool.
      </CardBody>
      <PrimaryButton>Verify phone &rarr;</PrimaryButton>
    </Card>
  );
}

/* --- Sandbox: Build Spec (wide, prominent — THE HERO) --- */

function BuildSpecHeroCard() {
  return (
    <Card variant="prominent" wide dot="brand">
      <CardTitle>Your build spec is ready</CardTitle>
      <CardBody>
        <p>
          Drop <span className="font-mono font-medium text-text-secondary">SMS_BUILD_SPEC.md</span>{" "}
          in your project root and tell your AI coding assistant:
        </p>
        <div className="mt-3 rounded-lg bg-bg-secondary border border-border-secondary px-4 py-3 font-mono text-sm text-text-primary">
          Read SMS_BUILD_SPEC.md and build my messaging feature.
        </div>
        <PrimaryButton>Download SMS_BUILD_SPEC.md</PrimaryButton>
        <p className="mt-3 text-xs text-text-quaternary">
          Works with Claude Code, Cursor, Windsurf, and any AI coding tool.
        </p>
      </CardBody>
    </Card>
  );
}

/* --- Sandbox: Phone verified (completed) --- */

function PhoneVerifiedCard() {
  return (
    <Card variant="completed" dot="green">
      <CardTitle>Phone verified</CardTitle>
      <CardBody>
        <div className="flex items-center gap-1.5">
          <GreenCheck />
          <span className="font-mono text-xs text-text-secondary">{SAMPLE.phone}</span>
        </div>
      </CardBody>
    </Card>
  );
}

/* --- Sandbox: Sandbox API key --- */

function SandboxApiKeyCard() {
  return (
    <Card variant="default" dot="green">
      <CardTitle>Sandbox API key</CardTitle>
      <CodeBlock text={SAMPLE.sandboxApiKey} />
      <CardBody>
        Your AI coding tool will use this key automatically when it reads your build spec.
      </CardBody>
    </Card>
  );
}

/* --- Sandbox/Live: Messages (standard) --- */

function MessagesCard() {
  return (
    <Card variant="default" dot="green">
      <CardTitle>Message library</CardTitle>
      <CardBody>6 templates for appointment reminders</CardBody>
      <CardLink href="/c/appointments/messages">View library</CardLink>
    </Card>
  );
}

/* --- Sandbox: Getting started --- */

function GettingStartedCard() {
  return (
    <Card variant="default" dot="brand">
      <CardTitle>Getting started</CardTitle>
      <CardBody>
        <ol className="space-y-1.5 list-decimal list-inside">
          <li>Download your build spec</li>
          <li>Drop it in your project root</li>
          <li>Tell your AI coding tool to read it and build</li>
        </ol>
        <p className="mt-3 text-xs text-text-quaternary">
          Works with Claude Code, Cursor, Windsurf, Copilot.
        </p>
      </CardBody>
    </Card>
  );
}

/* --- Sandbox: Go Live (wide, prominent) --- */

function GoLiveCard() {
  return (
    <Card variant="prominent" wide dot="brand">
      <CardTitle>When you&rsquo;re ready to send to real users</CardTitle>
      <CardBody>
        Register for carrier approval. Your sandbox stays active throughout the 2&ndash;3 week review.
      </CardBody>
      <PrimaryButton>Register &mdash; $199 setup + $19/mo</PrimaryButton>
    </Card>
  );
}

/* --- Live: Celebration + Status (wide, completed, dismissible) --- */

function CelebrationCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card variant="completed" wide dot="green">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle>You&rsquo;re live</CardTitle>
            <Badge color="green">Approved</Badge>
          </div>
          <p className="mt-1 text-xs text-text-quaternary">Approved {SAMPLE.approvedDate ?? "March 1, 2026"}</p>
          <p className="mt-2 text-sm text-text-tertiary">Most developers never get here. You did.</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-fg-quaternary hover:text-fg-quaternary_hover transition duration-100 ease-linear cursor-pointer p-1"
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

/* --- Live: Usage --- */

function UsageCard() {
  const barHeights = [60, 75, 45, 90, 80, 70, 85];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card variant="default" dot="green">
      <CardTitle>Messages this month</CardTitle>
      <CardBody>
        <p className="text-2xl font-semibold text-text-primary">{SAMPLE.messagesThisMonth.toLocaleString()}</p>
        <div className="mt-3 flex items-end gap-1.5 h-16">
          {barHeights.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-bg-brand-solid"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-1">
          {days.map((d) => (
            <span key={d} className="flex-1 text-center text-[10px] text-text-quaternary">{d}</span>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-quaternary">
          {SAMPLE.messagesIncluded} included &middot; $15 per 1,000 additional
        </p>
        <div className="mt-2 flex gap-4 text-sm">
          <div>
            <span className="text-text-quaternary">Delivery</span>
            <span className="ml-1.5 font-medium text-text-success-primary">{SAMPLE.deliveryRate}%</span>
          </div>
          <div>
            <span className="text-text-quaternary">Opt-outs</span>
            <span className="ml-1.5 font-medium text-text-primary">{SAMPLE.optOutRate}%</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* --- Live: API keys --- */

function ApiKeysCard() {
  return (
    <Card variant="default" dot="green">
      <CardTitle>API keys</CardTitle>
      <CardBody>
        <p className="text-xs text-text-quaternary mb-1">Sandbox</p>
        <CodeBlock text={SAMPLE.sandboxApiKey} />
        <p className="text-xs text-text-quaternary mt-3 mb-1">Live</p>
        <CodeBlock text={SAMPLE.liveApiKey} />
        <p className="mt-1.5 text-xs text-fg-warning-secondary">Shown once. Store securely.</p>
      </CardBody>
    </Card>
  );
}

/* --- Live: Compliance monitoring --- */

function ComplianceMonitoringCard() {
  return (
    <Card variant="default" dot="green">
      <CardTitle>Compliance monitoring</CardTitle>
      <CardBody>
        <Badge color="green">Healthy</Badge>
        <p className="mt-2 text-sm text-text-tertiary">No drift detected. Last checked 2h ago.</p>
        <a
          href={SAMPLE.complianceSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
        >
          View compliance site
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </CardBody>
    </Card>
  );
}

/* --- Live: Compliance site --- */

function ComplianceSiteCard() {
  return (
    <Card variant="default" dot="green">
      <CardTitle>Compliance site</CardTitle>
      <CardBody>
        <div className="flex items-center gap-2">
          <code className="text-xs text-text-secondary font-mono">{SAMPLE.complianceSiteUrl}</code>
          <a
            href={SAMPLE.complianceSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-quaternary hover:text-fg-quaternary_hover transition duration-100 ease-linear"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <p className="mt-2 text-sm text-text-tertiary">Live and serving.</p>
      </CardBody>
    </Card>
  );
}

/* --- Live: Notifications --- */

function NotificationsCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Card variant="default" dot={enabled ? "green" : "gray"}>
      <CardTitle>Notifications</CardTitle>
      <CardBody>
        <p className="text-sm text-text-secondary">SMS alerts</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-tertiary">Text me about compliance issues</span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative w-9 h-5 rounded-full transition duration-100 ease-linear cursor-pointer ${
              enabled ? "bg-bg-brand-solid" : "bg-bg-tertiary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-xs transition duration-100 ease-linear ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-text-quaternary font-mono">{SAMPLE.phone}</p>
      </CardBody>
    </Card>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function DashboardC() {
  const [state, setState] = useState<DashboardState>("pre-reg");

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">{SAMPLE.businessName}</h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Version C &mdash; Mission control. Card-based grid where each affordance is a card.
          Cards appear and change prominence as systems come online.
        </p>
      </div>

      {/* State toggle */}
      <div className="mb-4">
        <StateToggle state={state} onChange={setState} />
      </div>

      {/* Dynamic state annotation */}
      <p className="text-sm text-text-tertiary mb-6">{STATE_ANNOTATIONS[state]}</p>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ── Pre-reg: 2 cards ── */}
        {state === "pre-reg" && (
          <>
            <WelcomeMessagesCard />
            <GetStartedCard />
          </>
        )}

        {/* ── Sandbox: 6 cards ── */}
        {state === "sandbox" && (
          <>
            <BuildSpecHeroCard />
            <PhoneVerifiedCard />
            <SandboxApiKeyCard />
            <MessagesCard />
            <GettingStartedCard />
            <GoLiveCard />
          </>
        )}

        {/* ── Live: 7 cards ── */}
        {state === "live" && (
          <>
            <CelebrationCard />
            <UsageCard />
            <ApiKeysCard />
            <MessagesCard />
            <ComplianceMonitoringCard />
            <ComplianceSiteCard />
            <NotificationsCard />
          </>
        )}
      </div>

      {/* Bottom annotation per state */}
      <div className="mt-6 rounded-lg border border-border-tertiary bg-bg-secondary px-4 py-3">
        {state === "pre-reg" && (
          <Annotation>
            Pre-reg is intentionally sparse. Two cards. Messages are ready to browse.
            One action to unlock sandbox.
          </Annotation>
        )}
        {state === "sandbox" && (
          <Annotation>
            Sandbox is build-spec-first. Six cards. No raw code, no npm commands &mdash;
            the build spec teaches the AI tool how to integrate. Go Live is prominent but not premature.
          </Annotation>
        )}
        {state === "live" && (
          <Annotation>
            Live is the full control room. Seven cards, all systems green. No duplicate message
            content &mdash; everything links to the message library.
          </Annotation>
        )}
      </div>
    </div>
  );
}
