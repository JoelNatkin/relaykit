"use client";

/**
 * Marketing-side parity copy of `prototype/lib/editor/variable-node-view.tsx`.
 * Renders an atomic, color-only token inside the Tiptap editor whose preview
 * value resolves from the configurator's SessionState. Diverge only
 * intentionally.
 */

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useSession } from "@/lib/configurator/session-context";
import { getExampleValues } from "@/lib/configurator/example-values";
import type { VerticalId } from "@/lib/configurator/types";
import { VARIABLE_TOKEN_CLASSES } from "./variable-token";
import type { VariableNodeOptions } from "./variable-node";

export function VariableNodeView(props: ReactNodeViewProps) {
  const { state } = useSession();
  const key: string | null = props.node.attrs.key;
  const verticalId = (props.extension.options as VariableNodeOptions).verticalId as VerticalId;
  const selected = props.selected;

  const preview = (() => {
    if (!key) return "";
    const example = getExampleValues(verticalId).get(key);
    return example ? example.preview(state) : `{${key}}`;
  })();

  const padded = "pt-[3px] pb-[3px] -mt-[3px] -mb-[3px]";
  const stateClasses = selected
    ? `bg-bg-brand-secondary ${padded}`
    : "hover:bg-bg-brand-primary hover:pt-[3px] hover:pb-[3px] hover:-mt-[3px] hover:-mb-[3px]";

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
