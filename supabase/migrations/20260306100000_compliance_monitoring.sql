-- ---------------------------------------------------------------------------
-- PRD_08: Compliance Monitoring — message_scans & compliance_alerts
-- ---------------------------------------------------------------------------
-- Depends on: 20260306000000_messaging_proxy.sql (messages table)
-- Creates tables for async compliance scan results and dashboard/email alerts.
-- ---------------------------------------------------------------------------

-- 1. message_scans — async compliance check results
-- Stores per-message scan outcomes. Only 'clean' or 'warning' — violations
-- are handled inline by the proxy before delivery and never reach this table.
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
  ON message_scans (registration_id, overall_status, scanned_at DESC);

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
  ON compliance_alerts (customer_id, created_at DESC);

CREATE INDEX idx_compliance_alerts_unack
  ON compliance_alerts (customer_id)
  WHERE acknowledged = FALSE;

-- 3. RLS — service-role only for now
ALTER TABLE message_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;
