-- 006_signups.sql — pre-launch signup capture (D-368 follow-up)
--
-- Two write-only tables fed by /marketing-site server actions:
--   phone_signups   — early-access phone list (/start/verify)
--   beta_signups    — beta-access email list (/start/get-started)
--
-- Both tables enforce uniqueness on the user-provided handle (phone, email)
-- so repeat submissions are idempotent — server actions catch the violation
-- and return the same thanks-state the first submission got.

create extension if not exists "pgcrypto";

create table if not exists phone_signups (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  created_at timestamptz not null default now(),
  source text not null default 'start-verify',
  notes text
);

create table if not exists beta_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  created_at timestamptz not null default now(),
  source text not null default 'start-get-started',
  notes text
);

create index if not exists phone_signups_created_at_idx on phone_signups (created_at desc);
create index if not exists beta_signups_created_at_idx on beta_signups (created_at desc);
