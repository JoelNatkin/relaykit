-- Stripe webhook event deduplication table.
-- Prevents duplicate processing of the same Stripe event (e.g., retries).

CREATE TABLE stripe_events (
  id TEXT PRIMARY KEY,                          -- Stripe event ID (evt_...)
  event_type TEXT NOT NULL,                     -- e.g. checkout.session.completed
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TTL cleanup: events older than 30 days can be pruned.
-- Stripe retries are within 72 hours, so 30 days provides wide margin.
CREATE INDEX idx_stripe_events_processed_at ON stripe_events (processed_at);
