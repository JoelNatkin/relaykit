import { createServiceClient } from '@/lib/supabase';
import type { AsyncCheckResult, AsyncScanResult } from './types';

// ---------------------------------------------------------------------------
// BM-06 weekly-limit thresholds by campaign type
// ---------------------------------------------------------------------------

export function getWeeklyLimit(effectiveCampaignType: string | null): number {
  switch (effectiveCampaignType) {
    case 'transactional':
      return 20;
    case 'mixed':
      return 40;
    default:
      return 20;
  }
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

function checkBusinessName(
  messageBody: string,
  businessName: string,
): AsyncCheckResult {
  const passed = messageBody.toLowerCase().includes(businessName.toLowerCase());
  return {
    ruleId: 'BM-01',
    passed,
    severity: 'warning',
    details: passed
      ? 'Business name found in message body.'
      : 'Message does not include your business name — carriers recommend sender identification in every message.',
  };
}

async function checkFirstMessageOptOut(
  messageBody: string,
  to: string,
  registrationId: string,
): Promise<AsyncCheckResult | null> {
  const supabase = createServiceClient();

  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', registrationId)
    .eq('to_number', to)
    .eq('direction', 'outbound')
    .eq('environment', 'live');

  if (error) {
    console.error('[BM-02] Failed to query prior messages:', error.message);
    // If the query fails we cannot determine first-message status — skip the check.
    return null;
  }

  // count <= 1 means this is the first outbound live message (the current
  // message has already been logged before the async scanner runs).
  const isFirstMessage = (count ?? 0) <= 1;

  if (!isFirstMessage) {
    return null; // Not the first message — skip this check entirely.
  }

  const hasOptOut = /\b(?:stop|opt[\s-]?out|unsubscribe|cancel)\b/i.test(messageBody);

  return {
    ruleId: 'BM-02',
    passed: hasOptOut,
    severity: 'warning',
    details: hasOptOut
      ? 'Opt-out language found in first message to this recipient.'
      : 'First message to a new recipient — include opt-out instructions (e.g. "Reply STOP to opt out").',
  };
}

async function checkMessageFrequency(
  to: string,
  registrationId: string,
  effectiveCampaignType: string | null,
): Promise<AsyncCheckResult> {
  const supabase = createServiceClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', registrationId)
    .eq('to_number', to)
    .eq('direction', 'outbound')
    .eq('environment', 'live')
    .gte('created_at', sevenDaysAgo);

  if (error) {
    console.error('[BM-06] Failed to query message frequency:', error.message);
    // On error, assume within limits rather than raising a false positive.
    return {
      ruleId: 'BM-06',
      passed: true,
      severity: 'warning',
      details: 'Unable to verify message frequency — query failed.',
    };
  }

  const messageCount = count ?? 0;
  const limit = getWeeklyLimit(effectiveCampaignType);
  const passed = messageCount <= limit;

  return {
    ruleId: 'BM-06',
    passed,
    severity: 'warning',
    details: passed
      ? `${messageCount} message(s) to this recipient in 7 days (limit: ${limit}).`
      : `${messageCount} messages to this recipient in 7 days — consider reducing frequency to avoid carrier filtering.`,
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function runAsyncChecks(params: {
  messageBody: string;
  to: string;
  registrationId: string;
  businessName: string;
  effectiveCampaignType: string | null;
}): Promise<AsyncScanResult> {
  const { messageBody, to, registrationId, businessName, effectiveCampaignType } = params;

  const [bm01, bm02, bm06] = await Promise.all([
    checkBusinessName(messageBody, businessName),
    checkFirstMessageOptOut(messageBody, to, registrationId),
    checkMessageFrequency(to, registrationId, effectiveCampaignType),
  ]);

  // Filter out null results (BM-02 returns null when not applicable).
  const checks: AsyncCheckResult[] = [bm01, bm02, bm06].filter(
    (result): result is AsyncCheckResult => result !== null,
  );

  const overallStatus = checks.every((c) => c.passed) ? 'clean' : 'warning';

  return { overallStatus, checks };
}
