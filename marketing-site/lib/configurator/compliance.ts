/**
 * Best-effort compliance check for configurator message editing.
 *
 * Corpus-authored message variants are pre-vetted; this check guards
 * hand-edited corpus bodies and visitor-authored custom messages. Three rules,
 * all derived from D-402 + TCR category shape:
 *
 *   1. Single segment — the resolved body must fit one GSM-7 SMS segment.
 *   2. GSM-7 character set — author-controlled literal text must be SMS-safe.
 *      Variables are type-constrained / exempt (D-402).
 *   3. Opt-out language — Marketing-shaped categories must carry STOP + an
 *      exit word. Verification (2FA carve-out) does not.
 */

import { interpolateBody } from "@/lib/message-library/render";
import type { Variable } from "@/lib/message-library/types";

export interface ComplianceResult {
  isCompliant: boolean;
  issues: string[];
}

/** GSM 03.38 basic set + basic-extension characters — the SMS-safe character set. */
const GSM7_CHARS = new Set<string>([
  ...'@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ ÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?',
  ...'¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà',
  ...'€[\\]^{|}~\n',
]);

const SINGLE_SEGMENT_GSM7 = 160;

export interface ComplianceInput {
  /** Message body in `{{token}}` format. */
  body: string;
  /** The message's category variable catalog. */
  variables: Variable[];
  /** True for Marketing-shaped categories — opt-out language is then required. */
  requiresStop: boolean;
}

export function checkCompliance({
  body,
  variables,
  requiresStop,
}: ComplianceInput): ComplianceResult {
  const issues: string[] = [];
  const segments = interpolateBody(body, variables);
  const resolved = segments.map((s) => s.text).join("");

  if (resolved.length > SINGLE_SEGMENT_GSM7) {
    issues.push("Too long for a single SMS segment");
  }

  // GSM-7 applies only to author-controlled literal text — variable values are
  // type-constrained at the SDK boundary and exempt (D-402).
  const literal = segments
    .filter((s) => !s.isVariable)
    .map((s) => s.text)
    .join("");
  if ([...literal].some((ch) => !GSM7_CHARS.has(ch))) {
    issues.push("Contains characters that aren't SMS-safe");
  }

  if (requiresStop) {
    const hasStop = /stop/i.test(resolved);
    const hasExitWord = /opt[- ]?out|unsubscribe/i.test(resolved);
    if (!(hasStop && hasExitWord)) {
      issues.push("Needs opt-out language");
    }
  }

  return { isCompliant: issues.length === 0, issues };
}
