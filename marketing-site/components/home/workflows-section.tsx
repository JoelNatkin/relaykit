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

// Resolve a step to its final, personalized SMS body.
function resolveStepBody(
  step: WorkflowStep,
  businessName: string,
  tone: VariantTone,
): string {
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

  // Identity frame first, then the step's contextual aliases on top.
  body = body.replaceAll("{{workspace_name}}", name);
  if (step.variableAliases) {
    for (const [token, value] of Object.entries(step.variableAliases)) {
      body = body.replaceAll(`{{${token}}}`, value);
    }
  }
  return body;
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
                      {resolveStepBody(step, businessName, tone)}
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
