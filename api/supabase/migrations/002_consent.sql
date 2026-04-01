-- api/supabase/migrations/002_consent.sql
-- Consent records for RelayKit API server (D-252, D-253)
-- One consent record per phone per customer. Re-consenting updates the existing record.

CREATE TABLE consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES customers(id),
  phone TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  ip_address TEXT,
  source TEXT NOT NULL,
  UNIQUE(user_id, phone)
);

CREATE INDEX idx_consent_user_phone ON consent(user_id, phone);
