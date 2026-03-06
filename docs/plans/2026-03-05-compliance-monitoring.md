# PRD_08 Compliance Monitoring — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add async compliance monitoring (BM-01, BM-02, BM-06), alert infrastructure, dashboard wiring, and checkout consent — layered on top of the existing inline enforcement from PRD_09.

**Architecture:** Async checks run fire-and-forget after message delivery in the `/v1/messages` route. Results land in `message_scans` + `compliance_alerts` tables. The dashboard compliance tab queries these via `/api/compliance/alerts` and renders real data instead of the current hardcoded "All clear" state.

**Tech Stack:** Next.js API routes, Supabase Postgres, existing proxy types, existing SHAFT-C scanner (`src/lib/proxy/content-scanner.ts`). No new dependencies. No Redis. No Claude API (BM-09 drift is Phase 2).

**Scope exclusions (Phase 2):** BM-05 quiet hours, BM-08 URL blocklist, BM-09 semantic drift/Claude API, message preview endpoint, per-customer allowlists, PHI detection, drift escalation automation, admin alerts.

---

## Existing Infrastructure (do NOT rebuild)

| Component | File | What it does |
|-----------|------|-------------|
| Inline compliance pipeline | `src/lib/proxy/compliance-pipeline.ts` | BM-03, BM-04, BM-07, BM-10 — blocks before delivery |
| SHAFT-C scanner | `src/lib/proxy/content-scanner.ts` | `scanForShaftC()` — import and reuse |
| Marketing consent | `src/lib/proxy/marketing-consent.ts` | `classifyMessageType()`, `checkMarketingConsent()` |
| Message logger | `src/lib/proxy/message-logger.ts` | `logMessage()` — fire-and-forget to `messages` table |
| Opt-out tracker | `src/lib/proxy/opt-out.ts` | `isOptedOut()`, `addOptOut()`, `removeOptOut()` |
| `sms_opt_outs` table | `supabase/migrations/20260306000000_messaging_proxy.sql` | Already exists — do NOT recreate |
| `recipient_consents` table | Same migration | Already exists — do NOT recreate |
| `messages` table | Same migration | Already exists — has `compliance_result JSONB` |
| ComplianceStatusCard shell | `src/components/dashboard/compliance-status-card.tsx` | Has `hasAlerts` prop, always false |
| Compliance page | `src/app/dashboard/compliance/page.tsx` | Renders static cards, no data fetching |
| Monitoring consent checkbox | `src/app/start/review/page.tsx` | Already exists at line 322–329 |
| Email templates (0–5) | `src/lib/emails/templates.ts` | Deterministic functions, no provider wired |

---

## Task 1: Database migration — `message_scans`, `compliance_alerts`

**Files:**
- Create: `supabase/migrations/20260306100000_compliance_monitoring.sql`

**What to build:**

Two new tables per PRD_08 Section 8. Do NOT recreate `sms_opt_outs` or `recipient_consents` (already exist). Do NOT create `message_log` (the existing `messages` table already tracks per-recipient messages and can serve the BM-06 frequency query).

```sql
-- PRD_08 Phase 1: Compliance Monitoring
-- Depends on: 20260306000000_messaging_proxy.sql (messages, sms_opt_outs, recipient_consents)

-- 1. message_scans — async compliance check results
CREATE TABLE message_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  message_sid TEXT NOT NULL,
  recipient_phone_last4 TEXT NOT NULL,
  overall_status TEXT NOT NULL CHECK (overall_status IN ('clean', 'warning')),
  checks JSONB NOT NULL,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_scans_reg_status
  ON message_scans(registration_id, overall_status, scanned_at DESC);

-- 2. compliance_alerts — surfaced to dashboard and email
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warning', 'critical', 'info')),
  rule_id TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('dashboard', 'email')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_alerts_customer
  ON compliance_alerts(customer_id, created_at DESC);
CREATE INDEX idx_compliance_alerts_unack
  ON compliance_alerts(customer_id)
  WHERE acknowledged = FALSE;

-- RLS — service-role only
ALTER TABLE message_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;
```

