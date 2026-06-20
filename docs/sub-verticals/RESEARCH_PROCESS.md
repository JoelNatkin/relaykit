# Sub-vertical research process

> **What this is:** The end-to-end process for researching, documenting, and maintaining the RelayKit sub-vertical library. Read this before running any batch. It covers how to pull data, run CC sub-agents, review output, clean up issues, and expand the message corpus when research surfaces gaps.
>
> **Who runs this:** PM (browser chat). CC executes sub-agent batches and writes files. PM reviews and approves pushes.
>
> **Output location:** `/docs/sub-verticals/[family-name].md` — one file per vertical family.

---

## What the sub-vertical library is

RelayKit serves builders across ~130 software sub-verticals. Each sub-vertical needs:
- A clear description of what the software actually does (grounded in real market research, not reasoning)
- A ranked set of RelayKit message categories relevant to that vertical
- A complete set of workflows — ordered sequences of corpus messages that map to real jobs-to-be-done
- A gap analysis: which workflows need messages not yet in the corpus, classified as Universal miss or Vertical-specific
- Draft message variants for every gap, ready to add to the corpus or sub-vertical registry
- Content constraints specific to the vertical
- Disambiguation notes distinguishing it from neighboring sub-verticals

This library drives three downstream uses:
1. **Marketing copy** — hero bodies, moment scenarios, and Q&A pointers for sub-vertical landing pages
2. **Product decisions** — which workflows to surface in the configurator, which messages to add to the corpus
3. **Engineering** — the sub-vertical registry that powers the configurator's workflow layer

**Airtable is NOT the source of truth for this content.** The `/docs/sub-verticals/` files are. Airtable holds copy (hero body, moment body) for the landing pages. The research library lives in the repo.

---

## File structure

```
docs/sub-verticals/
├── RESEARCH_PROCESS.md          ← this file
├── b2b-saas.md
├── financial-services.md
├── healthcare.md
├── home-local-services.md
├── professional-services.md
├── retail-hospitality.md
├── creator-community.md
└── civic-public-sector.md
```

Each family file opens with a header block, then one `## [Sub-vertical name]` section per sub-vertical in the family.

---

## Scope: what gets researched

Research every sub-vertical **except** bucket = `Not our lane`. That includes:
- Clear ✅
- Conditional 🟡
- Not yet ⚫
- Not yet, maybe not ever 🟠

`Not yet` and `Not yet, maybe not ever` entries are documented for future-proofing — the workflow and corpus research has value even if we don't serve the vertical at launch. These entries carry a `⚠️ FUTURE REFERENCE ONLY` banner and their gap draft variants are marked `Status: FUTURE`.

`Not our lane` (surveillance, debt collection, SHAFT-barred categories) are excluded entirely — no research value since these will never be served.

---

## Step 1 — Pull sub-vertical data from Airtable

Sub-verticals live in the Constraints base (`appxThB8UWmNulAMt`), Sub-verticals table (`tblsTgbqncUJLtIqb`).

**Fields to pull:**
- Name: `fldoLJGDejKkXLVOK`
- Bucket: `fldgGjPajW7OAGRNn`
- Bucket reason: `fldsdQjYjK1HOyTnf`
- Constraint source: `fld7raNcjLcgseE8j`
- Notes: `flduME53kcJNDtYM0`

Pull all records in one `list_records_for_table` call (pageSize 200). Filter client-side by vertical family using the Name field — Airtable's linked-field filter on Parent vertical doesn't work reliably via MCP.

**Note on notes field:** The Notes column has some internal RelayKit policy reasoning (values-posture language, D-number references, "Permanent reflects values posture" type content). Strip this before feeding to sub-agents — pass only the business-context signal: product analogies ("Clio-for-X"), product shape descriptions, and disambiguation cues. Internal policy reasoning confuses the research agent and is not useful for market research.

**What to strip from notes before including in the prompt:**
- Any mention of D-numbers
- Any "RelayKit-specific" policy reasoning
- Any reference to internal systems (Layer B, proxy layer, etc.)
- Bucket-reason elaborations that are internal policy, not business description

**What to keep:**
- Named product analogies ("Clio-for-X", "ServiceTitan-for-X")
- Business shape descriptions ("dental office, PT, clinic intake")
- Disambiguation cues ("distinct from #8 surveillance via consent regime")
- Specific rules that are externally grounded ("FDCPA-adjacent hygiene for arrears comms")

