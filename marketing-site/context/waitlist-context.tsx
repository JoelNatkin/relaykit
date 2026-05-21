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
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePostHog } from "posthog-js/react";

export type CtaSource = "top-nav" | "mid-page" | "bottom";

export interface WaitlistSummary {
  /** Human-readable category titles, e.g. ["Verification", "Appointments"]. */
  categoryTitles: string[];
  tone: string;
  businessName: string;
  configuratorTouched: boolean;
  /** Extended configurator snapshot — additive, populated only when a
   *  configurator is mounted. Consumed by the `early_access_clicked` event. */
  categoriesSelected?: string[];
  messagesSelected?: string[];
  toneDefault?: string;
  hasOverrides?: boolean;
}

/**
 * Reproduces the configurator's untouched defaults (Verification + its primary
 * message selected, tone Standard, no business name). Used on every page that
 * has no configurator mounted, so the modal still shows a correct
 * "Live at launch: Verification".
 */
export const DEFAULT_WAITLIST_SUMMARY: WaitlistSummary = {
  categoryTitles: ["Verification"],
  tone: "Standard",
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
  const posthog = usePostHog();
  const [isOpen, setIsOpen] = useState(false);
  const [ctaSource, setCtaSource] = useState<CtaSource | null>(null);
  const [summary, setSummaryState] = useState<WaitlistSummary>(
    DEFAULT_WAITLIST_SUMMARY,
  );

  // Mirror the latest summary into a ref so the stable `openModal` callback
  // can read a fresh configurator snapshot without re-creating itself.
  const summaryRef = useRef(summary);
  summaryRef.current = summary;

  const openModal = useCallback(
    (source: CtaSource) => {
      const s = summaryRef.current;
      posthog?.capture("early_access_clicked", {
        categories_selected: s.categoriesSelected ?? [],
        messages_selected: s.messagesSelected ?? [],
        tone_default: s.toneDefault ?? s.tone,
        has_overrides: s.hasOverrides ?? false,
        source,
      });
      setCtaSource(source);
      setIsOpen(true);
    },
    [posthog],
  );

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
