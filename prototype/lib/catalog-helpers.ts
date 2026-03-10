import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";

/* ── Example values per variable, per category ── */

interface ExampleValue {
  key: string;
  label: string;
  preview: (state: SessionState) => string;
}

const CATEGORY_EXAMPLE_VALUES: Record<string, ExampleValue[]> = {
  verification: [
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "code", label: "Code", preview: () => "283947" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "customer_name", label: "Customer name", preview: () => "Alex" },
  ],
  appointments: [
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "date", label: "Date", preview: () => "Mar 15, 2026" },
    { key: "time", label: "Time", preview: () => "2:30 PM" },
    { key: "service_type", label: "Service type", preview: (s) => s.serviceType || "appointment" },
    { key: "customer_name", label: "Customer name", preview: () => "Alex" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
  ],
  orders: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "order_id", label: "Order ID", preview: () => "10482" },
    { key: "tracking_url", label: "Tracking URL", preview: () => "track.example.com/10482" },
    { key: "date", label: "Date", preview: () => "Mar 18, 2026" },
    { key: "address", label: "Address", preview: () => "123 Main St" },
    { key: "product_type", label: "Product type", preview: (s) => s.productType || "items" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
  ],
  support: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "ticket_id", label: "Ticket ID", preview: () => "4821" },
    { key: "eta", label: "ETA", preview: () => "2 hours" },
    { key: "contact_phone", label: "Phone", preview: () => "(555) 123-4567" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "date", label: "Date", preview: () => "Mar 15, 2026" },
    { key: "time", label: "Time", preview: () => "2:00 AM" },
  ],
  marketing: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "date", label: "Date", preview: () => "Mar 20, 2026" },
  ],
  internal: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "date", label: "Date", preview: () => "Mar 15, 2026" },
    { key: "time", label: "Time", preview: () => "9:00 AM" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "task_description", label: "Task", preview: () => "Review Q1 reports" },
  ],
  community: [
    { key: "community_name", label: "Community name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Community name", preview: (s) => s.appName || "YourApp" },
    { key: "time", label: "Time", preview: () => "6:00 PM" },
    { key: "location", label: "Location", preview: () => "Downtown Community Center" },
    { key: "date", label: "Date", preview: () => "Mar 22, 2026" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "announcement_text", label: "Announcement", preview: () => "Board elections next month" },
    { key: "sponsor_name", label: "Sponsor", preview: () => "Local Coffee Co" },
  ],
  waitlist: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "wait_time", label: "Wait time", preview: () => "15 minutes" },
    { key: "date", label: "Date", preview: () => "Mar 15, 2026" },
    { key: "time", label: "Time", preview: () => "7:30 PM" },
    { key: "party_size", label: "Party size", preview: () => "4" },
    { key: "venue_type", label: "Venue type", preview: (s) => s.venueType || "restaurant" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
  ],
  exploring: [
    { key: "business_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "YourApp" },
    { key: "time", label: "Time", preview: () => "2:30 PM" },
    { key: "code", label: "Code", preview: () => "283947" },
    { key: "tracking_url", label: "Tracking URL", preview: () => "track.example.com/10482" },
    { key: "alert_text", label: "Alert", preview: () => "scheduled maintenance tonight at 11 PM" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
  ],
};

export function getExampleValues(categoryId: string): Map<string, ExampleValue> {
  const values = CATEGORY_EXAMPLE_VALUES[categoryId] || CATEGORY_EXAMPLE_VALUES.verification;
  return new Map(values.map((v) => [v.key, v]));
}

/* ── Template interpolation ── */

export interface InterpolatedSegment {
  text: string;
  isVariable: boolean;
  variableKey?: string;
}

/** Parse a template into segments, resolving variables to example values */
export function interpolateTemplate(
  template: string,
  categoryId: string,
  state: SessionState
): InterpolatedSegment[] {
  const valueMap = getExampleValues(categoryId);
  const parts = template.split(/(\{[^}]+\})/g);
  const segments: InterpolatedSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^\{(\w+)\}$/);
    if (match) {
      const key = match[1];
      const v = valueMap.get(key);
      segments.push({
        text: v ? v.preview(state) : part,
        isVariable: !!v,
        variableKey: key,
      });
    } else {
      segments.push({ text: part, isVariable: false });
    }
  }

  return segments;
}

/** Extract variable keys from a template string */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

/** Get the nature badge for a message: Transactional or Marketing */
export function getMessageNature(message: Message): "Transactional" | "Marketing" {
  if (message.expansionType === "marketing") return "Marketing";
  if (message.expansionType === "mixed") return "Marketing";
  return "Transactional";
}

/* ── Trigger formatting ── */

export function formatTrigger(trigger: string): string {
  const first = trigger.charAt(0);
  if (first >= "A" && first <= "Z") {
    return "Triggers " + first.toLowerCase() + trigger.slice(1);
  }
  return "Triggers " + trigger;
}

/* ── Copy block formatting ── */

export function formatCopyBlock(
  message: Message,
  categoryId: string,
  state: SessionState
): string {
  const segments = interpolateTemplate(message.template, categoryId, state);
  const preview = segments.map((s) => s.text).join("");
  const variables = extractVariables(message.template);
  const requiredKeys = new Set(["app_name", "business_name", "community_name"]);
  const required = variables.filter((v) => requiredKeys.has(v));
  const typical = variables.filter((v) => !requiredKeys.has(v));

  return [
    message.name,
    `Triggers: ${formatTrigger(message.trigger).replace("Triggers ", "")}`,
    `Example: ${preview}`,
    `Template: ${message.template}`,
    required.length > 0 ? `Required variables: ${required.join(", ")}` : null,
    typical.length > 0 ? `Typical variables: ${typical.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatMultipleCopyBlocks(
  messages: Message[],
  categoryId: string,
  state: SessionState
): string {
  return messages
    .map((m) => formatCopyBlock(m, categoryId, state))
    .join("\n\n---\n\n");
}

/* ── Prompt nudge generation ── */

const PROMPT_NUDGES: Record<string, (message: Message) => string> = {
  appointments: (m) => {
    if (m.id.includes("confirmation") || m.id.includes("booking"))
      return "Ask your AI: Write me a booking confirmation that includes the service type, date, and time.";
    if (m.id.includes("reminder"))
      return "Ask your AI: Write an appointment reminder that lets users confirm or reschedule.";
    if (m.id.includes("cancel"))
      return "Ask your AI: Write a cancellation notice with a rebooking link.";
    return "Ask your AI: Write this message for my app using the template above.";
  },
  verification: (m) => {
    if (m.id.includes("login") || m.id.includes("signup") || m.id.includes("mfa"))
      return "Ask your AI: Send a verification code that expires in 10 minutes.";
    if (m.id.includes("device"))
      return "Ask your AI: Alert the user about a new device login with a password reset link.";
    return "Ask your AI: Write this message for my app using the template above.";
  },
};

export function getPromptNudge(message: Message, categoryId: string): string {
  const nudgeFn = PROMPT_NUDGES[categoryId];
  if (nudgeFn) return nudgeFn(message);
  // Generic fallback based on message variables
  const vars = extractVariables(message.template);
  const varNames = vars
    .filter((v) => v !== "app_name" && v !== "business_name" && v !== "community_name")
    .map((v) => v.replace(/_/g, " "));
  if (varNames.length > 0) {
    return `Ask your AI: Write me a ${message.name.toLowerCase()} that includes the ${varNames.join(", ")}.`;
  }
  return `Ask your AI: Write a ${message.name.toLowerCase()} for my app using the template above.`;
}
