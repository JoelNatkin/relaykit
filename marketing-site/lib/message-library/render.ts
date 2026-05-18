/**
 * Corpus-native rendering helpers.
 *
 * Message bodies in the message-library corpus use `{{double-brace}}` variable
 * syntax (per the D-402-era authoring convention). These helpers parse a body
 * into preview segments, extract its tokens, and flatten it to plain text —
 * driving the configurator's variable-chip rendering, the Tiptap editor, and
 * the clipboard copy.
 */

import type { Variable } from "./types";

export interface InterpolatedSegment {
  /** Rendered text — the resolved preview value for variables, raw text otherwise. */
  text: string;
  isVariable: boolean;
  /** The variable name, present only when `isVariable` is true. */
  token?: string;
}

/**
 * Resolve a variable's preview value. `business_name` reflects the live
 * configurator input when the visitor has typed one; everything else uses the
 * variable's catalogued `example`.
 */
export function resolveVariableExample(
  variable: Variable,
  businessName?: string,
): string {
  if (variable.name === "business_name" && businessName && businessName.trim()) {
    return businessName.trim();
  }
  return variable.example;
}

/**
 * Split a `{{token}}` body into segments, resolving known tokens to their
 * preview values. Unknown tokens (no matching catalog entry) fall through as
 * literal text so authoring mistakes stay visible rather than vanishing.
 */
export function interpolateBody(
  body: string,
  variables: Variable[],
  businessName?: string,
): InterpolatedSegment[] {
  const byName = new Map(variables.map((v) => [v.name, v]));
  const segments: InterpolatedSegment[] = [];

  for (const part of body.split(/(\{\{[^}]+\}\})/g)) {
    if (!part) continue;
    const match = part.match(/^\{\{(\w+)\}\}$/);
    const variable = match ? byName.get(match[1]) : undefined;
    if (match && variable) {
      segments.push({
        text: resolveVariableExample(variable, businessName),
        isVariable: true,
        token: match[1],
      });
    } else {
      segments.push({ text: part, isVariable: false });
    }
  }

  return segments;
}

/** Extract the distinct `{{token}}` variable names from a body string. */
export function extractTokens(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

/** Flatten a body to plain text with variables resolved — for clipboard copy. */
export function flattenBody(
  body: string,
  variables: Variable[],
  businessName?: string,
): string {
  return interpolateBody(body, variables, businessName)
    .map((s) => s.text)
    .join("");
}
