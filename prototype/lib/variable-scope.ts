import type { Message } from "@/data/messages";
import { MESSAGES } from "@/data/messages";
import type { CustomMessage } from "@/context/session-context";

/**
 * D-353: each SDK method's data shape determines what's insertable for
 * that message type. Built-in messages declare `variables` directly;
 * custom messages default to the intersection of variables across all
 * built-in methods in the parent category (D-351 + D-353).
 */
export function getVariableScope(
  message: Message | CustomMessage,
  categoryId: string
): string[] {
  if ("variables" in message && Array.isArray(message.variables)) {
    return message.variables;
  }
  const builtins = MESSAGES[categoryId] ?? [];
  if (builtins.length === 0) return [];
  const [first, ...rest] = builtins;
  return rest.reduce(
    (acc, m) => acc.filter((k) => m.variables.includes(k)),
    first.variables
  );
}
