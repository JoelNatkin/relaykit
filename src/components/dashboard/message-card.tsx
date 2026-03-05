"use client";

import { useState } from "react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { TextAreaBase } from "@/components/base/textarea/textarea";
import { Button } from "@/components/base/buttons/button";
import { Star01, AlertTriangle } from "@untitledui/icons";
import {
  checkCompliance,
  getMissingElements,
} from "@/lib/dashboard/compliance-check";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";

interface MessageCardProps {
  entry: MessagePlanEntry;
  complianceElements: string[];
  isExpansion: boolean;
  expansionType: string | null;
  onToggle: (templateId: string, enabled: boolean) => void;
  onEdit: (templateId: string, editedText: string | null) => void;
}

export function MessageCard({
  entry,
  complianceElements,
  isExpansion,
  expansionType,
  onToggle,
  onEdit,
}: MessageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(
    entry.edited_text ?? entry.original_template,
  );

  const displayText = entry.edited_text ?? entry.original_template;
  const warnings = isEditing
    ? checkCompliance(editText, complianceElements)
    : [];
  const missingElements = getMissingElements(warnings);

  function handleDone() {
    const finalText =
      editText === entry.original_template ? null : editText;
    onEdit(entry.template_id, finalText);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(entry.edited_text ?? entry.original_template);
    setIsEditing(false);
  }

  function handleRestore() {
    setEditText(entry.original_template);
    onEdit(entry.template_id, null);
    setIsEditing(false);
  }

  return (
    <div
      className={`rounded-lg border p-4 transition duration-100 ease-linear ${
        isEditing
          ? "border-brand ring-1 ring-brand"
          : "border-secondary bg-primary"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          isSelected={entry.enabled}
          onChange={(checked: boolean) =>
            onToggle(entry.template_id, checked)
          }
          className="mt-0.5"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isExpansion && (
              <Star01 className="size-4 shrink-0 text-fg-warning-secondary" />
            )}
            <span className="text-sm font-medium text-primary">
              {entry.category}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <TextAreaBase
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />

              {missingElements.length > 0 && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-warning-secondary p-2.5">
                  <AlertTriangle className="size-4 shrink-0 text-fg-warning-primary" />
                  <div className="text-xs">
                    <p className="text-warning-primary">
                      {missingElements.includes("opt-out language")
                        ? "Carriers need opt-out language in this message."
                        : "Carriers expect your business name in each message."}
                    </p>
                    <Button
                      size="sm"
                      color="link-color"
                      onClick={handleRestore}
                      className="mt-1"
                    >
                      Restore default
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <Button size="sm" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" color="primary" onClick={handleDone}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1.5 whitespace-pre-wrap font-mono text-sm text-tertiary">
                &ldquo;{displayText}&rdquo;
              </p>
              <p className="mt-1.5 text-xs text-quaternary">
                Trigger: {entry.trigger}
              </p>
              {isExpansion && expansionType && (
                <p className="mt-1.5 text-xs text-tertiary">
                  Needs {expansionType} expansion — we add a separate consent
                  form when you register.
                </p>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <Button
            size="sm"
            color="link-gray"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
