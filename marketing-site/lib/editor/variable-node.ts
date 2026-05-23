/**
 * Tiptap node for message variables. Variables render as atomic,
 * indivisibly-selectable tokens (D-350). The category `variables` catalog
 * flows through to the NodeView so it can resolve preview values.
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { Variable } from "@/lib/message-library/types";
import { VariableNodeView } from "./variable-node-view";

export interface VariableNodeOptions {
  variables: Variable[];
  /**
   * Per-category authored variable values (D-414 / configurator-authoring
   * Resolved §1). Read by the NodeView when resolving chip preview text.
   */
  categoryVariables?: Record<string, string>;
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
    return { variables: [], categoryVariables: {} };
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
