/**
 * Best-effort compliance check for configurator message editing.
 *
 * Corpus-authored message variants are pre-vetted; this check guards
 * hand-edited corpus bodies and visitor-authored custom messages. Three rules,
 * all derived from D-402 + TCR category shape:
 *
 *   1. Single segment — the resolved body must fit one GSM-7 SMS segment.
 *      Configurator severity: **warning** (soft, visitor's choice — the
 *      message still functions; the visitor is billed for two segments
 *      and the carrier reassembles for the recipient). Workspace stage
 *      may re-judge as blocker.
 *   2. GSM-7 character set — author-controlled literal text must be SMS-
 *      safe. Variables are type-constrained / exempt (D-402).
 *      Configurator severity: **blocker** (silent UCS-2 encoding switch
 *      causes downstream surprises wherever the message is sent).
 *   3. Opt-out language — Marketing-shaped categories must carry STOP +
 *      an exit word. Verification (2FA carve-out) does not.
 *      Configurator severity: **blocker** (TCR carrier-compliance
 *      failure regardless of downstream).
 *
 * The configurator gates Save on blockers only (per configurator-
 * authoring exploration §1: "an over-length message is a soft warning
 * in the configurator and a hard gate in the workspace — same message,
 * same data; the workspace re-judges it under stricter rules"). A
 * future workspace caller may treat every issue as blocking by reading
 * `issues.length === 0` directly.
 */

import { interpolateBody } from "@/lib/message-library/render";
import type { Variable } from "@/lib/message-library/types";

export type ComplianceSeverity = "blocker" | "warning";

export interface ComplianceIssue {
  severity: ComplianceSeverity;
  message: string;
}

export interface ComplianceResult {
  /**
   * True when no `blocker` issues exist — the configurator's Save gate.
   * `warning` issues are listed in `issues` but never affect this flag.
   * A future workspace stage that wants every issue to block may use
   * `issues.length === 0` instead.
   */
  isCompliant: boolean;
  issues: ComplianceIssue[];
  /**
   * True when the resolved body exceeds a single SMS segment (D-414 /
   * configurator-authoring §4). Surfaced separately from `issues` so
   * the read-card char-warning can gate on length alone without
   * walking the issues list.
   */
  isOverSegmentLength: boolean;
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
  /**
   * Per-category authored variable values — drives the post-render char count
   * so authored values count toward the single-segment limit (D-414 /
   * configurator-authoring Resolved §1).
   */
  categoryVariables?: Record<string, string>;
}

export function checkCompliance({
  body,
  variables,
  requiresStop,
  categoryVariables,
}: ComplianceInput): ComplianceResult {
  const issues: ComplianceIssue[] = [];
  const segments = interpolateBody(body, variables, { categoryVariables });
  const resolved = segments.map((s) => s.text).join("");

  const isOverSegmentLength = resolved.length > SINGLE_SEGMENT_GSM7;
  if (isOverSegmentLength) {
    // Length is a warning, not a blocker — the message still functions;
    // the visitor is billed for two segments and the carrier reassembles
    // for the recipient. Wording matches the read-card char-warning
    // tooltip so the visitor sees the same framing on both surfaces.
    issues.push({
      severity: "warning",
      message: "Over 160 characters — counts as 2 messages.",
    });
  }

  // GSM-7 applies only to author-controlled literal text — variable values are
  // type-constrained at the SDK boundary and exempt (D-402).
  const literal = segments
    .filter((s) => !s.isVariable)
    .map((s) => s.text)
    .join("");
  if ([...literal].some((ch) => !GSM7_CHARS.has(ch))) {
    issues.push({
      severity: "blocker",
      message: "Contains characters that aren't SMS-safe",
    });
  }

  if (requiresStop) {
    const hasStop = /stop/i.test(resolved);
    const hasExitWord = /opt[- ]?out|unsubscribe/i.test(resolved);
    if (!(hasStop && hasExitWord)) {
      issues.push({
        severity: "blocker",
        message: "Needs opt-out language",
      });
    }
  }

  const isCompliant = !issues.some((i) => i.severity === "blocker");
  return { isCompliant, issues, isOverSegmentLength };
}
