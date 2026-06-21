import type { ReactNode } from "react";
import { CATEGORIES } from "@/lib/message-library";
import type { VariantTone } from "@/lib/message-library/types";
import type { Workflow, WorkflowStep } from "@/lib/landing/sub-verticals";

// WorkflowsSection — presentational. Renders a sub-vertical's curated workflows
// as two-column stepped cards (Phase 1C). Each step's body is resolved from the
// universal corpus (or the step's own customVariants), then personalized with
// the shared business name and the step's contextual variable aliases. The
// parent owns the controls (businessName, tone) and any section chrome; this
// component only draws the cards. Card style mirrors the home MessagesSection.

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
  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="overflow-hidden rounded-xl border border-border-secondary bg-surface-card px-[18px] py-4"
        >
          <div className="text-[14px] font-medium text-text-primary">
            {workflow.displayName}
          </div>
          <p className="mt-[3px] text-[12px] text-text-secondary">
            {workflow.description}
          </p>

          <div className="mt-4">
            {workflow.steps.map((step, i) => {
              const isLast = i === workflow.steps.length - 1;
              const { body, values } = resolveStepBody(step, businessName, tone);
              return (
                <div key={i} className="flex gap-2.5">
                  {/* Left rail: gold dot + connector line down to the next step. */}
                  <div className="flex flex-col items-center">
                    <span
                      className="mt-[5px] size-[5px] shrink-0 rounded-full bg-[#c9a84c]"
                      aria-hidden
                    />
                    {!isLast && (
                      <span className="w-px flex-1 bg-border-tertiary" aria-hidden />
                    )}
                  </div>
                  {/* Step name + always-visible message body. */}
                  <div className={isLast ? "" : "pb-3"}>
                    <div className="text-[12px] font-medium text-text-primary">
                      {step.displayName}
                    </div>
                    <p className="mt-0.5 text-[11px] text-text-secondary">
                      {renderBody(body, values)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
