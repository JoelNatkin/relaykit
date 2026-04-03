CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  api_key_id TEXT,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'live')),
  namespace TEXT NOT NULL,
  event TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  composed_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
  carrier_message_id TEXT,
  queued_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT
);

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_status ON messages(status) WHERE status = 'queued';