---

## Step 2 — The two prompts

Every batch requires two prompts pasted together in a single CC message.

### Prompt 1 — Base research prompt (never changes between batches)

This is the sub-agent's operating manual. It contains the full research methodology, output format, quality checks, draft variant rules, and corpus reference instructions. It does not change between families or batches.

```
You are a research sub-agent. Your job is to investigate one software sub-vertical and produce a structured documentation entry for it. Follow every instruction below exactly.

---

## CORPUS REFERENCE

Before writing anything, read `docs/RELAYKIT_MESSAGE_CORPUS.md` in full. Every corpus message ID you use in workflows must exactly match an ID in that file. Know the corpus before you start mapping.

Available category IDs: account-events, appointments, community, customer-support, marketing, order-updates, team-alerts, verification, waitlist

---

## RESEARCH METHODOLOGY

Complete all four steps before writing anything.

**Step 1 — Understand the market.**
Search broadly for "[sub-vertical] software", "[sub-vertical] platform", "[sub-vertical] app", and "[sub-vertical] tools". Do not anchor on any single product. Read across whatever comes up — product marketing pages, G2/Capterra category pages, Reddit threads where builders or business owners discuss what they use. The goal is to understand the full shape of the market: what problems these products solve, who uses them, what a typical day inside the software looks like. If the research notes name a specific product, use it as one data point among many, not as the definitive reference.

**Step 2 — Go deeper on what the software actually does.**
Pick the 3-5 most representative products you found — a mix of established players and smaller indie-style tools. Read their feature pages, help documentation, and onboarding flows. What does the software track day to day? What triggers notifications? What does the user's workflow actually look like inside it? Look specifically for anything related to customer communication, scheduling, alerts, or status updates — these are the surfaces where SMS lives.

**Step 3 — Find real SMS use cases.**
Search "[sub-vertical] SMS notifications", "[sub-vertical] text message customers", and "[sub-vertical] SMS workflow" (adapt terms to the vertical). Look for case studies, help articles, SMS provider pages targeting this vertical, forum posts from business owners. What are real businesses in this category actually texting about? What sequences of messages do they send? What triggers each one?

**Step 4 — Find content restrictions and enforcement context.**
Search "[sub-vertical] SMS compliance" and "[sub-vertical] SMS carrier rules". Add anything meaningful not already in the research notes. Do not contradict the research notes — supplement them.

---

## LENGTH GUIDANCE

- What this builder is making: 3 sentences max
- Why they need SMS: 3 sentences max
- Message categories: ranked list, one line per category
- Workflows: no count limit — be exhaustive
- Message gaps: full format per gap including draft variants
- Content constraints: bullets only
- Disambiguation: 3-5 sentences or omit entirely
- Sources: bare URLs only

---

## OUTPUT FORMAT

Write exactly this structure. No preamble. No commentary after.

---

## [Sub-vertical name]
**Vertical:** [parent vertical]
**Bucket:** [Clear / Conditional / Not yet / Not yet maybe not ever]
**URL slug:** /for/[slug]

[If bucket is Not yet or Not yet maybe not ever, add this banner immediately after the bucket line:]
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
[3 sentences max. What does the software actually do operationally? Specific enough that a developer in this category would feel described. Grounded in steps 1-2. Reflects the full market shape, not just one product.]

### Why they need SMS
[3 sentences max. Specific moment, specific consequence, specific reason SMS wins. Grounded in step 3.]

### Message categories
[From the nine RelayKit categories, identify which apply to this sub-vertical and rank them by importance. Reason from the workflows you are about to document — do not accept any pre-assigned categories as given. Format:]

1. [category-id] — [one clause: why this is the primary category for this vertical]
2. [category-id] — [one clause: why this is secondary]
3. [continue for all relevant categories]

Excluded: [category-id] ([one clause: why it has no real use case here]), [continue for all excluded]

### Workflows
[Identify ALL meaningful workflows for this sub-vertical. Err toward completeness, not brevity. A workflow is any recognizable job-to-be-done sequence a builder in this category would plausibly need to send SMS for. If a real business in this vertical would build it, document it. Thin workflows (2 messages) and rich workflows (6+ messages) both belong. The UI will decide what to surface prominently — the research should capture everything worth having.

For each workflow:]

**[Workflow name]**
[One sentence: what job does this workflow do for the business?]
Sequence:
1. [corpus-category:message-id] — "[Display alias for this sub-vertical]" — [one clause: what it says and when]
2. [continue]

Variable aliases (only list variables where the default example would feel wrong for this sub-vertical):
- [variable_name]: "[contextual example]"

[Repeat for every workflow]

**Corpus message ID format:** category:message-id — e.g. appointments:confirmation, account-events:payment-failed. Must exactly match IDs in `docs/RELAYKIT_MESSAGE_CORPUS.md`. If a workflow needs a message not in the corpus, write GAP:[short-description] and flag it in Message gaps. If you use a corpus message but the body needs significant reframing, write STRETCH:[corpus-message-id] and flag it in Message gaps.

### Message gaps
[List every GAP and every STRETCH referenced in workflows above. For each:]

**GAP:[short-description]** or **STRETCH:[corpus-message-id]**
- **Classification:** [Universal miss / Vertical-specific / Stretch]
- **Proposed corpus home:** [category:proposed-message-id. If vertical-specific: "sub-vertical registry layer". If stretch: name the corpus message and describe the fit gap.]
- **Proposed universal name:** [what this message would be called in the corpus — plain English, consistent with corpus naming. If vertical-specific, write the display alias instead.]
- **Why:** [one clause — why universal, vertical-specific, or stretch]
- **Draft variants:** [For Universal miss and Stretch only. Skip for Vertical-specific.]
  - Standard: `[draft body — sender frame first, factual, "Reply STOP to opt out." at end, under 160 chars at worst-case substitution]`
  - Friendly: `[draft friendly variant]`
  - Brief: `[draft brief variant — "STOP to opt out." at end]`
- **New variables:** [Only if draft variants require a variable not in the corpus. Format: `{{variable_name}}` — description, budget chars, source, example. Otherwise omit.]
- **Status:** [FUTURE — only add this line if the entry's bucket is Not yet or Not yet maybe not ever]

### Content constraints
[Bullet list of plain rules a developer can act on. Grounded in research notes and step 4 findings. If Clear with no rules: "Standard carrier rules apply. No vertical-specific restrictions."]

### Disambiguation
[3-5 sentences. Neighboring sub-verticals, what tips Clear to Conditional, what a developer might think is allowed but isn't. Omit entirely if nothing meaningful.]

### Sources
[Bare URLs, one per line. Flag any section where you couldn't find real grounding with [NEEDS REVIEW].]

---

## QUALITY CHECKS

Fix all of these before submitting output:

- "What this builder is making" — could it describe three different sub-verticals? If yes, rewrite. Does it reflect the full market shape? If not, broaden it.
- "Why they need SMS" — specific moment, consequence, and reason SMS wins? If generic, rewrite.
- Message categories — reasoned from the workflows, not accepted from input? Rankings must reflect what the research found.
- Every corpus message ID verified against `docs/RELAYKIT_MESSAGE_CORPUS.md`? Any unverified ID is a GAP.
- Every workflow represents a real job a builder in this vertical would actually need? If theoretical, cut it.
- Every imperfect corpus fit flagged as STRETCH in Message gaps? No silent imperfect mappings.
- Every GAP and STRETCH has draft variants written in corpus style? Vertical-specific entries skip draft variants.
- Variable aliases only listed where the default example would feel wrong?
- Not yet / Not yet maybe not ever entries have the FUTURE banner and FUTURE status on all gaps?

---

## DRAFT VARIANT RULES

- Follow corpus conventions exactly — sender frame ({{workspace_name}} or {{business_name}}) first, factual body, "Reply STOP to opt out." at end (Brief: "STOP to opt out.")
- Single GSM-7 segment — under 160 characters at worst-case variable substitution
- No promotional content, no credentials in body
- Variable names must match existing corpus variables where possible
- Only propose a new variable if nothing in the corpus covers it — flag it explicitly as a new variable
```

