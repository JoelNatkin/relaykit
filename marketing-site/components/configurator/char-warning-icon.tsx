"use client";

/**
 * Triangle warning surfaced on a read card when its rendered (post-
 * substitution) body exceeds a single SMS segment (D-414 /
 * configurator-authoring §4). Non-blocking — pure information; the visitor
 * can still copy and use the message.
 *
 * Matches the message-card ?-icon pattern: 14px visual footprint inside a
 * 44px hit-area wrapper, tooltip-on-hover via the shared Tooltip.
 */

import { AlertTriangle } from "@untitledui/icons";
import { Tooltip } from "@/components/configurator/tooltip";

export function CharWarningIcon() {
  return (
    <Tooltip content="Over 160 characters. This counts as 2 messages.">
      <span className="-m-[15px] inline-flex size-11 cursor-pointer items-center justify-center">
        <AlertTriangle className="size-3.5 shrink-0 text-fg-warning-secondary" />
      </span>
    </Tooltip>
  );
}
