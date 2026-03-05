import type { ComplianceWarning } from "./message-plan-types";

const OPT_OUT_PATTERN = /\b(STOP|stop|opt out|opt-out|unsubscribe)\b/;
const BUSINESS_NAME_PATTERN = /\{business_name\}/;

const ELEMENT_LABELS: Record<string, string> = {
  opt_out: "opt-out language",
  business_name: "your business name",
};

export function checkCompliance(
  text: string,
  complianceElements: string[],
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];

  for (const element of complianceElements) {
    if (element === "opt_out") {
      warnings.push({
        element,
        label: ELEMENT_LABELS[element],
        present: OPT_OUT_PATTERN.test(text),
      });
    } else if (element === "business_name") {
      warnings.push({
        element,
        label: ELEMENT_LABELS[element],
        present: BUSINESS_NAME_PATTERN.test(text),
      });
    }
  }

  return warnings;
}

export function getMissingElements(warnings: ComplianceWarning[]): string[] {
  return warnings.filter((w) => !w.present).map((w) => w.label);
}
