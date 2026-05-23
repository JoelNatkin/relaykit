"use client";

/**
 * Edit card for a corpus message. The visitor picks a tone variant or
 * hand-edits the body; saving commits a `MessageEditDecision` to the
 * configurator state — `{ kind: "tone" }` pins the message to a corpus
 * variant, `{ kind: "custom" }` writes a hand-edited body. Once a message
 * carries either, the page-level tone toggle no longer drives it.
 */

import { HelpCircle, Plus } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { MessageEditor } from "@/lib/editor/message-editor";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";
import { Tooltip } from "@/components/configurator/tooltip";
import { useSession } from "@/lib/configurator/session-context";
import { checkCompliance } from "@/lib/configurator/compliance";
import type { MessageEditDecision } from "@/lib/configurator/use-configurator-state";
import { resolveVariableExample } from "@/lib/message-library/render";
import type { Message, Variable, VariantTone } from "@/lib/message-library";

/** Local edit-card tone selection — "Custom" is the UI pill for a hand-edited body. */
type ActiveTone = VariantTone | "Custom";

interface MessageEditCardProps {
  message: Message;
  variables: Variable[];
  pageTone: VariantTone;
  /** Pinned tone for this message, or undefined when following the page tone. */
  pinnedTone: VariantTone | undefined;
  /** Hand-edited body for this message, or undefined when none. */
  customBody: string | undefined;
  /** Per-category authored variable values (D-414). */
  categoryVariables: Record<string, string>;
  /** True for Marketing-shaped categories — drives the opt-out compliance rule. */
  requiresStop: boolean;
  onSave: (decision: MessageEditDecision) => void;
  onCancel: () => void;
}

function PencilIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

/** The body for a given tone, falling back to the first variant. */
function bodyForTone(message: Message, tone: VariantTone): string {
  const variant =
    message.variants.find((v) => v.tone === tone) ?? message.variants[0];
  return variant?.body ?? "";
}

