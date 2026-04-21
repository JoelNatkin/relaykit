-- DEV ONLY — DO NOT RUN IN PROD
-- ---------------------------------------------------------------------------
-- Migration audit fixes (2026-03-07)
-- ---------------------------------------------------------------------------
-- 1. Add customers.user_id (NOT NULL, FK to auth.users, indexed)
-- 2. Add CHECK constraint on webhook_endpoints (at least one owner)
-- 3. Make message_scans.message_id NOT NULL
-- 4. Make compliance_alerts.customer_id NOT NULL
--
-- DESTRUCTIVE: Dev database only. Drops and recreates columns where needed.
-- ---------------------------------------------------------------------------

-- ============================================================
-- 1. customers.user_id — links to auth.users, eliminates O(n)
--    listUsers() scan in proxy auth (auth.ts)
-- ============================================================

-- Drop existing rows (dev data only) that would violate NOT NULL.
-- In production this would need a backfill step.
DELETE FROM customers WHERE TRUE;

ALTER TABLE customers
  ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id);

CREATE INDEX idx_customers_user_id ON customers (user_id);

-- ============================================================
-- 2. webhook_endpoints — at least one owner must be set
-- ============================================================

ALTER TABLE webhook_endpoints
  ADD CONSTRAINT webhook_endpoints_owner_check
  CHECK (customer_id IS NOT NULL OR user_id IS NOT NULL);

-- ============================================================
-- 3. message_scans.message_id — must reference a message
-- ============================================================

-- Clear any orphaned rows (dev only)
DELETE FROM message_scans WHERE message_id IS NULL;

ALTER TABLE message_scans
  ALTER COLUMN message_id SET NOT NULL;

-- ============================================================
-- 4. compliance_alerts.customer_id — must reference a customer
-- ============================================================

-- Clear any orphaned rows (dev only)
DELETE FROM compliance_alerts WHERE customer_id IS NULL;

ALTER TABLE compliance_alerts
  ALTER COLUMN customer_id SET NOT NULL;
