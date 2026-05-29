"use client";

/**
 * Elig section state — the three identity facts captured on the home page
 * (multi-tenant flag, vertical, sub-vertical), the derived bucket + verdict,
 * and an updatedAt stamp. Persists to `localStorage.relaykit_elig` as the
 * durable handoff to the future onboarding wizard (continuity-of-intent —
 * MASTER_PLAN principle #7).
 *
 * Lazy-create rule: localStorage is not written until the visitor's first
 * interaction. The key does not exist for untouched visitors; first interaction
 * creates it with whatever subset of fields are now set.
 *
 * Verdict derivation:
 *   1. multiTenant === "multi" → ⚫ Not yet (multi-tenant routes here
 *      regardless of D2/D3 per vertical-constraints §9.3).
 *   2. verticalSlug + subVerticalSlug both set → lookupEligibility's bucket.
 *   3. verticalSlug set + the vertical has NO routingTrigger:true rows →
 *      verdict resolves at D2 from the single shared bucket. (Currently
 *      unreachable in practice: every vertical in verticals.ts has at least
 *      one routing-trigger row as of 2026-05-29. The branch stays for data
 *      robustness.)
 *   4. Else verdict = null (placeholder / free-use mode).
 *
 * Wave 1 leaves `verdict.copy` null; Wave 2 fills it from the authored copy
 * module. The persisted shape is complete from Wave 1 so downstream consumers
 * (future wizard) have everything they need.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Bucket } from "../../../lib/constraints/types";
import { findVertical, lookupEligibility } from "../../../lib/constraints/lookup";

const STORAGE_KEY = "relaykit_elig";
const STATE_VERSION = 1 as const;
const SAVE_DEBOUNCE_MS = 200;

export type MultiTenantValue = "single" | "multi";

export type VerdictTier =
  | "clear"
  | "conditional"
  | "not-yet-maybe-not"
  | "not-yet"
  | "not-our-lane";

export interface Verdict {
  tier: VerdictTier | null;
  copy: string | null;
}

export interface EligState {
  /** Schema version — bumps invalidate persisted state on load. */
  version: typeof STATE_VERSION;
  multiTenant: MultiTenantValue | null;
  verticalSlug: string | null;
  subVerticalSlug: string | null;
  bucket: Bucket | null;
  verdict: Verdict;
  /** ISO timestamp of last user interaction. null until first touch. */
  updatedAt: string | null;
}

export interface EligActions {
  setMultiTenant: (value: MultiTenantValue | null) => void;
  setVerticalSlug: (slug: string | null) => void;
  setSubVerticalSlug: (slug: string | null) => void;
}

function bucketToTier(bucket: Bucket): VerdictTier {
  switch (bucket) {
    case "Clear":
      return "clear";
    case "Conditional":
      return "conditional";
    case "Not yet, maybe not ever":
      return "not-yet-maybe-not";
    case "Not yet":
      return "not-yet";
    case "Not our lane":
      return "not-our-lane";
  }
}

/**
 * Pure derivation. Returns the {bucket, verdict} pair implied by the three
 * input fields, without touching updatedAt. updatedAt is set by the setters
 * (one bump per user interaction) so derivation can be called freely.
 */
function deriveVerdict(input: {
  multiTenant: MultiTenantValue | null;
  verticalSlug: string | null;
  subVerticalSlug: string | null;
}): { bucket: Bucket | null; verdict: Verdict } {
  // Wave 1 leaves copy null across the board; Wave 2 populates from elig-copy.ts.
  // The bucket/tier fields are complete from Wave 1 so persisted state is durable.

  if (input.multiTenant === "multi") {
    // Multi-tenant routes to ⚫ Not yet regardless of D2/D3 (§9.3).
    return {
      bucket: "Not yet",
      verdict: { tier: "not-yet", copy: null },
    };
  }

  if (input.verticalSlug && input.subVerticalSlug) {
    const e = lookupEligibility(input.verticalSlug, input.subVerticalSlug);
    if (e) {
      return {
        bucket: e.bucket,
        verdict: { tier: bucketToTier(e.bucket), copy: null },
      };
    }
    // Inconsistent state (subVertical slug doesn't belong to vertical) — fall through to null.
    return { bucket: null, verdict: { tier: null, copy: null } };
  }

  if (input.verticalSlug) {
    const vertical = findVertical(input.verticalSlug);
    if (vertical) {
      const anyTrigger = vertical.subVerticals.some((s) => s.routingTrigger);
      if (!anyTrigger && vertical.subVerticals.length > 0) {
        // Pre-flight invariant (Wave 1): single-bucket consensus across subs.
        // Currently unreachable in production data — every vertical has at
        // least one routing-trigger row — but the branch stays for robustness.
        const sharedBucket = vertical.subVerticals[0].bucket;
        return {
          bucket: sharedBucket,
          verdict: { tier: bucketToTier(sharedBucket), copy: null },
        };
      }
    }
  }

  return { bucket: null, verdict: { tier: null, copy: null } };
}

