"use client";

/**
 * Empty-state placeholder that replaces the message stream when the verdict
 * is 🟠 / ⚫ / 🔴 (vertical-constraints §9.3). The verdict card above
 * carries the meaning (line + waitlist for 🟠/⚫, lane line for 🔴); this
 * surface is a quiet structural hold for the message area.
 *
 * Sized for a future illustration drop-in: a fixed-aspect container that can
 * be filled visually later without restructuring (§9.8 deferred — empty-state
 * illustration TBD, one-vs-three TBD).
 *
 * Bucket-keyed copy is minimal — most of the message is already in the
 * verdict card. Surveillance is the exception: §9.6's two-tier carve-out
 * places its secondary line here.
 */

import { Inbox01 } from "@untitledui/icons";
import type { EligState } from "@/lib/configurator/use-elig-state";
import { SURVEILLANCE_EMPTY_STATE_LINE, SURVEILLANCE_SLUG } from "@/lib/configurator/elig-copy";

const TIER_LINES: Record<string, string> = {
  "not-yet-maybe-not": "No messages available for this category.",
  "not-yet": "No messages available for this category yet.",
  "not-our-lane": "No messages available for this category.",
};

export interface EligEmptyStateProps {
  state: EligState;
}

export function EligEmptyState({ state }: EligEmptyStateProps) {
  const tier = state.verdict.tier;
  if (
    tier !== "not-yet-maybe-not" &&
    tier !== "not-yet" &&
    tier !== "not-our-lane"
  ) {
    return null;
  }

  const baseLine = TIER_LINES[tier];
  const secondLine =
    state.subVerticalSlug === SURVEILLANCE_SLUG
      ? SURVEILLANCE_EMPTY_STATE_LINE
      : null;

  return (
    <div
      // Fixed-height structural placeholder — sized so a later illustration
      // can drop in centered without re-flowing. Dashed border matches the
      // existing "Select a category" empty state pattern.
      className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-secondary px-6 py-10 text-center"
      role="status"
    >
      <Inbox01 className="size-8 text-fg-quaternary" aria-hidden />
      <p className="text-sm text-text-tertiary">{baseLine}</p>
      {secondLine ? (
        <p className="text-xs text-text-quaternary">{secondLine}</p>
      ) : null}
    </div>
  );
}
