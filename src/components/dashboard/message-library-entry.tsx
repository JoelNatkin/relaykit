"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import {
  Badge,
  BadgeWithDot,
  BadgeWithIcon,
} from "@/components/base/badges/badges";
import { Copy01, Check, Star01 } from "@untitledui/icons";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";

type Tier = "included" | "available" | "expansion";

interface MessageLibraryEntryProps {
  entry: MessagePlanEntry;
  tier: Tier;
  /** Whether this message was part of the approved registration (D-36: "registered message") */
  isCanon?: boolean;
}

const tierConfig = {
  included: {
    label: "Included with your registration",
    color: "success" as const,
  },
  available: {
    label: "Also available with your registration",
    color: "gray" as const,
  },
  expansion: {
    label: "Requires an additional campaign",
    color: "warning" as const,
  },
};

/** Renders message text with {variables} visually highlighted in brand colors. */
function HighlightedMessage({ text }: { text: string }) {
  // Split on {variable} patterns, keeping the delimiters
  const parts = text.split(/(\{[^}]+\})/g);

  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("{") && part.endsWith("}") ? (
          <span
            key={i}
            className="rounded bg-brand-secondary px-1 py-0.5 font-semibold text-brand-secondary"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

export function MessageLibraryEntry({
  entry,
  tier,
  isCanon = false,
}: MessageLibraryEntryProps) {
  const [copied, setCopied] = useState(false);

  const displayText = entry.edited_text ?? entry.original_template;
  const config = tierConfig[tier];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently fail
    }
  }

  return (
    <div className="rounded-lg border border-secondary bg-primary p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Category heading */}
          <div className="flex items-center gap-1.5">
            {isCanon && (
              <Star01 className="size-4 shrink-0 text-fg-brand-secondary" />
            )}
            <span className="text-sm font-medium text-primary">
              {entry.category}
            </span>
            {isCanon && (
              <Badge size="sm" color="brand" type="pill-color">
                Registered message
              </Badge>
            )}
          </div>

          {/* Message text with highlighted variables */}
          <p className="mt-1.5 whitespace-pre-wrap font-mono text-sm text-tertiary">
            &ldquo;
            <HighlightedMessage text={displayText} />
            &rdquo;
          </p>

          <p className="mt-1.5 text-xs text-quaternary">
            Trigger: {entry.trigger}
          </p>

          {/* Tier badge */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tier === "expansion" ? (
              <BadgeWithIcon
                size="sm"
                color={config.color}
                type="pill-color"
                iconLeading={Star01}
              >
                {config.label}
              </BadgeWithIcon>
            ) : (
              <BadgeWithDot size="sm" color={config.color} type="pill-color">
                {config.label}
              </BadgeWithDot>
            )}
          </div>

          {/* Expansion detail line */}
          {tier === "expansion" && entry.expansion_type && (
            <p className="mt-1.5 text-xs text-tertiary">
              Needs {entry.expansion_type} campaign — we register it alongside
              your existing one.
            </p>
          )}
        </div>

        {/* Copy button */}
        <Button
          size="sm"
          color="tertiary"
          iconLeading={copied ? Check : Copy01}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
