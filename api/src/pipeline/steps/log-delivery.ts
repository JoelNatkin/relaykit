import type { MessageContext, PipelineStep } from '../types.js';

export const logDelivery: PipelineStep = async (ctx: MessageContext) => {
  // Stub: will write to messages table when Supabase is wired.
  return ctx;
};
