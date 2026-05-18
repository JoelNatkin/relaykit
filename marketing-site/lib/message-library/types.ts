/**
 * Message-library type system (Wave 2 foundation).
 *
 * A typed corpus of SMS message templates organized by category. Categories are
 * one of three shapes — `discrete` (a flat set of message groups), `workflow`
 * (an ordered sequence of stages), or `hybrid` (both). `classification` is the
 * discriminant of the `Category` union.
 *
 * Each category carries a `variables` catalog (the tokens its messages use,
 * drawn from the cross-corpus `shared-variables` set plus category-specific
 * additions) and a `compliance` block (the authoring rules that govern it).
 *
 * Scaffolding: per-category data files ship with empty `subs`/`stages` until
 * authored; research and message bodies land in per-category authoring passes.
 */

export type Classification = "workflow" | "discrete" | "hybrid";

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
}

/** Category-level authoring rules surfaced to authors and the future editor compliance gate. */
export interface CategoryCompliance {
  rules: string[];
}

/** A group of related messages within a discrete category. */
export interface Sub {
  id: string;
  name: string;
  description: string;
  /** Short hover-tooltip copy surfaced on the configurator sub-checkbox row. */
  tooltip?: string;
  messages: Message[];
}

/** An ordered step within a workflow category. */
export interface Stage {
  id: string;
  name: string;
  description: string;
  triggerCue: string;
  messages: Message[];
}

export interface DiscreteCategory {
  id: string;
  name: string;
  /** One-sentence collapsed-state summary shown under the category name in the configurator. */
  description: string;
  tcrMapping: TCRMapping;
  classification: "discrete";
  variables: Variable[];
  compliance: CategoryCompliance;
  subs: Sub[];
}

export interface WorkflowCategory {
  id: string;
  name: string;
  /** One-sentence collapsed-state summary shown under the category name in the configurator. */
  description: string;
  tcrMapping: TCRMapping;
  classification: "workflow";
  variables: Variable[];
  compliance: CategoryCompliance;
  stages: Stage[];
}

export interface HybridCategory {
  id: string;
  name: string;
  /** One-sentence collapsed-state summary shown under the category name in the configurator. */
  description: string;
  tcrMapping: TCRMapping;
  classification: "hybrid";
  variables: Variable[];
  compliance: CategoryCompliance;
  stages: Stage[];
  subs: Sub[];
}

export type Category = DiscreteCategory | WorkflowCategory | HybridCategory;
