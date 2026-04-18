"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useSession } from "@/context/session-context";
import { getExampleValues } from "@/lib/catalog-helpers";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/variable-token";
import type { VariableNodeOptions } from "./variable-node";

export function VariableNodeView(props: ReactNodeViewProps) {
  const { state } = useSession();
  const key: string | null = props.node.attrs.key;
  const categoryId = (props.extension.options as VariableNodeOptions).categoryId;
  const selected = props.selected;

  const preview = (() => {
    if (!key) return "";
    const example = getExampleValues(categoryId).get(key);
    return example ? example.preview(state) : `{${key}}`;
  })();

  // D-350: at rest the token is color-only (no background, no radius, no
  // padding) so prose reads cleanly. Hover and selected get a padded pill
  // treatment for interaction feedback. Padding + negative margin pair
  // (px-1 / -mx-1) grows the background 4px outside the text on each side
  // without shifting surrounding text flow.
  //
  // Selected > hover by bg darkness: hover = bg-bg-brand-secondary (lightest
  // brand tint), selected = bg-bg-brand-primary (next shade up). No ring by
  // default per PM direction.
  //
  // Drag suppression: contentEditable={false} makes the atom click-selectable
  // (otherwise the browser treats inner text as editable and clicks place a
  // caret). draggable={false} + onDragStart + [-webkit-user-drag:none] kill
  // drag at three layers (Chrome/Firefox/Safari) since drag isn't part of
  // the interaction model — insert affordance + backspace cover all flows.
  const stateClasses = selected
    ? "bg-bg-brand-primary rounded-sm px-1 -mx-1"
    : "hover:bg-bg-brand-secondary hover:rounded-sm hover:px-1 hover:-mx-1";

  return (
    <NodeViewWrapper
      as="span"
      contentEditable={false}
      draggable={false}
      onDragStart={(e: React.DragEvent<HTMLSpanElement>) => e.preventDefault()}
      data-variable-key={key ?? undefined}
      className={`${VARIABLE_TOKEN_CLASSES} [-webkit-user-drag:none] transition-colors duration-100 ${stateClasses}`}
    >
      {preview}
    </NodeViewWrapper>
  );
}
