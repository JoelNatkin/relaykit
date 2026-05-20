"use client";

/**
 * The categories panel content — preset dropdown header + the 9 category
 * cards (Verification authored, the other 8 rendered as disabled "Coming
 * soon"). Pure presentational: receives state + setters from the parent,
 * never reads from any hook directly.
 *
 * Rendered by BOTH the desktop categories card (configurator-section.tsx)
 * AND the mobile full-page modal (mobile-categories-modal.tsx) so the two
 * surfaces stay byte-identical. The outer card / modal shell wraps this
 * component; this component renders only the inside.
 */

import { HelpCircle } from "@untitledui/icons";
import { Tooltip } from "@/components/configurator/tooltip";
import { ComingSoonBadge } from "@/components/configurator/coming-soon-badge";
import {
  PresetDropdown,
  type Preset,
} from "@/components/configurator/preset-dropdown";
import {
  CATEGORIES,
  categorySubs,
  isAuthored,
} from "@/lib/message-library";
import type { ConfiguratorState } from "@/lib/configurator/use-configurator-state";

/** Dropdown presets. Only "Verification only" is reachable at launch. */
const PRESETS: Preset[] = [
  { id: "verification-only", label: "Verification only", disabled: false },
  { id: "saas", label: "SaaS", disabled: true },
  { id: "personal-services", label: "Personal services", disabled: true },
  { id: "real-estate", label: "Real estate", disabled: true },
  { id: "fitness", label: "Fitness", disabled: true },
  { id: "ecommerce", label: "E-commerce", disabled: true },
];

/**
 * Configurator checkbox — a custom appearance-none box matching the
 * "Recommended combinations" dropdown trigger's fill + border in both
 * modes (bg-bg-primary / dark:bg-bg-secondary, border-border-primary).
 * The check glyph renders on top of the same fill; the 1px stroke is
 * kept for the checked state. Category rows use the larger size-5 box,
 * sub rows the size-4 box; `disabled` (Coming-soon categories) softens
 * the border. The box className is identical across checked/unchecked,
 * so the box never changes size on toggle.
 */
function ConfiguratorCheckbox({
  checked,
  size = "sub",
  disabled = false,
}: {
  checked: boolean;
  size?: "sub" | "category";
  disabled?: boolean;
}) {
  const boxSize = size === "category" ? "size-5" : "size-4";
  const glyphSize = size === "category" ? "size-3" : "size-2.5";
  const borderColor = disabled ? "border-border-secondary" : "border-border-primary";
  return (
    <span className={`relative mt-0.5 inline-flex ${boxSize} shrink-0`}>
      <input
        type="checkbox"
        checked={checked}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        className={`${boxSize} appearance-none rounded border ${borderColor} bg-bg-primary dark:bg-bg-secondary`}
      />
      {checked ? (
        <svg
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`pointer-events-none absolute inset-0 m-auto ${glyphSize} text-text-primary`}
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

export interface CategoryListProps {
  state: ConfiguratorState;
  presetValue: string;
  onCategoryToggle: (categoryId: string) => void;
  onSubToggle: (categoryId: string, subId: string) => void;
  onSelectPreset: (presetId: string) => void;
}

export function CategoryList({
  state,
  presetValue,
  onCategoryToggle,
  onSubToggle,
  onSelectPreset,
}: CategoryListProps) {
  return (
    <>
      <div className="px-4 pt-5 pb-3">
        <h3 className="text-base font-semibold text-text-primary">Categories</h3>
        <div className="mt-4">
          <p className="mb-1.5 text-sm font-medium text-text-secondary">
            Recommended combinations
          </p>
          <PresetDropdown
            presets={PRESETS}
            value={presetValue}
            onSelect={onSelectPreset}
          />
        </div>
      </div>

      {CATEGORIES.map((category) => {
        const catState = state.categories[category.id];
        const authored = isAuthored(category);
        const checked = !!catState?.checked;
        return (
          <div
            key={category.id}
            className="border-b border-border-secondary px-4 py-5 last:border-b-0"
          >
            {authored ? (
              <button
                type="button"
                onClick={() => onCategoryToggle(category.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <ConfiguratorCheckbox checked={checked} size="category" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-primary">
                    {category.name}
                  </span>
                  {!checked ? (
                    <p className="mt-1 text-xs text-text-tertiary">
                      {category.description}
                    </p>
                  ) : null}
                </div>
              </button>
            ) : (
              <div className="flex w-full items-start gap-3">
                <ConfiguratorCheckbox checked={false} size="category" disabled />
                <div className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      {category.name}
                    </span>
                    <ComingSoonBadge />
                  </span>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {category.description}
                  </p>
                </div>
              </div>
            )}

            {authored && checked ? (
              <div className="mt-3 space-y-2 pl-7">
                {categorySubs(category).map((sub) => {
                  const subChecked =
                    !!catState?.subs[sub.id]?.checked;
                  return (
                    // role="button" instead of <button> because the row
                    // contains a nested interactive element (the ? icon's
                    // Tooltip span), which a real <button> can't legally
                    // wrap. Same pattern MessageReadCard uses for its
                    // click-to-edit body. Keyboard nav handled via tabIndex
                    // + onKeyDown for Enter and Space.
                    <div
                      key={sub.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSubToggle(category.id, sub.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSubToggle(category.id, sub.id);
                        }
                      }}
                      className="flex w-full cursor-pointer items-start gap-2.5 text-left"
                    >
                      <ConfiguratorCheckbox checked={subChecked} />
                      {/* Inner wrapper centers the label + ? icon on the
                          label's optical midline (items-center) and gives
                          them the same 6px gap the message-card uses, so
                          the two ? icon contexts look consistent. The
                          outer items-start preserves the existing
                          checkbox alignment via its mt-0.5 nudge. */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-text-secondary">
                          {sub.name}
                        </span>
                        {sub.tooltip ? (
                          <Tooltip content={sub.tooltip}>
                            {/* 44px hit area wrapper with negative margins
                                to preserve the icon's 14px layout footprint
                                — keeps the row layout unchanged while
                                extending the tap target. stopPropagation
                                on click so a tap on the ? doesn't bubble
                                to the row's toggle (matters on iOS where
                                one tap synthesizes both mouseenter and
                                click). */}
                            <span
                              className="-m-[15px] inline-flex size-11 items-center justify-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <HelpCircle className="size-3.5 shrink-0 text-fg-quaternary" />
                            </span>
                          </Tooltip>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
