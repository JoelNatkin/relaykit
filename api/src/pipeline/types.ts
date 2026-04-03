import type { MessageTemplate } from '../templates/registry.js';

export interface MessageContext {
  // From auth middleware
  userId: string | null;
  environment: 'sandbox' | 'live';
  apiKeyId: string;

  // From validation
  namespace: string;
  event: string;
  toPhone: string; // normalized E.164
  data: Record<string, string>;

  // From template lookup
  template?: MessageTemplate;
  composedText?: string;

  // From send step
  messageId?: string;
  timestamp?: string;
  carrierMessageId?: string;
  status?: 'queued' | 'sent' | 'delivered' | 'failed';
  failureReason?: string;
}

export type PipelineStep = (ctx: MessageContext) => Promise<MessageContext | Response>;
