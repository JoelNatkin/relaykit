"use client";

import { Copy01, Edit01, HelpCircle, Plus } from "@untitledui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { MessageEditCard } from "@/components/configurator/message-edit-card";
import { CustomMessageCard } from "@/components/configurator/custom-message-card";
import { Tooltip } from "@/components/configurator/tooltip";
import { CategoryList } from "@/components/configurator/category-list";
import { MobileCategoriesSummary } from "@/components/configurator/mobile-categories-summary";
import { MobileCategoriesModal } from "@/components/configurator/mobile-categories-modal";
import { useWaitlist, type WaitlistSummary } from "@/context/waitlist-context";
import { SessionProvider } from "@/lib/configurator/session-context";
import {
  useConfiguratorState,
  type MessageOverride,
} from "@/lib/configurator/use-configurator-state";
import {
  CATEGORIES,
  interpolateBody,
  flattenBody,
} from "@/lib/message-library";
import type { Category, Message, VariantTone } from "@/lib/message-library";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";

const PAGE_TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

const PRESET_VERIFICATION_ONLY = "Verification only";

/** Name-field placeholder for the custom-message editor, keyed by category id. */
const CUSTOM_NAME_PLACEHOLDERS: Record<string, string> = {
  verification: "e.g. Login alert",
  marketing: "e.g. Holiday hours",
  appointments: "e.g. Reschedule notice",
  "order-updates": "e.g. Backorder notice",
  "customer-support": "e.g. After-hours auto-reply",
  "team-alerts": "e.g. Deploy started",
  community: "e.g. Event reminder",
  waitlist: "e.g. Position update",
  "account-events": "e.g. Password changed",
};

function tonePillClasses(active: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear";
  return active
    ? `${base} bg-bg-brand-solid text-text-on-brand border border-bg-brand-solid`
    : `${base} bg-bg-primary text-text-secondary border border-border-secondary hover:bg-bg-primary_hover`;
}

/** Marketing-shaped categories require opt-out language; Verification does not. */
function categoryRequiresStop(category: Category): boolean {
  return category.tcrMapping === "MARKETING";
}

/** The body to render for a message given its override and the page tone. */
function effectiveBody(
  message: Message,
  override: MessageOverride | undefined,
  pageTone: VariantTone,
): string {
  if (override) {
    if (override.tone === "Custom") return override.customBody ?? "";
    const v =
      message.variants.find((x) => x.tone === override.tone) ??
      message.variants[0];
    return v?.body ?? "";
  }
  const v =
    message.variants.find((x) => x.tone === pageTone) ?? message.variants[0];
  return v?.body ?? "";
}

/**
 * One Copy-output block for a message: title, optional description, the
 * personalized example, and the raw {{token}} template. Joined by `---`.
 */
function buildCopyBlock(
  title: string,
  description: string | undefined,
  example: string,
  template: string,
): string {
  const head = description ? `${title}\n${description}` : title;
  return `${head}\n\nExample\n${example}\n\nTemplate\n${template}`;
}

interface MessageReadCardProps {
  name: string;
  tooltip?: string;
  body: string;
  variables: Category["variables"];
  businessName: string;
  onEdit: () => void;
}

