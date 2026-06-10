# CC_HANDOFF — design-refresh: hero rebuild + surface dry-out (branch `feat/design-refresh`, 2026-06-10)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.
>
> **NOTE — this is the BRANCH copy.** It reflects `feat/design-refresh`; the `main` copy is separately current (`5d169e0`). The two reconcile when this branch merges.

**Session metrics:** Commits: 15 on `feat/design-refresh` since the increment-1 close-out (`c3b9b4c`), + this handoff refresh | Files modified: ~10 (hero.tsx, hero-configurator-graphic.tsx, globals.css, configurator-section.tsx, category-list.tsx, mobile-categories-modal.tsx, tone-pill.ts, elig-section.tsx, elig-verdict-card.tsx, messages-quickstart.tsx) | Decisions added: 0 (all extend D-405/D-427 — no new D-number) | External actions: branch push per commit, Vercel preview rebuilding

**Status: 🟡 `feat/design-refresh` is UNMERGED, on Vercel preview, in ACTIVE TWEAKING MODE.** Branch HEAD `9e087c7`, in sync with `origin/feat/design-refresh`. **Next session resumes hero/configurator visual tweaks on the preview — NOT yet ready to merge.** Branched from `main` at `068c2e5`; `main` has since advanced to `2e8624d` (+ its own CC_HANDOFF refresh `5d169e0`) — none on this branch yet; they reconcile at merge. `main` is live in production.

---

## Commit log since `c3b9b4c` (oldest → newest)

Configurator restyle fast-follows: `02a7945` quick-start panel card-group fill + eyebrows above progress · `7bbe3a1` mobile categories sheet matches desktop column · `3d304f2` consistent card-group borders + read-only summary (bold name, pencil edit) · `8e3eac6` messages column max-w 500px · `3a3b498` tone pills + add-message lifted off near-black · `c11ab26` thicker stroke on large category checkboxes · `e3f0b52` advisory card lifecycle (persist/dismiss/reopen + reliability fix) + muted request link.

Hero rebuild: `5502fd0` static configurator graphic replaces the phone mock · `81735a4` top-anchor + 2-col, no copy overlap · `2c227f2` lower-right rounded card, right-edge bleed only · `c560bc3` all-categories rail, two-message peek, gold Copy CTA · `3ec2199` curated rail + larger two-tone H1.

Surface + copy: `eee5c30` dry-out surface retune (two-tone) · `1da78fa` darken surface tones · `9e087c7` H1 copy → "Text messaging for your app. Easier".

## Hero peek — now a dedicated STATIC mock (`components/home/hero-configurator-graphic.tsx`)

The hero peek is a bespoke static graphic, **NOT** the shared `<ConfiguratorSection/>` (that earlier live-instance approach was abandoned — a second live instance would clobber the existing embed's `relaykit_configurator`/`relaykit_elig` localStorage). The mock owns no state, no hooks, no storage; wrapped `inert` + `aria-hidden`.

- **Bespoke left rail** — no longer reuses `<CategoryList>` (hand-built in this file; must be hand-synced if categories change). Curated set: Verification, Appointments, Order updates, Waitlist, Account events, Marketing (dropped Customer support / Team alerts / Community via a local `RAIL_EXCLUDED` filter; `CATEGORIES` source untouched). 20px row gaps (`gap-5`), larger names (`text-lg`), hollow unchecked checkboxes (`border-2`, no fill), **only Verification checked** (gold).
- **Two-message peek** — Verification group only, first two messages (Verification code + Confirmation code) via the real `MessageReadCard`. Gold full-width "Copy messages" CTA at the bottom (removed the small top-right ghost Copy).
- **Clean all-around border** — the card's own `rounded-[22px] border` shows on all visible edges; right runs off-screen.

## Hero H1 + framing (`components/home/hero.tsx`)

- Two-tone H1: **"Text messaging for your app."** (primary) + **"Easier"** as a muted accent span. Accent color `#958675` via the dedicated token **`--color-text-headline-muted`** (utility `text-text-headline-muted`; only the H1 span consumes it — no raw hex inline, D-405). Enlarged to `text-5xl sm:text-6xl`.
- 2-col grid (copy left, mock right, `items-start`) so the mock can never overlap the copy. Mock offset ~400px below the nav (`top-[330px]` + hero `pt-[72px]`), clip window `h-[600px]`, `scale-[0.85]`, section `lg:min-h-[960px]`. `hidden lg:block` (desktop-only). All offsets/heights are visual tunables.

## Surface colors — dried out + darkened (`app/globals.css` `.dark` only; light untouched)

Flattened the prior 4-step ladder to a darker two-tone:
- `--color-surface-card` → **`#181511`** (rgb 24 21 17) — configurator container + inputs; the mock's single flat tone.
- `--color-surface-inset` + `--color-surface-raised` → both **`#1E1A15`** (rgb 30 26 21) — collapsed: rail, message cards, unselected tone pills, input-group.
- `--color-surface-page` → **`#16130F`** unchanged (page behind the tool).
- New scoped **`.surface-flat`** rule points `inset`/`raised` at `var(--color-surface-card)`; applied to the mock wrapper so the shared leaves (MessageReadCard, tone pills) render flat **#181511** inside the mock, while the real configurator stays two-tone (#181511 container/inputs, #1E1A15 rail/cards/pills). Token-only — all hex in `globals.css`. **Extends D-405; not a D-number.**

## Configurator restyle (increment 1) — still on the branch

The original increment: the whole tool in one contained card, depth tiers, and a collapsing setup zone (business name + industry/sub-industry condense to a "[Business] · [specialty]" summary row + pencil via a local `setupEditing` flag). Presentation-only — **elig / cascade / AIRGAP untouched** throughout. The advisory rules card was later decoupled from the collapse (`e3f0b52`) so it persists and is dismissible.

## Open for next session (preview crit)

- **Rules/verdict card vs. setup collapse** — the advisory now persists + is dismiss/reopen-able (`e3f0b52`); confirm the behavior reads right on the preview (PM lean: keep the D-422 eligibility surface persistent).
- **Home-peek framing** — the mock's lower-right crop/offset/scale (`top-[330px]`, `h-[600px]`, `scale-[0.85]`, `lg:min-h-[960px]`) are eyeball tunables; dial against the artifact.
- **Font** — still undecided.
- **Surface tones** — `#181511` / `#1E1A15` are one-line tunables in `globals.css` if the dry-out wants pushing further.
- **H1 size** — `text-5xl sm:text-6xl`, tunable.

## Pending at branch close-out

- **PROTOTYPE_SPEC** — add a note covering the surface-token dry-out ladder + the hero static mock + the configurator restyle (extends D-405/D-427; **not a D-number** unless PM locks a stance). Deferred to close-out so it describes the stabilized result.

## Untracked carryover — DO NOT COMMIT

Only `.claude/settings.local.json` remains untracked.

## Carried cleanup (Joel)

The go-live smoke-test row in `early_access_subscribers` — `joel+golive-smoke@gmail.com`, `interest_tag` = `golive-smoke-test` — still pending deletion.

## Next steps

- Resume hero/configurator visual tweaks on the preview per Joel's crit → once visuals lock, branch close-out (PROTOTYPE_SPEC note + REPO_INDEX surface-token/hero-mock inventory) → merge `feat/design-refresh` to `main` (picks up `main`'s `5d169e0`/`23f5be5`/`2e8624d`).
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
