"use client";

/**
 * Configurator card for the home hero — mildly interactive, state-ISOLATED,
 * self-clipping.
 *
 * Self-contained card: its OWN container is the fixed-height, overflow-hidden,
 * uniformly-bordered box — there is no external clipping window, no scaled
 * 920px layout, no gradient/mask/taper. The internals are sized to fit the
 * card's own (column) width; the bottom edge cleanly cuts the third message
 * card.
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
// Full rail — every category in the corpus (all 9), display order preserved.
// Auto-advance cycles through the whole set.
const RAIL_CATEGORIES = CATEGORIES;

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
// size-4 to suit the compact card rail.
function RailCheckbox({ checked }: { checked: boolean }) {
  return (
    <span className="relative inline-flex size-4 shrink-0">
      <span
        className={`size-4 rounded ${
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
          className="pointer-events-none absolute inset-0 m-auto size-2.5 text-text-on-gold"
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
    // Self-clipping card: fixed height + overflow-hidden + uniform border. The
    // height shows ~2½ message cards; the 3rd is cut by the card's own bottom
    // edge (clean clip, no fade). Height is a visual tunable.
    <div className="surface-flat h-[480px] overflow-hidden rounded-[22px] border border-border-primary bg-surface-card p-5 shadow-xl">
      {/* Header row — mirrors ConfiguratorSection, sized down for the card. */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-secondary pb-4">
        <h2 className="text-lg font-bold tracking-tight text-text-primary">
          Choose your messages
        </h2>
        <span className="shrink-0 rounded-full border border-border-secondary bg-surface-inset px-2.5 py-1 text-xs font-medium text-text-tertiary">
          Free · no account
        </span>
      </div>

      {/* Fixed tracks: 170px rail + 500px messages. The messages column is
          intentionally wider than the card — it crops at the card's right edge
          (overflow-hidden), a deliberate peek, not a shrunk-to-fit column. */}
      <div className="grid grid-cols-[170px_500px] gap-4">
        {/* Hand-built categories rail — the ONLY interactive part. All 9
            categories; each row is a real button with aria-pressed; clicking
            sets manual mode. Tightened spacing/type to stay comfortable at
            170px with 9 rows. */}
        <div className="rounded-xl border border-border-secondary bg-surface-inset p-3">
          <h3 className="text-sm font-semibold text-text-primary">Categories</h3>
          <div className="mt-3 flex flex-col gap-3">
            {RAIL_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category.id)}
                aria-pressed={category.id === activeId}
                className="flex items-center gap-2 text-left"
              >
                <RailCheckbox checked={category.id === activeId} />
                <span className="text-sm font-medium text-text-primary">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages column — decorative (inert): tone pills, the swapping
            category group, and the Copy CTA are all non-interactive. */}
        <div className="flex flex-col" inert aria-hidden>
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
            className={`mt-6 transition-all duration-300 ease-linear motion-reduce:transition-none ${
              out ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-text-primary">
                  {activeCategory.name}
                </h4>
              </div>
              <div className="space-y-3">
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

          {/* Prominent gold Copy CTA spanning the messages column (D-427). Sits
              below the clip line — cropped by the card's bottom edge. */}
          <div className="mt-7 flex h-12 w-full items-center justify-center rounded-lg bg-bg-gold text-base font-semibold text-text-on-gold">
            Copy messages
          </div>
        </div>
      </div>
    </div>
  );
}
