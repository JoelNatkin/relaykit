"use client";

import { Copy01, Edit01, HelpCircle, Plus } from "@untitledui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { MessageEditCard } from "@/components/configurator/message-edit-card";
import { CustomMessageCard } from "@/components/configurator/custom-message-card";
import { Tooltip } from "@/components/configurator/tooltip";
import { ComingSoonBadge } from "@/components/configurator/coming-soon-badge";
import {
  PresetDropdown,
  type Preset,
} from "@/components/configurator/preset-dropdown";
import { useWaitlist, type WaitlistSummary } from "@/context/waitlist-context";
import { SessionProvider } from "@/lib/configurator/session-context";
import {
  useConfiguratorState,
  type MessageOverride,
} from "@/lib/configurator/use-configurator-state";
import {
  CATEGORIES,
  categorySubs,
  isAuthored,
  interpolateBody,
  flattenBody,
} from "@/lib/message-library";
import type { Category, Message, VariantTone } from "@/lib/message-library";
import { VARIABLE_TOKEN_READ_CLASSES } from "@/lib/editor/variable-token";

const PAGE_TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

/** Dropdown presets. Only "Verification only" is reachable at launch. */
const PRESETS: Preset[] = [
  { id: "verification-only", label: "Verification only", disabled: false },
  { id: "saas", label: "SaaS", disabled: true },
  { id: "personal-services", label: "Personal services", disabled: true },
  { id: "real-estate", label: "Real estate", disabled: true },
  { id: "fitness", label: "Fitness", disabled: true },
  { id: "ecommerce", label: "E-commerce", disabled: true },
];

