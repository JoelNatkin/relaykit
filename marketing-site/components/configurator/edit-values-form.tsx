"use client";

/**
 * Shared "Variables" form content — one input per non-identity variable
 * in the category. Identity tokens (`business_name` / `workspace_name` /
 * `community_name`) are filtered out per D-413 — they resolve from the
 * top-of-page "Your business name" input and aren't duplicated here.
 *
 * Pure presentational: receives the category, current per-category
 * `variables` map, and an onChange setter from the parent. Live-applies on
 * every keystroke — every preview in the category (read cards, edit-card
 * editor chips, the Insert variable dropdown's preview values) reflects the
 * new value immediately, since they all read through the resolver that
 * pulls from the same `categoryValues[catId].variables` map.
 *
 * Empty input → resolver falls through to the variable's corpus `example`.
 * The setter mirrors that: an empty value removes the entry from state.
 *
 * Rendered by both the desktop inline expander and the mobile full-page
 * modal so the two surfaces stay byte-identical.
 */

import { useMemo } from "react";
import type { Category } from "@/lib/message-library";
import { isIdentityToken } from "@/lib/message-library";

export interface EditValuesFormProps {
  category: Category;
  /** Current per-category variable values. */
  values: Record<string, string>;
  onChange: (variableName: string, value: string) => void;
}

export function EditValuesForm({ category, values, onChange }: EditValuesFormProps) {
  const editableVariables = useMemo(
    () => category.variables.filter((v) => !isIdentityToken(v.name)),
    [category.variables],
  );

  // For each editable variable, the list of message names whose variants
  // reference it. Scanned across every variant body (a variable used only in
  // one tone still counts) so the hint is consistent regardless of which
  // tone the visitor is previewing.
  const usedBy = useMemo<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    for (const variable of editableVariables) {
      const token = `{{${variable.name}}}`;
      const names: string[] = [];
      for (const message of category.messages) {
        const referenced = message.variants.some((v) => v.body.includes(token));
        if (referenced) names.push(message.name);
      }
      map[variable.name] = names;
    }
    return map;
  }, [editableVariables, category.messages]);

  if (editableVariables.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">
        No editable values in this category.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {editableVariables.map((variable) => {
        const usedNames = usedBy[variable.name];
        const inputId = `edit-values-${category.id}-${variable.name}`;
        return (
          <div key={variable.name}>
            <label
              htmlFor={inputId}
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              {variable.name}
            </label>
            <input
              id={inputId}
              type="text"
              value={values[variable.name] ?? ""}
              onChange={(e) => onChange(variable.name, e.target.value)}
              placeholder={variable.example}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs transition duration-100 ease-linear focus:border-border-brand focus:outline-none dark:bg-bg-secondary"
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              {usedNames.length > 0
                ? `Used in: ${usedNames.join(", ")}`
                : "Not currently used."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
