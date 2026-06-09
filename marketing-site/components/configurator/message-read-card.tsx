/**
 * MessageReadCard — the read-mode corpus message card. Extracted from
 * configurator-section.tsx as a single shared card (D-379/D-381 — one source,
 * no drift); the configurator renders it at `/messages` and in the home's
 * embedded ConfiguratorSection. Pure, prop-driven, provider-free: takes
 * `businessName` as a prop, uses interpolateBody + VARIABLE_TOKEN_CLASSES +
 * checkCompliance.
 */

import { Edit01, HelpCircle } from "@untitledui/icons";
import { CharWarningIcon } from "@/components/configurator/char-warning-icon";
import { Tooltip } from "@/components/configurator/tooltip";
import { checkCompliance } from "@/lib/configurator/compliance";
import { interpolateBody } from "@/lib/message-library";
import type { Category } from "@/lib/message-library";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";

interface MessageReadCardProps {
  name: string;
  tooltip?: string;
  body: string;
  variables: Category["variables"];
  categoryVariables: Record<string, string>;
  businessName: string;
  /** True for Marketing-shaped categories — affects compliance issues, not the length warning. */
  requiresStop: boolean;
  onEdit: () => void;
  /** Double-click on a variable chip — opens the Variables form focused on that variable. */
  onVariableDoubleClick: (variableName: string) => void;
}

export function MessageReadCard({
  name,
  tooltip,
  body,
  variables,
  categoryVariables,
  businessName,
  requiresStop,
  onEdit,
  onVariableDoubleClick,
}: MessageReadCardProps) {
  const segments = interpolateBody(body, variables, {
    businessName,
    categoryVariables,
  });
  // Post-render length check (D-414 / configurator-authoring §4). Read-mode
  // warning is non-blocking and fires only on segment length — other
  // compliance issues stay in the edit card where they can be fixed.
  const compliance = checkCompliance({
    body,
    variables,
    requiresStop,
    categoryVariables,
  });
  return (
    <div className="rounded-xl border border-border-secondary bg-surface-raised p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="min-w-0 truncate text-sm font-semibold text-text-primary">
            {name}
          </span>
          {tooltip ? (
            <Tooltip content={tooltip}>
              {/* 44px hit area wrapper with negative margins to preserve
                  the icon's 14px layout footprint — keeps the row layout
                  unchanged while extending the tap target. */}
              <span className="-m-[15px] inline-flex size-11 items-center justify-center">
                <HelpCircle className="size-3.5 shrink-0 text-fg-quaternary" />
              </span>
            </Tooltip>
          ) : null}
        </div>
        {compliance.isOverSegmentLength ? <CharWarningIcon /> : null}
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit message"
          className="cursor-pointer p-1 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
        >
          <Edit01 className="size-[17px]" />
        </button>
      </div>
      <div
        className="mt-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEdit();
        }}
      >
        {/* break-words wraps long unbroken values (e.g. an authored
            order_number with no spaces) inside the card instead of
            overflowing the layout. */}
        <p className="text-sm leading-relaxed break-words text-text-secondary">
          {segments.map((seg, i) =>
            seg.isVariable ? (
              // Chips swallow single-click so the parent edit handler
              // doesn't open the edit card on the first half of a
              // double-click. Double-click routes to the Variables form.
              <span
                key={i}
                className={`${VARIABLE_TOKEN_CLASSES} cursor-pointer`}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (seg.token) onVariableDoubleClick(seg.token);
                }}
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}