const PRESET_VERIFICATION_ONLY = "Verification only";

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
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="min-w-0 truncate text-sm font-semibold text-text-primary">
            {name}
          </span>
          {tooltip ? (
            <Tooltip content={tooltip}>
              <HelpCircle className="size-3.5 shrink-0 text-fg-quaternary" />
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
              <span key={i} className={VARIABLE_TOKEN_READ_CLASSES}>
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
  | { kind: "corpus"; categoryId: string; subId: string; messageId: string }
  | { kind: "custom"; categoryId: string; localId: string }
  | { kind: "new-custom"; categoryId: string }
  | null;

export function ConfiguratorSection() {
  const {
    state,
    toggleCategory,
    toggleSub,
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

  function handleSubToggle(categoryId: string, subId: string) {
    const wasChecked = !!state.categories[categoryId]?.subs[subId]?.checked;
    toggleSub(categoryId, subId);
    posthog?.capture("configurator_sub_toggled", {
      category_id: categoryId,
      sub_id: subId,
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
      for (const sub of Object.values(cat.subs)) {
        for (const msg of Object.values(sub.messages)) {
          if (msg.override) return true;
        }
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
      Object.entries(verification.subs).every(
        ([subId, sub]) => sub.checked === (subId === "signup-phone-verification"),
      );
    return matchesVerificationOnly ? PRESET_VERIFICATION_ONLY : "Custom";
  }, [state, anyOverride, anyCustom]);

  // Publish a snapshot to the waitlist context so the modal (opened from any
  // "Get early access" CTA) reflects what the visitor configured.
  const waitlistSummary = useMemo<WaitlistSummary>(() => {
    const subsSelected: string[] = [];
    for (const cat of checkedCategories) {
      const catState = state.categories[cat.id];
      for (const sub of categorySubs(cat)) {
        if (catState.subs[sub.id]?.checked) {
          subsSelected.push(`${cat.id}/${sub.id}`);
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
      subsSelected,
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
      for (const sub of categorySubs(cat)) {
        if (!catState.subs[sub.id]?.checked) continue;
        for (const message of sub.messages) {
          const override = catState.subs[sub.id].messages[message.id]?.override;
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
      subs_selected: waitlistSummary.subsSelected ?? [],
      tone_default: state.pageTone,
      has_overrides: anyOverride,
    });
  }

  return (
    <SessionProvider state={{ businessName: state.businessName }}>
      <section className="bg-bg-primary pt-[100px] pb-16 sm:pb-20">
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
            {/* Categories panel */}
            <div className="rounded-xl border border-border-secondary bg-bg-primary md:min-w-60">
              <div className="px-4 pt-5 pb-3">
                <h3 className="text-base font-semibold text-text-primary">Categories</h3>
                <div className="mt-4">
                  <p className="mb-1.5 text-sm font-medium text-text-secondary">
                    Recommended combinations
                  </p>
                  <PresetDropdown
                    presets={PRESETS}
                    value={presetValue}
                    onSelect={selectPreset}
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
                        onClick={() => handleCategoryToggle(category.id)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          tabIndex={-1}
                          className="mt-0.5 size-4 shrink-0 rounded border-border-primary accent-bg-brand-solid"
                        />
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
                        <input
                          type="checkbox"
                          checked={false}
                          disabled
                          className="mt-0.5 size-4 shrink-0 rounded border-border-secondary"
                        />
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
                            <Tooltip
                              key={sub.id}
                              content={sub.tooltip}
                              className="w-full"
                            >
                              <button
                                type="button"
                                onClick={() => handleSubToggle(category.id, sub.id)}
                                className="flex w-full items-start gap-2.5 text-left"
                              >
                                <input
                                  type="checkbox"
                                  checked={subChecked}
                                  readOnly
                                  tabIndex={-1}
                                  className="mt-0.5 size-4 shrink-0 rounded border-border-primary accent-bg-brand-solid"
                                />
                                <span className="text-sm text-text-secondary">
                                  {sub.name}
                                </span>
                              </button>
                            </Tooltip>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
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
                        {categorySubs(category).map((sub) => {
                          if (!catState.subs[sub.id]?.checked) return null;
                          return sub.messages.map((message) => {
                            const override =
                              catState.subs[sub.id].messages[message.id]
                                ?.override;
                            const isEditing =
                              editTarget?.kind === "corpus" &&
                              editTarget.categoryId === category.id &&
                              editTarget.subId === sub.id &&
                              editTarget.messageId === message.id;
                            if (isEditing) {
                              return (
                                <MessageEditCard
                                  key={`${sub.id}-${message.id}`}
                                  message={message}
                                  variables={category.variables}
                                  pageTone={state.pageTone}
                                  override={override}
                                  requiresStop={requiresStop}
                                  onSave={(ov) => {
                                    setMessageOverride(
                                      category.id,
                                      sub.id,
                                      message.id,
                                      ov,
                                    );
                                    const key = `${category.id}/${sub.id}/${message.id}`;
                                    if (!customizedFiredRef.current.has(key)) {
                                      customizedFiredRef.current.add(key);
                                      posthog?.capture(
                                        "configurator_message_customized",
                                        {
                                          category_id: category.id,
                                          sub_id: sub.id,
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
                                key={`${sub.id}-${message.id}`}
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
                                    subId: sub.id,
                                    messageId: message.id,
                                  })
                                }
                              />
                            );
                          });
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
                {/* PRE-LAUNCH (2026-05-15): revert to "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text." when onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md */}
                <p className="text-sm text-text-secondary">
                  Pre-launch. The messages above are yours — copy them and use them
                  with any provider today. The full product, with onboarding and
                  delivery, ships summer 2026. Get on the list and we&apos;ll tell
                  you when.
                </p>
                {/* PRE-LAUNCH (2026-05-16): opens the waitlist modal. Revert to
                    a <Link> "Start building with SMS →" (href "/signup") when
                    onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md */}
                <button
                  type="button"
                  onClick={() => openModal("mid-page")}
                  className="mt-4 flex h-15 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-brand-cta text-base font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-cta_hover"
                >
                  Get early access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SessionProvider>
  );
}
