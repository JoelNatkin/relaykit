"use client";

/**
 * Per-category authored variable values, surfaced to Tiptap NodeViews via
 * React context rather than through extension.options.
 *
 * Why context: `useEditor`'s extensions array is constructed once at mount,
 * so `VariableNode.configure({ categoryVariables })` would capture a stale
 * snapshot. Reading the same data from React context lets each NodeView
 * re-render reactively when the visitor edits a value in the Variables
 * form — no editor remount, no flicker, no focus loss.
 *
 * Default `undefined` means "no per-category values provided" so the
 * resolver falls through to the variable's corpus example.
 */

import { createContext } from "react";

export const CategoryVariablesContext = createContext<
  Record<string, string> | undefined
>(undefined);