---

### Prompt 2 — Orchestration prompt (changes each batch)

This tells the orchestrator which sub-verticals to research, where to write the output, and what commit message to use. Replace the bracketed sections for each batch.

```
You are the orchestrator. Spawn one sub-agent per sub-vertical below using the base research prompt. Collect all outputs and append each completed entry to [OUTPUT FILE PATH]. Write each entry as it arrives — do not wait for all sub-agents to finish.

[If this is the first batch for this family, add:]
Create the file first with this header:
# [Vertical Family Name] — Sub-vertical research
> Generated by CC sub-agents. PM review required before any entry is used for product decisions or marketing copy.
> Last updated: [DATE]

---

[If this is a subsequent batch appending to an existing file, add:]
Append to the existing file — do not overwrite or recreate the header.

---

## Sub-verticals to research

[Paste one block per sub-vertical, in this format:]

---
- Sub-vertical: [full name from Airtable]
- Bucket: [Clear / Conditional / Not yet / Not yet maybe not ever]
- Parent vertical: [family name]
- URL slug: /for/[slug]
- Research notes: [sanitized notes from Airtable — business context only, no internal policy reasoning]
- Constraint source: [value from Airtable]
- Bucket reason: [value from Airtable]

---

## Output file
[Write to / Append to]: [/docs/sub-verticals/[family].md]

## Commit instructions
When all sub-agents have completed and the file is fully written:
1. Stage [/docs/sub-verticals/[family].md]
2. Commit: `docs: add [Family] sub-vertical research — [batch description]`
3. Do not push — PM approves before push

## Quality gate before committing
- [Not yet / Not yet maybe not ever] entries have the FUTURE banner
- Every entry has a Sources section with real URLs
- Every entry has a Message categories section with ranked categories
- No corpus message ID used that doesn't exist in `docs/RELAYKIT_MESSAGE_CORPUS.md`
- Flag any failing entry in `.pm/AUDIT_NOTES.md` rather than committing it
```

