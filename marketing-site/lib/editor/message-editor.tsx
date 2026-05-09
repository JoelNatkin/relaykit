"use client";

/**
 * Marketing-side parity copy of `prototype/lib/editor/message-editor.tsx`.
 * Thin Tiptap wrapper. External interface is the `{var_key}` template
 * string format used everywhere else. Enter is suppressed (SMS messages
 * are single-line). Diverge only intentionally.
 */

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { VerticalId } from "@/lib/configurator/types";
import { VariableNode } from "./variable-node";
import { templateToContent, docToTemplate } from "./template-serde";

interface MessageEditorProps {
  template: string;
  verticalId: VerticalId;
  disabled?: boolean;
  className?: string;
  onChange: (template: string) => void;
  onReady?: (editor: Editor) => void;
}

export function MessageEditor({
  template,
  verticalId,
  disabled = false,
  className,
  onChange,
  onReady,
}: MessageEditorProps) {
  const lastEmittedRef = useRef<string>(template);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      VariableNode.configure({ verticalId }),
    ],
    content: templateToContent(template, verticalId),
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
      const next = docToTemplate(editor.state.doc);
      lastEmittedRef.current = next;
      onChange(next);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (template === lastEmittedRef.current) return;
    queueMicrotask(() => {
      if (!editor || editor.isDestroyed) return;
      editor.commands.setContent(templateToContent(template, verticalId), {
        emitUpdate: false,
      });
      lastEmittedRef.current = template;
    });
  }, [editor, template, verticalId]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled, false);
  }, [editor, disabled]);

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  return <EditorContent editor={editor} />;
}