**Notes:**
- `message_scans` references `messages(id)` via `message_id` for join queries. Also stores `message_sid` for Twilio correlation.
- `recipient_phone_last4` — we store only last 4 digits for PII avoidance (PRD_08 Section 9).
- No `drift_analysis` column — BM-09 is Phase 2.
- `compliance_alerts` has `customer_id` for dashboard queries (customer-scoped) and `registration_id` for audit trail.
- `rule_id` stores `BM-01`, `BM-02`, `BM-06` for filtering.

**Verify:** `npm run build` still passes (migration doesn't affect TS build).

**Commit:** `feat: add message_scans and compliance_alerts tables (PRD_08)`

---

## Task 2: Async scanner — BM-01, BM-02, BM-06

**Files:**
- Create: `src/lib/compliance/scanner.ts`
- Create: `src/lib/compliance/types.ts`

**What to build:**

The async check orchestrator that runs after message delivery. Three checks:

### `src/lib/compliance/types.ts`

```typescript
export interface AsyncCheckResult {
  ruleId: string;
  passed: boolean;
  severity: 'warning';
  details: string;
}

export interface AsyncScanResult {
  overallStatus: 'clean' | 'warning';
  checks: AsyncCheckResult[];
}
```

### `src/lib/compliance/scanner.ts`

```typescript
import { createServiceClient } from '@/lib/supabase';
import type { AsyncCheckResult, AsyncScanResult } from './types';

/**
 * Run async compliance checks after message delivery.
 * These generate warnings but do not block messages.
 *
 * BM-01: Business name present in message body
 * BM-02: First message to new recipient includes opt-out language
 * BM-06: Message frequency exceeds reasonable rate for this recipient
 */
export async function runAsyncChecks(params: {
  messageBody: string;
  to: string;
  registrationId: string;
  businessName: string;
}): Promise<AsyncScanResult> {
  const checks: AsyncCheckResult[] = [];

  // BM-01: Business name present
  checks.push(checkBusinessName(params.messageBody, params.businessName));

  // BM-02: First message to new recipient includes opt-out language
  const firstMessageCheck = await checkFirstMessageOptOut(
    params.messageBody,
    params.to,
    params.registrationId,
  );
  if (firstMessageCheck) {
    checks.push(firstMessageCheck);
  }

  // BM-06: Frequency check (7-day window)
  checks.push(
    await checkFrequency(params.to, params.registrationId),
  );

  const hasWarnings = checks.some((c) => !c.passed);

  return {
    overallStatus: hasWarnings ? 'warning' : 'clean',
    checks,
  };
}

// BM-01: Business name should appear in the message body
function checkBusinessName(body: string, businessName: string): AsyncCheckResult {
  const passed = body.toLowerCase().includes(businessName.toLowerCase());
  return {
    ruleId: 'BM-01',
    passed,
    severity: 'warning',
    details: passed
      ? 'Business name is present in the message.'
      : 'Message does not include your business name — carriers recommend sender identification in every message.',
  };
}

// BM-02: First message to a new recipient should include opt-out language
async function checkFirstMessageOptOut(
  body: string,
  to: string,
  registrationId: string,
): Promise<AsyncCheckResult | null> {
  const supabase = createServiceClient();

  // Count prior outbound messages to this recipient under this registration
  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('to_number', to)
    .eq('environment', 'live')
    .neq('id', '') // just need count
    .limit(2); // we only care if count > 1

  // If there are prior messages (count > 1 because the current one is already logged),
  // this is not the first message — skip BM-02
  if (count !== null && count > 1) {
    return null;
  }

  const hasOptOut = /\b(?:stop|opt[\s-]?out|unsubscribe|cancel)\b/i.test(body);
  return {
    ruleId: 'BM-02',
    passed: hasOptOut,
    severity: 'warning',
    details: hasOptOut
      ? 'Opt-out language is present in the first message.'
      : 'First message to a new recipient — include opt-out instructions (e.g. "Reply STOP to opt out").',
  };
}

// BM-06: Message frequency in 7-day rolling window
// Threshold: 20 messages/week for transactional, generous enough to avoid false alarms
const WEEKLY_FREQUENCY_LIMIT = 20;

async function checkFrequency(
  to: string,
  registrationId: string,
): Promise<AsyncCheckResult> {
  const supabase = createServiceClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('to_number', to)
    .eq('environment', 'live')
    .gte('created_at', sevenDaysAgo.toISOString());

  const messageCount = count ?? 0;
  const passed = messageCount <= WEEKLY_FREQUENCY_LIMIT;

  return {
    ruleId: 'BM-06',
    passed,
    severity: 'warning',
    details: passed
      ? `${messageCount} messages to this recipient in 7 days (within limits).`
      : `${messageCount} messages to this recipient in 7 days — consider reducing frequency to avoid carrier filtering.`,
  };
}
```

**Design notes:**
- BM-02 queries the existing `messages` table (not a separate `message_log` table) — we already log every message there. The query checks if the current message is the first outbound to this `to_number` under the same registration context.
- BM-06 also uses the `messages` table with a 7-day window. The limit of 20/week is generous for transactional use cases. Phase 2 can make this configurable per registration.
- The `messages` table query for BM-02 needs to filter by the registration's context. Since `messages` doesn't have `registration_id`, we filter by `to_number` + `environment='live'` for the customer. This is sufficient for v1 single-project (one registration per customer).

**Verify:** `npm run build`

**Commit:** `feat: async compliance scanner — BM-01, BM-02, BM-06 (PRD_08)`

---

## Task 3: Alert generator — persist scan results and create alerts

**Files:**
- Create: `src/lib/compliance/alert-generator.ts`

**What to build:**

A function that takes async scan results and persists them:
1. Insert `message_scans` row for every scanned message
2. For failed checks, insert `compliance_alerts` row (deduped — one alert per rule per 24h window)

```typescript
import { createServiceClient } from '@/lib/supabase';
import type { AsyncScanResult } from './types';

/**
 * Persist scan results and generate alerts for failed checks.
 * Fire-and-forget — errors are logged but do not propagate.
 */
export async function persistScanAndAlert(params: {
  registrationId: string;
  customerId: string;
  messageId: string;
  messageSid: string;
  recipientPhone: string;
  scanResult: AsyncScanResult;
}): Promise<void> {
  const supabase = createServiceClient();
  const last4 = params.recipientPhone.slice(-4);

  // 1. Insert message_scans row
  const { error: scanError } = await supabase.from('message_scans').insert({
    registration_id: params.registrationId,
    message_id: params.messageId,
    message_sid: params.messageSid,
    recipient_phone_last4: last4,
    overall_status: params.scanResult.overallStatus,
    checks: params.scanResult.checks,
  });

  if (scanError) {
    console.error('[compliance] Failed to insert message_scan:', scanError.message);
  }

  // 2. Generate alerts for failed checks (deduped by rule per 24h)
  const failedChecks = params.scanResult.checks.filter((c) => !c.passed);
  if (failedChecks.length === 0) return;

  for (const check of failedChecks) {
    // Dedupe: don't create another alert for the same rule within 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { count } = await supabase
      .from('compliance_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', params.customerId)
      .eq('rule_id', check.ruleId)
      .gte('created_at', twentyFourHoursAgo.toISOString());

    if (count !== null && count > 0) continue;

    const alertTitle = getAlertTitle(check.ruleId);

    const { error: alertError } = await supabase.from('compliance_alerts').insert({
      registration_id: params.registrationId,
      customer_id: params.customerId,
      alert_type: 'warning',
      rule_id: check.ruleId,
      channel: 'dashboard',
      title: alertTitle,
      body: check.details,
    });

    if (alertError) {
      console.error('[compliance] Failed to insert alert:', alertError.message);
    }
  }
}

function getAlertTitle(ruleId: string): string {
  switch (ruleId) {
    case 'BM-01':
      return 'Missing business name in message';
    case 'BM-02':
      return 'First message missing opt-out instructions';
    case 'BM-06':
      return 'High message frequency to a recipient';
    default:
      return 'Compliance warning';
  }
}
```

**Verify:** `npm run build`

**Commit:** `feat: compliance alert generator with 24h deduplication (PRD_08)`

---

## Task 4: Wire async checks into `/v1/messages` route

**Files:**
- Modify: `src/app/api/v1/messages/route.ts`

**What to build:**

After the existing `logMessage()` + `incrementUsage()` fire-and-forget block (line 124–141), add the async compliance scan call. This must only run for live messages (not sandbox) and only when `registrationId` and `customerId` are present.

**Add these imports at the top:**
```typescript
import { runAsyncChecks } from '@/lib/compliance/scanner';
import { persistScanAndAlert } from '@/lib/compliance/alert-generator';
```

**After line 141 (after `incrementUsage`), add:**
```typescript
  // 8. Async: compliance monitoring (fire-and-forget, PRD_08 BM-01/02/06)
  if (ctx.registrationId && ctx.customerId) {
    runAsyncChecks({
      messageBody: messageRequest.body,
      to: messageRequest.to,
      registrationId: ctx.registrationId,
      businessName: ctx.businessName ?? '',
    }).then((scanResult) => {
      // We need the message ID from the messages table for the scan record.
      // logMessage inserts with external_id, so look it up.
      const supabase = createServiceClient();
      supabase
        .from('messages')
        .select('id')
        .eq('external_id', externalId)
        .single()
        .then(({ data }) => {
          if (data) {
            persistScanAndAlert({
              registrationId: ctx.registrationId!,
              customerId: ctx.customerId!,
              messageId: data.id,
              messageSid: forwardResult.twilioSid,
              recipientPhone: messageRequest.to,
              scanResult,
            });
          }
        });
    });
  }
```

**Important:** This requires `businessName` on `AuthenticatedContext`. Currently that field does not exist. Two options:

**Option A (recommended):** Add `businessName` to `AuthenticatedContext` and populate it in `auth.ts` from the `customers` table join that already happens for live key auth.

**Option B:** Query it separately in the async path. Less efficient but doesn't touch auth.

Go with Option A — add `businessName: string | null` to `AuthenticatedContext` in `types.ts` and populate it in `auth.ts` where the customer record is fetched.

**Files also modified:**
- `src/lib/proxy/types.ts` — add `businessName: string | null` to `AuthenticatedContext`
- `src/lib/proxy/auth.ts` — populate `businessName` from the customer/registration query

**Add import at the top of route.ts:**
```typescript
import { createServiceClient } from '@/lib/supabase';
```

**Verify:** `npm run build`

**Commit:** `feat: wire async compliance checks into /v1/messages (PRD_08)`

---

## Task 5: Compliance alerts API route

**Files:**
- Create: `src/app/api/compliance/alerts/route.ts`

**What to build:**

`GET /api/compliance/alerts` — authenticated via Supabase session (dashboard route, not API key). Returns the current user's unacknowledged alerts, plus recent acknowledged ones.

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get customer_id for this user
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ alerts: [], stats: null });
  }

  // Fetch alerts: unacknowledged first, then recent acknowledged (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: alerts, error } = await supabase
    .from('compliance_alerts')
    .select('id, alert_type, rule_id, title, body, acknowledged, created_at')
    .eq('customer_id', customer.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('acknowledged', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }

  // Fetch scan stats for the current billing period (last 30 days)
  const { data: scanStats } = await supabase
    .from('message_scans')
    .select('overall_status')
    .gte('scanned_at', thirtyDaysAgo.toISOString());

  const stats = scanStats ? {
    total: scanStats.length,
    clean: scanStats.filter((s) => s.overall_status === 'clean').length,
    warning: scanStats.filter((s) => s.overall_status === 'warning').length,
  } : null;

  return NextResponse.json({ alerts: alerts ?? [], stats });
}
```

**Also add PATCH for acknowledging alerts:**

```typescript
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { alert_id } = await request.json();

  if (!alert_id) {
    return NextResponse.json({ error: 'alert_id is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('compliance_alerts')
    .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
    .eq('id', alert_id);

  if (error) {
    return NextResponse.json({ error: 'Failed to acknowledge alert' }, { status: 500 });
  }

  return NextResponse.json({ acknowledged: true });
}
```

**Note:** This route uses `createClient` (Supabase SSR, cookie-based auth) — not service client. This means RLS applies. We may need a service client instead if RLS blocks service-role inserts being read by authenticated users. Check the existing pattern — other dashboard API routes use `createClient` from `@/utils/supabase/server`.

**Verify:** `npm run build`

**Commit:** `feat: GET/PATCH /api/compliance/alerts route (PRD_08)`

---

## Task 6: Upgrade ComplianceStatusCard with real data

**Files:**
- Modify: `src/components/dashboard/compliance-status-card.tsx`

**What to build:**

Replace the binary `hasAlerts` shell with a data-driven card showing scan stats and alert count.

```typescript
"use client";

import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckCircle, AlertTriangle } from "@untitledui/icons";

interface ComplianceStats {
  total: number;
  clean: number;
  warning: number;
}

interface ComplianceStatusCardProps {
  alertCount: number;
  stats: ComplianceStats | null;
}

export function ComplianceStatusCard({
  alertCount,
  stats,
}: ComplianceStatusCardProps) {
  const hasAlerts = alertCount > 0;

  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <FeaturedIcon
        icon={hasAlerts ? AlertTriangle : CheckCircle}
        color={hasAlerts ? "warning" : "success"}
        theme="light"
        size="lg"
      />
      <h3 className="mt-4 text-sm font-semibold text-primary">
        {hasAlerts ? "Needs attention" : "All clear"}
      </h3>
      <p className="mt-2 text-sm text-tertiary">
        {hasAlerts
          ? `${alertCount} compliance ${alertCount === 1 ? 'suggestion' : 'suggestions'} for your messages. Review them below.`
          : "Your messages are within your registration. We check every message against your registered content."}
      </p>

      {stats && stats.total > 0 && (
        <div className="mt-4 flex gap-4 border-t border-secondary pt-4 text-xs text-tertiary">
          <span>{stats.total} scanned</span>
          <span className="text-fg-success-secondary">{stats.clean} clean</span>
          {stats.warning > 0 && (
            <span className="text-fg-warning-secondary">{stats.warning} warnings</span>
          )}
        </div>
      )}
    </div>
  );
}
```

**Copy notes (Experience Principles):**
- "Needs attention" not "Drift detected" — drift is Phase 2 (BM-09). Phase 1 only has warnings from BM-01/02/06.
- "suggestions" not "violations" or "warnings" — per vocabulary table, avoid threat language.
- "All clear" is kept — it's concise and reassuring.
- Stats line uses plain counts, not percentages — developers prefer concrete numbers.

**Verify:** `npm run build`

**Commit:** `feat: data-driven ComplianceStatusCard with scan stats (PRD_08)`

---

## Task 7: DriftAlertCard component

**Files:**
- Create: `src/components/dashboard/drift-alert-card.tsx`

**What to build:**

A card that renders individual compliance alerts from the `compliance_alerts` table. In Phase 1 these are BM-01/02/06 warnings (not actual drift — that's Phase 2). The component name stays `DriftAlertCard` per PRD_08 Section 12 for forward compatibility.

```typescript
"use client";

