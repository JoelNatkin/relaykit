import type { MessageContext, PipelineStep } from './types.js';

export async function runPipeline(
  steps: PipelineStep[],
  initialCtx: MessageContext,
): Promise<MessageContext | Response> {
  let ctx: MessageContext = initialCtx;
  for (const step of steps) {
    const result = await step(ctx);
    if (result instanceof Response) return result;
    ctx = result;
  }
  return ctx;
}
