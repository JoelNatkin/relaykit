/**
 * Marketing-side example values per variable per vertical. Mirrors the shape
 * of `prototype/lib/catalog-helpers.ts` `CATEGORY_EXAMPLE_VALUES` so the
 * Tiptap variable-node-view, compliance check, and read-state preview can
 * all share lookup logic with the dashboard. Preview values are driven by
 * the configurator's businessName/website inputs (via SessionState) so
 * variables live-update across the section as the user types.
 *
 * Parity expectation: every variable key referenced in any stub template
 * must have an entry here for its vertical, otherwise the editor renders
 * the literal `{key}` and the compliance check ignores it.
 */

import type { SessionState } from "./session-context";
import type { VerticalId } from "./types";

export interface ExampleValue {
  key: string;
  label: string;
  preview: (state: SessionState) => string;
}

const EXAMPLES_BY_VERTICAL: Record<VerticalId, ExampleValue[]> = {
  verification: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "code", label: "Code", preview: () => "482910" },
  ],
  appointments: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "website", label: "Website", preview: (s) => s.website || "acme.com" },
    { key: "day", label: "Day", preview: () => "Friday" },
    { key: "time", label: "Time", preview: () => "2:00 PM" },
    { key: "when", label: "When", preview: () => "tomorrow" },
  ],
  orders: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "website", label: "Website", preview: (s) => s.website || "acme.com" },
    { key: "order_id", label: "Order ID", preview: () => "4827" },
    { key: "tracking_number", label: "Tracking number", preview: () => "1Z999AA10000123456" },
    { key: "when", label: "When", preview: () => "today" },
  ],
  support: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "website", label: "Website", preview: (s) => s.website || "acme.com" },
    { key: "ticket_id", label: "Ticket ID", preview: () => "1893" },
  ],
  marketing: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "website", label: "Website", preview: (s) => s.website || "acme.com" },
    { key: "discount", label: "Discount", preview: () => "20%" },
    { key: "when", label: "When", preview: () => "today" },
  ],
  team: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "shift_time", label: "Shift time", preview: () => "3 PM" },
  ],
  community: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "website", label: "Website", preview: (s) => s.website || "acme.com" },
    { key: "time", label: "Time", preview: () => "7 PM" },
  ],
  waitlist: [
    { key: "business_name", label: "Business name", preview: (s) => s.businessName || "Acme" },
    { key: "wait_time", label: "Wait time", preview: () => "5 minutes" },
  ],
};

export function getExampleValues(verticalId: VerticalId): Map<string, ExampleValue> {
  const values = EXAMPLES_BY_VERTICAL[verticalId] ?? [];
  return new Map(values.map((v) => [v.key, v]));
}

export interface InterpolatedSegment {
  text: string;
  isVariable: boolean;
  variableKey?: string;
}

/** Parse a `{key}` template into segments, resolving variables to example values. */
export function interpolateTemplate(
  template: string,
  verticalId: VerticalId,
  state: SessionState,
): InterpolatedSegment[] {
  const valueMap = getExampleValues(verticalId);
  const parts = template.split(/(\{[^}]+\})/g);
  const segments: InterpolatedSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^\{(\w+)\}$/);
    if (match) {
      const key = match[1];
      const v = valueMap.get(key);
      segments.push({
        text: v ? v.preview(state) : part,
        isVariable: !!v,
        variableKey: key,
      });
    } else {
      segments.push({ text: part, isVariable: false });
    }
  }

  return segments;
}

/** Extract variable keys from a `{key}` template string. */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}
