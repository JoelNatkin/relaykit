# /explorations

Sandbox space for product, strategy, and design ideas being prototyped before committing to canonical docs.

## Status header

Every exploration file starts with one of these as its first line:

- `Status: exploring` — actively being developed
- `Status: paused (YYYY-MM-DD) — [brief context]` — set aside, may return
- `Status: killed (YYYY-MM-DD) — [brief reason]` — graveyard; prevents re-exploring later
- `Status: promoted to D-XXX (YYYY-MM-DD)` — moved into canon; file remains as historical reference

## Where explorations are tracked

- **REPO_INDEX.md** — "Active explorations" section lists `exploring` and `paused` files
- **PROTOTYPE_SPEC.md** — pointers from screen sections when UI is being explored
- **PRODUCT_SUMMARY.md** — pointers from relevant sections when customer experience could be affected
- **DECISIONS.md** — when an exploration is `promoted`, a D-number lands and the exploration file's status header points at it

## Working with this directory

PM scaffolds an exploration when an idea has substantial blast radius and Joel wants to sit with it before committing. CC creates the file, updates the tracking surfaces, and maintains the status as it changes.

See `PM_PROJECT_INSTRUCTIONS.md` "Explorations (sandbox before canon)" for PM-side rules and `CLAUDE.md` for CC-side mechanics.
