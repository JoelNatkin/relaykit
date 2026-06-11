"use client";

/**
 * Static, non-interactive graphic of the configurator for the home hero.
 *
 * NOT a live instance: it owns no state, calls no configurator/elig hooks, and
 * never touches localStorage — so it can't clobber the home's real embedded
 * ConfiguratorSection or /messages. It reproduces a fixed demo state (business
 * "Acme", Verification selected) as a product-forward peek.
 *
 * The left rail is HAND-BUILT in this file (it no longer reuses <CategoryList>):
 * it maps over every entry in CATEGORIES rendering a checkbox + the category
 * name only — no description sub-text and no per-row messages. Because it's
 * bespoke, it must be HAND-SYNCED if the category set or the checkbox styling
 * changes. The message cards still reuse the real <MessageReadCard> so message
 * styling + content track automatically. The whole subtree is `inert` (+
 * aria-hidden) so it's purely decorative — no pointer, focus, or a11y.
 */

import { MessageReadCard } from "@/components/configurator/message-read-card";
import {
  PAGE_TONES,
  tonePillClasses,
  effectiveBody,
} from "@/components/configurator/tone-pill";
import { CATEGORIES, VERIFICATION } from "@/lib/message-library";
import type { Category } from "@/lib/message-library";

const DEMO_BUSINESS = "Acme";
// Only Verification is checked in the demo state.
const DEMO_CHECKED = new Set(["verification"]);
// Curated rail set — drop Customer support, Team alerts, Community. The
// CATEGORIES source is untouched; display order is preserved by filtering.
const RAIL_EXCLUDED = new Set(["customer-support", "team-alerts", "community"]);
const RAIL_CATEGORIES = CATEGORIES.filter((c) => !RAIL_EXCLUDED.has(c.id));
// Right column shows only the Verification group, first two messages.
const DEMO_GROUPS: Category[] = [VERIFICATION];

const noop = () => {};

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
  return (
    // inert: no pointer/focus/a11y — purely decorative product peek.
    <div
      inert
      aria-hidden
      className="surface-flat rounded-[22px] border border-border-primary bg-surface-card p-5 shadow-xl sm:p-7"
    >
      {/* Header row — mirrors ConfiguratorSection. */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border-secondary pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Write your messages
        </h2>
        <span className="shrink-0 rounded-full border border-border-secondary bg-surface-inset px-3 py-1 text-xs font-medium text-text-tertiary">
          Free · no account
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
        {/* Hand-built categories rail — checkbox + name only, no dividers,
            24px (gap-6) between rows. All categories; Verification checked. */}
        <div className="rounded-xl border border-border-secondary bg-surface-inset p-5 md:min-w-60">
          <h3 className="text-base font-semibold text-text-primary">
            Categories
          </h3>
          <div className="mt-5 flex flex-col gap-5">
            {RAIL_CATEGORIES.map((category) => (
              <div key={category.id} className="flex items-center gap-3">
                <RailCheckbox checked={DEMO_CHECKED.has(category.id)} />
                <span className="text-lg font-medium text-text-primary">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages column */}
        <div className="flex flex-col md:max-w-[500px]">
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

          <div className="mt-8 space-y-7">
            {DEMO_GROUPS.map((category) => {
              const requiresStop = category.tcrMapping === "MARKETING";
              return (
                <div key={category.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-text-primary">
                      {category.name}
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {category.messages.slice(0, 2).map((message) => (
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
                        variables={category.variables}
                        categoryVariables={{}}
                        businessName={DEMO_BUSINESS}
                        requiresStop={requiresStop}
                        onEdit={noop}
                        onVariableDoubleClick={noop}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
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
