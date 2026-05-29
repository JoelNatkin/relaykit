"use client";

/**
 * Verdict card under the elig dropdowns. Five rendering branches keyed by
 * verdict tier (vertical-constraints §9.3):
 *
 *   🟢 clear              — inline single line with success check, no card.
 *   🟡 conditional        — neutral info card with collapsed line + expander
 *                           revealing 1–3 paragraphs (§9.4 anchored or generic).
 *   🟠 not-yet-maybe-not  — warning-toned info card + inline waitlist email form
 *                           (interest_tag = "vetting:{slug}").
 *   ⚫ not-yet            — warning-toned info card + inline waitlist email form
 *                           (interest_tag = "capacity:{slug}" or "multi-tenant").
 *                           Multi-tenant uses tailored copy.
 *   🔴 not-our-lane       — warning-toned info card with §9.6 line. No waitlist.
 *                           Surveillance uses the two-tier carve-out (primary
 *                           line here; secondary line lives in the empty state).
 *
 * Brand-system note: §9.3 calls for "blue" (🟡) / "orange" (🟠/⚫/🔴) info
 * cards, but the post-D-405 monochrome warm-neutral palette has no chromatic
 * accent except the semantic warning/error/success scales. The conditional
 * card uses a brand-neutral surface lift; the warning card uses
 * `text-warning-primary` text + `fg-warning-secondary` icon to signal the
 * orange intent without painting a bright cream blob on dark mode.
 */

import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "@untitledui/icons";
import { useState } from "react";
import { findSubVertical } from "../../../lib/constraints";
import type { EligState } from "@/lib/configurator/use-elig-state";
import {
  CLEAR_LINE,
  CONDITIONAL_COLLAPSED_LINE,
  NOT_OUR_LANE_LINES,
  NOT_YET_LINE,
  NOT_YET_MAYBE_LINE,
  NOT_YET_MULTI_TENANT_LINE,
  SURVEILLANCE_PRIMARY_LINE,
  SURVEILLANCE_SLUG,
  eligInterestTag,
  genericNotOurLaneLine,
  getConditionalExpanded,
} from "@/lib/configurator/elig-copy";

export interface EligVerdictCardProps {
  state: EligState;
}

export function EligVerdictCard({ state }: EligVerdictCardProps) {
  const tier = state.verdict.tier;
  if (tier === null) return null;

  if (tier === "clear") {
    return <ClearLine />;
  }

  if (tier === "conditional") {
    // Verdict only resolves to "conditional" when subVerticalSlug is set
    // (every Conditional sub-vertical carries routingTrigger:true; D2-only
    // resolution would require a vertical with no triggers AND a shared
    // bucket — that bucket is Clear in every existing case).
    if (!state.subVerticalSlug) return null;
    return <ConditionalCard subVerticalSlug={state.subVerticalSlug} />;
  }

  if (tier === "not-yet-maybe-not") {
    if (!state.subVerticalSlug) return null;
    return (
      <NotYetCard
        primaryLine={NOT_YET_MAYBE_LINE}
        interestTag={eligInterestTag(state)}
      />
    );
  }

  if (tier === "not-yet") {
    const isMultiTenant = state.multiTenant === "multi";
    const primaryLine = isMultiTenant ? NOT_YET_MULTI_TENANT_LINE : NOT_YET_LINE;
    return (
      <NotYetCard
        primaryLine={primaryLine}
        interestTag={eligInterestTag(state)}
      />
    );
  }

  if (tier === "not-our-lane") {
    if (!state.subVerticalSlug) return null;
    const sub = findSubVertical(state.subVerticalSlug);
    const subName = sub?.name ?? "this category";
    const line =
      state.subVerticalSlug === SURVEILLANCE_SLUG
        ? SURVEILLANCE_PRIMARY_LINE
        : (NOT_OUR_LANE_LINES[state.subVerticalSlug] ??
          genericNotOurLaneLine(subName));
    return <NotOurLaneCard primaryLine={line} />;
  }

  return null;
}

// ─── 🟢 Clear ───────────────────────────────────────────────────────────────

function ClearLine() {
  return (
    <div className="flex items-center gap-2 px-1 py-2 text-sm text-text-tertiary">
      <CheckCircle className="size-4 shrink-0 text-fg-success-secondary" />
      <span>{CLEAR_LINE}</span>
    </div>
  );
}

// ─── 🟡 Conditional ─────────────────────────────────────────────────────────

interface ConditionalCardProps {
  subVerticalSlug: string;
}

function ConditionalCard({ subVerticalSlug }: ConditionalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const expandedCopy = getConditionalExpanded(subVerticalSlug);
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
      <div className="flex items-start gap-2">
        <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" />
        <div className="flex-1">
          <p className="text-sm text-text-primary">{CONDITIONAL_COLLAPSED_LINE}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
          >
            {expanded ? "Less info" : "More info"}
            {expanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
          {expanded ? (
            <div className="mt-3 space-y-3">
              {expandedCopy.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-text-secondary">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── 🟠 / ⚫ Not yet (with inline waitlist) ────────────────────────────────

interface NotYetCardProps {
  primaryLine: string;
  interestTag: string | null;
}

function NotYetCard({ primaryLine, interestTag }: NotYetCardProps) {
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" />
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-text-warning-primary">
            {primaryLine}
          </p>
          <div className="mt-3">
            <InterestEmailForm interestTag={interestTag} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 🔴 Not our lane (no waitlist) ─────────────────────────────────────────

interface NotOurLaneCardProps {
  primaryLine: string;
}

function NotOurLaneCard({ primaryLine }: NotOurLaneCardProps) {
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" />
        <p className="flex-1 text-sm leading-relaxed text-text-warning-primary">
          {primaryLine}
        </p>
      </div>
    </div>
  );
}

// ─── Inline waitlist email form ────────────────────────────────────────────

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface InterestEmailFormProps {
  interestTag: string | null;
}

/**
 * Inline waitlist email capture for 🟠/⚫ verdicts. POSTs to /api/early-access
 * with the interest_tag derived from the elig state. Mirrors the
 * WaitlistModal POST shape minus the configurator summary (this signal is
 * about the elig pick, not the message authoring layer).
 */
function InterestEmailForm({ interestTag }: InterestEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || email.trim() === "") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          ctaSource: "elig-section",
          interestTag,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      setStatus(data?.ok === true ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-text-success-primary">
        You&apos;re on the list — we&apos;ll email you when this is ready.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourapp.com"
        aria-label="Email for waitlist"
        disabled={status === "loading"}
        className="flex-1 rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading" || email.trim() === ""}
        className="cursor-pointer rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Joining…" : "Notify me"}
      </button>
      {status === "error" ? (
        <p className="basis-full text-xs text-text-error-primary">
          Something went wrong. Try again, or email joel@relaykit.ai.
        </p>
      ) : null}
    </form>
  );
}
