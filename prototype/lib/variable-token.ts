/**
 * Shared styling for rendered variable values. Applied in both the Tiptap
 * editor's NodeView and every read-only preview site so edit and preview
 * match per D-350 (color only, no weight override).
 *
 * `cursor-pointer` applies in both surfaces: in the editor it matches the
 * click-to-select behavior; in read-only preview it signals that the glyph
 * is a single unit (the same affordance cue used for links, mentions, etc.).
 */
export const VARIABLE_TOKEN_CLASSES = "cursor-pointer text-text-brand-secondary";