export function MessageEditCard({
  message,
  variables,
  pageTone,
  pinnedTone,
  customBody,
  categoryVariables,
  requiresStop,
  onSave,
  onCancel,
}: MessageEditCardProps) {
  const { state } = useSession();
  const editorRef = useRef<Editor | null>(null);
  const insertWrapperRef = useRef<HTMLDivElement>(null);

  // Tones this message actually offers, in corpus order.
  const availableTones = message.variants.map((v) => v.tone);
  const fallbackTone: VariantTone = availableTones.includes(pageTone)
    ? pageTone
    : availableTones[0];
  const startedFromCustom = customBody !== undefined;
  const initialTone: ActiveTone = startedFromCustom
    ? "Custom"
    : (pinnedTone ?? fallbackTone);
  const seedBody = startedFromCustom
    ? customBody
    : bodyForTone(message, pinnedTone ?? fallbackTone);

  const [activeTone, setActiveTone] = useState<ActiveTone>(initialTone);
  const [editBody, setEditBody] = useState<string>(seedBody);
  const [customBuffer, setCustomBuffer] = useState<string | null>(
    startedFromCustom ? (customBody ?? "") : null,
  );
  const [isInsertOpen, setIsInsertOpen] = useState(false);

  const showCustomPill = customBuffer !== null || activeTone === "Custom";
  const compliance = checkCompliance({
    body: editBody,
    variables,
    requiresStop,
    categoryVariables,
  });

  useEffect(() => {
    if (!isInsertOpen) return;
    function handleDown(e: MouseEvent) {
      if (
        insertWrapperRef.current &&
        !insertWrapperRef.current.contains(e.target as Node)
      ) {
        setIsInsertOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsInsertOpen(false);
    }
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isInsertOpen]);

  function selectTone(tone: VariantTone) {
    if (activeTone === "Custom") setCustomBuffer(editBody);
    setActiveTone(tone);
    setEditBody(bodyForTone(message, tone));
  }

  function selectCustom() {
    if (customBuffer === null) return;
    setActiveTone("Custom");
    setEditBody(customBuffer);
  }

  function handleTextChange(next: string) {
    setEditBody(next);
    setCustomBuffer(next);
    setActiveTone("Custom");
  }

  function insertVariable(name: string) {
    editorRef.current?.chain().focus().insertVariable(name).run();
    setIsInsertOpen(false);
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    onSave(
      activeTone === "Custom"
        ? { kind: "custom", body: editBody }
        : { kind: "tone", tone: activeTone },
    );
  }

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs dark:bg-bg-secondary">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="min-w-0 truncate text-sm font-semibold text-text-primary">
            {message.name}
          </span>
          {message.tooltip ? (
            <Tooltip content={message.tooltip}>
              {/* 44px hit area wrapper with negative margins to preserve
                  the icon's 14px layout footprint — keeps the row layout
                  unchanged while extending the tap target. */}
              <span className="-m-[15px] inline-flex size-11 items-center justify-center">
                <HelpCircle className="size-3.5 shrink-0 text-fg-quaternary" />
              </span>
            </Tooltip>
          ) : null}
        </div>
        <span className="flex flex-shrink-0 items-center gap-1.5 p-1 text-fg-quaternary">
          <PencilIcon />
          <span className="text-sm">Edit</span>
        </span>
      </div>

      <div className="mt-4">
        <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs transition duration-100 ease-linear focus-within:border-border-brand dark:bg-bg-secondary">
          <MessageEditor
            body={editBody}
            variables={variables}
            categoryVariables={categoryVariables}
            className="text-sm leading-relaxed text-text-secondary outline-none"
            onChange={handleTextChange}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {!compliance.isCompliant ? (
          <div className="mt-1.5 flex flex-col items-end gap-0.5">
            {compliance.issues.map((issue) => (
              <p key={issue} className="text-xs text-text-error-primary">
                {issue}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-1.5 space-y-3">
          <div className="flex flex-wrap items-start gap-2">
            {availableTones.map((tone) => (
              <button
                key={tone}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectTone(tone)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear ${
                  activeTone === tone
                    ? "bg-bg-brand-solid text-text-on-brand"
                    : "border border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                }`}
              >
                {tone}
              </button>
            ))}

            {showCustomPill ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={selectCustom}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear ${
                  activeTone === "Custom"
                    ? "bg-bg-brand-solid text-text-on-brand"
                    : "border border-dashed border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                }`}
              >
                Custom
              </button>
            ) : null}

            <div className="relative ml-auto" ref={insertWrapperRef}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsInsertOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isInsertOpen}
                className="inline-flex cursor-pointer items-center gap-1 py-1.5 text-xs font-semibold whitespace-nowrap text-text-brand-secondary transition-colors duration-100 hover:text-text-brand-secondary_hover"
              >
                <Plus className="size-3.5" />
                Variable
              </button>
              {isInsertOpen ? (
                <div
                  role="menu"
                  className="absolute top-full right-0 z-20 mt-1 rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
                >
                  {variables.length === 0 ? (
                    <p className="px-3 py-2 text-sm whitespace-nowrap text-text-tertiary">
                      No variables for this message.
                    </p>
                  ) : (
                    variables.map((variable) => (
                      <button
                        key={variable.name}
                        type="button"
                        role="menuitem"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => insertVariable(variable.name)}
                        className="flex w-full cursor-pointer items-center justify-between gap-6 px-3 py-2 text-sm whitespace-nowrap transition duration-100 ease-linear hover:bg-bg-primary_hover"
                      >
                        <span className="text-text-secondary">{variable.name}</span>
                        <span className={VARIABLE_TOKEN_CLASSES}>
                          {resolveVariableExample(variable, {
                            businessName: state.businessName,
                            categoryVariables,
                          })}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!compliance.isCompliant}
              className="cursor-pointer rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
