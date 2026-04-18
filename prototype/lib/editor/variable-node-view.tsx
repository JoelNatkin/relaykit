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

  // D-350: the atom wrapper must be non-editable so that single click selects
  // the whole node (ProseMirror/Tiptap otherwise treats the inner text as
  // editable and click becomes a caret placement). draggable={false} +
  // onDragStart handler disable drag at the DOM level since drag semantics
  // (copy vs move) vary by browser and ProseMirror's default drop handler
  // is a copy. Keeping the insert affordance + backspace as the canonical
  // flows; drag isn't part of the core interaction model.
  //
  // Visual states:
  //   at rest  — color-only, no background (preserves prose reading)
  //   hover    — subtle brand-secondary background
  //   selected — same background + brand ring (from props.selected, which
  //              Tiptap sets when ProseMirror's node selection targets this
  //              node; enables keyboard backspace-to-delete feedback)
  const baseClasses =
    "rounded-sm px-0.5 -mx-0.5 transition-colors duration-100";
  const stateClasses = selected
    ? "bg-bg-brand-secondary ring-1 ring-border-brand"
    : "hover:bg-bg-brand-secondary";

  return (
    <NodeViewWrapper
      as="span"
      contentEditable={false}
      draggable={false}
      onDragStart={(e: React.DragEvent<HTMLSpanElement>) => e.preventDefault()}
      data-variable-key={key ?? undefined}
      className={`${VARIABLE_TOKEN_CLASSES} ${baseClasses} ${stateClasses}`}
    >
      {preview}
    </NodeViewWrapper>
  );
}
