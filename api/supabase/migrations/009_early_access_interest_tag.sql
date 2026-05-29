-- 009_early_access_interest_tag.sql — add interest_tag for elig-section signals
--
-- The home configurator's elig section captures signal on 🟠 (Not yet, maybe
-- not ever) and ⚫ (Not yet) verdicts via the same /api/early-access endpoint
-- the rest of the marketing site already uses. interest_tag distinguishes
-- those signals downstream (vetting-interest queue vs. capacity-deferred /
-- multi-tenant queue) without splitting into separate tables (vertical-
-- constraints §9.7).
--
-- Nullable: existing signups (and the general "Get early access" CTAs that
-- don't carry an interest tag) keep posting without it.
--
-- Apply via the Supabase SQL Editor before deploying the marketing-site
-- code that posts interest_tag — the route handler writes the column on
-- 🟠/⚫ submissions and will fail on insert if the column is missing.

alter table early_access_subscribers
  add column if not exists interest_tag text;

create index if not exists early_access_subscribers_interest_tag_idx
  on early_access_subscribers (interest_tag)
  where interest_tag is not null;
