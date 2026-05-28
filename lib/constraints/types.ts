// Type definitions for the RelayKit Constraints data file.
//
// Mirrors the Airtable Constraints base (appxThB8UWmNulAMt) — the authoring source of truth.
// Union strings are verbatim from the live base's singleSelect option labels, not from
// AIRTABLE_SCHEMA.md (which has known drift on Bucket emoji prefixes and Severity parentheticals).

export type Bucket =
  | "Clear"
  | "Conditional"
  | "Not yet, maybe not ever"
  | "Not yet"
  | "Not our lane";

export type BucketReason =
  | "Carrier prohibition (statutory)"
  | "Vetting burden (case-by-case)"
  | "TCR Special category"
  | "BAA gating (legal call)"
  | "Customer-pull dependent"
  | "Standard eligibility";

export type ConstraintSource =
  | "Industry-wide regulatory"
  | "Industry-wide standard"
  | "RelayKit-specific, permanent"
  | "RelayKit-specific, deferred"
  | "RelayKit-specific, case-by-case"
  | "Not applicable";

export type Severity = "Enforced" | "Advisory";

export interface ContentRule {
  name: string;
  prohibition: string;
  toneSensitive: boolean;
  safeRewritePlain: string;
  safeRewriteWarm?: string;
  safeRewriteBrief?: string;
  severity: Severity;
  source: string;
  notes?: string;
}

export interface SubVertical {
  slug: string;
  name: string;
  bucket: Bucket;
  bucketReason: BucketReason;
  constraintSource: ConstraintSource;
  routingTrigger: boolean;
  preemptiveNotice?: string;
  notes?: string;
  contentRules: ContentRule[];
}

export interface Vertical {
  slug: string;
  name: string;
  tcrVerticalMapping?: string;
  notes?: string;
  subVerticals: SubVertical[];
}
