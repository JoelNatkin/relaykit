-- ---------------------------------------------------------------------------
-- PRD_09 Phase 1: Messaging Proxy & Developer Sandbox
-- ---------------------------------------------------------------------------
-- Creates tables for: opt-out tracking (D-24), marketing consent (D-14),
-- message logging, webhook endpoints, and sandbox daily usage.
-- ---------------------------------------------------------------------------

-- 1. sms_opt_outs — per-customer/user opt-out records
-- customer_id is nullable because pre-registration sandbox users have no
-- customer record. user_id (Supabase auth) is always present.
CREATE TABLE sms_opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN (
    'sms_keyword', 'web_form', 'email', 'phone_call',
    'api', 'natural_language', 'twilio_error'
  )),
  raw_opt_out_text TEXT,
  opted_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opted_back_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active opt-out per user+phone at a time
CREATE UNIQUE INDEX idx_sms_opt_outs_active
  ON sms_opt_outs (user_id, phone_number)
  WHERE opted_back_in_at IS NULL;

CREATE INDEX idx_sms_opt_outs_customer
  ON sms_opt_outs (customer_id, phone_number)
  WHERE customer_id IS NOT NULL;

-- 2. recipient_consents — MIXED tier marketing consent (D-14)
-- Only post-registration customers have campaign types, so customer_id is NOT NULL.
CREATE TABLE recipient_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('transactional', 'marketing')),
  source TEXT NOT NULL CHECK (source IN ('web_form', 'api', 'keyword', 'import')),
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active consent per customer+phone+type at a time
CREATE UNIQUE INDEX idx_recipient_consents_active
  ON recipient_consents (customer_id, phone_number, consent_type)
  WHERE revoked_at IS NULL;

-- 3. messages — proxy message log
-- customer_id is nullable for pre-registration sandbox users.
-- body is never stored — only a SHA-256 hash for deduplication.
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  external_id TEXT NOT NULL UNIQUE,
  twilio_sid TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  to_number TEXT NOT NULL,
  from_number TEXT NOT NULL,
  body_hash TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  compliance_result JSONB,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'live')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_customer ON messages (customer_id, created_at DESC)
  WHERE customer_id IS NOT NULL;
CREATE INDEX idx_messages_user ON messages (user_id, created_at DESC);
CREATE INDEX idx_messages_twilio_sid ON messages (twilio_sid)
  WHERE twilio_sid IS NOT NULL;

CREATE TRIGGER trg_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. webhook_endpoints — customer webhook configuration
-- customer_id or user_id identifies the owner (pre-reg uses user_id only).
CREATE TABLE webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{message.received}',
  secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_customer ON webhook_endpoints (customer_id)
  WHERE customer_id IS NOT NULL;
CREATE INDEX idx_webhook_endpoints_user ON webhook_endpoints (user_id)
  WHERE user_id IS NOT NULL;

-- 5. sandbox_daily_usage — daily message count per sandbox user
CREATE TABLE sandbox_daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TRIGGER trg_sandbox_daily_usage_updated_at
  BEFORE UPDATE ON sandbox_daily_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. RLS — all tables service-role only for now
ALTER TABLE sms_opt_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sandbox_daily_usage ENABLE ROW LEVEL SECURITY;
