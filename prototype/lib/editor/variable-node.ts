import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VariableNodeView } from "./variable-node-view";

export interface VariableNodeOptions {
  categoryId: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (key: string) => ReturnType;
    };
  }
}

/**
 * D-350: variables render as atomic, indivisibly-selectable tokens.
 * `atom: true` + `selectable: true` gives cursor-before/after, click-selects-
 * whole-unit, and backspace-deletes-whole for free. No cursor can land
 * inside the node, preventing the class of error where a user silently
 * corrupts a per-recipient variable into static text.
 */
export const VariableNode = Node.create<VariableNodeOptions>({
  name: "variable",

  addOptions() {
    return { categoryId: "" };
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
