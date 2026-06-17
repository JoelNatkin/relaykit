"use client";

/**
 * Animated phone-notification visual for the Developer-tools landing hero
 * (D-436). Adapts the dev-tools mockup's rotating-notification into React: the
 * five account-event messages cross-fade through the notification body on an
 * interval, with a pause toggle.
 *
 * State-ISOLATED like HeroConfiguratorGraphic — it owns only local view state
 * (index + paused + reduced), calls no store/configurator hooks, and never
 * touches localStorage. The business name is the static demo "Acme" (the hero
 * is not bound to the shared business-name store).
 *
 * Motion: every 4s the body swaps with a ~280ms opacity cross-fade (not an
 * abrupt swap). prefers-reduced-motion holds the first frame — no auto-advance,
 * no fade — and hides the pause toggle.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const DEMO_BUSINESS = "Acme";
const ADVANCE_MS = 4000;
const FADE_MS = 280;

// Account-event notification bodies, in rotation order (from the dev-tools
// mockup). Business name is rendered separately as the notification app label.
const BODIES = [
  "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
  "Your trial ends in 3 days. Choose a plan to keep your account: yourapp.com/billing",
  "New sign-in from Chrome on Mac, Denver. Not you? Secure your account: yourapp.com/security",
  "Your account has been suspended. Review the details and next steps here: yourapp.com/account",
  "Your subscription change is confirmed. View the details in your account: yourapp.com/account",
];

export function HeroNotificationMock() {
  const [index, setIndex] = useState(0);
  const [out, setOut] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const indexRef = useRef(index);
  indexRef.current = index;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Track prefers-reduced-motion (client-only → no SSR mismatch).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Advance to the next body with the opacity cross-fade. Under reduced motion,
  // swap instantly (the fade classes are disabled too).
  const advance = useCallback(() => {
    const next = (indexRef.current + 1) % BODIES.length;
    clearTimeout(fadeTimer.current);
    if (reducedRef.current) {
      setIndex(next);
      setOut(false);
      return;
    }
    setOut(true);
    fadeTimer.current = setTimeout(() => {
      setIndex(next);
      setOut(false);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const interval = setInterval(advance, ADVANCE_MS);
    return () => clearInterval(interval);
  }, [paused, reduced, advance]);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* Soft ambient glow behind the phone (brand warm-gray, not gold). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, rgba(149,134,117,0.18), transparent 70%)",
        }}
      />

      {/* Phone frame — realistic ~9:18 portrait aspect (taller than wide). */}
      <div className="mx-auto h-[560px] w-[300px] overflow-hidden rounded-[44px] border border-border-primary bg-surface-card p-3 shadow-xl">
        <div className="relative flex h-full flex-col rounded-[30px] border border-border-secondary bg-bg-primary px-5 pb-6 pt-9">
          {/* Dynamic-island pill. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-3 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black/60"
          />

          {/* Lock-screen clock. */}
          <div className="mt-6 text-center">
            <div className="text-5xl font-semibold tracking-tight text-text-primary">
              9:41
            </div>
            <div className="mt-1 text-sm text-text-tertiary">
              Saturday, June 13
            </div>
          </div>

          {/* Notification — pinned to the bottom of the screen. */}
          <div className="mt-auto rounded-[18px] border border-border-secondary bg-surface-card/80 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="flex size-[22px] items-center justify-center rounded-md bg-bg-gold text-[11px] font-bold text-text-on-gold">
                {DEMO_BUSINESS.charAt(0)}
              </span>
              <span className="text-xs font-semibold text-text-secondary">
                {DEMO_BUSINESS}
              </span>
              <span className="ml-auto text-[11px] text-text-quaternary">
                now
              </span>
            </div>
            <p
              className={`mt-2 text-[13px] leading-relaxed text-text-primary transition-opacity duration-300 ease-linear motion-reduce:transition-none ${
                out ? "opacity-0" : "opacity-100"
              }`}
            >
              {BODIES[index]}
            </p>
          </div>
        </div>
      </div>

      {/* Pause / play toggle — hidden under reduced motion (nothing to pause). */}
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume message rotation" : "Pause message rotation"}
          className="mx-auto mt-3 flex size-5 items-center justify-center text-text-quaternary opacity-60 transition duration-100 ease-linear hover:text-text-tertiary hover:opacity-100"
        >
          {paused ? (
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="size-3.5">
              <path d="M6 3.5 L16.5 10 L6 16.5 Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="size-3.5">
              <rect x="5.5" y="3" width="3.5" height="14" rx="1" />
              <rect x="11" y="3" width="3.5" height="14" rx="1" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
