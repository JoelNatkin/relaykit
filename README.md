# RelayKit

RelayKit is an SMS compliance + delivery service for indie developers. It exists so a developer building an application that needs to send SMS can add it cleanly, compliantly, and confidently, without becoming an expert in carrier regulation. The developer's AI coding tool reads our documentation and produces a working integration step by step; real test messages work before any money changes hands; live messaging costs $49 to register and $19/month thereafter. See `MASTER_PLAN.md` §0 for the full North Star.

## Where to start reading

- `MASTER_PLAN.md` — strategy, phases, out-of-scope
- `REPO_INDEX.md` — canonical docs index, current state, recent sessions
- `CLAUDE.md` — CC working rules, quality gates, session protocol
- `PROTOTYPE_SPEC.md` — UI screen specs (prototype is the UI source of truth)
- `DECISIONS.md` — why-we-did-what (active D-84+; D-01–D-83 archived in `DECISIONS_ARCHIVE.md`)

## Directory map

- `/api` — new backend (Hono framework, strict TypeScript, 98 passing tests). Active rebuild target for Phases 2–5.
- `/sdk` — TypeScript SDK, eight verticals, ~30 methods, v0.1.0 packed. Publication gated on Phase 8.
- `/prototype` — UI source of truth. Production UI ports from here (port 3001).
- `/src` — Twilio-era Next.js app, **sunset per D-358**. Feature-freeze. See `SRC_SUNSET.md` for the capability-to-phase rebuild map.

## Current phase

See `MASTER_PLAN.md` §3 for the phase list; the active phase is called out in `REPO_INDEX.md`.

## Local development

The prototype is the only current run target:

```
cd prototype
npm run dev
# → http://localhost:3001
```

`/src` is frozen per D-358 and is not a run target. `/api` is not yet deployed (Phase 7); it runs locally via its own README when Phase 2 work is active.

## Design system

Untitled UI React + Tailwind v4.1. Full reference: `docs/UNTITLED_UI_REFERENCE.md`.
