-- Phase 2 multi-project guardrails
-- Adds nullable project_id columns per DECISIONS.md D-11.
-- These columns are structural prep only — no project-switching UI in V1.

-- ============================================================
-- 1. api_keys.project_id
-- ============================================================
ALTER TABLE api_keys
  ADD COLUMN IF NOT EXISTS project_id UUID;

COMMENT ON COLUMN api_keys.project_id IS
  'Phase 2: multi-project. Will become NOT NULL after migration.';
