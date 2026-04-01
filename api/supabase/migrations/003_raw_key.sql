-- api/supabase/migrations/003_raw_key.sql
-- Add raw_key column for sandbox API key re-display (D-291)
-- Sandbox keys store plaintext for dashboard visibility.
-- Live keys MUST remain NULL (hash-only).

ALTER TABLE api_keys ADD COLUMN raw_key TEXT;

ALTER TABLE api_keys ADD CONSTRAINT chk_raw_key_environment
  CHECK (
    (environment = 'sandbox' AND raw_key IS NOT NULL)
    OR (environment = 'live' AND raw_key IS NULL)
  );
