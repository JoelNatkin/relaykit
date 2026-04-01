-- api/supabase/migrations/004_nullable_user_id.sql
-- Make user_id nullable for sandbox keys (D-292)
-- Sandbox keys are anonymous until the developer authenticates.
-- Live keys always require a linked customer record.

ALTER TABLE api_keys ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE api_keys ADD CONSTRAINT chk_user_id_environment
  CHECK (environment = 'sandbox' OR user_id IS NOT NULL);
