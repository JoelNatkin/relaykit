"use client";

import { ChevronDown, ChevronUp, Copy01, Edit01, HelpCircle, Plus } from "@untitledui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { MessageEditCard } from "@/components/configurator/message-edit-card";
import { CustomMessageCard } from "@/components/configurator/custom-message-card";
import { Tooltip } from "@/components/configurator/tooltip";
import { CategoryList } from "@/components/configurator/category-list";
import { MobileCategoriesSummary } from "@/components/configurator/mobile-categories-summary";
import { MobileCategoriesModal } from "@/components/configurator/mobile-categories-modal";
import { EditValuesForm } from "@/components/configurator/edit-values-form";
import { EditValuesModal } from "@/components/configurator/edit-values-modal";
import { CharWarningIcon } from "@/components/configurator/char-warning-icon";
import { KebabMenu } from "@/components/configurator/kebab-menu";
import { EligSection } from "@/components/configurator/elig-section";
import { EligEmptyState } from "@/components/configurator/elig-empty-state";
import { checkCompliance } from "@/lib/configurator/compliance";
import { useWaitlist, type WaitlistSummary } from "@/context/waitlist-context";
import { SessionProvider } from "@/lib/configurator/session-context";
import { useConfiguratorState } from "@/lib/configurator/use-configurator-state";
import { useEligState } from "@/lib/configurator/use-elig-state";
import {
  CATEGORIES,
  interpolateBody,
  flattenBody,
  isIdentityToken,
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

/**
 * Effective body for a corpus message: hand-edited body wins, otherwise the
 * pinned tone, otherwise the page tone (D-414 / configurator-authoring §1).
 */
function effectiveBody(
  message: Message,
  customBody: string | undefined,
  pinnedTone: VariantTone | undefined,
  pageTone: VariantTone,
): string {
  if (customBody !== undefined) return customBody;
  const tone = pinnedTone ?? pageTone;
  const v = message.variants.find((x) => x.tone === tone) ?? message.variants[0];
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
  categoryVariables: Record<string, string>;
  businessName: string;
  /** True for Marketing-shaped categories — affects compliance issues, not the length warning. */
  requiresStop: boolean;
  onEdit: () => void;
  /** Double-click on a variable chip — opens the Variables form focused on that variable. */
  onVariableDoubleClick: (variableName: string) => void;
}

function MessageReadCard({
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
    setMessageEdit,
    setCategoryVariable,
    clearCategory,
    clearAll,
    addCustomMessage,
    updateCustomMessage,
    removeCustomMessage,
  } = useConfiguratorState();

  // Elig state hoisted here so Wave 2 can gate sibling rendering (categories
  // panel + message stream) off the verdict. Persists to localStorage.relaykit_elig
  // lazily — no write until the visitor's first interaction (PM ruling §5.8).
  const {
    state: eligState,
    setMultiTenant: setEligMultiTenant,
    setVerticalSlug: setEligVerticalSlug,
    setSubVerticalSlug: setEligSubVerticalSlug,
  } = useEligState();

  // Verdict-driven gates (Wave 2 — vertical-constraints §9.3):
  //   - 🟠 / ⚫ / 🔴 disable the categories panel + replace the message
  //     stream with the empty-state placeholder. Authoring controls (tone
  //     pills, Copy, kebab, business name input) go away too — they're
  //     dead UI with no messages to operate on.
  //   - Bottom "Get early access" CTA hides on every disabled bucket. On
  //     🔴 there's no future state to sign up for; on 🟠/⚫ the inline
  //     form in the verdict card is the canonical capture and a backup
  //     CTA would produce untagged general-waitlist signups that bypass
  //     the interest_tag segmentation.
  const isMessageAreaDisabled =
    eligState.verdict.tier === "not-yet-maybe-not" ||
    eligState.verdict.tier === "not-yet" ||
    eligState.verdict.tier === "not-our-lane";
  const hideBottomCta = isMessageAreaDisabled;

  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  // Which category's Variables surface is open (desktop expander OR
  // mobile modal, driven by the same state). Only one is open at a time.
  const [editValuesCategoryId, setEditValuesCategoryId] = useState<string | null>(
    null,
  );
  // Variable name to focus inside the Variables form on next open/update.
  // Set when a chip is double-clicked; cleared by the form once focus has
  // been delivered (so subsequent unfocused opens don't re-focus stale state).
  const [focusVariableOnOpen, setFocusVariableOnOpen] = useState<string | null>(
    null,
  );
  // Identity-token branch of the double-click handler targets the top-of-
  // page "Your business name" input via this ref (D-413 — identity tokens
  // are filtered out of the Variables form).
  const businessNameInputRef = useRef<HTMLInputElement | null>(null);

  const editValuesCategory = useMemo(
    () =>
      editValuesCategoryId
        ? (CATEGORIES.find((c) => c.id === editValuesCategoryId) ?? null)
        : null,
    [editValuesCategoryId],
  );

  function handleVariableDoubleClick(
    categoryId: string,
    variableName: string,
  ) {
    if (isIdentityToken(variableName)) {
      // Identity tokens (business_name / workspace_name / community_name,
      // per D-413) live on the top-of-page input, not in the Variables form.
      const input = businessNameInputRef.current;
      if (!input) return;
      input.scrollIntoView({ block: "center", behavior: "smooth" });
      input.focus();
      return;
    }
    setEditValuesCategoryId(categoryId);
    setFocusVariableOnOpen(variableName);
  }

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

  // Any per-message edit — hand-edited body, pinned tone, or authored variable.
  const anyOverride = useMemo(() => {
    for (const cv of Object.values(state.categoryValues)) {
      if (Object.keys(cv.customBodies).length > 0) return true;
      if (Object.keys(cv.messageTones).length > 0) return true;
      if (Object.keys(cv.variables).length > 0) return true;
    }
    return false;
  }, [state]);

  const anyCustom = useMemo(
    () =>
      Object.values(state.categoryValues).some(
        (cv) => cv.addedMessages.length > 0,
      ),
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
    // tone, respecting per-card edits. Custom messages are included.
    const blocks: string[] = [];
    for (const cat of checkedCategories) {
      const catState = state.categories[cat.id];
      const cv = state.categoryValues[cat.id];
      const resolveOptions = {
        businessName: state.businessName,
        categoryVariables: cv.variables,
      };
      for (const message of cat.messages) {
        if (!catState.messages[message.id]?.checked) continue;
        const template = effectiveBody(
          message,
          cv.customBodies[message.id],
          cv.messageTones[message.id],
          state.pageTone,
        );
        const example = flattenBody(template, cat.variables, resolveOptions);
        blocks.push(
          buildCopyBlock(message.name, message.tooltip, example, template),
        );
      }
      for (const cm of cv.addedMessages) {
        const example = flattenBody(cm.body, cat.variables, resolveOptions);
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
        {/* Mobile-only Edit-values surface — full-page modal mounted at
            section level, driven by the same editValuesCategoryId state
            that toggles the desktop inline expander. Above md: the modal
            self-hides (md:hidden inside) and the inline expanders own the
            surface. */}
        <EditValuesModal
          category={editValuesCategory}
          values={
            editValuesCategoryId
              ? (state.categoryValues[editValuesCategoryId]?.variables ?? {})
              : {}
          }
          onChange={(name, value) => {
            if (!editValuesCategoryId) return;
            setCategoryVariable(editValuesCategoryId, name, value);
          }}
          onClose={() => setEditValuesCategoryId(null)}
          focusVariableName={focusVariableOnOpen}
          onFocusDelivered={() => setFocusVariableOnOpen(null)}
        />
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
            <div
              className={`md:hidden ${isMessageAreaDisabled ? "cursor-not-allowed" : ""}`}
            >
              <div
                className={
                  isMessageAreaDisabled ? "pointer-events-none opacity-50" : ""
                }
              >
                <MobileCategoriesSummary
                  selected={checkedCategories}
                  onOpen={() => setMobileCategoriesOpen(true)}
                />
                <MobileCategoriesModal
                  isOpen={mobileCategoriesOpen}
                  onClose={() => setMobileCategoriesOpen(false)}
                  state={state}
                  onCategoryToggle={handleCategoryToggle}
                  onMessageToggle={handleMessageToggle}
                />
              </div>
            </div>

            {/* Desktop categories panel (≥md:). Same content as the modal
                via the shared CategoryList component. PM ruling §5.6:
                disabled on 🟠/⚫/🔴 via opacity + pointer-events-none;
                cursor-not-allowed on the wrapper so hover still feels
                disabled. Existing checked state is preserved (re-selecting
                an in-scope vertical brings the user back to their prior
                shape per §6 preservation principle). */}
            <div
              className={`hidden rounded-xl border border-border-secondary bg-bg-primary md:block md:min-w-60 ${
                isMessageAreaDisabled ? "cursor-not-allowed" : ""
              }`}
            >
              <div
                className={
                  isMessageAreaDisabled ? "pointer-events-none opacity-50" : ""
                }
              >
                <CategoryList
                  state={state}
                  onCategoryToggle={handleCategoryToggle}
                  onMessageToggle={handleMessageToggle}
                />
              </div>
            </div>

            {/* Messages column */}
            <div className="flex flex-col md:max-w-[540px]">
              {/* Elig section — sits at the top of the right column above the
                  tone pills (vertical-constraints §9). Wave 1 ships dropdowns
                  + state + localStorage emission only; Wave 2 adds the
                  verdict cards and the disabled-categories + empty-state
                  behavior for 🟠/⚫/🔴. */}
              <div className="mb-6">
                <EligSection
                  state={eligState}
                  onMultiTenantChange={setEligMultiTenant}
                  onVerticalChange={setEligVerticalSlug}
                  onSubVerticalChange={setEligSubVerticalSlug}
                />
              </div>
              {isMessageAreaDisabled ? null : (
                <>
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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                      >
                        <Copy01 className="size-4" />
                        {copyToastVisible ? "Copied" : "Copy"}
                      </button>
                      <KebabMenu
                        ariaLabel="Configurator options"
                        items={[
                          {
                            label: "Reset all to defaults",
                            onClick: clearAll,
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      ref={businessNameInputRef}
                      type="text"
                      value={state.businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your business name"
                      className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="mt-8 space-y-7">
                {isMessageAreaDisabled ? (
                  <EligEmptyState state={eligState} />
                ) : null}

                {!isMessageAreaDisabled && checkedCategories.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border-secondary px-6 py-10 text-center">
                    <p className="text-sm text-text-tertiary">
                      Select a category to see your messages.
                    </p>
                  </div>
                ) : null}

                {!isMessageAreaDisabled && checkedCategories.map((category) => {
                  const catState = state.categories[category.id];
                  const cv = state.categoryValues[category.id];
                  const requiresStop = categoryRequiresStop(category);
                  const addingNew =
                    editTarget?.kind === "new-custom" &&
                    editTarget.categoryId === category.id;
                  const editValuesOpen = editValuesCategoryId === category.id;
                  return (
                    <div key={category.id}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="text-base font-semibold text-text-primary">
                          {category.name}
                        </h4>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setEditValuesCategoryId(
                                editValuesOpen ? null : category.id,
                              )
                            }
                            aria-expanded={editValuesOpen}
                            className="inline-flex cursor-pointer items-center gap-1 px-1 py-0.5 text-xs font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                          >
                            Variables
                            {editValuesOpen ? (
                              <ChevronUp className="size-3.5" />
                            ) : (
                              <ChevronDown className="size-3.5" />
                            )}
                          </button>
                          <KebabMenu
                            ariaLabel={`${category.name} options`}
                            items={[
                              {
                                label: "Reset to defaults",
                                onClick: () => clearCategory(category.id),
                              },
                            ]}
                          />
                        </div>
                      </div>
                      {/* Desktop expander — sits above the messages so
                          previews stay visible while editing. Mobile uses
                          the EditValuesModal mounted at section level. */}
                      {editValuesOpen ? (
                        <div className="mb-3 hidden rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs md:block dark:bg-bg-secondary">
                          <EditValuesForm
                            category={category}
                            values={cv.variables}
                            onChange={(name, value) =>
                              setCategoryVariable(category.id, name, value)
                            }
                            focusVariableName={focusVariableOnOpen}
                            onFocusDelivered={() =>
                              setFocusVariableOnOpen(null)
                            }
                          />
                        </div>
                      ) : null}
                      <div className="space-y-3">
                        {category.messages.map((message) => {
                          if (!catState.messages[message.id]?.checked)
                            return null;
                          const customBody = cv.customBodies[message.id];
                          const pinnedTone = cv.messageTones[message.id];
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
                                pinnedTone={pinnedTone}
                                customBody={customBody}
                                categoryVariables={cv.variables}
                                requiresStop={requiresStop}
                                onVariableDoubleClick={(name) =>
                                  handleVariableDoubleClick(category.id, name)
                                }
                                onSave={(decision) => {
                                  setMessageEdit(
                                    category.id,
                                    message.id,
                                    decision,
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
                                          decision.kind === "custom"
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
                                customBody,
                                pinnedTone,
                                state.pageTone,
                              )}
                              variables={category.variables}
                              categoryVariables={cv.variables}
                              businessName={state.businessName}
                              requiresStop={requiresStop}
                              onEdit={() =>
                                setEditTarget({
                                  kind: "corpus",
                                  categoryId: category.id,
                                  messageId: message.id,
                                })
                              }
                              onVariableDoubleClick={(name) =>
                                handleVariableDoubleClick(category.id, name)
                              }
                            />
                          );
                        })}

                        {cv.addedMessages.map((cm) => {
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
                              categoryVariables={cv.variables}
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
                              onVariableDoubleClick={(name) =>
                                handleVariableDoubleClick(category.id, name)
                              }
                            />
                          );
                        })}

                        {addingNew ? (
                          <CustomMessageCard
                            name=""
                            body=""
                            variables={category.variables}
                            categoryVariables={cv.variables}
                            businessName={state.businessName}
                            placeholder={
                              CUSTOM_NAME_PLACEHOLDERS[category.id] ??
                              "e.g. Holiday hours"
                            }
                            requiresStop={requiresStop}
                            isEditing
                            isNew
                            onEditRequest={() => {}}
                            onVariableDoubleClick={(name) =>
                              handleVariableDoubleClick(category.id, name)
                            }
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

              {hideBottomCta ? null : (
                <div className="mt-10">
                  {/* PRE-LAUNCH (2026-05-16): opens the waitlist modal. Revert to
                      a <Link> "Start building with SMS →" (href "/signup") when
                      onboarding ships. See docs/PRE_LAUNCH_DEVIATIONS.md
                      WAVE 2 (2026-05-29): hidden on every disabled bucket
                      (🟠/⚫/🔴). The inline form in the verdict card is the
                      canonical capture on 🟠/⚫; a backup CTA here would
                      produce untagged general-waitlist signups that bypass
                      the interest_tag segmentation. 🔴 has no waitlist at
                      all (PM ruling §5.2 — no future state to sign up for). */}
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
              )}
            </div>
          </div>
        </div>
      </section>
    </SessionProvider>
  );
}
