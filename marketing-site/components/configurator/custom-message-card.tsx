"use client";

/**
 * Visitor-authored custom message card. Matches the workspace authoring shape
 * (`prototype/components/catalog/custom-message-card.tsx`): a required Name
 * field, a Message body editor, and a "+ Variable" picker. Custom messages
 * carry forward into the visitor's workspace at signup.
 *
 * Out of scope here: monitor/test, kebab/archive, AI rewrite, slugs.
 */

import { Plus } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { MessageEditor } from "@/lib/editor/message-editor";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";
import { checkCompliance } from "@/lib/configurator/compliance";
import { interpolateBody, resolveVariableExample } from "@/lib/message-library/render";
import type { Variable } from "@/lib/message-library";

interface CustomMessageCardProps {
  name: string;
  body: string;
  variables: Variable[];
  businessName: string;
  /** Category-aware placeholder for the Name field. */
  placeholder: string;
  /** True for Marketing-shaped categories — drives the opt-out compliance rule. */
  requiresStop: boolean;
  isEditing: boolean;
  /** Freshly-added draft — focuses the Name field on open. */
  isNew?: boolean;
  onEditRequest: () => void;
  onSave: (next: { name: string; body: string }) => void;
  onCancel: () => void;
  /** Present for saved messages — absent for a never-saved draft. */
  onRemove?: () => void;
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

export function CustomMessageCard({
  name,
  body,
  variables,
  businessName,
  placeholder,
  requiresStop,
  isEditing,
  isNew = false,
  onEditRequest,
  onSave,
  onCancel,
  onRemove,
}: CustomMessageCardProps) {
  const editorRef = useRef<Editor | null>(null);
  const insertWrapperRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [editName, setEditName] = useState(name);
  const [editBody, setEditBody] = useState(body);
  const [isInsertOpen, setIsInsertOpen] = useState(false);

  // Re-seed the local draft whenever an edit session opens.
  const prevEditingRef = useRef(false);
  useEffect(() => {
    if (isEditing && !prevEditingRef.current) {
      setEditName(name);
      setEditBody(body);
    }
    prevEditingRef.current = isEditing;
  }, [isEditing, name, body]);

  useEffect(() => {
    if (isEditing && isNew) nameInputRef.current?.focus();
  }, [isEditing, isNew]);

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

  function insertVariable(variableName: string) {
    editorRef.current?.chain().focus().insertVariable(variableName).run();
    setIsInsertOpen(false);
  }

  const compliance = checkCompliance({ body: editBody, variables, requiresStop });
  const nameEmpty = editName.trim() === "";
  const bodyEmpty = editBody.trim() === "";
  const canSave = !nameEmpty && !bodyEmpty && compliance.isCompliant;

  function handleSave() {
    if (!canSave) return;
    onSave({ name: editName.trim(), body: editBody });
  }

  if (!isEditing) {
    const segments = interpolateBody(body, variables, businessName);
    return (
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs dark:bg-bg-secondary">
        <div className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
            {name || "Untitled message"}
          </span>
          <button
            type="button"
            onClick={onEditRequest}
            aria-label="Edit message"
            className="cursor-pointer p-1 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
          >
            <PencilIcon />
          </button>
        </div>
        <div
          className="mt-1 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={onEditRequest}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEditRequest();
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

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs dark:bg-bg-secondary">
      <div>
        <label
          htmlFor="custom-message-name"
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Name
        </label>
        <input
          id="custom-message-name"
          ref={nameInputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs transition duration-100 ease-linear focus:border-border-brand focus:outline-none dark:bg-bg-secondary"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="custom-message-body"
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Message
        </label>
        <div
          id="custom-message-body"
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs transition duration-100 ease-linear focus-within:border-border-brand dark:bg-bg-secondary"
        >
          <MessageEditor
            body={editBody}
            variables={variables}
            className="min-h-[4.5rem] text-sm leading-relaxed text-text-secondary outline-none"
            onChange={setEditBody}
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
          <div className="flex items-start">
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
                      No variables for this category.
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
                          {resolveVariableExample(variable, businessName)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="cursor-pointer px-1 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-error-primary"
              >
                Remove
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
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
                disabled={!canSave}
                className="cursor-pointer rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
