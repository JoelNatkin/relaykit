"use client";

/**
 * Renders an atomic, color-only variable token inside the Tiptap editor. The
 * preview value resolves from the message's category variable catalog, with
 * `business_name` reflecting the live configurator input.
 */

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useSession } from "@/lib/configurator/session-context";
import { resolveVariableExample } from "@/lib/message-library/render";
import { VARIABLE_TOKEN_CLASSES } from "./variable-token";
import type { VariableNodeOptions } from "./variable-node";

export function VariableNodeView(props: ReactNodeViewProps) {
  const { state } = useSession();
  const key: string | null = props.node.attrs.key;
  const { variables, categoryVariables } =
    props.extension.options as VariableNodeOptions;
  const selected = props.selected;

  const preview = (() => {
    if (!key) return "";
    const variable = variables.find((v) => v.name === key);
    return variable
      ? resolveVariableExample(variable, {
          businessName: state.businessName,
          categoryVariables,
        })
      : `{{${key}}}`;
  })();

  const padded = "pt-[3px] pb-[3px] -mt-[3px] -mb-[3px]";
  const stateClasses = selected
    ? `bg-bg-variable-highlight ${padded}`
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