import { AlertTriangle, Check } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface ComplianceAlert {
  id: string;
  alert_type: string;
  rule_id: string;
  title: string;
  body: string;
  acknowledged: boolean;
  created_at: string;
}

interface DriftAlertCardProps {
  alerts: ComplianceAlert[];
  onAcknowledge: (alertId: string) => void;
}

export function DriftAlertCard({ alerts, onAcknowledge }: DriftAlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-primary">
        Compliance suggestions
      </h2>
      <p className="text-sm text-tertiary">
        These are recommendations to keep your messages aligned with carrier expectations.
      </p>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-secondary bg-primary p-4"
        >
          <div className="flex items-start gap-3">
            <FeaturedIcon
              icon={AlertTriangle}
              color="warning"
              theme="light"
              size="sm"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-primary">
                {alert.title}
              </h3>
              <p className="mt-1 text-sm text-tertiary">{alert.body}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-quaternary">
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    color="link-gray"
                    iconLeading={Check}
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Got it
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Copy notes (Experience Principles):**
- "Compliance suggestions" not "Compliance alerts" or "Violations" — guide tone, not threat.
- "recommendations to keep your messages aligned with carrier expectations" — trusted guide framing.
- "Got it" acknowledge button — simple, non-bureaucratic.

**Verify:** `npm run build`

**Commit:** `feat: DriftAlertCard component for compliance suggestions (PRD_08)`

---

## Task 8: Wire compliance tab to real data

**Files:**
- Modify: `src/app/dashboard/compliance/page.tsx`

**What to build:**

Replace the static compliance page with data-fetched content. Fetch from `/api/compliance/alerts` on mount and pass real data to `ComplianceStatusCard` and `DriftAlertCard`.

```typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { ComplianceSandboxCard } from "@/components/dashboard/compliance-sandbox-card";
import { ComplianceStatusCard } from "@/components/dashboard/compliance-status-card";
import { DriftAlertCard } from "@/components/dashboard/drift-alert-card";
import { MessageLibrary } from "@/components/dashboard/message-library";
import { Button } from "@/components/base/buttons/button";

interface ComplianceAlert {
  id: string;
  alert_type: string;
  rule_id: string;
  title: string;
  body: string;
  acknowledged: boolean;
  created_at: string;
}

interface ComplianceStats {
  total: number;
  clean: number;
  warning: number;
}

export default function DashboardCompliancePage() {
  const { stage, canonMessageIds } = useDashboard();
  const isLive = stage === "live";

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    setIsLoading(true);
    fetch("/api/compliance/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts ?? []);
        setStats(data.stats ?? null);
      })
      .finally(() => setIsLoading(false));
  }, [isLive]);

  const handleAcknowledge = useCallback((alertId: string) => {
    fetch("/api/compliance/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: alertId }),
    }).then((res) => {
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true } : a,
          ),
        );
      }
    });
  }, []);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-primary">Compliance</h1>
        <p className="mt-1 text-sm text-tertiary">
          {isLive
            ? "Your registration status and message monitoring."
            : "How RelayKit protects your traffic after registration."}
        </p>
      </div>

      {!isLive && <ComplianceSandboxCard />}

      {isLive && (
        <>
          <ComplianceStatusCard
            alertCount={unacknowledgedAlerts.length}
            stats={stats}
          />

          <DriftAlertCard
            alerts={unacknowledgedAlerts}
            onAcknowledge={handleAcknowledge}
          />

          <div>
            <h2 className="text-sm font-semibold text-primary">
              Registered messages
            </h2>
            <p className="mt-1 text-sm text-tertiary">
              These are the messages carriers approved in your registration.
            </p>
          </div>

          <MessageLibrary canonMessageIds={canonMessageIds} />

          <Button href="#" color="link-color" size="sm">
            View your compliance site
          </Button>
        </>
      )}
    </div>
  );
}
```

**Note:** The `ComplianceStatusCard` props change from `hasAlerts?: boolean` to `alertCount: number` + `stats`. This is a breaking interface change — no other consumers exist, so it's safe.

**Verify:** `npm run build`

**Commit:** `feat: wire compliance tab to live alert data (PRD_08)`

---

## Task 9: Alert email templates (Emails 6–7)

**Files:**
- Modify: `src/lib/emails/templates.ts`
- Modify: `src/lib/emails/types.ts`

**What to build:**

Add two new email templates per PRD_08 Section 7. These are deterministic string interpolation — no email provider wired (consistent with D-48).

### Add to `types.ts`:

```typescript
/** Variables for compliance warning daily digest (Email 6) */
export interface ComplianceWarningDigestVars {
  business_name: string;
  date: string;
  warning_count: number;
  warning_list: string;
}

/** Variables for messages blocked notification (Email 7) */
export interface MessagesBlockedVars {
  business_name: string;
  blocked_count: number;
  violation_summary: string;
}
```

### Add to `templates.ts`:

```typescript
// Email 6: Compliance warning — daily digest
export function complianceWarningDigest(
  vars: ComplianceWarningDigestVars,
): EmailTemplate {
  return {
    subject: `SMS compliance summary — ${vars.business_name} — ${vars.date}`,
    body: `${vars.warning_count} compliance ${vars.warning_count === 1 ? 'suggestion' : 'suggestions'} for your messages today:

${vars.warning_list}

These are recommendations, not blocks. Following them improves your deliverability and reduces the risk of carrier filtering.

→ View details: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// Email 7: Messages blocked notification (repeated inline blocks)
export function messagesBlocked(
  vars: MessagesBlockedVars,
): EmailTemplate {
  return {
    subject: `Messages blocked — ${vars.business_name}`,
    body: `${vars.blocked_count} ${vars.blocked_count === 1 ? 'message was' : 'messages were'} blocked by compliance enforcement today:

${vars.violation_summary}

These messages were prevented from reaching carriers, so no fines or penalties apply. But repeated blocks may indicate a code issue that needs attention.

→ View details: ${DASHBOARD_URL}

— RelayKit`,
  };
}
```

**Copy notes (Experience Principles):**
- "suggestions" not "violations" — vocabulary table
- "recommendations, not blocks" — trusted guide, not nagging parent
- "may indicate a code issue" — frames it as a debugging prompt, not an accusation
- No "⚠" emoji in subject lines — per CLAUDE.md, no emojis unless user requests

**Verify:** `npm run build`

**Commit:** `feat: compliance alert email templates — Emails 6 and 7 (PRD_08)`

---

## Task 10: Review and harden checkout monitoring consent

**Files:**
- Review: `src/app/start/review/page.tsx` (lines 322–329)

**What to verify:**

The monitoring consent checkbox already exists at the checkout review screen. Verify:

1. The checkbox label and hint text match PRD_08 Section 6 copy
2. The `monitoringConsent` state gates the checkout button (already does — `isDisabled={!monitoringConsent}`)
3. The consent value is included in the checkout POST payload

**What to change:**

The current copy reads:
> "I agree to compliance monitoring"
> "RelayKit scans outbound messages for opt-out enforcement, prohibited content, and carrier rule compliance. This protects your registration and prevents fines."

PRD_08 Section 6 specifies:
> "I understand that RelayKit enforces compliance on outbound messages to protect my phone number from carrier suspension and maintain platform integrity for all users."

Update the label and hint to match the PRD copy. Also ensure `monitoring_consent: true` is sent in the checkout POST payload (add to `handleCheckout` body if missing).

**Updated checkbox:**
```typescript
<Checkbox
  isSelected={monitoringConsent}
  onChange={setMonitoringConsent}
  label="I understand that RelayKit monitors outbound messages"
  hint="RelayKit enforces compliance on outbound messages to protect your phone number from carrier suspension and maintain platform integrity for all users."
/>
```

**Copy notes (Experience Principles):**
- "I understand" not "I agree" — less legalistic, per vocabulary table
- "monitors" not "scans" — more natural language
- "protect your phone number" — the value proposition framing, not just the requirement

**Also add** `monitoring_consent: monitoringConsent` to the checkout POST body in `handleCheckout`.

**Verify:** `npm run build`

**Commit:** `feat: update monitoring consent copy to match PRD_08 Section 6`

---

## Task 11: Update PROGRESS.md and CC_HANDOFF.md

**Files:**
- Modify: `PROGRESS.md`
- Modify: `CC_HANDOFF.md`

**What to do:**
- Check off PRD_08 Phase 1 items in PROGRESS.md
- Update CC_HANDOFF.md with files created/modified, decisions made, and gotchas for the next session

**Commit:** `docs: update progress and handoff for PRD_08 Phase 1`

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Database migration | `supabase/migrations/20260306100000_compliance_monitoring.sql` |
| 2 | Async scanner (BM-01, BM-02, BM-06) | `src/lib/compliance/scanner.ts`, `types.ts` |
| 3 | Alert generator + dedup | `src/lib/compliance/alert-generator.ts` |
| 4 | Wire into `/v1/messages` + add `businessName` to auth context | `route.ts`, `types.ts`, `auth.ts` |
| 5 | `/api/compliance/alerts` GET+PATCH | `src/app/api/compliance/alerts/route.ts` |
| 6 | Upgrade ComplianceStatusCard | `compliance-status-card.tsx` |
| 7 | DriftAlertCard component | `drift-alert-card.tsx` |
| 8 | Wire compliance page to real data | `compliance/page.tsx` |
| 9 | Email templates 6+7 | `templates.ts`, `types.ts` |
| 10 | Harden checkout consent copy | `review/page.tsx` |
| 11 | Progress + handoff docs | `PROGRESS.md`, `CC_HANDOFF.md` |
