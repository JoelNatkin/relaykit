-- 008_early_access_subscribers_rls.sql — lock down the waitlist table
--
-- early_access_subscribers is the only table fed by a public, unauthenticated
-- endpoint (POST /api/early-access). The Supabase URL + anon key are public
-- (NEXT_PUBLIC_*), so without RLS the subscriber list is readable and writable
-- by anyone holding the anon key. Enabling RLS with an explicit deny-all policy
-- closes that off for the anon and authenticated roles; service_role
-- (BYPASSRLS) — used by every app call site via getSupabaseServerClient —
-- is unaffected, so application behavior is unchanged.
--
-- This supersedes the "no RLS, matching every other table in this schema" note
-- in 007's header: per D-406, early_access_subscribers is deliberately the only
-- RLS-locked table because it is the only one behind a public endpoint. A
-- schema-wide RLS pass is separate, out-of-scope work.
--
-- force row level security is deliberately NOT set: service_role bypasses RLS
-- regardless, and forcing it would needlessly constrain the table owner.

alter table early_access_subscribers enable row level security;

-- Explicit restrictive deny-all. With RLS on and zero permissive policies the
-- anon/authenticated roles are already denied; the restrictive policy makes the
-- intent legible AND hard-denies even if a permissive policy is added later
-- (restrictive policies AND with everything; permissive ones only OR).
create policy "deny all non-service access"
  on early_access_subscribers
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);
