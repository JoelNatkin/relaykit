"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { VariableNode } from "./variable-node";
import { templateToContent, docToTemplate } from "./template-serde";

interface MessageEditorProps {
  /** Template string with `{var_key}` tokens */
  template: string;
  categoryId: string;
  disabled?: boolean;
  className?: string;
  onChange: (template: string) => void;
  /** Exposed so the parent can call editor.commands.insertVariable(key) */
  onReady?: (editor: Editor) => void;
}

/**
 * Thin Tiptap wrapper. The editor's internal state is a ProseMirror doc;
 * the external interface is the same `{var_key}` template string format
 * used everywhere else in the prototype (zero data migration). Enter is
 * suppressed — SMS messages are single-line.
 */
export function MessageEditor({
  template,
  categoryId,
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
      VariableNode.configure({ categoryId }),
    ],
    content: templateToContent(template, categoryId),
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
      // Drag suppression at the editor level (complements the NodeView's
      // DOM-level drag blockers). handleDrop returning true tells ProseMirror
      // the drop was handled — prevents the default copy-on-drop behavior
      // that was duplicating tokens when the browser initiated a drag despite
      // draggable=false.
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

  // Sync external template changes (tone-pill swap, Restore) into the editor
  // without creating an onUpdate feedback loop — only resets when the new
  // template differs from the last value the editor emitted.
  //
  // setContent is deferred to a microtask. Calling it synchronously inside
  // the effect fires during React's commit phase, and Tiptap's flushSync
  // inside setContent then collides with React's own in-progress flush,
  // producing the "flushSync was called from inside a lifecycle method"
  // warning. queueMicrotask runs after the current commit completes. The
  // isDestroyed guard covers the race where the component unmounts between
  // the effect firing and the microtask running.
  useEffect(() => {
    if (!editor) return;
    if (template === lastEmittedRef.current) return;
    queueMicrotask(() => {
      if (!editor || editor.isDestroyed) return;
      editor.commands.setContent(templateToContent(template, categoryId), { emitUpdate: false });
      lastEmittedRef.current = template;
    });
  }, [editor, template, categoryId]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  return <EditorContent editor={editor} />;
}
