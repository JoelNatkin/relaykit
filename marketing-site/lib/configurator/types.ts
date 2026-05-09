export type VerticalId =
  | "verification"
  | "appointments"
  | "orders"
  | "support"
  | "marketing"
  | "team"
  | "community"
  | "waitlist";

export type PackId =
  | "saas"
  | "personal"
  | "real-estate"
  | "fitness"
  | "ecommerce"
  | "custom"
  | "none";

export type ToneId = "standard" | "friendly" | "brief";

export type PillId = ToneId | "custom";

export interface StubMessage {
  name: string;
  tooltip: string;
  variables: string[];
  requiresStop: boolean;
  variants: Record<ToneId, string>;
}

export interface CustomMessage {
  id: string;
  name: string;
  body: string;
  requiresStop: boolean;
}

export interface Vertical {
  id: VerticalId;
  title: string;
  description: string;
  messages: StubMessage[];
  alwaysOn?: boolean;
  note?: string;
}
