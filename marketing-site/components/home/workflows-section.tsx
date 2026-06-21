"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "@untitledui/icons";
import { CATEGORIES } from "@/lib/message-library";
import type { VariantTone } from "@/lib/message-library/types";
import type { Workflow, WorkflowStep } from "@/lib/landing/sub-verticals";

// WorkflowsSection — renders a sub-vertical's curated workflows as collapsible
// stepped cards in a responsive 1/2/3-column grid (Phase 1C). Cards are collapsed
// by default (step names only) and expand independently to reveal each step's
// message body. Each step's body is resolved from the universal corpus (or the
// step's own customVariants), then personalized with the shared business name and
// the step's contextual variable aliases. The parent owns the controls
// (businessName, tone) and section chrome; this component only draws the cards.

interface WorkflowsSectionProps {
  workflows: Workflow[];
  businessName: string;
  tone: VariantTone;
}

// Global fallback table — display values for corpus tokens that aren't aliased
// per-step, so an unresolved {{token}} never renders literally on the page.
// Module-level so it isn't recreated on every call.
const FALLBACKS: Record<string, string> = {
  action_link: "yourapp.com/alerts",
  account_link: "yourapp.com/billing",
  escalation_to: "your teammate",
  card_last4: "4242",
  code: "480913",
  expiry_minutes: "10",
  ticket_number: "318",
  ticket_link: "yourapp.com/tickets/318",
  days_remaining: "3",
  queue_position: "#4 in line",
  grace_window: "24 hours",
  claim_link: "yourapp.com/claim",
  rejoin_link: "yourapp.com/waitlist",
  provider_name: "your provider",
  agent_name: "Sam",
  eta: "30 min",
  incident_id: "INC-4821",
  system_name: "prod",
  alert_type: "threshold exceeded",
  severity: "CRITICAL",
  resource_name: "API calls",
  usage_percent: "80",
  quota_period: "monthly",
};

// Escape a string for literal use inside a RegExp.
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Resolve a step to its final body plus the list of values that were
// substituted in (so the renderer can bold them).
function resolveStepBody(
  step: WorkflowStep,
  businessName: string,
  tone: VariantTone,
): { body: string; values: string[] } {
  const name = businessName.trim() || "Acme";

  let body: string;
  if (step.customVariants) {
    // customVariants keys are lowercase; VariantTone is PascalCase.
    const key = tone.toLowerCase() as keyof typeof step.customVariants;
    body = step.customVariants[key];
  } else if (step.corpusId) {
    const [categoryId, messageId] = step.corpusId.split(":");
    const category = CATEGORIES.find((c) => c.id === categoryId);
    const message = category?.messages.find((m) => m.id === messageId);
    // Match the requested tone; fall back to the first variant if absent.
    const variant =
      message?.variants.find((v) => v.tone === tone) ?? message?.variants[0];
    body = variant?.body ?? "";
  } else {
    body = "";
  }

  // Substitute in order — identity frame, step aliases, then the global
  // fallback table. Each pass records the value it injected (only when the
  // token was actually present) so the renderer can bold the substituted text.
  const values: string[] = [];
  const sub = (token: string, value: string) => {
    const needle = `{{${token}}}`;
    if (body.includes(needle)) {
      body = body.replaceAll(needle, value);
      values.push(value);
    }
  };

  // 1. Identity frame
  sub("workspace_name", name);
  sub("business_name", name);

  // 2. Step-specific aliases
  if (step.variableAliases) {
    for (const [token, value] of Object.entries(step.variableAliases)) {
      sub(token, value);
    }
  }

  // 3. Global fallback table — covers corpus tokens not aliased per-step
  for (const [token, value] of Object.entries(FALLBACKS)) {
    sub(token, value);
  }

  return { body, values };
}

// Render the substituted body, bolding the injected variable values. Splits the
// string on those values (longest first, so a shorter value can't partial-match
// inside a longer one) and wraps each match in <strong>.
function renderBody(body: string, values: string[]): ReactNode {
  const unique = [...new Set(values)].filter(Boolean);
  if (unique.length === 0) return body;
  unique.sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${unique.map(escapeRegExp).join("|")})`, "g");
  const matched = new Set(unique);
  return body.split(re).map((part, i) =>
    matched.has(part) ? (
      <strong key={i} className="font-medium text-text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function WorkflowsSection({
  workflows,
  businessName,
  tone,
}: WorkflowsSectionProps) {
  // Each card opens/closes independently — multiple may be open at once.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Lead with the richest workflows — sort by step count desc. Copy first so the
  // prop is never mutated.
  const sorted = [...workflows].sort((a, b) => b.steps.length - a.steps.length);

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((workflow) => {
        const isOpen = expanded.has(workflow.id);
        return (
          <div
            key={workflow.id}
            className="overflow-hidden rounded-xl border border-border-secondary bg-surface-card px-[18px] py-4"
          >
            {/* Header row: name + description left, expand chevron right. */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-text-primary">
                  {workflow.displayName}
                </div>
                <p className="mt-[3px] text-[12px] text-text-secondary">
                  {workflow.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(workflow.id)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Collapse workflow" : "Expand workflow"}
                className="-mr-1 shrink-0 cursor-pointer p-1 text-text-quaternary transition-colors duration-100 ease-linear hover:text-text-secondary"
              >
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </div>

            <div className="mt-4">
              {workflow.steps.map((step, i) => {
                const isLast = i === workflow.steps.length - 1;
                const { body, values } = resolveStepBody(step, businessName, tone);
                return (
                  <div key={i} className="flex gap-2.5">
                    {/* Left rail: gold dot + connector down to the next step. The
                        connector is flex-driven, so it spans just the step names
                        when collapsed and through the bodies when expanded. */}
                    <div className="flex flex-col items-center">
                      <span
                        className="mt-[5px] size-[7px] shrink-0 rounded-full bg-[#c9a84c] pt-[2px]"
                        aria-hidden
                      />
                      {!isLast && (
                        <span
                          className="mt-[5px] w-px flex-1 bg-border-primary"
                          aria-hidden
                        />
                      )}
                    </div>
                    {/* Step name + (expanded only) message body. */}
                    <div className={isLast ? "" : "pb-3"}>
                      <div className="text-[12px] font-medium text-text-primary">
                        {step.displayName}
                      </div>
                      {isOpen && (
                        <p className="mt-0.5 text-[13px] leading-relaxed text-text-secondary">
                          {renderBody(body, values)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