---

## Step 3 — Run the batch

1. Paste Prompt 1 immediately followed by Prompt 2 in a single CC message — no separator needed, CC reads it as one instruction set
2. CC spawns sub-agents in parallel (one per sub-vertical) and writes entries to the file as they complete
3. Typical run time: 10-15 minutes for a batch of 8-10

**Batch sizing:**
- 8-10 sub-verticals per batch is the reliable range
- Split larger families (B2B SaaS at 18, Retail at 22) into two batches: Clear entries first, Conditional/Not yet second
- If a batch stalls or sub-agents fail silently, run a targeted follow-up for the missing entries rather than re-running the whole batch

---

## Step 4 — PM review checklist

After CC commits the batch, PM reads the file and checks:

**Structural checks (quick scan):**
- [ ] Every entry has all sections (What this builder is making, Why they need SMS, Message categories, Workflows, Message gaps, Content constraints, Sources)
- [ ] Every Not yet / Not yet maybe not ever entry has the `⚠️ FUTURE REFERENCE ONLY` banner
- [ ] Sources section has real URLs (not placeholders)
- [ ] No corpus message IDs that don't exist in `RELAYKIT_MESSAGE_CORPUS.md`

**Content checks (read each entry):**
- [ ] "What this builder is making" is specific — would a developer in this category feel described?
- [ ] "Why they need SMS" names a specific moment and consequence, not a generic claim
- [ ] Workflows are real jobs, not theoretical ones
- [ ] Message categories are ranked by what the workflows show, not what was pre-assigned

**Gap classification checks:**
- [ ] Universal misses are truly universal — would this message appear in 5+ sub-verticals?
- [ ] Vertical-specific entries are genuinely narrow — not just underserved universal misses
- [ ] STRETCHes are flagged where corpus messages need significant reframing, not just minor aliasing
- [ ] **Watch for double-counting:** an entry that uses a STRETCH in the workflow sequence AND declares a GAP for the same moment is double-counting. The workflow should use either the STRETCH or the GAP — not both. The e-signature entry in the B2B SaaS batch had this issue.

**If you find issues:**
- Minor (variable alias wrong, one sentence off): fix directly in the file via filesystem MCP `edit_file`, commit as `docs: fix [sub-vertical] entry — [brief description]`
- Structural (wrong GAP classification, double-counting, missing section): note in `.pm/AUDIT_NOTES.md` and decide whether to fix now or batch with other cleanup
- Systematic (the same issue appears across multiple entries): fix the base prompt before running the next batch

---

## Step 5 — Approve push

After PM review:

```
Mode: normal.
```

```
Push the last commit on main to origin. Do not force push.
```

---

## Step 6 — Corpus expansion (after all families are complete)

Once all 8 vertical family files are written and reviewed:

**1. Compile Universal misses across all files**

