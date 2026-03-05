export interface CanonMessage {
  template_id: string;
  category: string;
  text: string;
  trigger: string;
  variables: string[];
  is_expansion: boolean;
}

/**
 * Renders the canon messages markdown section used in both
 * MESSAGING_SETUP.md and production SMS_GUIDELINES.md.
 *
 * Output shape matches build-spec-generator.ts lines 22-34
 * (PRD_05 Trap #6 — identical structure between sandbox and production docs).
 */
export function renderCanonMessagesSection(messages: CanonMessage[]): string {
  return messages
    .map((m) => {
      return [
        `### ${m.category}: ${m.trigger}`,
        "",
        m.text,
        "",
        `Variables: ${m.variables.join(", ")}`,
        `When to send: ${m.trigger}`,
      ].join("\n");
    })
    .join("\n\n");
}
