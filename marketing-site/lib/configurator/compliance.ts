/**
 * Compliance check ported from `prototype/components/catalog/catalog-card.tsx`
 * lines 123–164. Two rules:
 *
 *   1. Required variables — every variable in the message's `variables` list
 *      whose interpolated preview value is missing from the rendered text
 *      surfaces as "Needs <Label>".
 *   2. Opt-out language — if requiresStop is true, the rendered text must
 *      contain both /stop/i and /opt[- ]?out|unsubscribe/i. Otherwise emits
 *      "Needs opt-out language".
 *
 * Parity expectation: copy the rule shape, not the literal labels. If the
 * dashboard's rule set diverges, this file should be re-synced.
 */

import {
  extractVariables,
  getExampleValues,
  interpolateTemplate,
  type InterpolatedSegment,
} from "./example-values";
import type { SessionState } from "./session-context";
import type { VerticalId } from "./types";

export interface ComplianceResult {
  isCompliant: boolean;
  issues: string[];
}

function joinLabels(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function resolveTemplate(
  template: string,
  verticalId: VerticalId,
  state: SessionState,
): string {
  return interpolateTemplate(template, verticalId, state)
    .map((s: InterpolatedSegment) => s.text)
    .join("");
}

export interface ComplianceInput {
  template: string;
  verticalId: VerticalId;
  variables: string[];
  requiresStop: boolean;
  state: SessionState;
}

export function checkCompliance({
  template,
  verticalId,
  variables,
  requiresStop,
  state,
}: ComplianceInput): ComplianceResult {
  const text = resolveTemplate(template, verticalId, state);
  const issues: string[] = [];

  const hasStop = /stop/i.test(text);
  const hasExitWord = /opt[- ]?out|unsubscribe/i.test(text);
  if (requiresStop && !(hasStop && hasExitWord)) {
    issues.push("Needs opt-out language");
  }

  // Required variables: each declared {key} must still resolve in-text via
  // its interpolated preview value.
  const presentKeys = new Set(extractVariables(template));
  const valueMap = getExampleValues(verticalId);
  const missingLabels: string[] = [];
  const seen = new Set<string>();
  const lowered = text.toLowerCase();
  for (const key of variables) {
    const example = valueMap.get(key);
    if (!example) continue;
    if (!presentKeys.has(key)) {
      // Variable removed from template entirely — its preview won't appear
      if (!seen.has(example.label)) {
        seen.add(example.label);
        missingLabels.push(example.label);
      }
      continue;
    }
    const value = example.preview(state);
    if (!value) continue;
    if (!lowered.includes(value.toLowerCase()) && !seen.has(example.label)) {
      seen.add(example.label);
      missingLabels.push(example.label);
    }
  }
  if (missingLabels.length > 0) {
    issues.push(`Needs ${joinLabels(missingLabels)}`);
  }

  return { isCompliant: issues.length === 0, issues };
}
