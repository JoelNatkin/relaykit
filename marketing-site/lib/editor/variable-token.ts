/**
 * Color-only variable-token styling. Per D-405's monochrome pivot, tokens
 * are a neutral gray one step quieter than message body text (which is
 * `text-secondary`) — they read as substitutable content, not a highlight.
 * Intentionally diverged from `prototype/lib/variable-token.ts`, which is
 * still on the pre-pivot brand color.
 */

export const VARIABLE_TOKEN_CLASSES = "cursor-pointer text-text-tertiary";
