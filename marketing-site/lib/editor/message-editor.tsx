"use client";

/**
 * Thin Tiptap wrapper for editing a single SMS message body. The external
 * interface is the message-library `{{double-brace}}` body format. Enter is
 * suppressed (SMS messages are single-line).
 *
 * `categoryVariables` is passed through React context (not extension
 * options) so chip previews stay reactive — see
 * `./category-variables-context.ts`.
 */

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { Variable } from "@/lib/message-library/types";
import { VariableNode } from "./variable-node";
import { CategoryVariablesContext } from "./category-variables-context";
import { bodyToContent, docToBody } from "./template-serde";

interface MessageEditorProps {
  /** Message body in `{{double-brace}}` format. */
  body: string;
  /** The message's category variable catalog — drives token recognition + previews. */
  variables: Variable[];
  /**
   * Per-category authored variable values (D-414). Surfaced via context so
   * NodeView chips re-render reactively without remounting the editor.
   */
  categoryVariables?: Record<string, string>;
  /** Invoked when a chip is double-clicked — see VariableNode.onVariableDoubleClick. */
  onVariableDoubleClick?: (variableName: string) => void;
  disabled?: boolean;
  className?: string;
  onChange: (body: string) => void;
  onReady?: (editor: Editor) => void;
}

export function MessageEditor({
  body,
  variables,
  categoryVariables,
  onVariableDoubleClick,
  disabled = false,
  className,
  onChange,
  onReady,
}: MessageEditorProps) {
  const lastEmittedRef = useRef<string>(body);
  // Mutable handle so the editor's extension can always reach the latest
  // double-click callback without needing the extensions array rebuilt.
  const dblClickRef = useRef<typeof onVariableDoubleClick>(onVariableDoubleClick);
  useEffect(() => {
    dblClickRef.current = onVariableDoubleClick;
  }, [onVariableDoubleClick]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      VariableNode.configure({
        variables,
        onVariableDoubleClick: (name: string) => dblClickRef.current?.(name),
      }),
    ],
    content: bodyToContent(body, variables),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: className ?? "outline-none",
        "aria-label": "Message text",
      },
      handleKeyDown(_view, event) {
        if (event.key === "Enter") {
          event.preventDefault();
          return true;
        }
        return false;
      },
      handleDrop() {
        return true;
      },
      handleDOMEvents: {
        dragstart: (_view, event) => {
          event.preventDefault();
          return true;
        },
      },
    },
    onUpdate({ editor }) {
      const next = docToBody(editor.state.doc);
      lastEmittedRef.current = next;
      onChange(next);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (body === lastEmittedRef.current) return;
    queueMicrotask(() => {
      if (!editor || editor.isDestroyed) return;
      editor.commands.setContent(bodyToContent(body, variables), {
        emitUpdate: false,
      });
      lastEmittedRef.current = body;
    });
  }, [editor, body, variables]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled, false);
  }, [editor, disabled]);

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  return (
    <CategoryVariablesContext.Provider value={categoryVariables}>
      <EditorContent editor={editor} />
    </CategoryVariablesContext.Provider>
  );
}
