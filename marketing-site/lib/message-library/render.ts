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
 * The configurator surfaces a single "Your business name" input but the corpus
 * uses three distinct identity-token names by historical authoring choice
 * (`business_name`, `workspace_name`, and Community's locally-defined
 * `community_name`). At preview time they all resolve from the same input so
 * one input drives every category's sender frame. Corpus bodies are unchanged;
 * the SDK contract and D-398's multi-workspace runtime semantics are
 * unaffected. See D-413.
 */
const IDENTITY_TOKENS = new Set([
  "business_name",
  "workspace_name",
  "community_name",
]);

/**
 * True when a variable name is one of the corpus's identity tokens — i.e.,
 * a token that resolves from the top-of-page "Your business name" input
 * (D-413) rather than from per-category authored values. The configurator's
 * Edit-values form filters these out so they aren't duplicated alongside
 * the global input.
 */
export function isIdentityToken(variableName: string): boolean {
  return IDENTITY_TOKENS.has(variableName);
}

/** Options for resolving a variable's preview value. */
export interface ResolveOptions {
  /** Live "Your business name" input — resolves identity tokens (D-413). */
  businessName?: string;
  /**
   * Per-category authored variable values (D-414 / configurator-authoring
   * Resolved §1). When a value is present and non-empty, it overrides the
   * variable's catalogued example.
   */
  categoryVariables?: Record<string, string>;
}

/**
 * Resolve a variable's preview value. Resolution order:
 *   1. Identity token + non-empty `businessName` → that input (D-413).
 *   2. Non-empty `categoryVariables[variable.name]` → that authored value.
 *   3. The variable's catalogued `example` from the corpus.
 */
export function resolveVariableExample(
  variable: Variable,
  options?: ResolveOptions,
): string {
  const { businessName, categoryVariables } = options ?? {};
  if (IDENTITY_TOKENS.has(variable.name) && businessName && businessName.trim()) {
    return businessName.trim();
  }
  if (categoryVariables) {
    const authored = categoryVariables[variable.name];
    if (typeof authored === "string" && authored !== "") {
      return authored;
    }
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
  options?: ResolveOptions,
): InterpolatedSegment[] {
  const byName = new Map(variables.map((v) => [v.name, v]));
  const segments: InterpolatedSegment[] = [];

  for (const part of body.split(/(\{\{[^}]+\}\})/g)) {
    if (!part) continue;
    const match = part.match(/^\{\{(\w+)\}\}$/);
    const variable = match ? byName.get(match[1]) : undefined;
    if (match && variable) {
      segments.push({
        text: resolveVariableExample(variable, options),
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
  options?: ResolveOptions,
): string {
  return interpolateBody(body, variables, options)
    .map((s) => s.text)
    .join("");
}
