Status: promoted to D-414 + D-415 (2026-05-23) — configurator authoring layer shipped Session 106 (four wave commits: 70db7cb → d53c0e3 → 2702052 → a3ba24b). Design substance now canonical in PROTOTYPE_SPEC §Configurator. File retained as historical record of why the canonical decision looks the way it does. The configurator→workspace handoff (Resolved §2) remains scoped-not-designed and awaits a workspace session.

# Configurator as Authoring Tool

> **Purpose:** Design the configurator's shift from preview tool to lightweight authoring tool — per-category variable editing, max persistence, dual copy output. Sits on top of the committed D-414 storage decision.
>
> Not for: the D-414 architectural decision itself (that's canon); workspace persistence architecture beyond the configurator's slice.

## The shift

The configurator was a preview tool — it showed what RelayKit's templates look like. Screenshot review (Session 105) established that a meaningful share of lead-magnet visitors are not previewing, they are authoring: they will copy the output and use it. They cannot judge whether a template fits their use case while it renders someone else's reality ("Cohort Kickoff", "ORD-2026-90413", "yourapp.com/offer"). The configurator becomes a lightweight authoring tool so a visitor can fill every variable with their own content and copy out something usable.

Two audiences, one artifact. The copy output carries both the rendered message (Group 1: visitors who run off and use the messages elsewhere) and the {{variable}} template (eventual RelayKit users, who wire the template into the real variable system). Neither audience is sacrificed; the template half keeps RelayKit's variable system the point of the page.

## Converged design (Session 105)

- **Per-category form.** Each category group gets an "Edit preview values" affordance (working label — "preview info" rejected as sounding read-only). Opens a form with an input for every variable in that category's set. Editing a value updates every preview in the category live, and updates the +Variable dropdown's example values.
- **Open mechanism.** Desktop: expander above the messages, so previews stay visible while editing. Mobile: the established full-takeover modal pattern. Modal-on-desktop rejected — it hides the previews, and watching previews change is the whole value.
- **Form, not inline editing.** Inline (click a rendered value, edit in place) rejected: a category variable like event_name appears in multiple messages; the form makes "set once, all previews update" natural, and matches the author's mental model of filling in their reality as a coherent set. The form should indicate, per variable, which messages it touches.
- **All variables editable.** Including links and IDs. Authors hardcode their own URLs and know the shape of their own order/ticket numbers; seeing them in the preview is real convenience. The earlier content-vs-placeholder split is rejected — no taxonomy, every variable in the category gets an input.
- **Identity tokens unchanged.** business_name / workspace_name / community_name keep their existing universal top-of-page input (D-413). They are not duplicated into the per-category form.
- **Variable editing is a "managed" mutation.** Tone tabs (Standard/Friendly/Brief) and variable-value editing both operate on RelayKit's templates — they do not trip "Custom." Only hand-editing a body trips "Custom" (the escape hatch where the author owns the wording, compliance still enforced). This is the organizing concept that lets three mutation surfaces coexist on one card without overload. *(Session 106 note: the message-state model is fuller than the two states this bullet implies — see Resolved §1, "Three message states." A hand-edited template and an author-created "Add message" message are distinct things in the stored shape.)*
- **Copy output: both forms, no glossary.** Rendered message + {{variable}} template. No variable glossary — the preview sits directly above the template in the copied block, which is self-explanatory.
- **Char-count warning on the message, not the form.** Form-level counting would false-positive on Friendly-tone verbosity. A lightweight warning on the message affordance, with a few words on the consequence (e.g. over 160 = sends as 2 texts). Affordance TBD.
- **Max persistence.** Authored values persist durably across sessions (D-414). A returning visitor finds their work waiting, then clicks "Start building." Persistence is the conversion mechanic.

## Resolved (Session 106)

The five open decisions, resolved. Decisions 1, 3, 4, 5 are fully designed. Decision 2 is scoped to a boundary, not fully designed — see its entry for why.

### Framing established before the decisions

These are the premises the decisions rest on. Established this session, all confirmed:

- **One authoring surface, two stages of commitment.** The configurator (home page) and the workspace are the same authoring tool at two stages. Before registration: low stakes. After registration: real, about to reach carriers. The author's content carries from one to the other intact.
- **Three known readers of one record.** The stored values are read by the configurator, by the onboarding flow (which may prepopulate fields from them), and by the workspace. Each reader judges the same record under its own rules.
- **The stored record holds authorial intent only.** It stores what the author typed — variable values and message text. It stores no computed state: no character counts, no compliance verdicts, no lock flags, no "Custom" badge. Every judgment is derived per stage by whichever reader is rendering. This is what lets a lenient configurator and a strict workspace read the identical record and reach different conclusions correctly — the conclusion was never in the record.
- **Enforcement level is a property of the stage, not the data.** An over-length message is a soft warning in the configurator and a hard gate in the workspace. Same message, same stored data; the workspace re-judges it under stricter rules. "Configurator content survives into the workspace" and "the workspace can enforce harder" are not in tension — the workspace inherits the content, not the configurator's leniency.

### 1. State shape — resolved

The stored structure is `categoryValues`: a map keyed by category, each category holding four buckets.

```
categoryValues: {
  [categoryId: string]: {
    variables:     { [variableName: string]: string },
    customBodies:  { [templateMessageId: string]: string },
    addedMessages: Array<{ localId: string, name: string, body: string }>,
    messageTones:  { [messageId: string]: tone }
  }
}
```

**`variables`** — the category's variable values, keyed by variable name. A variable's value is shared across every message in its category: edit `appointment_date` once, every appointment message updates. Variable name is the key because that is what templates already reference (`{{appointment_date}}`). This is the one point producer and consumer already agree on, confirmed by the workspace screenshots — a value belongs to the app and is the same everywhere it appears.

**`customBodies`** — per-message, keyed by the RelayKit template's message ID. An entry exists only when the author has hand-edited that template's body. Its presence is the "Custom" signal — no separate flag. The stored body is itself a template: it still contains `{{variables}}`, which still resolve from the same `variables` map. "Custom" means the author owns the *wording*; RelayKit still owns the *variable slots* inside it. A hand-edited verification message must still substitute `{{code}}` at send time, or it is broken.

**`addedMessages`** — messages the author created from scratch via "+ Add message" (name and body both authored; no RelayKit template behind them). An array, because the configurator renders custom messages in the order they were added and order is part of the contract. Each entry carries `localId` — a throwaway internal ID generated by the configurator, opaque to the author — which is the key the handoff calls for. Stores `name` because the author named it and there is no template to inherit a name from. The body is a template like any other and resolves variables from the same `variables` map.

**`messageTones`** — per-message tone selection (Standard / Friendly / Brief), keyed by message ID. An entry exists when the author has pinned a message to a tone different from the page tone. Per-message tone is authorial intent — the author saying "I want this message different from the default" — which is the same kind of thing as a hand-edited body, so it is stored, not computed. An entry's absence means the message follows the page tone.

**Three message states, not two.** A message in a category is in exactly one of: *pristine template* (no `customBodies` entry, no `addedMessages` entry — renders from RelayKit's template); *edited template* (a `customBodies` entry exists — renders that text, still substitutes variables); *author-created* (an `addedMessages` entry — entirely the author's, still substitutes variables). The `customBodies` / `addedMessages` split (two of the four buckets) exists because an edited template and an author-created message are genuinely different things: one is a deviation from a known template with a known ID, the other is original content with no template and no canonical ID. Tone (`messageTones`, the fourth bucket) is orthogonal to these three states — any of the three can carry a pinned tone.

**Char-count is always post-render.** A body like `Your {{code}} expires soon` is not its own length — it is the length after `{{code}}` substitutes. Counting is: render with current variable values, then count the result. Applies identically to pristine, edited, and author-created messages. This is why char-count is computed, never stored.

**Identity tokens are not in this map.** `business_name` / `workspace_name` / `community_name` keep their existing universal top-of-page input (D-413). They are not duplicated into per-category `variables`.

**What is deliberately not stored:** character counts, compliance verdicts, lock flags, "Custom" badges. All are derived per stage by whichever reader is rendering. (Tone *is* stored — see `messageTones` above — because it is authorial intent, not a derived verdict.)

### 2. Configurator → workspace handoff — scoped, not fully designed

A full handoff design requires knowing what the workspace stores internally — and the workspace is undecided territory the team has deliberately chosen not to design this session. So decision 2 is resolved to a *boundary contract*, not a mechanism:

> `categoryValues` is the shared record of authorial intent — a category-keyed map whose values hold four buckets per category: authored variable values, hand-edited template bodies, the ordered list of author-created messages, and per-message tone pins. No computed or stage-specific state. Its three known readers (configurator, onboarding, workspace) each consume this same record and apply their own rules. The handoff at "Start building" is a translation step, not a raw copy: each reader maps `categoryValues` into whatever it needs.

One concrete piece of the handoff *is* settled, because it falls out cleanly: **slugs are minted by the workspace, not the configurator.** A RelayKit template has a fixed known slug. An author-created message has none — the configurator keys it by a throwaway internal ID whose only job is to hold the message together during the handoff. When an author-created message crosses into the workspace, the workspace mints the real slug from the message name (`My custom login alert` → `my-custom-login-alert`) and owns slug-uniqueness, including collision handling. The configurator never touches slugs, routes, or registration state — those are workspace infrastructure. This keeps the boundary honest: the configurator stores intent; the workspace stores intent plus its own infrastructure.

The rest of the handoff — exactly how onboarding prepopulates from `categoryValues`, how the workspace persists it, how post-registration variable-locking works — is left to a workspace session. The boundary contract above is the promise those sessions build against.

### 3. Clear-affordance scope — resolved

Two levels, both via kebab (overflow) menus:

- **Global clear** — a kebab menu next to the Copy button. Clears all authored values across every category, returning the configurator to seed state.
- **Per-category clear** — a kebab menu on each category row. Clears that one category's authored values.

### 4. Char-warning affordance — resolved

A triangle warning icon placed next to the edit pencil on a message. The icon carries a tooltip explaining the consequence in a few words (e.g. over 160 characters sends as two texts). The warning fires on the rendered (post-substitution) length, per decision 1. Configurator stage: warning only, non-blocking.

### 5. Button label — resolved

Working label "Edit values" for the per-category variable-editing affordance. Not treated as final; a string-level choice, refinable without reopening the design.

## Implementation pressure-test — complete (Session 106)

CC ran a plan-mode pass against the real configurator code (`marketing-site/components/configurator-section.tsx`, `lib/configurator/*`, the `render.ts` resolver carrying the D-413 identity-token fix). Outcome:

- The design is buildable. Main structural work: a resolver-signature change threading `categoryValues` through `resolveVariableExample` / `interpolateBody` / `flattenBody` / `checkCompliance`, and a `STATE_VERSION` bump to 4 (pre-existing v3 state drops on mismatch, per the D-409 precedent — no migration code).
- The D-413 `IDENTITY_TOKENS` resolver extends cleanly — a new resolution branch slots between identity tokens and corpus defaults, no precedence conflict.
- The plan-mode pass surfaced one real conflict: per-message tone already exists as a configurator feature and could not be deferred to a workspace decision. Resolved by adding `messageTones` as the fourth bucket (see §1). The exploration's earlier "tone lives elsewhere" framing was scoped to the workspace-survival question, not the configurator's existing feature.
- Build size: a focused 4-commit wave plus close-out. Not a single commit, not a multi-session wave.
- MASTER_PLAN: no new phase. One line added to the pre-launch checklist (between "Configurator message refinement" and "First Indie Hackers post"), applied at the build's close-out, not before.

The build is fully planned and PM-approved. It is the next session's primary task; CC's plan file is the build spec.

## Downstream questions — parked, do not solve here

- Per-message tone is a configurator feature and is stored in `categoryValues.messageTones` (resolved §1). The open question is workspace-side only: when the configurator is brought into the workspace, does per-message tone survive, or collapse to a global tone selector? Pre-configurator workspace mockups have per-message tone; not this feature's call.
- MASTER_PLAN phase ordering: D-414 pulls a slice of workspace persistence forward. Whether the phase list needs a note depends on the size of the slice, which #1 determines. Assess next session.

## Supersedes

This exploration supersedes two earlier, narrower framings of the same idea:
- PROTOTYPE_SPEC.md line 145's "conditional input rendering for identity tokens" — described a smaller version (identity tokens only, conditional rendering). The named tokens (website, business_type, service_type) do not exist in the corpus. To be reconciled when this feature's design promotes to spec.
- BACKLOG entries "Configurator conditional input rendering" and "Variable identity-vs-default schema distinction" — the speculative version of this feature. To be retired when this exploration promotes.
