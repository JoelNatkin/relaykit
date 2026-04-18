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

  const preview = (() => {
    if (!key) return "";
    const example = getExampleValues(categoryId).get(key);
    return example ? example.preview(state) : `{${key}}`;
  })();

  return (
    <NodeViewWrapper
      as="span"
      data-variable-key={key ?? undefined}
      className={VARIABLE_TOKEN_CLASSES}
    >
      {preview}
    </NodeViewWrapper>
  );
}
