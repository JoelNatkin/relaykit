/**
 * Variable-token styling. Per D-405's monochrome pivot these use the
 * neutral Gray Warm scale. Intentionally diverged from
 * `prototype/lib/variable-token.ts`, which is still on the pre-pivot
 * brand color.
 *
 * Two treatments:
 * - VARIABLE_TOKEN_CLASSES — the quiet edit-state chip (editor body,
 *   "+ Variable" picker rows). Color-only.
 * - VARIABLE_TOKEN_READ_CLASSES — the read-state message highlight: a
 *   strong value on a lifted backdrop so the token reads clearly as a
 *   substitutable slot at a glance.
 */

export const VARIABLE_TOKEN_CLASSES = "cursor-pointer text-text-variable";

export const VARIABLE_TOKEN_READ_CLASSES =
  "cursor-pointer rounded bg-bg-variable px-1 py-0.5 text-text-variable-strong";
