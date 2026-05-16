-- 007_early_access_subscribers.sql — early-access waitlist capture
--
-- Fed by the marketing-site POST /api/early-access endpoint. Richer than
-- beta_signups (006): stores the visitor's configurator summary (categories,
-- tone, business name) alongside the email so the welcome email — and the
-- launch-day broadcast — can lead with what each subscriber cared about.
--
-- Server-only via the service-role key (no RLS, matching every other table
-- in this schema). Email is unique, so repeat signups are idempotent: the
-- endpoint catches the unique violation, preserves the first signup's data,
-- and skips the welcome email. unsubscribe_token backs GET /api/unsubscribe.

create extension if not exists "pgcrypto";

create table if not exists early_access_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  categories text[] not null default '{}',
  tone text,
  business_name text,
  configurator_touched boolean not null default false,
  cta_source text,
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists early_access_subscribers_email_idx
  on early_access_subscribers (email);
create index if not exists early_access_subscribers_unsubscribe_token_idx
  on early_access_subscribers (unsubscribe_token);
create index if not exists early_access_subscribers_created_at_idx
  on early_access_subscribers (created_at desc);
