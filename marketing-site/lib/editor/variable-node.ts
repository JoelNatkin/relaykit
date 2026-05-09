/**
 * Marketing-side parity copy of `prototype/lib/editor/variable-node.ts`.
 * Variables render as atomic, indivisibly-selectable tokens (D-350). The
 * `verticalId` option flows through to the NodeView so it can resolve
 * preview values via getExampleValues. Diverge only intentionally.
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VariableNodeView } from "./variable-node-view";

export interface VariableNodeOptions {
  verticalId: string;
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
    return { verticalId: "" };
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