PM reads all 8 files (or instructs CC to grep for `Universal miss`) and compiles every Universal miss entry into a single list. Deduplicate — the same message pattern will appear in multiple sub-verticals. Count how many sub-verticals flagged each pattern.

**2. Decide which to add**

For each unique Universal miss pattern, decide:
- **Add to corpus** if it appears in 3+ sub-verticals and fits cleanly in an existing category
- **Add as a new category** only if the pattern is so distinct it doesn't belong in any existing category (rare)
- **Promote to sub-vertical registry** if on reflection it's genuinely narrow despite appearing in multiple entries

**3. Write the CC corpus expansion prompt**

```
Mode: normal.
```

```
Add the following messages to the RelayKit message corpus. For each message:
1. Add it to the correct file in `marketing-site/lib/message-library/[category].ts`
2. Follow the exact structure of existing messages in that file — id, name, tooltip, description, variables, variants
3. Use the draft variants below as the starting point — refine for corpus style consistency
4. Update `docs/RELAYKIT_MESSAGE_CORPUS.md` in the same commit to reflect the additions
5. Commit as: `feat(corpus): add [message names] to [category] category`

[Paste each Universal miss entry with its proposed corpus home, proposed name, and draft variants]
```

**4. Update the sub-vertical files**

After the corpus additions land, CC does a pass over the sub-vertical files to replace `GAP:[description]` entries in workflows with the new corpus IDs.

---

## Maintenance

**When to re-run research for a sub-vertical:**
- The bucket changes (e.g., Not yet → Conditional after a product decision)
- A new major product category emerges in the market
- The message corpus is significantly expanded and new workflows become possible

**When to update the base prompt:**
- A systematic quality issue appears across multiple batches
- The corpus structure changes
- The output format needs adjustment

**When to update this file:**
- The process changes in any meaningful way
- A new edge case is discovered that PM reviewers should know about

The base prompt and this process doc should stay in sync. If the prompt changes, update the copy in this file in the same commit.

---

## Known edge cases and gotchas

**Double-counting in gap entries (e-signature pattern)**
If a workflow sequence uses a STRETCH for a moment, and the Message gaps section then declares a GAP for the same moment, the entry is double-counting. The workflow should reference either the STRETCH or the GAP — not both. The fix: update the workflow sequence to use the GAP notation, remove the STRETCH entry, and keep the GAP's draft variants. Note this in `.pm/AUDIT_NOTES.md` when found.

**Universal miss vs. Vertical-specific borderline cases**
Some patterns that look vertical-specific are actually Universal misses in disguise. The test: can you describe the message in plain English without naming the vertical? If "payment due reminder" works without mentioning the vertical, it's universal. If you need "student absence alert" to describe it meaningfully, it's vertical-specific. When in doubt, classify as Vertical-specific and promote to Universal miss during the deduplication step if it recurs.

**Mention/notification gaps**
Several collaboration and communication tools (project management, team chat, community platforms) surface a `GAP:mention-notification`. This appears to be Vertical-specific in each individual entry but is arguably a Universal miss — any platform where users can @-mention each other needs it. Flag this for the corpus expansion session.

**SHAFT-adjacent verticals**
Not yet / Not yet maybe not ever verticals that are SHAFT-adjacent (adult content, gambling, alcohol) still get researched and documented. Their draft variants are marked `Status: FUTURE`. The research has value for future-proofing even if we don't serve them now.

**The 2FA carve-out**
Verification category messages carry NO STOP/HELP language. This is mandatory, not stylistic. Any draft variant for a verification-category GAP must omit the opt-out clause.

---

## File locations reference

| What | Where |
|---|---|
| Message corpus (ship truth) | `marketing-site/lib/message-library/` (one file per category) |
| Message corpus (PM reference) | `docs/RELAYKIT_MESSAGE_CORPUS.md` |
| Sub-vertical research files | `docs/sub-verticals/[family].md` |
| This process doc | `docs/sub-verticals/RESEARCH_PROCESS.md` |
| Audit notes | `.pm/AUDIT_NOTES.md` (gitignored) |
| Airtable base | `appxThB8UWmNulAMt` (RelayKit Constraints) |
| Sub-verticals table | `tblsTgbqncUJLtIqb` |
| Sub Vert Landing Pages table | `tblm9GiYRi1CWhcl2` |

---

*Last updated: 2026-06-20*
