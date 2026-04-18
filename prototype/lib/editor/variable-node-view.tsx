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
  // cleanly. Hover and selected paint a horizontal band behind the glyphs
  // with ~3px top / ~5px bottom padding to give the band more presence.
  // Negative margin counterweight keeps the element's layout box unchanged
  // so surrounding text flow stays stable. No radius, no ring.
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
  const padded = "pt-[3px] pb-[3px] -mt-[3px] -mb-[3px]";
  const stateClasses = selected
    ? `bg-bg-brand-secondary ${padded}`
    : `hover:bg-bg-brand-primary hover:pt-[3px] hover:pb-[3px] hover:-mt-[3px] hover:-mb-[3px]`;

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
