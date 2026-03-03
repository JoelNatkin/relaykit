-- Twilio Submission Engine — PRD_04
-- Extends customers + registrations, adds twilio_api_log, registration_events, api_keys

-- ============================================================
-- 1. Expand registrations.status CHECK constraint
-- ============================================================
ALTER TABLE registrations
  DROP CONSTRAINT IF EXISTS registrations_status_check;

ALTER TABLE registrations
  ADD CONSTRAINT registrations_status_check
  CHECK (status IN (
    'pending_payment',
    'creating_subaccount',
    'generating_artifacts',
    'deploying_site',
    'submitting_brand',
    'awaiting_otp',
    'brand_pending',
    'brand_approved',
    'vetting_in_progress',
    'creating_service',
    'submitting_campaign',
    'campaign_pending',
    'provisioning_number',
    'generating_api_key',
    'complete',
    'rejected',
    'needs_attention'
  ));

-- ============================================================
-- 2. New columns on registrations
-- ============================================================
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS twilio_trust_product_sid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS twilio_end_user_sid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS twilio_address_sid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS twilio_vetting_sid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS twilio_subaccount_sid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS trust_score INTEGER;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS rejection_code TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS compliance_site_url TEXT;

-- ============================================================
-- 3. New columns on customers
-- ============================================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS twilio_subaccount_sid TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS twilio_subaccount_auth TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS live_active BOOLEAN NOT NULL DEFAULT FALSE;

-- ============================================================
-- 4. twilio_api_log — every Twilio API call
-- ============================================================
CREATE TABLE twilio_api_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_body JSONB,
  response_status INTEGER,
  response_body JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_twilio_api_log_registration ON twilio_api_log (registration_id);
CREATE INDEX idx_twilio_api_log_created ON twilio_api_log (created_at);

-- ============================================================
-- 5. registration_events — state transition audit trail
-- ============================================================
CREATE TABLE registration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_registration_events_registration ON registration_events (registration_id);
CREATE INDEX idx_registration_events_created ON registration_events (created_at);

-- ============================================================
-- 6. api_keys — hashed API keys
-- ============================================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'live')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_customer ON api_keys (customer_id);
CREATE INDEX idx_api_keys_hash ON api_keys (key_hash);

-- ============================================================
-- 7. RLS — service role only for new tables
-- ============================================================
ALTER TABLE twilio_api_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
