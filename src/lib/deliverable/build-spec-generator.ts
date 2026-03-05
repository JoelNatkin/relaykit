import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import { BUILD_SPEC_TEMPLATE } from "./build-spec-template";
import { USE_CASE_TIPS } from "./use-case-tips";
import { USE_CASE_LABELS } from "@/lib/templates/types";

export interface BuildSpecInput {
  useCase: UseCaseId;
  sandboxApiKey: string;
  businessName?: string;
  messages: MessagePlanEntry[];
}

export function generateBuildSpec(input: BuildSpecInput): string {
  const enabledMessages = input.messages.filter((m) => m.enabled);
  const appLabel =
    input.businessName || USE_CASE_LABELS[input.useCase] || input.useCase;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const messagesSection = enabledMessages
    .map((m) => {
      const text = m.edited_text ?? m.original_template;
      return [
        `### ${m.category}: ${m.trigger}`,
        "",
        text,
        "",
        `Variables: ${m.variables.join(", ")}`,
        `When to send: ${m.trigger}`,
      ].join("\n");
    })
    .join("\n\n");

  const triggersSection = enabledMessages
    .map(
      (m) =>
        `- ${m.trigger}: Call sendSMS() with the ${m.category} template, replacing ${m.variables.join(", ")} with actual values`,
    )
    .join("\n");

  const useCaseTip = USE_CASE_TIPS[input.useCase] ?? "";

  return BUILD_SPEC_TEMPLATE
    .replace("{app_name_or_use_case}", appLabel)
    .replace("{date}", date)
    .replace("{rk_sandbox_key}", input.sandboxApiKey)
    .replace("{messages_section}", messagesSection)
    .replace("{triggers_section}", triggersSection)
    .replace("{use_case_tip}", useCaseTip);
}
