import { createServiceClient } from '@/lib/supabase';
import type { AsyncScanResult } from './types';

// ---------------------------------------------------------------------------
// Alert title map — one entry per async rule
// ---------------------------------------------------------------------------
const ALERT_TITLES: Record<string, string> = {
  'BM-01': 'Missing business name in message',
  'BM-02': 'First message missing opt-out instructions',
  'BM-06': 'High message frequency to a recipient',
};

// ---------------------------------------------------------------------------
// persistScanAndAlert
// ---------------------------------------------------------------------------
// Inserts a message_scans row for every scanned message, then creates
// deduplicated compliance_alerts for any failed checks. Dedup window is 24h
// per (customer_id, rule_id). All errors are logged but never propagated.
// ---------------------------------------------------------------------------
export async function persistScanAndAlert(params: {
  registrationId: string;
  customerId: string;
  messageId: string;
  messageSid: string;
  recipientPhone: string;
  scanResult: AsyncScanResult;
}): Promise<void> {
  const {
    registrationId,
    customerId,
    messageId,
    messageSid,
    recipientPhone,
    scanResult,
  } = params;

  const supabase = createServiceClient();
  const recipientPhoneLast4 = recipientPhone.slice(-4);

  // 1. Insert message_scans row (always — clean or warning)
  const { error: scanError } = await supabase.from('message_scans').insert({
    registration_id: registrationId,
    message_id: messageId,
    message_sid: messageSid,
    recipient_phone_last4: recipientPhoneLast4,
    overall_status: scanResult.overallStatus,
    checks: scanResult.checks,
  });

  if (scanError) {
    console.error('[compliance] Failed to insert message_scan:', scanError.message);
  }

  // 2. For each failed check, insert a deduplicated compliance_alert
  const failedChecks = scanResult.checks.filter((c) => !c.passed);

  for (const check of failedChecks) {
    try {
      await insertDedupedAlert(supabase, {
        registrationId,
        customerId,
        ruleId: check.ruleId,
        details: check.details,
      });
    } catch (err) {
      // Should not happen — insertDedupedAlert handles its own errors —
      // but guard against unexpected throws.
      console.error('[compliance] Unexpected error creating alert:', err);
    }
  }
}

// ---------------------------------------------------------------------------
// insertDedupedAlert — one alert per rule per customer per 24h window
// ---------------------------------------------------------------------------
async function insertDedupedAlert(
  supabase: ReturnType<typeof createServiceClient>,
  params: {
    registrationId: string;
    customerId: string;
    ruleId: string;
    details: string;
  },
): Promise<void> {
  const { registrationId, customerId, ruleId, details } = params;

  // Check for existing alert within 24h window
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: existing, error: lookupError } = await supabase
    .from('compliance_alerts')
    .select('id')
    .eq('customer_id', customerId)
    .eq('rule_id', ruleId)
    .gte('created_at', twentyFourHoursAgo)
    .limit(1);

  if (lookupError) {
    console.error('[compliance] Failed to check existing alerts:', lookupError.message);
    return;
  }

  if (existing && existing.length > 0) {
    // Duplicate within 24h window — skip
    return;
  }

  const title = ALERT_TITLES[ruleId] ?? `Compliance warning: ${ruleId}`;

  const { error: insertError } = await supabase.from('compliance_alerts').insert({
    registration_id: registrationId,
    customer_id: customerId,
    alert_type: 'warning',
    rule_id: ruleId,
    channel: 'dashboard',
    title,
    body: details,
  });

  if (insertError) {
    console.error('[compliance] Failed to insert compliance_alert:', insertError.message);
  }
}
