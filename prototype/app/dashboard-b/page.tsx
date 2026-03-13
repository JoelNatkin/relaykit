"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StateToggle, type DashboardState } from "@/components/dashboard/state-toggle";
import { SAMPLE } from "@/components/dashboard/sample-data";

/* ─── Tab definitions per state ──────────────────────────── */

const TABS_BY_STATE: Record<DashboardState, string[]> = {
  "pre-reg": ["Overview"],
  sandbox: ["Overview", "Messages"],
  live: ["Overview", "Messages", "Compliance", "Settings"],
};

/* ─── Inline SVG icons ───────────────────────────────────── */

function IconCheck({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconPhone({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconKey({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function IconFile({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconShield({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconMessageSquare({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function IconSettings({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconGlobe({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function IconBell({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function IconStar({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconDownload({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconX({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCopy({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

/* ─── Copy button ────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-md border border-border-primary px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear"
    >
      {copied ? (
        <span className="flex items-center gap-1"><IconCheck className="size-3" /> Copied</span>
      ) : (
        <span className="flex items-center gap-1"><IconCopy className="size-3" /> Copy</span>
      )}
    </button>
  );
}

/* ─── Annotation component ───────────────────────────────── */

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-xs text-text-tertiary italic border-l-2 border-border-tertiary pl-3">
      {children}
    </p>
  );
}

/* ─── Card wrapper ───────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border-secondary bg-bg-primary p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Overview Tab Content ───────────────────────────────── */

function OverviewPreReg() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Your appointment reminder templates are ready</h2>
        <p className="mt-1 text-sm text-text-tertiary">Browse your message library, then verify your phone to start sending test messages.</p>
      </div>

      {/* Messages link card */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary text-fg-brand-primary">
            <IconMessageSquare />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary">View your message library</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {SAMPLE.canonMessages.length} templates for appointment reminders
            </p>
            <Link
              href="/c/appointments/messages"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
            >
              View your message library <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Card>

      {/* Phone verification nudge */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-warning-secondary text-fg-warning-primary">
            <IconPhone />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary">Verify your phone number to unlock sandbox testing</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              We&apos;ll text you a one-time code to confirm your identity.
            </p>
            <p className="mt-2 text-xs text-text-tertiary">
              TCR limits this to 3 verifications per phone number lifetime.
            </p>
            <button className="mt-3 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear">
              Send verification code
            </button>
          </div>
        </div>
      </Card>

      <Annotation>Pre-reg is the thinnest state. One tab, two cards. The next step is clear.</Annotation>
    </div>
  );
}

function OverviewSandbox() {
  return (
    <div className="space-y-6">
      {/* Build Spec — hero card */}
      <Card className="border-border-brand bg-bg-brand-section_subtle">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-solid text-fg-white">
            <IconFile />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text-primary">Your build spec is ready</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              Drop <code className="rounded bg-bg-secondary px-1.5 py-0.5 text-xs font-mono text-text-secondary">SMS_BUILD_SPEC.md</code> in your project root and tell your AI coding assistant:
            </p>
            <div className="mt-3 rounded-lg bg-bg-primary border border-border-secondary px-4 py-3">
              <code className="text-sm font-mono text-text-brand-secondary">Read SMS_BUILD_SPEC.md and build my messaging feature.</code>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear">
                <IconDownload className="size-4" /> Download build spec
              </button>
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              Works with Claude Code, Cursor, Windsurf, and any AI coding tool.
            </p>
          </div>
        </div>
        <Annotation>The build spec is the key product moment. It bridges setup and implementation.</Annotation>
      </Card>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Phone verified */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-success-solid text-fg-white">
                <IconCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Phone verified</p>
                <p className="text-xs text-text-tertiary">{SAMPLE.phone}</p>
              </div>
            </div>
          </Card>

          {/* Sandbox API key */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-secondary text-fg-secondary">
                <IconKey />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary">Sandbox API key</h3>
                <p className="mt-1 text-xs text-text-tertiary">
                  Your AI coding tool will use this key automatically when it reads your build spec.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-xs font-mono text-text-secondary truncate">
                    {SAMPLE.sandboxApiKey}
                  </code>
                  <CopyButton text={SAMPLE.sandboxApiKey} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Getting started — prose steps */}
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Getting started</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-secondary text-xs font-semibold text-text-brand-secondary">1</span>
                <p className="text-sm text-text-secondary">Download your build spec</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-secondary text-xs font-semibold text-text-brand-secondary">2</span>
                <p className="text-sm text-text-secondary">Drop it in your project root</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-secondary text-xs font-semibold text-text-brand-secondary">3</span>
                <p className="text-sm text-text-secondary">Tell your AI: &ldquo;Read SMS_BUILD_SPEC.md and send a test message&rdquo;</p>
              </li>
            </ol>
            <p className="mt-3 text-xs text-text-tertiary">
              Works with Claude Code, Cursor, Windsurf, Copilot, and any AI coding assistant.
            </p>
          </Card>

          {/* Go Live CTA */}
          <Card className="border-border-brand">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-brand-solid text-fg-white">
                <IconArrowRight />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">Ready to go live?</h3>
                <p className="mt-1 text-sm text-text-tertiary">
                  Submit your registration to start sending real messages. Review takes 10&ndash;15 business days &mdash; your sandbox stays active throughout.
                </p>
                <button className="mt-3 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear">
                  Register to go live
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Compliance site link */}
      <Card>
        <div className="flex items-center gap-3">
          <IconGlobe className="size-5 text-fg-tertiary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">Compliance site</p>
            <a
              href={SAMPLE.complianceSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear truncate block"
            >
              {SAMPLE.complianceSiteUrl}
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OverviewLive() {
  const [showCelebration, setShowCelebration] = useState(true);

  return (
    <div className="space-y-6">
      {/* Dismissible celebration card */}
      {showCelebration && (
        <div className="rounded-xl border border-success bg-bg-success-secondary p-5 relative">
          <button
            onClick={() => setShowCelebration(false)}
            className="absolute top-4 right-4 text-fg-tertiary hover:text-fg-secondary transition duration-100 ease-linear"
            aria-label="Dismiss"
          >
            <IconX />
          </button>
          <div className="flex items-start gap-4 pr-8">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-success-solid text-fg-white">
              <IconStar />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-text-primary">Most developers never get here. You did.</h3>
                <span className="inline-flex items-center rounded-full bg-bg-success-solid px-2.5 py-0.5 text-xs font-medium text-text-white">
                  Approved
                </span>
              </div>
              <p className="text-sm text-text-tertiary">
                Approved {SAMPLE.approvalDate}. Your messages are reaching real users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row with temporal context */}
      <div>
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">Usage &mdash; March 2026</p>
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <p className="text-xs font-medium text-text-tertiary">Messages this month</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">{SAMPLE.messagesThisMonth.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium text-text-tertiary">Delivery rate</p>
            <p className="mt-1 text-2xl font-semibold text-text-success-primary">{SAMPLE.deliveryRate}%</p>
          </Card>
          <Card>
            <p className="text-xs font-medium text-text-tertiary">Opt-out rate</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">{SAMPLE.optOutRate}%</p>
          </Card>
        </div>
      </div>

      {/* Bar chart — message volume last 7 days */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary">Message volume &mdash; last 7 days</h3>
        <div className="mt-4 flex items-end gap-3 h-32">
          {[
            { day: "Mon", h: 60 },
            { day: "Tue", h: 75 },
            { day: "Wed", h: 45 },
            { day: "Thu", h: 90 },
            { day: "Fri", h: 80 },
            { day: "Sat", h: 70 },
            { day: "Sun", h: 85 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-bg-brand-solid"
                style={{ height: `${bar.h}%` }}
              />
              <span className="text-xs text-text-tertiary">{bar.day}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          {SAMPLE.messagesIncluded} included &middot; $15 per 1,000 additional
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API keys — dual */}
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-secondary text-fg-secondary">
              <IconKey />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">API keys</h3>
              <p className="mt-0.5 text-xs text-text-tertiary">Your AI coding tool will use this key automatically when it reads your build spec.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-text-tertiary mb-1">Sandbox</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-xs font-mono text-text-secondary truncate">
                  {SAMPLE.sandboxApiKey}
                </code>
                <CopyButton text={SAMPLE.sandboxApiKey} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-text-tertiary mb-1">Live</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-xs font-mono text-text-secondary truncate">
                  {SAMPLE.liveApiKey}
                </code>
                <CopyButton text={SAMPLE.liveApiKey} />
              </div>
            </div>
          </div>
        </Card>

        {/* Activity log */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Recent messages</h3>
          <div className="space-y-2">
            {[
              { time: "2 min ago", event: "Delivered to +1 (512) 555-0199" },
              { time: "8 min ago", event: "Delivered to +1 (512) 555-0234" },
              { time: "14 min ago", event: "Opt-out processed for +1 (512) 555-0188" },
              { time: "22 min ago", event: "Delivered to +1 (512) 555-0312" },
              { time: "31 min ago", event: "Delivered to +1 (512) 555-0145" },
            ].map((entry, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 text-xs text-text-tertiary w-20">{entry.time}</span>
                <div className="size-1.5 rounded-full bg-fg-success-secondary shrink-0 mt-1.5" />
                <span className="text-text-secondary">{entry.event}</span>
              </div>
            ))}
          </div>
          <Link
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
          >
            View full logs <IconArrowRight className="size-3" />
          </Link>
          <Annotation>Activity feed shows real delivery events. Links to a detailed logs view.</Annotation>
        </Card>
      </div>
    </div>
  );
}

/* ─── Messages Tab Content ───────────────────────────────── */

function MessagesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary text-fg-brand-primary">
            <IconMessageSquare />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text-primary">Your message library</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {SAMPLE.useCase} &middot; {SAMPLE.canonMessages.length} templates
            </p>
            <Link
              href={`/c/${SAMPLE.categoryId}/messages`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear"
            >
              Open message library <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Card>

      <Annotation>Messages tab is a portal to the full catalog. No content duplication.</Annotation>
    </div>
  );
}

/* ─── Compliance Tab Content (Live only) ─────────────────── */

function ComplianceLive() {
  return (
    <div className="space-y-6">
      {/* Compliance health */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-success-secondary text-fg-success-primary">
            <IconShield />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Compliance health</h3>
              <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-xs font-medium text-text-success-primary border border-success">
                Healthy
              </span>
            </div>
            <p className="mt-1 text-sm text-text-tertiary">No drift detected. Last checked 2 hours ago.</p>
          </div>
        </div>
      </Card>

      {/* Compliance site link */}
      <Card>
        <div className="flex items-center gap-3">
          <IconGlobe className="size-5 text-fg-tertiary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">Compliance site</p>
            <a
              href={SAMPLE.complianceSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear truncate block"
            >
              {SAMPLE.complianceSiteUrl}
            </a>
          </div>
        </div>
      </Card>

      {/* Drift alerts */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Drift alerts</h3>
        <div className="flex items-center gap-2 text-sm text-text-tertiary py-4">
          <IconShield className="size-4" />
          No active alerts
        </div>
      </Card>

      <Annotation>Compliance tab focuses on monitoring: health, drift, alerts, site link. Message content lives on the Messages page.</Annotation>
    </div>
  );
}

/* ─── Settings Tab Content ───────────────────────────────── */

function SettingsTab() {
  const [smsNotify, setSmsNotify] = useState(true);

  return (
    <div className="space-y-6">
      {/* SMS notification toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBell className="size-5 text-fg-tertiary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Text me about compliance issues</p>
              <p className="text-xs text-text-tertiary">Get SMS alerts when drift is detected.</p>
            </div>
          </div>
          <button
            onClick={() => setSmsNotify(!smsNotify)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition duration-100 ease-linear ${
              smsNotify ? "bg-bg-brand-solid" : "bg-bg-tertiary"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-bg-primary shadow-xs transition duration-100 ease-linear ${
                smsNotify ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Account info */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Account info</h3>
        <dl className="space-y-3">
          {[
            ["Business name", SAMPLE.businessName],
            ["Email", SAMPLE.email],
            ["Phone", SAMPLE.phone],
            ["Registration date", SAMPLE.registrationDate],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">{label}</dt>
              <dd className="text-sm font-medium text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* API key management */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-1">API key management</h3>
        <p className="text-xs text-text-tertiary mb-4">
          Your AI coding tool will use this key automatically when it reads your build spec. You can also find it in SMS_BUILD_SPEC.md.
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-secondary">Sandbox key</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono text-text-tertiary">{SAMPLE.sandboxApiKey}</code>
                  <CopyButton text={SAMPLE.sandboxApiKey} />
                </div>
              </div>
              <button className="shrink-0 rounded-lg border border-border-primary px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear">
                Regenerate
              </button>
            </div>
          </div>
          <div className="border-t border-border-tertiary pt-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-secondary">Live key</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono text-text-tertiary">{SAMPLE.liveApiKey}</code>
                  <CopyButton text={SAMPLE.liveApiKey} />
                </div>
              </div>
              <span className="text-xs text-text-tertiary">Cannot be regenerated</span>
            </div>
          </div>
        </div>
      </Card>

      <Annotation>Settings only appears after registration when there are meaningful things to configure.</Annotation>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function DashboardB() {
  const [state, setState] = useState<DashboardState>("pre-reg");
  const [activeTab, setActiveTab] = useState("Overview");

  // Reset tab when state changes if current tab isn't available
  useEffect(() => {
    const available = TABS_BY_STATE[state];
    if (!available.includes(activeTab)) {
      setActiveTab("Overview");
    }
  }, [state, activeTab]);

  const availableTabs = TABS_BY_STATE[state];

  function renderTabContent() {
    switch (activeTab) {
      case "Overview":
        if (state === "pre-reg") return <OverviewPreReg />;
        if (state === "sandbox") return <OverviewSandbox />;
        return <OverviewLive />;
      case "Messages":
        return <MessagesTab />;
      case "Compliance":
        return <ComplianceLive />;
      case "Settings":
        return <SettingsTab />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-8">
      {/* Version description */}
      <p className="text-xs text-text-tertiary mb-4">
        Version B — Tabbed workspace. Horizontal tabs organize affordances into logical groups. Tab visibility changes per state. Build spec is the hero of sandbox.
      </p>

      {/* State toggle */}
      <div className="mb-6">
        <StateToggle state={state} onChange={setState} />
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border-secondary mb-6">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition duration-100 ease-linear cursor-pointer -mb-px ${
              activeTab === tab
                ? "border-b-2 border-border-brand text-text-brand-secondary"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
}
