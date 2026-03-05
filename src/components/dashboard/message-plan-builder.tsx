"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Star01 } from "@untitledui/icons";
import { MessageCard } from "./message-card";
import { getMessageTemplates } from "@/lib/templates/message-templates";
import type { MessageTemplate } from "@/lib/templates/message-templates";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import { cx } from "@/utils/cx";

interface MessagePlanBuilderProps {
  useCase: UseCaseId;
}

/** Map from template_id → original MessageTemplate for compliance element lookup */
type TemplateMap = Map<string, MessageTemplate>;

function buildInitialEntries(templates: MessageTemplate[]): MessagePlanEntry[] {
  return templates.map((t) => ({
    template_id: t.id,
    category: t.category,
    original_template: t.text,
    edited_text: null,
    trigger: t.trigger,
    variables: t.variables,
    is_expansion: t.is_expansion,
    expansion_type: t.expansion_type ?? null,
    enabled: t.default_enabled,
  }));
}

function mergeWithSaved(
  templates: MessageTemplate[],
  saved: MessagePlanEntry[],
): MessagePlanEntry[] {
  const savedMap = new Map(saved.map((s) => [s.template_id, s]));
  return templates.map((t) => {
    const existing = savedMap.get(t.id);
    if (existing) {
      return {
        ...existing,
        // Keep template metadata fresh from source
        category: t.category,
        original_template: t.text,
        trigger: t.trigger,
        variables: t.variables,
        is_expansion: t.is_expansion,
        expansion_type: t.expansion_type ?? null,
      };
    }
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
  });
}

export function MessagePlanBuilder({ useCase }: MessagePlanBuilderProps) {
  const [entries, setEntries] = useState<MessagePlanEntry[]>([]);
  const [templateMap, setTemplateMap] = useState<TemplateMap>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [expansionOpen, setExpansionOpen] = useState(false);
  const [advisoryShown, setAdvisoryShown] = useState(false);
  const [advisoryDismissed, setAdvisoryDismissed] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load templates and saved state
  useEffect(() => {
    const templates = getMessageTemplates(useCase);
    const tMap = new Map(templates.map((t) => [t.id, t]));
    setTemplateMap(tMap);

    async function loadSaved() {
      try {
        const res = await fetch("/api/message-plan");
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.use_case === useCase) {
            setEntries(mergeWithSaved(templates, data.messages));
          } else {
            setEntries(buildInitialEntries(templates));
          }
        } else {
          setEntries(buildInitialEntries(templates));
        }
      } catch {
        setEntries(buildInitialEntries(templates));
      } finally {
        setIsLoading(false);
      }
    }

    loadSaved();
  }, [useCase]);

  // Debounced autosave
  const autosave = useCallback(
    (updatedEntries: MessagePlanEntry[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        fetch("/api/message-plan", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            use_case: useCase,
            messages: updatedEntries,
          }),
        });
      }, 500);
    },
    [useCase],
  );

  function handleToggle(templateId: string, enabled: boolean) {
    setEntries((prev) => {
      const updated = prev.map((e) =>
        e.template_id === templateId ? { ...e, enabled } : e,
      );

      // Show expansion advisory on first expansion enable
      const entry = prev.find((e) => e.template_id === templateId);
      if (enabled && entry?.is_expansion && !advisoryDismissed) {
        setAdvisoryShown(true);
      }

      autosave(updated);
      return updated;
    });
  }

  function handleEdit(templateId: string, editedText: string | null) {
    setEntries((prev) => {
      const updated = prev.map((e) =>
        e.template_id === templateId ? { ...e, edited_text: editedText } : e,
      );
      autosave(updated);
      return updated;
    });
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-tertiary" />
        <div className="h-32 animate-pulse rounded-lg bg-secondary" />
      </section>
    );
  }

  // Three-tier split (D-35)
  const includedMessages = entries.filter(
    (e) => !e.is_expansion && e.enabled,
  );
  const availableMessages = entries.filter(
    (e) => !e.is_expansion && !e.enabled,
  );
  const expansionMessages = entries.filter((e) => e.is_expansion);

  // Re-sort: if user toggles a base message off, it moves to Available.
  // If they toggle an Available on, it moves to Included.
  // We just partition by enabled state for base messages.

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Your message plan
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          These are the messages your app can send. Select the ones you need,
          edit the wording, and we&rsquo;ll handle the carrier registration.
        </p>
      </div>

      {/* Tier 1: Included */}
      {includedMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success-primary">
            Included in your registration
          </h3>
          {includedMessages.map((entry) => (
            <MessageCard
              key={entry.template_id}
              entry={entry}
              complianceElements={
                templateMap.get(entry.template_id)?.compliance_elements ?? []
              }
              isExpansion={false}
              expansionType={null}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Tier 2: Available */}
      {availableMessages.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Available messages
            </h3>
            <p className="mt-0.5 text-xs text-quaternary">
              Turn these on if your app needs them.
            </p>
          </div>
          {availableMessages.map((entry) => (
            <MessageCard
              key={entry.template_id}
              entry={entry}
              complianceElements={
                templateMap.get(entry.template_id)?.compliance_elements ?? []
              }
              isExpansion={false}
              expansionType={null}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Tier 3: Expansion messages */}
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
            These messages need a broader registration.
          </p>

          {expansionOpen && (
            <div className="mt-3 space-y-3">
              {/* One-time advisory */}
              {advisoryShown && !advisoryDismissed && (
                <div className="rounded-lg border border-brand bg-brand-primary_alt p-3">
                  <p className="text-sm text-primary">
                    Adding promotional messages means recipients give separate,
                    explicit consent for marketing texts. We handle the extra
                    consent form in your registration.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAdvisoryDismissed(true)}
                    className="mt-1 text-xs font-medium text-brand-secondary"
                  >
                    Got it
                  </button>
                </div>
              )}

              {expansionMessages.map((entry) => (
                <MessageCard
                  key={entry.template_id}
                  entry={entry}
                  complianceElements={
                    templateMap.get(entry.template_id)
                      ?.compliance_elements ?? []
                  }
                  isExpansion={true}
                  expansionType={entry.expansion_type}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
