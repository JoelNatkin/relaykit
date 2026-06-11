"use client";

/**
 * Configurator peek for the home hero — mildly interactive, state-ISOLATED.
 *
 * NOT a live instance: it owns ONLY local view state (which category is active
 * + a manual-override flag). It calls NO configurator/elig hooks and NEVER
 * touches localStorage — so it can't clobber the home's real embedded
 * ConfiguratorSection or /messages. It reproduces a demo state (business
 * "Acme", one category selected) as a product-forward peek.
 *
 * Behavior: every 8s it auto-advances the active category through
 * RAIL_CATEGORIES (wrapping), the checked checkbox + the messages column
 * following along with a soft ~280ms fade/translate swap. Any click on a rail
 * row selects that category and permanently stops the auto-advance for this
 * mount. prefers-reduced-motion disables both the auto-advance and the swap
 * animation.
 *
 * The left rail is HAND-BUILT here (it doesn't reuse <CategoryList>): it maps
 * RAIL_CATEGORIES to a checkbox + name only. Because it's bespoke, it must be
 * HAND-SYNCED if the category set or checkbox styling changes. The message
 * cards reuse the real <MessageReadCard> so message styling + content track
 * automatically. Only the rail rows are interactive; the rest of the card
 * (tone pills, message cards, Copy CTA) stays decorative via `inert`.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageReadCard } from "@/components/configurator/message-read-card";
import {
  PAGE_TONES,
  tonePillClasses,
  effectiveBody,
} from "@/components/configurator/tone-pill";
import { CATEGORIES } from "@/lib/message-library";
import type { Category } from "@/lib/message-library";

const DEMO_BUSINESS = "Acme";
// Curated rail set — drop Customer support, Team alerts, Community. The
// CATEGORIES source is untouched; display order is preserved by filtering.
const RAIL_EXCLUDED = new Set(["customer-support", "team-alerts", "community"]);
const RAIL_CATEGORIES = CATEGORIES.filter((c) => !RAIL_EXCLUDED.has(c.id));

const INITIAL_CATEGORY = "verification";
const ADVANCE_MS = 8000;
const SWAP_MS = 280;

function nextCategoryId(currentId: string): string {
  const idx = RAIL_CATEGORIES.findIndex((c) => c.id === currentId);
  const next = RAIL_CATEGORIES[(idx + 1) % RAIL_CATEGORIES.length];
  return next.id;
}

// Bespoke rail checkbox — gold filled check when selected, empty rounded square
// otherwise. Mirrors the live category checkbox visually (D-427 gold for the
// selected CATEGORY) but is hand-built here; sync if that styling changes.
function RailCheckbox({ checked }: { checked: boolean }) {
  return (
    <span className="relative inline-flex size-5 shrink-0">
      <span
        className={`size-5 rounded ${
          checked
            ? "border border-border-gold bg-bg-gold"
            : "border-2 border-border-primary"
        }`}
      />
      {checked ? (
        <svg
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto size-3 text-text-on-gold"
        >
          <path
            d="M1.75 5.25 4 7.25 8.25 2.75"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

export function HeroConfiguratorGraphic() {
  const [activeId, setActiveId] = useState<string>(INITIAL_CATEGORY);
  // `out` drives the swap fade (mirrors the site's existing rotor motion).
  const [out, setOut] = useState(false);
  const [manual, setManual] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Refs so the interval + swap helper read fresh values without re-arming.
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Detect (and track) prefers-reduced-motion. Client-only → no SSR mismatch.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Swap to a category with the soft fade. Under reduced motion, swap instantly
  // (the fade classes are disabled too, so the trough would just blank).
  const swapTo = useCallback((id: string) => {
    clearTimeout(swapTimer.current);
    if (reducedRef.current) {
      setActiveId(id);
      setOut(false);
      return;
    }
    setOut(true);
    swapTimer.current = setTimeout(() => {
      setActiveId(id);
      setOut(false);
    }, SWAP_MS);
  }, []);

  // Auto-advance every 8s — never under manual override or reduced motion.
  useEffect(() => {
    if (manual || reduced) return;
    const interval = setInterval(() => {
      swapTo(nextCategoryId(activeIdRef.current));
    }, ADVANCE_MS);
    return () => clearInterval(interval);
  }, [manual, reduced, swapTo]);

  // Clear any pending swap timer on unmount.
  useEffect(() => () => clearTimeout(swapTimer.current), []);

  function handleSelect(id: string) {
    setManual(true); // stops auto-advance permanently for this mount
    if (id === activeIdRef.current) return;
    swapTo(id);
  }

  const activeCategory: Category =
    CATEGORIES.find((c) => c.id === activeId) ?? RAIL_CATEGORIES[0];
  const requiresStop = activeCategory.tcrMapping === "MARKETING";

  return (
    <div className="surface-flat rounded-[22px] border border-border-primary bg-surface-card p-5 shadow-xl sm:p-7">
      {/* Header row — mirrors ConfiguratorSection. */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border-secondary pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Choose your messages
        </h2>
        <span className="shrink-0 rounded-full border border-border-secondary bg-surface-inset px-3 py-1 text-xs font-medium text-text-tertiary">
          Free · no account
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Hand-built categories rail — the ONLY interactive part. Each row is a
            real button with aria-pressed; clicking sets manual mode. */}
        <div className="rounded-xl border border-border-secondary bg-surface-inset p-5">
          <h3 className="text-base font-semibold text-text-primary">
            Categories
          </h3>
          <div className="mt-5 flex flex-col gap-5">
            {RAIL_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category.id)}
                aria-pressed={category.id === activeId}
                className="flex items-center gap-3 text-left"
              >
                <RailCheckbox checked={category.id === activeId} />
                <span className="text-base font-medium text-text-primary">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages column — decorative (inert): tone pills, the swapping
            category group, and the Copy CTA are all non-interactive. */}
        <div className="flex flex-col md:max-w-[500px]" inert aria-hidden>
          <div className="flex flex-wrap gap-2">
            {PAGE_TONES.map((tone) => (
              <span
                key={tone}
                className={tonePillClasses(tone === "Standard")}
              >
                {tone}
              </span>
            ))}
          </div>

          {/* Swapping content — soft fade + slight translate-y, ~280ms, matching
              the site's existing rotor motion; disabled under reduced motion. */}
          <div
            className={`mt-8 transition-all duration-300 ease-linear motion-reduce:transition-none ${
              out ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-base font-semibold text-text-primary">
                  {activeCategory.name}
                </h4>
              </div>
              <div className="space-y-4">
                {activeCategory.messages.slice(0, 3).map((message) => (
                  <MessageReadCard
                    key={message.id}
                    name={message.name}
                    tooltip={message.tooltip}
                    body={effectiveBody(
                      message,
                      undefined,
                      undefined,
                      "Standard",
                    )}
                    variables={activeCategory.variables}
                    categoryVariables={{}}
                    businessName={DEMO_BUSINESS}
                    requiresStop={requiresStop}
                    onEdit={() => {}}
                    onVariableDoubleClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Prominent gold Copy CTA spanning the messages column (D-427). */}
          <div className="mt-7 flex h-12 w-full items-center justify-center rounded-lg bg-bg-gold text-base font-semibold text-text-on-gold">
            Copy messages
          </div>
        </div>
      </div>
    </div>
  );
}
