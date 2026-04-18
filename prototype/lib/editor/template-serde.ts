import type { Node as PMNode } from "@tiptap/pm/model";
import { getExampleValues } from "@/lib/catalog-helpers";

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

/**
 * Parse a `{var_key}` template into Tiptap/ProseMirror JSON. Tokens that
 * match known variable keys for the given category become atomic
 * `variable` nodes; unknown `{tokens}` and plain text stay as text.
 */
export function templateToContent(template: string, categoryId: string): DocContent {
  const validKeys = new Set<string>([...getExampleValues(categoryId).keys()]);
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

/**
 * Serialize a ProseMirror doc back to the `{var_key}` template format.
 * Variable nodes emit `{key}`; text nodes emit their text. Round-trip:
 * `docToTemplate(nodeFromContent(templateToContent(t))) === t` for any
 * template `t` whose variable keys exist in the category registry.
 */
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
