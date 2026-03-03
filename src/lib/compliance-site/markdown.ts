import { escapeHtml } from "./escape";

/**
 * Convert the template engine's markdown output to HTML.
 * Handles only the subset used by our templates:
 * - # / ## / ### headings
 * - **bold** text
 * - - bullet lists
 * - 1. ordered lists
 * - [text](url) inline links
 * - blank-line-separated paragraphs
 */
export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const output: string[] = [];
  let listType: "ul" | "ol" | false = false;

  function closeList() {
    if (listType) {
      output.push(`</${listType}>`);
      listType = false;
    }
  }

  function openList(type: "ul" | "ol") {
    if (listType !== type) {
      closeList();
      output.push(`<${type}>`);
      listType = type;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line — close any open list
    if (trimmed === "") {
      closeList();
      continue;
    }

    // Headings (skip H1 since page template provides it)
    if (trimmed.startsWith("### ")) {
      closeList();
      output.push(`<h3>${applyInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      output.push(`<h2>${applyInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      closeList();
      // Skip top-level heading — page template already renders <h1>
      continue;
    }

    // Bullet list items
    if (trimmed.startsWith("- ")) {
      openList("ul");
      output.push(`<li>${applyInline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Ordered list items
    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      openList("ol");
      output.push(`<li>${applyInline(olMatch[1])}</li>`);
      continue;
    }

    // Paragraph
    closeList();
    output.push(`<p>${applyInline(trimmed)}</p>`);
  }

  closeList();
  return output.join("\n");
}

/** Apply inline formatting: **bold**, [links](url) */
function applyInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
