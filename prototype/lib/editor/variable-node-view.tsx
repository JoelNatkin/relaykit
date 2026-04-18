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

  // D-350: at rest the token is color-only (no background) so prose reads
  // cleanly. Hover and selected paint a flat horizontal band behind the
  // glyphs — mimics native text selection. No radius, no horizontal padding,
  // no ring. Without padding expansion there is no layout shift on state
  // change, so no negative-margin offset is needed either.
  //
  // Token choice by observed rendering in this prototype's theme:
  //   hover    → bg-bg-brand-primary    (lighter tint)
  //   selected → bg-bg-brand-secondary  (one shade up, darker)
  // Per PM direction after browser testing.
  //
  // Drag suppression: contentEditable={false} makes the atom click-selectable
  // (otherwise the browser treats inner text as editable and clicks place a
  // caret). draggable={false} + onDragStart + [-webkit-user-drag:none] kill
  // drag at three layers (Chrome/Firefox/Safari) since drag isn't part of
  // the interaction model — insert affordance + backspace cover all flows.
  const stateClasses = selected
    ? "bg-bg-brand-secondary"
    : "hover:bg-bg-brand-primary";

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
