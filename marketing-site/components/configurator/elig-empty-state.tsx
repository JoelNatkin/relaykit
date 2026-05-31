"use client";

/**
 * Message-area treatment for the Not-yet buckets (⚫ "Not yet" + 🟠 "Not yet,
 * maybe not ever"). It occupies the message stream's place — the categories
 * panel is disabled above — rather than leaving the area blank under a floating
 * card: a boundary line stating RelayKit can't send the category yet, plus a
 * "Request category" action that opens the request modal. The interest_tag
 * (vetting: vs capacity:) is derived from the elig state.
 *
 * Other tiers render nothing here — 🟢/🟡 keep their message stream, and 🔴
 * sub-verticals are unselectable (disabled in the sub-vertical dropdown), so no
 * message-area treatment is needed for them.
 *
 * The fixed-height dashed container is sized so a later illustration can drop in
 * centered without re-flowing (illustration deferred per §9.8).
 */

import { Inbox01 } from "@untitledui/icons";
import { useState } from "react";
import type { EligState } from "@/lib/configurator/use-elig-state";
import {
  NOT_YET_BOUNDARY_LINE,
  eligInterestTag,
} from "@/lib/configurator/elig-copy";
import { EligRequestModal } from "./elig-request-modal";

export interface EligEmptyStateProps {
  state: EligState;
}

export function EligEmptyState({ state }: EligEmptyStateProps) {
  const tier = state.verdict.tier;
  const [modalOpen, setModalOpen] = useState(false);

  if (tier !== "not-yet" && tier !== "not-yet-maybe-not") {
    return null;
  }

  return (
    <>
      <div
        className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-secondary px-6 py-10 text-center"
        role="status"
      >
        <Inbox01 className="size-8 text-fg-quaternary" aria-hidden />
        <p className="text-sm text-text-secondary">{NOT_YET_BOUNDARY_LINE}</p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="cursor-pointer text-sm font-medium text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
        >
          Request category
        </button>
      </div>
      <EligRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        interestTag={eligInterestTag(state)}
      />
    </>
  );
}
