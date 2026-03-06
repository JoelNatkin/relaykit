-- BYO Twilio waitlist — email capture for Phase 2 registration-only option (PRD_07 Section 6)
CREATE TABLE byo_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: service role only (no public access)
ALTER TABLE byo_waitlist ENABLE ROW LEVEL SECURITY;
