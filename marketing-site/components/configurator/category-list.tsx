"use client";

/**
 * The categories panel content — the 9 category cards (Verification
 * authored, the other 8 rendered as disabled "Coming soon"). Pure
 * presentational: receives state + setters from the parent, never reads
 * from any hook directly.
 *
 * Rendered by BOTH the desktop categories card (configurator-section.tsx)
 * AND the mobile full-page modal (mobile-categories-modal.tsx) so the two
 * surfaces stay byte-identical. The outer card / modal shell wraps this
 * component; this component renders only the inside.
 */

import { HelpCircle } from "@untitledui/icons";
import { Tooltip } from "@/components/configurator/tooltip";
import { ComingSoonBadge } from "@/components/configurator/coming-soon-badge";
import { CATEGORIES, isAuthored } from "@/lib/message-library";
import type { ConfiguratorState } from "@/lib/configurator/use-configurator-state";

/**
 * Configurator checkbox — a custom appearance-none box with a fill and
 * border that hold in both modes (bg-bg-primary / dark:bg-bg-secondary,
 * border-border-primary). The check glyph renders on top of the same
 * fill; the 1px stroke is kept for the checked state. Category rows use
 * the larger size-5 box, sub rows the size-4 box; `disabled` (Coming-soon
 * categories) softens the border. The box className is identical across
 * checked/unchecked, so the box never changes size on toggle.
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
  // Gold marks the selected CATEGORY only (D-427). Message-level (sub) checkboxes
  // keep the neutral D-405 form-control treatment, gold or not.
  const goldChecked = size === "category" && checked && !disabled;
  return (
    <span className={`relative mt-0.5 inline-flex ${boxSize} shrink-0`}>
      <input
        type="checkbox"
        checked={checked}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        className={`${boxSize} appearance-none rounded border ${
          goldChecked
            ? "border-border-gold bg-bg-gold"
            : `${borderColor} bg-bg-primary dark:bg-bg-secondary`
        }`}
      />
      {checked ? (
        <svg
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`pointer-events-none absolute inset-0 m-auto ${glyphSize} ${
            goldChecked ? "text-text-on-gold" : "text-text-primary"
          }`}
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
  onCategoryToggle: (categoryId: string) => void;
  onMessageToggle: (categoryId: string, messageId: string) => void;
  // The mobile sheet provides its own "Categories" header row, so it
  // suppresses the column's own h3 to avoid a doubled heading. Desktop
  // renders with the default (heading visible).
  showHeading?: boolean;
}

export function CategoryList({
  state,
  onCategoryToggle,
  onMessageToggle,
  showHeading = true,
}: CategoryListProps) {
  return (
    <>
      {showHeading ? (
        <div className="px-4 pt-5">
          <h3 className="text-base font-semibold text-text-primary">
            Categories
          </h3>
        </div>
      ) : null}

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
                {category.messages.map((message) => {
                  const messageChecked =
                    !!catState?.messages[message.id]?.checked;
                  return (
                    // role="button" instead of <button> because the row
                    // contains a nested interactive element (the ? icon's
                    // Tooltip span), which a real <button> can't legally
                    // wrap. Same pattern MessageReadCard uses for its
                    // click-to-edit body. Keyboard nav handled via tabIndex
                    // + onKeyDown for Enter and Space.
                    <div
                      key={message.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onMessageToggle(category.id, message.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onMessageToggle(category.id, message.id);
                        }
                      }}
                      className="flex w-full cursor-pointer items-start gap-2.5 text-left"
                    >
                      <ConfiguratorCheckbox checked={messageChecked} />
                      {/* Inner wrapper centers the label + ? icon on the
                          label's optical midline (items-center) and gives
                          them the same 6px gap the message-card uses, so
                          the two ? icon contexts look consistent. The
                          outer items-start preserves the existing
                          checkbox alignment via its mt-0.5 nudge. */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-text-secondary">
                          {message.name}
                        </span>
                        {message.tooltip ? (
                          <Tooltip content={message.tooltip}>
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
