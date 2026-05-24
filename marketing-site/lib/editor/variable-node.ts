/**
 * Tiptap node for message variables. Variables render as atomic,
 * indivisibly-selectable tokens (D-350). The category `variables` catalog
 * flows through to the NodeView so it can resolve preview values.
 *
 * Per-category authored values (D-414) are surfaced through the
 * CategoryVariablesContext, not extension options — see
 * `./category-variables-context.ts` for the rationale.
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { Variable } from "@/lib/message-library/types";
import { VariableNodeView } from "./variable-node-view";

export interface VariableNodeOptions {
  variables: Variable[];
  /**
   * Invoked when a chip is double-clicked — the configurator routes this
   * to opening the category's Variables form with the named variable's
   * input focused (or to the top-of-page businessName input when the token
   * is an identity token per D-413).
   */
  onVariableDoubleClick?: (variableName: string) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (key: string) => ReturnType;
    };
  }
}

export const VariableNode = Node.create<VariableNodeOptions>({
  name: "variable",

  addOptions() {
    return { variables: [] };
  },

  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-variable-key"),
        renderHTML: (attrs) => ({ "data-variable-key": attrs.key }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-variable-key]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeView);
  },

  addCommands() {
    return {
      insertVariable:
        (key: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { key } }),
    };
  },
});
