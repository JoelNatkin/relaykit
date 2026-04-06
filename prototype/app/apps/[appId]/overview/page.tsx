"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Copy01, Check, Code02 } from "@untitledui/icons";
import { useSession } from "@/context/session-context";
import ApprovedDashboard from "./approved-dashboard";

/* ── Building state: copy button + tool logos + instruction cards ── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button type="button" onClick={handleCopy} className="shrink-0 p-1 text-fg-tertiary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer" aria-label="Copy to clipboard">
      {copied ? <Check className="size-4 text-fg-success-primary" /> : <Copy01 className="size-4" />}
    </button>
  );
}

const BUILDING_PROMPT_TEXT = `I installed the RelayKit SDK. Add SMS to my app. I run a hair styling business called Club Woman. The SDK has my message templates — use them all.`;
const BUILDING_ENV_TEXT = `Add this API key to my .env file: RELAYKIT_API_KEY=rk_sandbox_7Kx9mP2vL4qR8nJ5`;

const BUILDING_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};
const BUILDING_TOOLS = [
  { id: "claude-code", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "windsurf", name: "Windsurf" },
  { id: "copilot", name: "GitHub Copilot" },
  { id: "cline", name: "Cline" },
  { id: "other", name: "Other" },
];

function BuildingToolLogo({ id }: { id: string }) {
  const logoSrc = BUILDING_LOGO_MAP[id];
  if (!logoSrc) return <Code02 className="w-5 h-5 text-text-quaternary" />;
  const sizeClass = id === "windsurf" ? "w-[28px] h-[28px]" : "w-[22px] h-[22px]";
  return <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />;
}

/* ── Status badges ── */

function BrandBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
      {children}
    </span>
  );
}

function SuccessBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-success-secondary px-2.5 py-1 text-xs font-medium text-text-success-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-success-primary" />
      {children}
    </span>
  );
}

function ErrorBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-error-secondary px-2.5 py-1 text-xs font-medium text-text-error-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-error-primary" />
      {children}
    </span>
  );
}

/* ── Registration stepper (right column) ── */

interface StepperStep {
  label: string;
  detail: string | null;
  detailClass?: string;
  link?: { text: string; href: string };
  status: "completed" | "active" | "upcoming" | "error";
}

const PENDING_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Carriers verify your business and message content. We respond to any questions on your behalf.", status: "active" },
  { label: "Phone number assigned", detail: null, status: "upcoming" },
  { label: "Live", detail: null, status: "upcoming" },
];

const APPROVED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Approved Mar 31", status: "completed" },
  { label: "Phone number assigned", detail: "+1 (555) 867-5309", status: "completed" },
  { label: "Live", detail: "Mar 31", status: "completed" },
];

const CHANGES_REQUESTED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Changes requested Mar 22", status: "completed" },
  { label: "Resubmission under review", detail: "Updated and resubmitted Mar 24. Carriers re-reviewing.", status: "active" },
  { label: "Phone number assigned", detail: null, status: "upcoming" },
  { label: "Live", detail: null, status: "upcoming" },
];

const REJECTED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee refunded", detail: "$49 refunded", detailClass: "text-text-success-primary", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Not approved Mar 28", status: "error" },
];

