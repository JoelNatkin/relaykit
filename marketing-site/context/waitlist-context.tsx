"use client";

/**
 * App-level context for the early-access waitlist.
 *
 * Holds two things: (1) modal open/close state plus which CTA opened it, and
 * (2) a lightweight summary of the configurator selection. The configurator
 * keeps all its heavy editing state local and only *publishes* this summary
 * up (see the publish-summary effect in configurator-section.tsx); the modal
 * reads it. One-way flow, no prop drilling.
 *
 * Provided at the layout level so the top-nav button (above the home page,
 * present on every route), the mid-page and footer buttons, and the modal
 * itself all share one instance.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ToneId } from "@/lib/configurator/types";

export type CtaSource = "top-nav" | "mid-page" | "bottom";

export interface WaitlistSummary {
  /** Human-readable category titles, e.g. ["Verification", "Appointments"]. */
  categoryTitles: string[];
  tone: ToneId;
  businessName: string;
  configuratorTouched: boolean;
}

/**
 * Reproduces the configurator's untouched defaults (pack `verification-only`
 * → selected `{verification}`, tone `standard`, no business name). Used on
 * every page that has no configurator mounted, so the modal still shows a
 * correct "You're interested in: Verification".
 */
export const DEFAULT_WAITLIST_SUMMARY: WaitlistSummary = {
  categoryTitles: ["Verification"],
  tone: "standard",
  businessName: "",
  configuratorTouched: false,
};

interface WaitlistContextValue {
  isOpen: boolean;
  ctaSource: CtaSource | null;
  openModal: (source: CtaSource) => void;
  closeModal: () => void;
  summary: WaitlistSummary;
  setSummary: (summary: WaitlistSummary) => void;
}

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ctaSource, setCtaSource] = useState<CtaSource | null>(null);
  const [summary, setSummaryState] = useState<WaitlistSummary>(
    DEFAULT_WAITLIST_SUMMARY,
  );

  const openModal = useCallback((source: CtaSource) => {
    setCtaSource(source);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setSummary = useCallback((next: WaitlistSummary) => {
    setSummaryState(next);
  }, []);

  const value = useMemo<WaitlistContextValue>(
    () => ({ isOpen, ctaSource, openModal, closeModal, summary, setSummary }),
    [isOpen, ctaSource, openModal, closeModal, summary, setSummary],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return ctx;
}
