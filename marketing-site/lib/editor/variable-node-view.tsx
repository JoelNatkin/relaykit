"use client";

/**
 * Renders an atomic, color-only variable token inside the Tiptap editor. The
 * preview value resolves from the message's category variable catalog, with
 * `business_name` reflecting the live configurator input.
 *
 * Per-category authored values come from CategoryVariablesContext rather
 * than extension.options — the NodeView re-renders on context change, so
 * chip previews stay live as the visitor edits values in the Variables
 * form (no editor remount).
 */

import { useContext } from "react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useSession } from "@/lib/configurator/session-context";
import { resolveVariableExample } from "@/lib/message-library/render";
import { VARIABLE_TOKEN_CLASSES } from "./variable-token";
import { CategoryVariablesContext } from "./category-variables-context";
import type { VariableNodeOptions } from "./variable-node";

export function VariableNodeView(props: ReactNodeViewProps) {
  const { state } = useSession();
  const key: string | null = props.node.attrs.key;
  const { variables, onVariableDoubleClick } =
    props.extension.options as VariableNodeOptions;
  const categoryVariables = useContext(CategoryVariablesContext);
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

  function handleDoubleClick(e: React.MouseEvent<HTMLSpanElement>) {
    if (!key || !onVariableDoubleClick) return;
    e.preventDefault();
    e.stopPropagation();
    onVariableDoubleClick(key);
  }

  return (
    <NodeViewWrapper
      as="span"
      contentEditable={false}
      draggable={false}
      onDragStart={(e: React.DragEvent<HTMLSpanElement>) => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
      data-variable-key={key ?? undefined}
      className={`${VARIABLE_TOKEN_CLASSES} [-webkit-user-drag:none] transition-colors duration-100 ${stateClasses}`}
    >
      {preview}
    </NodeViewWrapper>
  );
}
