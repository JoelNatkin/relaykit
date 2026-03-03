/** Escape HTML entities in text content */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Escape HTML attribute values (escapeHtml + quotes) */
export function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}