function MessageReadCard({
  name,
  tooltip,
  body,
  variables,
  businessName,
  onEdit,
}: MessageReadCardProps) {
  const segments = interpolateBody(body, variables, businessName);
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs dark:bg-bg-secondary">
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
        <p className="text-sm leading-relaxed text-text-secondary">
          {segments.map((seg, i) =>
            seg.isVariable ? (
              <span key={i} className={VARIABLE_TOKEN_CLASSES}>
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

type EditTarget =
  | { kind: "corpus"; categoryId: string; messageId: string }
  | { kind: "custom"; categoryId: string; localId: string }
  | { kind: "new-custom"; categoryId: string }
  | null;

export function ConfiguratorSection() {
  const {
    state,
    toggleCategory,
    toggleMessage,
    setPageTone,
    setBusinessName,
    setMessageOverride,
    addCustomMessage,
    updateCustomMessage,
    removeCustomMessage,
    selectPreset,
  } = useConfiguratorState();

  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const { openModal, setSummary } = useWaitlist();
  const posthog = usePostHog();
  // Message ids that have already fired `configurator_message_customized` —
  // the event fires once per message per session, on first override.
  const customizedFiredRef = useRef<Set<string>>(new Set());

  function handleCategoryToggle(categoryId: string) {
    const wasChecked = !!state.categories[categoryId]?.checked;
    toggleCategory(categoryId);
    posthog?.capture("configurator_category_toggled", {
      category_id: categoryId,
      action: wasChecked ? "unchecked" : "checked",
    });
  }

  function handleMessageToggle(categoryId: string, messageId: string) {
    const wasChecked =
      !!state.categories[categoryId]?.messages[messageId]?.checked;
    toggleMessage(categoryId, messageId);
    posthog?.capture("configurator_message_toggled", {
      category_id: categoryId,
      message_id: messageId,
      action: wasChecked ? "unchecked" : "checked",
    });
  }

  const checkedCategories = useMemo(
    () => CATEGORIES.filter((c) => state.categories[c.id]?.checked),
    [state],
  );

  // Whether any corpus message carries a card-level override.
  const anyOverride = useMemo(() => {
    for (const cat of Object.values(state.categories)) {
      for (const msg of Object.values(cat.messages)) {
        if (msg.override) return true;
      }
    }
    return false;
  }, [state]);

  const anyCustom = useMemo(
    () =>
      Object.values(state.categories).some((c) => c.customMessages.length > 0),
    [state],
  );

  // Reflective dropdown label. "Verification only" matches a precise selection
  // with no edits; any other non-empty selection reads "Custom"; nothing
  // checked reads blank. (spec §8.2 / §8.4)
  const presetValue = useMemo(() => {
    const anyChecked = CATEGORIES.some((c) => state.categories[c.id]?.checked);
    if (!anyChecked) return "";
    const verification = state.categories["verification"];
    const matchesVerificationOnly =
      !!verification?.checked &&
      !anyOverride &&
      !anyCustom &&
      CATEGORIES.every(
        (c) => c.id === "verification" || !state.categories[c.id]?.checked,
      ) &&
      Object.values(verification.messages).every((msg) => msg.checked);
    return matchesVerificationOnly ? PRESET_VERIFICATION_ONLY : "Custom";
  }, [state, anyOverride, anyCustom]);

  // Publish a snapshot to the waitlist context so the modal (opened from any
  // "Get early access" CTA) reflects what the visitor configured.
  const waitlistSummary = useMemo<WaitlistSummary>(() => {
    const messagesSelected: string[] = [];
    for (const cat of checkedCategories) {
      const catState = state.categories[cat.id];
      for (const message of cat.messages) {
        if (catState.messages[message.id]?.checked) {
          messagesSelected.push(`${cat.id}/${message.id}`);
        }
      }
    }
    return {
      categoryTitles: checkedCategories.map((c) => c.name),
      tone: state.pageTone,
      businessName: state.businessName.trim(),
      configuratorTouched:
        presetValue !== PRESET_VERIFICATION_ONLY ||
        state.pageTone !== "Standard" ||
        state.businessName.trim() !== "",
      categoriesSelected: checkedCategories.map((c) => c.id),
      messagesSelected,
      toneDefault: state.pageTone,
      hasOverrides: anyOverride,
    };
  }, [checkedCategories, state, presetValue, anyOverride]);

  useEffect(() => {
    setSummary(waitlistSummary);
  }, [waitlistSummary, setSummary]);

  useEffect(() => {
    if (!copyToastVisible) return;
    const timer = setTimeout(() => setCopyToastVisible(false), 1500);
    return () => clearTimeout(timer);
  }, [copyToastVisible]);

  async function handleCopy() {
    // Each visible message becomes a block: title, description, the
    // personalized example, and the raw {{token}} template — in the active
    // tone, respecting per-card overrides. Custom messages are included.
    const blocks: string[] = [];
    for (const cat of checkedCategories) {
      const catState = state.categories[cat.id];
      for (const message of cat.messages) {
        if (!catState.messages[message.id]?.checked) continue;
        const override = catState.messages[message.id]?.override;
        const template = effectiveBody(message, override, state.pageTone);
        const example = flattenBody(
          template,
          cat.variables,
          state.businessName,
        );
        blocks.push(
          buildCopyBlock(message.name, message.tooltip, example, template),
        );
      }
      for (const cm of catState.customMessages) {
        const example = flattenBody(cm.body, cat.variables, state.businessName);
        blocks.push(buildCopyBlock(cm.name, undefined, example, cm.body));
      }
    }
    const text = blocks.join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopyToastVisible(true);
    posthog?.capture("configurator_copy_clicked", {
      categories_selected: waitlistSummary.categoriesSelected ?? [],
      messages_selected: waitlistSummary.messagesSelected ?? [],
      tone_default: state.pageTone,
      has_overrides: anyOverride,
    });
  }

  return (
    <SessionProvider state={{ businessName: state.businessName }}>
      <section className="bg-bg-primary pt-20">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Configure your messages
            </h2>
            {/* PRE-LAUNCH (2026-05-15): revert to "All messages included. You can change these later in your workspace." when onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md */}
            <p className="mt-3 text-base text-text-tertiary">
              All messages included — yours to copy and use with any provider today.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            {/* Mobile-only categories: collapsed summary row + full-page
                modal. Both are display:none at md: and above — the desktop
                panel below takes over the left grid cell there. */}
            <div className="md:hidden">
              <MobileCategoriesSummary
                selected={checkedCategories}
                onOpen={() => setMobileCategoriesOpen(true)}
              />
              <MobileCategoriesModal
                isOpen={mobileCategoriesOpen}
                onClose={() => setMobileCategoriesOpen(false)}
                state={state}
                presetValue={presetValue}
                onCategoryToggle={handleCategoryToggle}
                onMessageToggle={handleMessageToggle}
                onSelectPreset={selectPreset}
              />
            </div>

            {/* Desktop categories panel (≥md:). Same content as the modal
                via the shared CategoryList component. */}
            <div className="hidden rounded-xl border border-border-secondary bg-bg-primary md:block md:min-w-60">
              <CategoryList
                state={state}
                presetValue={presetValue}
                onCategoryToggle={handleCategoryToggle}
                onMessageToggle={handleMessageToggle}
                onSelectPreset={selectPreset}
              />
            </div>

            {/* Messages column */}
            <div className="flex flex-col md:max-w-[540px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {PAGE_TONES.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setPageTone(tone)}
                      className={tonePillClasses(state.pageTone === tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                >
                  <Copy01 className="size-4" />
                  {copyToastVisible ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  value={state.businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
                />
              </div>

              <div className="mt-8 space-y-7">
                {checkedCategories.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border-secondary px-6 py-10 text-center">
                    <p className="text-sm text-text-tertiary">
                      Select a category to see your messages.
                    </p>
                  </div>
                ) : null}

                {checkedCategories.map((category) => {
                  const catState = state.categories[category.id];
                  const requiresStop = categoryRequiresStop(category);
                  const addingNew =
                    editTarget?.kind === "new-custom" &&
                    editTarget.categoryId === category.id;
                  return (
                    <div key={category.id}>
                      <h4 className="mb-3 text-base font-semibold text-text-primary">
                        {category.name}
                      </h4>
                      <div className="space-y-3">
                        {category.messages.map((message) => {
                          if (!catState.messages[message.id]?.checked)
                            return null;
                          const override =
                            catState.messages[message.id]?.override;
                          const isEditing =
                            editTarget?.kind === "corpus" &&
                            editTarget.categoryId === category.id &&
                            editTarget.messageId === message.id;
                          if (isEditing) {
                            return (
                              <MessageEditCard
                                key={message.id}
                                message={message}
                                variables={category.variables}
                                pageTone={state.pageTone}
                                override={override}
                                requiresStop={requiresStop}
                                onSave={(ov) => {
                                  setMessageOverride(
                                    category.id,
                                    message.id,
                                    ov,
                                  );
                                  const key = `${category.id}/${message.id}`;
                                  if (!customizedFiredRef.current.has(key)) {
                                    customizedFiredRef.current.add(key);
                                    posthog?.capture(
                                      "configurator_message_customized",
                                      {
                                        category_id: category.id,
                                        message_id: message.id,
                                        customization_type:
                                          ov.tone === "Custom"
                                            ? "custom_text"
                                            : "variant_change",
                                      },
                                    );
                                  }
                                  setEditTarget(null);
                                }}
                                onCancel={() => setEditTarget(null)}
                              />
                            );
                          }
                          return (
                            <MessageReadCard
                              key={message.id}
                              name={message.name}
                              tooltip={message.tooltip}
                              body={effectiveBody(
                                message,
                                override,
                                state.pageTone,
                              )}
                              variables={category.variables}
                              businessName={state.businessName}
                              onEdit={() =>
                                setEditTarget({
                                  kind: "corpus",
                                  categoryId: category.id,
                                  messageId: message.id,
                                })
                              }
                            />
                          );
                        })}

                        {catState.customMessages.map((cm) => {
                          const isEditing =
                            editTarget?.kind === "custom" &&
                            editTarget.categoryId === category.id &&
                            editTarget.localId === cm.localId;
                          return (
                            <CustomMessageCard
                              key={cm.localId}
                              name={cm.name}
                              body={cm.body}
                              variables={category.variables}
                              businessName={state.businessName}
                              placeholder={
                                CUSTOM_NAME_PLACEHOLDERS[category.id] ??
                                "e.g. Holiday hours"
                              }
                              requiresStop={requiresStop}
                              isEditing={isEditing}
                              onEditRequest={() =>
                                setEditTarget({
                                  kind: "custom",
                                  categoryId: category.id,
                                  localId: cm.localId,
                                })
                              }
                              onSave={(next) => {
                                updateCustomMessage(
                                  category.id,
                                  cm.localId,
                                  next,
                                );
                                setEditTarget(null);
                              }}
                              onCancel={() => setEditTarget(null)}
                              onRemove={() => {
                                removeCustomMessage(category.id, cm.localId);
                                setEditTarget(null);
                              }}
                            />
                          );
                        })}

                        {addingNew ? (
                          <CustomMessageCard
                            name=""
                            body=""
                            variables={category.variables}
                            businessName={state.businessName}
                            placeholder={
                              CUSTOM_NAME_PLACEHOLDERS[category.id] ??
                              "e.g. Holiday hours"
                            }
                            requiresStop={requiresStop}
                            isEditing
                            isNew
                            onEditRequest={() => {}}
                            onSave={(next) => {
                              addCustomMessage(category.id, next);
                              posthog?.capture(
                                "configurator_custom_message_added",
                                {
                                  category_id: category.id,
                                  body_length: next.body.length,
                                  has_name: next.name.trim() !== "",
                                },
                              );
                              setEditTarget(null);
                            }}
                            onCancel={() => setEditTarget(null)}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setEditTarget({
                                kind: "new-custom",
                                categoryId: category.id,
                              })
                            }
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 text-sm font-medium text-text-brand-secondary transition duration-100 ease-linear hover:border-border-brand hover:text-text-brand-secondary_hover"
                          >
                            <Plus className="size-4" />
                            Add message
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                {/* PRE-LAUNCH (2026-05-16): opens the waitlist modal. Revert to
                    a <Link> "Start building with SMS →" (href "/signup") when
                    onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md */}
                <button
                  type="button"
                  onClick={() => openModal("mid-page")}
                  className="flex h-15 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-brand-cta text-base font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-cta_hover"
                >
                  Get early access
                </button>
                {/* PRE-LAUNCH (2026-05-15): revert to "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text." when onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md */}
                <p className="mt-4 text-sm text-text-secondary">
                  The messages above are yours — copy them and use them with any
                  provider today. The full product ships summer 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SessionProvider>
  );
}
