# CC_HANDOFF — Go-live + marketing-home close-out (Session 128)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 14 (11 polish/feature on `feat/marketing-home` + 2 merges + 1 standalone docs on `main`) + the held canon commit (pending PM gg) | Files modified: ~18 distinct (`marketing-site/*` polish + 5 canon docs) | Decisions added: 1 (D-429) + the D-427 enumeration completion (pricing Stage labels) | External actions: Vercel **production deploy** of `main` (succeeded), 1 tagged prod `/api/early-access` smoke-test signup, push ×12

**Status: 🟢 LIVE in production.** `feat/marketing-home` is merged to `main` and deployed at **relaykit.ai** — the v10 marketing home at `/`, the free configurator tool at `/messages`, dark default, gold accent, mobile nav menu, and the `/messages` quick-start strip are all live. Phase 1 of the go-live plan is complete and verified; Phase 2 canon is done on disk but the **canon commit is held for PM "gg"** (see below).

---

## What shipped this session

**Branch polish (before go-live), all on `feat/marketing-home`:** home eyebrow placement + column top-align + card-stroke consistency (`88d7b5c`); responsive final-CTA headline break + inter-sentence space (`815f8ab`, `3a1257f`); `/messages` bottom spacing (`949f89f`); configurator subtitle removed + header spacing to 16px (`f155aaa`); `/messages` quick-start orientation strip (`6a7bc54`, fill dropped `85dcb06`); neutral hero phone glow (`f065c66`, scoped tight to the phone `8e177dc`); mobile nav menu (`3e5a168`, amended with `role="dialog"` + dead-backdrop removal + shared `NAV_LINKS`); desktop theme toggle moved left of the links (`c771da6`).

**Go-live (Phase 1):** picked up `main`'s `2688820` into the branch (merge `3ea5c31`), gates green on the integrated tree, `--no-ff` merge to `main` (`33048a5`), pushed → Vercel production deploy **succeeded**. Production verified: `/` and `/messages` serve the new build (HTTP 200); the hamburger button is in the served markup; `POST /api/early-access` returned `{ok:true, emailDelivered:true}` (the `interest_tag` insert path works — migration 009 confirmed live).

**Standalone docs commit on `main` (`5600159`, pushed, no gg gate):** PM_PROJECT_INSTRUCTIONS handoff-discipline rewrite ("write as work lands") + date bump to June 7.

**Phase 2 canon (HELD — staged, NOT pushed, awaiting gg):** D-429 (`/messages` dismissible quick-start strip, Supersedes none) + the D-427 enumeration completion (pricing Stage labels); PROTOTYPE_SPEC home/routing rewrite (+ `/messages` + top-nav-menu subsections, + the configurator header copy corrected to "Write your messages"); PRODUCT_SUMMARY `/` vs `/messages` split (Last reviewed → 2026-06-07); REPO_INDEX home-build inventory + Meta/decision/branch reconciliation; this CC_HANDOFF.

## Held for PM review (gg)

The canon commit is local on `main`, **not pushed**. `git show` of the **D-429 + PROTOTYPE_SPEC + PRODUCT_SUMMARY** edits is in `.pm-review.md`. On "gg" → `git push origin main`.

## Cleanup item

The go-live smoke test created a real tagged row in `early_access_subscribers` — email `joel+golive-smoke@gmail.com`, `ctaSource`/`interest_tag` = `golive-smoke-test` — and sent a welcome email to Joel's inbox. Delete the row when convenient.

## Branch state

`main` is the live production branch. `feat/marketing-home` is merged (`33048a5`) but not deleted — optional cleanup. No other branches.

## Untracked carryovers — DO NOT COMMIT

Two untracked files persist from another branch and must stay untracked: `marketing-site/content/posts/the-feature-serious-scheduling-apps-build.mdx` and `.claude/settings.local.json`.

## Next steps

- **PM:** review `.pm-review.md` → "gg" to push the held canon commit.
- The marketing-home workstream is complete and live. The next substantive product pickup is **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN (unchanged by this session).
- Two items best eyeballed in-browser on prod (client-rendered, absent from static HTML by design): the `/messages` quick-start strip render/dismiss-persist, and the mobile hamburger open/close + in-menu theme toggle.
