"use client";

/**
 * Static, non-interactive graphic of the configurator for the home hero.
 *
 * NOT a live instance: it owns no state, calls no configurator/elig hooks, and
 * never touches localStorage — so it can't clobber the home's real embedded
 * ConfiguratorSection or /messages. It reproduces a fixed demo state (business
 * "Acme", industry Project management / productivity SaaS, Verification +
 * Appointments selected) by reusing the REAL presentational leaf components
 * (CategoryList, MessageReadCard, tone pills) with hardcoded props, so leaf-
 * level style + content tweaks flow through automatically — no screenshot to
 * go stale. The container chrome (card shell, header, grid, group headings) is
 * mirrored from configurator-section.tsx and must be hand-synced if that chrome
 * is restyled.
 *
 * The whole subtree is `inert` (+ aria-hidden) so it's purely decorative — no
 * pointer, focus, or a11y interaction. Industry/sub-vertical is reflected only
 * by the absence of an eligibility advisory (productivity SaaS is bucket
 * "Clear"); no setup-summary row is rendered, matching the hero composition.
 */

import { Copy01 } from "@untitledui/icons";
import { CategoryList } from "@/components/configurator/category-list";
import { MessageReadCard } from "@/components/configurator/message-read-card";
import {
  PAGE_TONES,
  tonePillClasses,
  effectiveBody,
} from "@/components/configurator/tone-pill";
import { CATEGORIES, VERIFICATION, APPOINTMENTS } from "@/lib/message-library";
import type { Category } from "@/lib/message-library";
import type {
  ConfiguratorState,
  CategoryState,
  MessageState,
  CategoryValues,
} from "@/lib/configurator/use-configurator-state";

const DEMO_BUSINESS = "Acme";
const DEMO_CHECKED = new Set(["verification", "appointments"]);
// Category groups shown in the right column, in display order. Both selected.
const DEMO_GROUPS: Category[] = [VERIFICATION, APPOINTMENTS];

const noop = () => {};

// A hardcoded ConfiguratorState shaped exactly like the live one, with
// Verification + Appointments checked. CategoryList only reads `categories`,
// but the full shape keeps the type honest without a cast.
function buildDemoState(): ConfiguratorState {
  const categories: Record<string, CategoryState> = {};
  const categoryValues: Record<string, CategoryValues> = {};
  for (const category of CATEGORIES) {
    const checked = DEMO_CHECKED.has(category.id);
    const messages: Record<string, MessageState> = {};
    for (const m of category.messages) messages[m.id] = { checked };
    categories[category.id] = { checked, messages };
    categoryValues[category.id] = {
      variables: {},
      customBodies: {},
      addedMessages: [],
      messageTones: {},
    };
  }
  return {
    version: 4,
    categories,
    categoryValues,
    pageTone: "Standard",
    businessName: DEMO_BUSINESS,
  };
}

export function HeroConfiguratorGraphic() {
  const state = buildDemoState();
  return (
    // inert: no pointer/focus/a11y — purely decorative product peek.
    <div
      inert
      aria-hidden
      className="rounded-[22px] border border-border-primary bg-surface-card p-5 shadow-xl sm:p-7"
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
        {/* Categories panel — flat (expandChecked=false), inset surface. */}
        <div className="rounded-xl border border-border-secondary bg-surface-inset md:min-w-60">
          <CategoryList
            state={state}
            onCategoryToggle={noop}
            onMessageToggle={noop}
            expandChecked={false}
          />
        </div>

        {/* Messages column */}
        <div className="flex flex-col md:max-w-[500px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-text-tertiary">
              <Copy01 className="size-4" />
              Copy
            </span>
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
                    {category.messages.map((message) => (
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
        </div>
      </div>
    </div>
  );
}
