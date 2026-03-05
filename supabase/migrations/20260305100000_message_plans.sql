-- Message Plans — PRD_06
-- Stores the developer's curated message plan from the dashboard plan builder.
-- Each row represents a use-case-scoped set of message selections and edits.

CREATE TABLE message_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- No UNIQUE constraint on customer_id (D-10):
  -- Phase 2 multi-project allows multiple plans per customer.
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  -- Phase 2: multi-project. Will become NOT NULL after migration. (D-11)
  project_id UUID,

  use_case TEXT NOT NULL,

  -- Array of message plan entries:
  -- {
  --   template_id: string,
  --   category: string,
  --   original_template: string,
  --   edited_text: string | null,
  --   trigger: string,
  --   variables: string[],
  --   is_expansion: boolean,
  --   expansion_type: string | null,
  --   enabled: boolean
  -- }
  messages JSONB NOT NULL DEFAULT '[]',

  build_spec_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN message_plans.project_id IS
  'Phase 2: multi-project. Will become NOT NULL after migration.';

CREATE INDEX idx_message_plans_customer ON message_plans (customer_id);

-- RLS — service role only
ALTER TABLE message_plans ENABLE ROW LEVEL SECURITY;
