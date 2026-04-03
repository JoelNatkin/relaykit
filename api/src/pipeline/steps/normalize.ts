import type { MessageContext, PipelineStep } from '../types.js';
import { normalizePhone } from '../../utils/phone.js';

export const normalize: PipelineStep = async (ctx: MessageContext) => {
  try {
    return { ...ctx, toPhone: normalizePhone(ctx.toPhone) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid phone number';
    return Response.json(
      { error: { code: 'invalid_data', message } },
      { status: 400 },
    );
  }
};
