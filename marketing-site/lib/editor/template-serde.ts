/**
 * Marketing-side parity copy of `prototype/lib/editor/template-serde.ts`.
 * `categoryId` renamed to `verticalId` to match marketing-side naming.
 * Template syntax is `{var_key}`. Diverge only intentionally.
 */

import type { Node as PMNode } from "@tiptap/pm/model";
import { getExampleValues } from "@/lib/configurator/example-values";
import type { VerticalId } from "@/lib/configurator/types";

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

export function templateToContent(template: string, verticalId: VerticalId): DocContent {
  const validKeys = new Set<string>([...getExampleValues(verticalId).keys()]);
  const children: DocContent["content"][number]["content"] = [];

  for (const part of template.split(/(\{[^}]+\})/g)) {
    if (!part) continue;
    const m = part.match(/^\{(\w+)\}$/);
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

export function docToTemplate(doc: PMNode): string {
  let out = "";
  doc.descendants((node) => {
    if (node.type.name === "variable") {
      const key = node.attrs.key as string | null;
      if (key) out += `{${key}}`;
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