function baselineState(): EligState {
  return {
    version: STATE_VERSION,
    multiTenant: null,
    verticalSlug: null,
    subVerticalSlug: null,
    bucket: null,
    verdict: { tier: null, copy: null },
    updatedAt: null,
  };
}

function isMultiTenant(value: unknown): value is MultiTenantValue {
  return value === "single" || value === "multi";
}

/** Merge persisted state over the baseline. Version-gated drop on mismatch. */
function mergeStored(stored: unknown): EligState {
  if (!stored || typeof stored !== "object") return baselineState();
  const s = stored as Record<string, unknown>;
  if (s.version !== STATE_VERSION) return baselineState();

  const multiTenant = isMultiTenant(s.multiTenant) ? s.multiTenant : null;
  const verticalSlug = typeof s.verticalSlug === "string" ? s.verticalSlug : null;
  const subVerticalSlug =
    typeof s.subVerticalSlug === "string" ? s.subVerticalSlug : null;
  const updatedAt = typeof s.updatedAt === "string" ? s.updatedAt : null;

  // Recompute bucket+verdict from the persisted inputs — never trust a stale
  // verdict from disk against the live data layer.
  const { bucket, verdict } = deriveVerdict({
    multiTenant,
    verticalSlug,
    subVerticalSlug,
  });

  return {
    version: STATE_VERSION,
    multiTenant,
    verticalSlug,
    subVerticalSlug,
    bucket,
    verdict,
    updatedAt,
  };
}

export function useEligState(): { state: EligState } & EligActions {
  const [state, setState] = useState<EligState>(baselineState);
  const hydratedRef = useRef(false);
  // Lazy-create gate. False until the visitor's first interaction (or until
  // hydration finds a persisted record from a prior session, which implies
  // the user touched it last time).
  const touchedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage on mount — client-only, so SSR renders the baseline.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(mergeStored(JSON.parse(raw)));
        touchedRef.current = true;
      }
    } catch {
      // Parse/availability failure — keep the baseline, never block render.
    }
    hydratedRef.current = true;
  }, []);

  // Debounced persist. Lazy-create: skip the write until the user has touched.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!touchedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage unavailable/full — selections simply won't persist this session.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  const setMultiTenant = useCallback((value: MultiTenantValue | null) => {
    touchedRef.current = true;
    setState((prev) => {
      const next = { ...prev, multiTenant: value };
      const { bucket, verdict } = deriveVerdict(next);
      return {
        ...next,
        bucket,
        verdict,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setVerticalSlug = useCallback((slug: string | null) => {
    touchedRef.current = true;
    setState((prev) => {
      // Changing vertical clears any sub-vertical pick (sub only makes sense
      // within a vertical).
      const next = {
        ...prev,
        verticalSlug: slug,
        subVerticalSlug: prev.verticalSlug === slug ? prev.subVerticalSlug : null,
      };
      const { bucket, verdict } = deriveVerdict(next);
      return {
        ...next,
        bucket,
        verdict,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setSubVerticalSlug = useCallback((slug: string | null) => {
    touchedRef.current = true;
    setState((prev) => {
      const next = { ...prev, subVerticalSlug: slug };
      const { bucket, verdict } = deriveVerdict(next);
      return {
        ...next,
        bucket,
        verdict,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  return { state, setMultiTenant, setVerticalSlug, setSubVerticalSlug };
}
