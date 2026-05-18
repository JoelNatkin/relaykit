/**
 * Serialization between the message-library `{{double-brace}}` body format and
 * the Tiptap document model. Variables become atomic `variable` nodes; known
 * tokens are resolved against the message's category variable catalog.
 */

import type { Node as PMNode } from "@tiptap/pm/model";
import type { Variable } from "@/lib/message-library/types";

export interface DocContent {
  type: "doc";
  content: Array<{
    type: "paragraph";
    content: Array<
      | { type: "text"; text: string }
      | { type: "variable"; attrs: { key: string } }
    >;
  }>;
}

/** Parse a `{{token}}` body into Tiptap doc content. */
export function bodyToContent(body: string, variables: Variable[]): DocContent {
  const validKeys = new Set(variables.map((v) => v.name));
  const children: DocContent["content"][number]["content"] = [];

  for (const part of body.split(/(\{\{[^}]+\}\})/g)) {
    if (!part) continue;
    const m = part.match(/^\{\{(\w+)\}\}$/);
    if (m && validKeys.has(m[1])) {
      children.push({ type: "variable", attrs: { key: m[1] } });
    } else {
      children.push({ type: "text", text: part });
    }
  }

  return {
    type: "doc",
    content: [{ type: "paragraph", content: children }],
  };
}

/** Serialize a Tiptap document back to a `{{token}}` body string. */
export function docToBody(doc: PMNode): string {
  let out = "";
  doc.descendants((node) => {
    if (node.type.name === "variable") {
      const key = node.attrs.key as string | null;
      if (key) out += `{{${key}}}`;
      return false;
    }
    if (node.isText) {
      out += node.text ?? "";
      return false;
    }
    return true;
  });
  return out;
}
