/**
 * Message-library type system (Wave 2 foundation).
 *
 * A typed corpus of SMS message templates organized by category. Categories are
 * one of three shapes — `discrete` (a flat set of message groups), `workflow`
 * (an ordered sequence of stages), or `hybrid` (both). `classification` is the
 * discriminant of the `Category` union.
 *
 * Scaffolding only: per-category data files ship with empty `subs`/`stages`
 * arrays; research and message bodies land in subsequent authoring passes.
 */

export type Classification = "workflow" | "discrete" | "hybrid";

export type TCRMapping =
  | "2FA"
  | "ACCOUNT_NOTIFICATION"
  | "DELIVERY_NOTIFICATION"
  | "CUSTOMER_CARE"
  | "MARKETING";

/** A single message template. `body` uses {{double-brace}} variable syntax. */
export interface Message {
  id: string;
  body: string;
  variables: string[];
  charCount: number;
}

/** A group of related messages within a discrete category. */
export interface Sub {
  id: string;
  name: string;
  description: string;
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
  tcrMapping: TCRMapping;
  classification: "discrete";
  subs: Sub[];
}

export interface WorkflowCategory {
  id: string;
  name: string;
  tcrMapping: TCRMapping;
  classification: "workflow";
  stages: Stage[];
}

export interface HybridCategory {
  id: string;
  name: string;
  tcrMapping: TCRMapping;
  classification: "hybrid";
  stages: Stage[];
  subs: Sub[];
}

export type Category = DiscreteCategory | WorkflowCategory | HybridCategory;