function RegistrationStepper({ steps }: { steps: StepperStep[] }) {

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          {/* Icon column */}
          <div className="flex flex-col items-center">
            {step.status === "completed" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-success-secondary shrink-0">
                <svg className="size-3.5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : step.status === "error" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-error-secondary shrink-0">
                <svg className="size-3.5 text-fg-error-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
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
              <div className={`w-px flex-1 min-h-[16px] ${step.status === "completed" || step.status === "error" ? "bg-fg-success-secondary" : "bg-border-secondary"}`} />
            )}
          </div>
          {/* Content */}
          <div className="pb-4">
            <span className={`text-sm font-medium leading-6 ${
              step.status === "error" ? "text-text-error-primary" :
              step.status === "completed" ? "text-text-tertiary" :
              step.status === "active" ? "text-text-primary" :
              "text-text-quaternary"
            }`}>
              {step.label}
            </span>
            {step.detail && (
              <p className={`mt-0.5 text-sm leading-relaxed ${step.detailClass ? step.detailClass : step.status === "active" ? "text-text-secondary" : "text-text-tertiary"}`}>
                {step.detail}
              </p>
            )}
            {step.link && (
              <Link href={step.link.href} className="ml-2 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                {step.link.text}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */

export default function OverviewPage() {
  const { appId } = useParams<{ appId: string }>();
  const { state: sessionState, setRegistrationState } = useSession();
  const registrationState = sessionState.registrationState;

  const isApproved = registrationState === "registered";
  const isChangesRequested = registrationState === "changes_requested";
  const isRejected = registrationState === "rejected";
  const isPending = registrationState === "pending";

  return (
    <div>

      {/* Registered state: full dashboard replacement */}
      {isApproved ? (
        <ApprovedDashboard />
      ) : (
      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* LEFT — Sections */}
        <div className="min-w-0 flex-1">

          <div>
            <h1 className="text-2xl font-bold text-text-primary">Start building</h1>
            <p className="mt-2 text-sm text-text-tertiary">
              Everything your AI tool needs to build your SMS feature.
            </p>

            {/* Tool logos */}
            <div className="mt-4 mb-5 flex items-center gap-3">
              {BUILDING_TOOLS.map((tool) => (
                <div key={tool.id} title={tool.name} className="flex size-10 items-center justify-center rounded-full border border-[#c4c4c4] bg-white p-1">
                  <BuildingToolLogo id={tool.id} />
                </div>
              ))}
            </div>

            {/* Instruction cards */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border-secondary p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">1. Install RelayKit</p>
                  <CopyButton text="npm install relaykit" />
                </div>
                <p className="mt-1 mb-3 text-xs text-text-quaternary">Run this in your project&apos;s terminal.</p>
                <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
                  <span className="text-sm text-text-secondary whitespace-nowrap">npm install relaykit</span>
                </div>
              </div>

              <div className="rounded-xl border border-border-secondary p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">2. Add your API key</p>
                  <CopyButton text={BUILDING_ENV_TEXT} />
                </div>
                <p className="mt-1 mb-3 text-xs text-text-quaternary">Paste this prompt into your AI tool to add the key.</p>
                <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
                  <span className="text-sm text-text-secondary whitespace-nowrap">{BUILDING_ENV_TEXT}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border-secondary p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">3. Add SMS to your app</p>
                  <CopyButton text={BUILDING_PROMPT_TEXT} />
                </div>
                <p className="mt-1 mb-3 text-xs text-text-quaternary">Paste this prompt into your AI tool to start building.</p>
                <div className="rounded-lg bg-bg-secondary px-3 py-2">
                  <p className="text-sm text-text-secondary leading-relaxed">{BUILDING_PROMPT_TEXT}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT — Registration card */}
        <div id="registration-card" className="order-first md:order-last md:w-[280px] md:shrink-0">
          <div className="rounded-xl bg-gray-50 p-6 md:sticky md:top-20">
            {isApproved ? (
              <>
                {/* ── Registered state: completed status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <SuccessBadge>Approved</SuccessBadge>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={APPROVED_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Your messages are now delivered through carriers. Compliance monitoring is active — check the Monitor tab for message status.
                </p>

                <div className="my-5 border-t border-border-secondary" />

                <p className="text-sm font-semibold text-text-primary">Monthly plan</p>
                <p className="mt-1 text-sm text-text-secondary">$19/mo · 500 messages included</p>
                <p className="mt-0.5 text-sm text-text-tertiary">$15 per additional 1,000, auto-scaled</p>
              </>
            ) : isChangesRequested ? (
              <>
                {/* ── Changes Requested state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <BrandBadge>Changes requested</BrandBadge>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026 · Updated March 24, 2026</p>
                  <p className="text-sm text-text-tertiary">Resubmission typically reviewed within a few business days</p>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={CHANGES_REQUESTED_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? Reach out anytime — we can check status with carriers directly.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : isRejected ? (
              <>
                {/* ── Rejected state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <ErrorBadge>Not approved</ErrorBadge>
                </div>

                <p className="mt-4 text-sm font-semibold text-text-success-primary">$49 refund issued March 28, 2026</p>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={REJECTED_STEPS} />

                <div className="mt-2">
                  <p className="text-sm font-medium text-text-primary">Ready to try again?</p>
                  <button
                    type="button"
                    onClick={() => setRegistrationState("building")}
                    className="mt-3 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                  >
                    Start new registration
                  </button>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? We can review the carrier feedback with you.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : isPending ? (
              <>
                {/* ── Pending state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <BrandBadge>Under carrier review</BrandBadge>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026</p>
                  <p className="text-sm text-text-tertiary">Typically approved in a few days. We&#39;ll email you at <a href="mailto:jen@glowstudio.com" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">jen@glowstudio.com</a>.</p>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={PENDING_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? Reach out anytime — we can check status with carriers directly.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : (
              <>
                {/* ── Building state: calm registration reminder ── */}
                <h3 className="text-lg font-semibold text-text-primary">Ready to go live?</h3>

                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Carrier registration takes a few days. Start now so you&apos;re live when your app is ready.
                </p>

                <p className="mt-4 text-sm font-semibold text-text-primary">$49 registration + $19/mo</p>
                <p className="mt-1 text-sm text-text-tertiary">Not approved? Full refund.</p>

                <Link
                  href={`/apps/${appId}/register`}
                  className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
                >
                  Start registration &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
