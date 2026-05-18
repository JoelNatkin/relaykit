"use client";

/**
 * Thin Tiptap wrapper for editing a single SMS message body. The external
 * interface is the message-library `{{double-brace}}` body format. Enter is
 * suppressed (SMS messages are single-line).
 */

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { Variable } from "@/lib/message-library/types";
import { VariableNode } from "./variable-node";
import { bodyToContent, docToBody } from "./template-serde";

interface MessageEditorProps {
  /** Message body in `{{double-brace}}` format. */
  body: string;
  /** The message's category variable catalog — drives token recognition + previews. */
  variables: Variable[];
  disabled?: boolean;
  className?: string;
  onChange: (body: string) => void;
  onReady?: (editor: Editor) => void;
}

export function MessageEditor({
  body,
  variables,
  disabled = false,
  className,
  onChange,
  onReady,
}: MessageEditorProps) {
  const lastEmittedRef = useRef<string>(body);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      VariableNode.configure({ variables }),
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

  return <EditorContent editor={editor} />;
}
