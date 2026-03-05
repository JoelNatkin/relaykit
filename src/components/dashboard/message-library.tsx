"use client";

import { useEffect, useState } from "react";
import { ChevronDown, MessageSquare02, Star01 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { MessageLibraryEntry } from "./message-library-entry";
import { useDashboard } from "./dashboard-context";
import { getMessageTemplates } from "@/lib/templates/message-templates";
import type { MessageTemplate } from "@/lib/templates/message-templates";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import { cx } from "@/utils/cx";

interface MessageLibraryProps {
  /** IDs of messages that were part of the approved registration (canon messages) */
  canonMessageIds?: string[];
}

function templateToEntry(t: MessageTemplate): MessagePlanEntry {
  return {
    template_id: t.id,
    category: t.category,
    original_template: t.text,
    edited_text: null,
    trigger: t.trigger,
    variables: t.variables,
    is_expansion: t.is_expansion,
    expansion_type: t.expansion_type ?? null,
    enabled: t.default_enabled,
  };
}

export function MessageLibrary({ canonMessageIds }: MessageLibraryProps) {
  const { useCase } = useDashboard();
  const [entries, setEntries] = useState<MessagePlanEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expansionOpen, setExpansionOpen] = useState(false);

  useEffect(() => {
    if (!useCase) {
      setIsLoading(false);
      return;
    }

    async function load() {
      const templates = getMessageTemplates(useCase!);

      try {
        const res = await fetch("/api/message-plan");
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.use_case === useCase) {
            setEntries(data.messages as MessagePlanEntry[]);
          } else {
            // Wrong use case or no saved plan — build from templates, default_enabled only
            setEntries(
              templates
                .filter((t) => t.default_enabled)
                .map(templateToEntry),
            );
          }
        } else {
          setEntries(
            templates.filter((t) => t.default_enabled).map(templateToEntry),
          );
        }
      } catch {
        setEntries(
          templates.filter((t) => t.default_enabled).map(templateToEntry),
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [useCase]);

  // Empty state: no use case selected
  if (!useCase) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <FeaturedIcon
          icon={MessageSquare02}
          color="gray"
          theme="light"
          size="lg"
        />
        <h3 className="mt-4 text-base font-semibold text-primary">
          Pick a use case first
        </h3>
        <p className="mt-1 max-w-sm text-sm text-tertiary">
          Head to the Overview tab and choose what you&rsquo;re building
          &mdash; we&rsquo;ll show message templates for it.
        </p>
      </section>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-tertiary" />
        <div className="h-32 animate-pulse rounded-lg bg-secondary" />
        <div className="h-32 animate-pulse rounded-lg bg-secondary" />
      </section>
    );
  }

  // Empty state: no messages at all
  if (entries.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <FeaturedIcon
          icon={MessageSquare02}
          color="gray"
          theme="light"
          size="lg"
        />
        <h3 className="mt-4 text-base font-semibold text-primary">
          No messages selected yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-tertiary">
          Head to the Overview tab to build your message plan &mdash; your
          selections will appear here.
        </p>
      </section>
    );
  }

  const canonSet = new Set(canonMessageIds ?? []);

  // Three-tier split (D-35)
  const includedMessages = entries
    .filter((e) => !e.is_expansion && e.enabled)
    .sort((a, b) => {
      // Canon messages first
      const aCanon = canonSet.has(a.template_id) ? 0 : 1;
      const bCanon = canonSet.has(b.template_id) ? 0 : 1;
      return aCanon - bCanon;
    });

  const availableMessages = entries.filter(
    (e) => !e.is_expansion && !e.enabled,
  );

  const expansionMessages = entries.filter((e) => e.is_expansion);

  return (
    <section className="space-y-6">
      {/* Tier 1: Included */}
      {includedMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success-primary">
            Included with your registration
          </h3>
          {includedMessages.map((entry) => (
            <MessageLibraryEntry
              key={entry.template_id}
              entry={entry}
              tier="included"
              isCanon={canonSet.has(entry.template_id)}
            />
          ))}
        </div>
      )}

      {/* Tier 2: Also available */}
      {availableMessages.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Also available with your registration
            </h3>
            <p className="mt-0.5 text-xs text-quaternary">
              Your registration covers these too &mdash; turn them on from the
              Overview tab when you need them.
            </p>
          </div>
          {availableMessages.map((entry) => (
            <MessageLibraryEntry
              key={entry.template_id}
              entry={entry}
              tier="available"
            />
          ))}
        </div>
      )}

      {/* Tier 3: Expansion messages (collapsible) */}
      {expansionMessages.length > 0 && (
        <div className="border-t border-secondary pt-4">
          <button
            type="button"
            onClick={() => setExpansionOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Star01 className="size-4 text-fg-warning-secondary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                Expansion messages
              </span>
            </div>
            <ChevronDown
              className={cx(
                "size-4 text-fg-quaternary transition duration-100 ease-linear",
                expansionOpen && "rotate-180",
              )}
            />
          </button>
          <p className="mt-1 text-xs text-quaternary">
            These need a broader registration &mdash; we handle the second
            campaign alongside your existing one.
          </p>

          {expansionOpen && (
            <div className="mt-3 space-y-3">
              {expansionMessages.map((entry) => (
                <MessageLibraryEntry
                  key={entry.template_id}
                  entry={entry}
                  tier="expansion"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
