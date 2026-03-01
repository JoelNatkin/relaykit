-- Stripe Checkout & Subscription Schema
-- Tables: intake_sessions, customers, registrations, message_usage

-- ============================================================
-- 1. intake_sessions — ephemeral bridge between form and payment
-- ============================================================
CREATE TABLE intake_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_intake_sessions_expires ON intake_sessions (expires_at);
CREATE INDEX idx_intake_sessions_stripe ON intake_sessions (stripe_session_id);

-- ============================================================
-- 2. customers — created on successful payment
-- ============================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Business info
  business_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  has_ein BOOLEAN NOT NULL DEFAULT FALSE,
  ein TEXT,
  business_type TEXT,

  -- Contact
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT NOT NULL,

  -- Use case
  use_case TEXT NOT NULL,
  expansions TEXT[] NOT NULL DEFAULT '{}',
  effective_campaign_type TEXT NOT NULL,

  -- App-specific (nullable)
  website_url TEXT,
  service_type TEXT,
  product_type TEXT,
  app_name TEXT,
  community_name TEXT,
  venue_type TEXT,

  -- Overrides from review screen
  campaign_description_override TEXT,
  sample_messages_override TEXT[],

  -- Stripe
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'past_due', 'suspended', 'cancelled', 'churned')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_stripe_customer ON customers (stripe_customer_id);
CREATE INDEX idx_customers_subscription_status ON customers (subscription_status);

-- ============================================================
-- 3. registrations — tracks 10DLC registration lifecycle
-- ============================================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'generating_artifacts'
    CHECK (status IN (
      'generating_artifacts',
      'artifacts_ready',
      'submitting',
      'pending_review',
      'approved',
      'rejected',
      'resubmitting'
    )),

  -- Twilio references (populated during submission)
  twilio_brand_sid TEXT,
  twilio_campaign_sid TEXT,
  twilio_messaging_service_sid TEXT,
  twilio_phone_number TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_registrations_customer ON registrations (customer_id);
CREATE INDEX idx_registrations_status ON registrations (status);

-- ============================================================
-- 4. message_usage — per-customer per-billing-period tracking
-- ============================================================
CREATE TABLE message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  blocks_billed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_usage_customer_period
  ON message_usage (customer_id, billing_period_start);

-- ============================================================
-- 5. updated_at trigger — auto-update on row modification
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_message_usage_updated_at
  BEFORE UPDATE ON message_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
