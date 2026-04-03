import { randomUUID } from 'node:crypto';
import type { MessageContext, PipelineStep } from '../types.js';

export const send: PipelineStep = async (ctx: MessageContext) => {
  const messageId = `msg_${randomUUID()}`;
  const timestamp = new Date().toISOString();

  // Stub: log the composed message. Real Sinch integration comes later.
  console.log(`[send] ${messageId} → ${ctx.toPhone}: ${ctx.composedText}`);

  return {
    ...ctx,
    messageId,
    timestamp,
    status: 'sent' as const,
  };
};
