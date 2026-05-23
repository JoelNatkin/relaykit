Status: exploring (2026-05-23) — feature design; storage decision committed as D-414, design details open

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
- **Variable editing is a "managed" mutation.** Tone tabs (Standard/Friendly/Brief) and variable-value editing both operate on RelayKit's templates — they do not trip "Custom." Only hand-editing a body trips "Custom" (the escape hatch where the author owns the wording, compliance still enforced). This is the organizing concept that lets three mutation surfaces coexist on one card without overload.
- **Copy output: both forms, no glossary.** Rendered message + {{variable}} template. No variable glossary — the preview sits directly above the template in the copied block, which is self-explanatory.
- **Char-count warning on the message, not the form.** Form-level counting would false-positive on Friendly-tone verbosity. A lightweight warning on the message affordance, with a few words on the consequence (e.g. over 160 = sends as 2 texts). Affordance TBD.
- **Max persistence.** Authored values persist durably across sessions (D-414). A returning visitor finds their work waiting, then clicks "Start building." Persistence is the conversion mechanic.

## Open decisions — next session owes these

All design, not architecture — the storage commitment (D-414) is settled.

1. **State shape.** The categoryValues map structure, designed against what the workspace will consume. The expensive one — get it wrong and it's costly. Needs the workspace's expected input in the room; cannot design the producer without sketching the consumer.
2. **Configurator → workspace handoff.** At least a sketch of how categoryValues is read at "Start building." #1 depends on this.
3. **Clear-affordance scope.** Persistence needs a counterweight — likely two levels (clear one category, clear everything to start fresh). Scope TBD.
4. **Char-warning affordance.** Where on the message, exact wording.
5. **Button label.** Sets the user's expectation that this is an input surface, not a read-only panel.

## Downstream questions — parked, do not solve here

- When the configurator is brought into the workspace, does per-message tone selection survive, or collapse to the global tone selector? Pre-configurator workspace mockups have per-message tone; not this feature's call.
- MASTER_PLAN phase ordering: D-414 pulls a slice of workspace persistence forward. Whether the phase list needs a note depends on the size of the slice, which #1 determines. Assess next session.

## Supersedes

This exploration supersedes two earlier, narrower framings of the same idea:
- PROTOTYPE_SPEC.md line 145's "conditional input rendering for identity tokens" — described a smaller version (identity tokens only, conditional rendering). The named tokens (website, business_type, service_type) do not exist in the corpus. To be reconciled when this feature's design promotes to spec.
- BACKLOG entries "Configurator conditional input rendering" and "Variable identity-vs-default schema distinction" — the speculative version of this feature. To be retired when this exploration promotes.
