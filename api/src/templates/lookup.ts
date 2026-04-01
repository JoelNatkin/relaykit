import { registry } from './registry.js';
import type { MessageTemplate } from './registry.js';

export function lookupTemplate(namespace: string, event: string): MessageTemplate | null {
  const ns = registry[namespace];
  if (!ns) return null;
  return ns[event] ?? null;
}

export function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (!(key in data)) {
      throw new Error(`Missing required variable: ${key}`);
    }
    return data[key];
  });
}
