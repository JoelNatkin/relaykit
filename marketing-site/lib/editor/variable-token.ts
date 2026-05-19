/**
 * Color-only variable-token styling. Per D-405's monochrome pivot, tokens
 * use the `text-variable` token — one Gray Warm step quieter than message
 * body text, so they read as substitutable content, not a highlight.
 * Intentionally diverged from `prototype/lib/variable-token.ts`, which is
 * still on the pre-pivot brand color.
 */

export const VARIABLE_TOKEN_CLASSES = "cursor-pointer text-text-variable";
