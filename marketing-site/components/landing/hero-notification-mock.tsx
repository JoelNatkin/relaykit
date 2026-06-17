"use client";

/**
 * Animated phone-notification visual for the Developer-tools landing hero
 * (D-436). The account-event messages "arrive & settle" like real notifications:
 * each card enters from just above its resting spot, holds, then drops away
 * before the next arrives — never two on screen at once.
 *
 * State-ISOLATED like HeroConfiguratorGraphic — it owns only local view state,
 * calls no store/configurator hooks, and never touches localStorage. The
 * business name is the static demo "Acme".
 *
 * Motion (per phase, one lead transform = translate + a touch of scale):
 *   ENTER  ~420ms ease-out — from translateY(-16px) scale(0.98) opacity 0 → rest.
 *   REST   ~4.5s hold (pausable).
 *   EXIT   ~240ms ease-in  — drift to translateY(8px) scale(0.98) opacity 0.
 * The card HEIGHT transitions between messages of different lengths (measured),
 * so short↔long swaps grow/shrink gracefully instead of snapping.
 *
 * prefers-reduced-motion: a plain body opacity crossfade — no transforms, no
 * height animation — and the pause toggle is hidden.
 */

import { useEffect, useRef, useState } from "react";

const DEMO_BUSINESS = "Acme";
const ENTER_MS = 420;
const EXIT_MS = 240;
const REST_MS = 4500;
const REDUCED_FADE_MS = 220;

// Account-event notification bodies, in rotation order (from the dev-tools
// mockup). Business name is rendered separately as the notification app label.
const BODIES = [
  "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
  "Your trial ends in 3 days. Choose a plan to keep your account: yourapp.com/billing",
  "New sign-in from Chrome on Mac, Denver. Not you? Secure your account: yourapp.com/security",
  "Your account has been suspended. Review the details and next steps here: yourapp.com/account",
  "Your subscription change is confirmed. View the details in your account: yourapp.com/account",
];

// Split a notification body so any URL renders as an iOS-style system-blue
// link. The hex is an intentional literal — a platform link color, not a theme
// token (same rationale as the OS cursor glyph elsewhere).
const URL_RE = /([a-z0-9.-]+\.[a-z]{2,}\/[^\s]+)/i;
function renderBody(text: string) {
  return text.split(URL_RE).map((part, i) =>
    URL_RE.test(part) ? (
      <span key={i} style={{ color: "#0A84FF" }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

type Phase = "preEnter" | "enter" | "rest" | "exit";

export function HeroNotificationMock() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("preEnter");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [bodyH, setBodyH] = useState<number>();
  const [fade, setFade] = useState(false); // reduced-motion crossfade only

  const bodyRef = useRef<HTMLParagraphElement>(null);

  // Track prefers-reduced-motion (client-only → no SSR mismatch).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Measure the current body's natural height so the card height can transition
  // between messages of different lengths. (Margin lives on the wrapper, not the
  // <p>, so offsetHeight is the exact content height.)
  useEffect(() => {
    if (reduced) return;
    if (bodyRef.current) setBodyH(bodyRef.current.offsetHeight);
  }, [index, reduced]);

  // ── Phase machine (skipped under reduced motion) ──────────────────────────
  // preEnter → enter: flip on the next frame so the enter transition runs from
  // the above/scaled/transparent start state rather than snapping.
  useEffect(() => {
    if (reduced || phase !== "preEnter") return;
    const raf = requestAnimationFrame(() =>
      setPhase((p) => (p === "preEnter" ? "enter" : p)),
    );
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced, index]);

  useEffect(() => {
    if (reduced || phase !== "enter") return;
    const t = setTimeout(() => setPhase("rest"), ENTER_MS);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  // rest → exit, held while paused (resume restarts the dwell).
  useEffect(() => {
    if (reduced || phase !== "rest" || paused) return;
    const t = setTimeout(() => setPhase("exit"), REST_MS);
    return () => clearTimeout(t);
  }, [phase, reduced, paused]);

  // exit → next message (back to preEnter). Sequenced so the next card only
  // begins entering after this one has fully left — never both at once.
  useEffect(() => {
    if (reduced || phase !== "exit") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % BODIES.length);
      setPhase("preEnter");
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  // ── Reduced motion: plain body crossfade, no transforms / no height anim ───
  useEffect(() => {
    if (!reduced) return;
    const interval = setInterval(() => {
      if (paused) return;
      setFade(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % BODIES.length);
        setFade(false);
      }, REDUCED_FADE_MS);
    }, REST_MS);
    return () => clearInterval(interval);
  }, [reduced, paused]);

  // Card transform/opacity for the current phase (one lead transform).
  const transform =
    phase === "preEnter"
      ? "translateY(-16px) scale(0.98)"
      : phase === "exit"
        ? "translateY(8px) scale(0.98)"
        : "translateY(0) scale(1)";
  const visible = phase === "enter" || phase === "rest";
  const transition =
    phase === "preEnter"
      ? "none"
      : phase === "exit"
        ? `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in`
        : `transform ${ENTER_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${ENTER_MS}ms ease-out`;

  const cardStyle = reduced
    ? undefined
    : { transform, opacity: visible ? 1 : 0, transition };

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

          {/* Notification — pinned to the bottom; the whole card carries the
              per-phase enter/exit transform. */}
          <div
            style={cardStyle}
            className="mt-auto rounded-[18px] border border-white/10 bg-white/[0.08] p-3.5 backdrop-blur-xl"
          >
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
            {/* Height-animated body region — margin on the wrapper so the
                measured <p> height is exact. */}
            <div
              className="mt-2 overflow-hidden transition-[height] duration-[420ms] ease-out motion-reduce:transition-none"
              style={{ height: reduced ? undefined : bodyH }}
            >
              <p
                ref={bodyRef}
                className="text-[13px] leading-snug text-text-primary"
                style={
                  reduced
                    ? {
                        opacity: fade ? 0 : 1,
                        transition: `opacity ${REDUCED_FADE_MS}ms ease`,
                      }
                    : undefined
                }
              >
                {renderBody(BODIES[index])}
              </p>
            </div>
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
