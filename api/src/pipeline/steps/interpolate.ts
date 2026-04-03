import type { MessageContext, PipelineStep } from '../types.js';
import { lookupTemplate, interpolate as interpolateTemplate } from '../../templates/lookup.js';

export const interpolateStep: PipelineStep = async (ctx: MessageContext) => {
  if (ctx.namespace === 'custom' && ctx.event === 'send') {
    return Response.json(
      { error: { code: 'template_not_found', message: 'Custom messages not yet supported' } },
      { status: 422 },
    );
  }

  const template = lookupTemplate(ctx.namespace, ctx.event);
  if (!template) {
    return Response.json(
      { error: { code: 'template_not_found', message: `No template found for ${ctx.namespace}.${ctx.event}` } },
      { status: 422 },
    );
  }

  try {
    const composedText = interpolateTemplate(template.template, ctx.data);
    return { ...ctx, template, composedText };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown interpolation error';
    return Response.json(
      { error: { code: 'invalid_data', message } },
      { status: 422 },
    );
  }
};
