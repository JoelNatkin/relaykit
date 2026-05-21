/**
 * Message-library type system — flat-message model (D-408).
 *
 * Every `Category` carries a flat `messages: Message[]` field directly. The
 * configurator renders messages from this list uniformly; message-to-message
 * ordering and lifecycle context survive as optional documentation-only fields
 * on `Message` (`description`, `groupNote`) that nothing renders today and
 * that the future workspace UX consumes when it surfaces sequence to
 * developers.
 *
 * Per-category `Variable[]` catalogs (the tokens its messages use, drawn from
 * the cross-corpus `shared-variables` set plus category-specific additions)
 * and a `compliance` block (the authoring rules that govern it) are unchanged
 * from the pre-D-408 shape.
 *
 * Replaces the three-classification model (discrete / workflow / hybrid with
 * `Sub` and `Stage` wrappers) — see D-400 and D-408.
 */

export type TCRMapping =
  | "2FA"
  | "ACCOUNT_NOTIFICATION"
  | "DELIVERY_NOTIFICATION"
  | "CUSTOMER_CARE"
  | "MARKETING";

/** Tone register of a message variant. */
export type VariantTone = "Standard" | "Friendly" | "Brief";

/** Where a variable's value originates. */
export type VariableSource = "workspace settings" | "SDK call payload";

/**
 * A template variable. Catalogued per-category (and shared cross-corpus via
 * `shared-variables.ts`); referenced by name from `Message.variables`.
 */
export interface Variable {
  /** Token name as it appears in `{{double-brace}}` bodies. */
  name: string;
  description: string;
  /** Worst-case-realistic value length in characters — drives D-402 segment math. */
  budgetChars: number;
  source: VariableSource;
  example: string;
  /**
   * True for SDK-passed, type-constrained values (codes, timestamps). These are
   * exempt from the D-402 GSM-7 character rule — the type contract enforces shape.
   */
  typeConstrained?: boolean;
}

/** One tone-variant of a message template. `body` uses {{double-brace}} variable syntax. */
export interface MessageVariant {
  tone: VariantTone;
  body: string;
  /** Worst-case-substituted GSM-7 length — body with each token at its `budgetChars` (D-402). */
  charCount: number;
}

/** A single message template, expressed as one or more tone variants. */
export interface Message {
  id: string;
  name: string;
  /** Variable names (referencing the category catalog) used across this message's variants. */
  variables: string[];
  variants: MessageVariant[];
  /**
   * Short hover-tooltip rendered on the message-card title and on the
   * categories panel's `?`-icon. Operational register ("Sent when…").
   */
  tooltip?: string;
  /**
   * Editorial framing — what this message is for. Carries former
   * `Sub.description` and `Stage.description` text verbatim from the
   * pre-D-408 corpus. Documentation-only this wave: nothing in the
   * configurator renders it today. Reserved for the future workspace
   * UX that surfaces editorial context to developers.
   */
  description?: string;
  /**
   * Sequence annotation marking that a message belongs to an ordered group
   * (e.g. `"Order lifecycle — step 3 of 7: sent when carrier marks
   * delivered."`). Carries former `Stage.triggerCue` text verbatim,
   * prefixed with the lifecycle position. Unset for messages that were
   * never sequenced (e.g. former `Sub`-shaped messages). Documentation-only
   * this wave: nothing in the configurator renders it today. Reserved for
   * the future workspace UX that surfaces sequence to developers.
   */
  groupNote?: string;
}

/** Category-level authoring rules surfaced to authors and the future editor compliance gate. */
export interface CategoryCompliance {
  rules: string[];
}

/**
 * A message-library category — flat list of messages (D-408). The configurator
 * iterates `messages` directly; `variables` and `compliance` apply to every
 * message in the category.
 */
export interface Category {
  id: string;
  name: string;
  /** One-sentence collapsed-state summary shown under the category name in the configurator. */
  description: string;
  tcrMapping: TCRMapping;
  variables: Variable[];
  compliance: CategoryCompliance;
  messages: Message[];
}
