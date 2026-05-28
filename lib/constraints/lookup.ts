// Query helpers over the committed VERTICALS data.
//
// Two named consumers (per the schema-design plan):
//   1. Eligibility verdict — lookupEligibility(verticalSlug, subVerticalSlug)
//   2. Content-rule retrieval — getContentRules(subVerticalSlug)
//
// Indexes are built lazily on first call and memoized for the process lifetime.

import type {
  Bucket,
  BucketReason,
  ConstraintSource,
  ContentRule,
  SubVertical,
  Vertical,
} from "./types";
import { VERTICALS } from "./verticals";

export interface EligibilityVerdict {
  vertical: Vertical;
  subVertical: SubVertical;
  bucket: Bucket;
  bucketReason: BucketReason;
  constraintSource: ConstraintSource;
}

let verticalIndex: Map<string, Vertical> | null = null;
let subVerticalIndex: Map<string, { vertical: Vertical; subVertical: SubVertical }> | null = null;

function buildIndexes(): void {
  const v = new Map<string, Vertical>();
  const sv = new Map<string, { vertical: Vertical; subVertical: SubVertical }>();
  for (const vertical of VERTICALS) {
    v.set(vertical.slug, vertical);
    for (const subVertical of vertical.subVerticals) {
      sv.set(subVertical.slug, { vertical, subVertical });
    }
  }
  verticalIndex = v;
  subVerticalIndex = sv;
}

function ensureIndexes(): void {
  if (verticalIndex === null || subVerticalIndex === null) {
    buildIndexes();
  }
}

export function findVertical(verticalSlug: string): Vertical | null {
  ensureIndexes();
  return verticalIndex!.get(verticalSlug) ?? null;
}

export function findSubVertical(subVerticalSlug: string): SubVertical | null {
  ensureIndexes();
  return subVerticalIndex!.get(subVerticalSlug)?.subVertical ?? null;
}

export function lookupEligibility(
  verticalSlug: string,
  subVerticalSlug: string,
): EligibilityVerdict | null {
  ensureIndexes();
  const found = subVerticalIndex!.get(subVerticalSlug);
  if (!found) return null;
  if (found.vertical.slug !== verticalSlug) return null;
  return {
    vertical: found.vertical,
    subVertical: found.subVertical,
    bucket: found.subVertical.bucket,
    bucketReason: found.subVertical.bucketReason,
    constraintSource: found.subVertical.constraintSource,
  };
}

export function getContentRules(subVerticalSlug: string): ContentRule[] {
  return findSubVertical(subVerticalSlug)?.contentRules ?? [];
}
