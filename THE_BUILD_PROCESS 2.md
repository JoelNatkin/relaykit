# The Build Process
## A methodology for solo builders working with AI coding agents
### Derived from the RelayKit build — February–March 2026

---

## The Process in One Sentence

Build the bones first without designing anything. Get back raw functionality. React to what exists. Brainstorm the UX you actually want based on what you've learned. Prototype it. Then apply the design to what's already built.

---

## Why This Works

The traditional process — wireframe → design → build → discover it doesn't work → redesign → rebuild — has two expensive wrong turns baked in. You design before you know what the data looks like. You build to a design that turns out to be wrong. Both corrections cost time.

This process eliminates both. You build first, so you know what's real. You design second, so your design reacts to reality. The prototype proves the design before you touch production code. And when you apply the design, you're rearranging existing components — not rebuilding from scratch.

---

## The Five Phases

### Phase 1: Spec Everything Before Writing Code

Write the full product specification before CC touches a line of code. This isn't a loose plan — it's detailed PRDs, one per feature area, with data models, screen-by-screen behavior, copy decisions, and explicit constraints.

**What you produce:**
- A master project overview (one document, read first in every session)
- Numbered PRDs per feature area (fed to CC one at a time as the relevant build step begins)
- A decisions log (DECISIONS.md — every architectural, copy, and scope decision, numbered and immutable)
- Standing instructions for CC (CLAUDE.md — constraints, vocabulary, design system, session protocol)
- Experience principles (voice, tone, vocabulary — the emotional design of every user-facing string)

**Why front-load this much:**
- CC builds faster and more accurately from a detailed spec than from conversation
- Decisions made during speccing are recorded *before* they can be lost in a build session
- PRDs become the connective tissue between sessions — CC reads the file, not your memory
- You discover contradictions on paper (cheap to fix) instead of in code (expensive to fix)

**The audit step:** After all PRDs are written, run a cross-document audit. Check for circular references, stale terminology, schema conflicts, and Phase 2 scope leaks. Fix them before building. This sounds tedious but catches problems that would otherwise surface as confusing CC behavior weeks later.

### Phase 2: Build the Bones

Build every feature in the spec, in order, without worrying about UX polish, animations, or visual design. The goal is working functionality — data flows correctly, screens render, the pipeline works end-to-end.

**How it works:**
- Follow a strict build order. Each step maps to one PRD.
- Feed CC one PRD at a time. Never dump all docs at once.
- CC produces a build plan before writing code. You review the plan first.
- Atomic commits with descriptive messages after every logical unit.
- Session rotation at build step boundaries (new CC session for each PRD, handoff notes at every transition).

**What you're building for:**
- Does the data model work?
- Does the pipeline connect end-to-end?
- Do the screens render with real data?
- Can you click through the flow?

**What you're NOT building for:**
- Does it look good?
- Does it feel smooth?
- Is the information architecture right?
- Are the animations polished?

Those questions come later, and they're *better* questions when you've already seen the raw product.

**The PM layer:** While CC builds, a separate PM/architect process (a browser chat with an AI, or your own judgment) reviews CC's output, catches scope creep, enforces decisions, and maintains continuity between sessions. CC is the hands; the PM is the brain.

**Session hygiene matters more than you think.** AI sessions degrade. Context compacts. Decisions get forgotten. The countermeasure is aggressive rotation — new sessions at natural boundaries — with handoff documents that carry context forward. Two handoff docs: one for the coding agent (what was built, what's in progress, gotchas) and one for the PM layer (where we are, what's next, watch items). Without these, every session starts cold. With them, every session starts warm.

### Phase 3: Smoke Test and Harden

Before designing anything, verify the raw build works. Click through every flow. Call every API endpoint. Test the failure paths.

**What you're looking for:**
- Broken flows (buttons that don't navigate, forms that don't submit)
- Data integrity issues (state not persisting, schemas not matching)
- Silent failures (opt-outs not recording, webhooks not firing)
- Race conditions (what happens if two things hit the same endpoint simultaneously?)

**Fix everything that's broken before moving on.** Design work on top of broken functionality is wasted effort. The product doesn't need to be pretty yet, but it needs to *work*.

### Phase 4: Brainstorm the UX

This is the creative phase. You've seen the raw product. You know what the data looks like, where the friction is, what feels redundant, what's missing. Now you design — not from assumptions, but from experience.

**How it works:**
- Open an unhurried conversation. No build pressure. No CC prompts. Just thinking.
- React to what you've seen. "Messages in two places feels junky." "The phone verification card doesn't need to be permanent." "The compliance tab shouldn't exist before registration."
- Follow threads. One observation leads to another. Redundancy leads to consolidation leads to a new information architecture leads to a new flow.
- Make decisions and name them. "The consent form preview is the primary left-column element." "Signup happens at the API key request, not at entry." "Top nav CTA only — no sticky bottom bar."
- Research when needed. If you're unsure about a pattern (sticky bottom bars, chatbot UX), look into it before committing.

**What you produce:**
- A UX prototype spec — the complete flow narrative, screen-by-screen, with animation language, component inventory, and every decision documented
- A decisions log update — new entries for everything decided in this session

**The key insight:** This phase works because you're reacting to reality, not designing in the abstract. Every decision is grounded in something you actually saw or felt while using the raw product. "Phone verification should be a modal" is an obvious conclusion once you've stared at a dashboard with too many permanent cards. You'd never reach that conclusion from a wireframe.

### Phase 5: Prototype, Then Apply

Build the new UX as a standalone prototype — same stack, separate directory, no database, no auth, no API calls. Hardcoded data, fake state, pure UI with real animations.

**Why prototype separately:**
- Zero risk to production code
- CC can move fast without worrying about breaking working features
- You can iterate aggressively — throw away screens, rearrange flows, try different approaches
- The prototype becomes the visual spec when it's time to apply changes to the real build

**How to apply:**
- Once the prototype feels right, it becomes the reference implementation
- The production build already has the components, data flows, and routing — you're rearranging and adding animation, not rebuilding
- Update the PRD to reflect the new UX before CC touches production code
- Apply changes incrementally — one screen at a time, with commits between each

---

## The Rhythm

| Phase | Duration | Pressure | Output |
|-------|----------|----------|--------|
| Spec | Days | Low — get it right | PRDs, decisions, principles |
| Build | Days to weeks | Medium — steady, sequential | Working features, committed code |
| Smoke test | Hours | High — find everything | Bug list, fixes |
| Brainstorm | Hours | None — unhurried, exploratory | UX spec, new decisions |
| Prototype | Days | Medium — iterative | Clickable prototype, then production application |

The process is not strictly linear. You might cycle back from brainstorming to speccing (if you discover the information architecture needs to change fundamentally). You might prototype one section while building another. But the general direction is always: spec → build → test → design → apply.

---

## The Repo File System: Infrastructure for Continuity

AI coding sessions are ephemeral. Context windows fill up, compact, and lose nuance. The solution is a set of purpose-built files that live in the repo and carry intelligence between sessions. These aren't documentation for humans — they're infrastructure for AI agents.

### CLAUDE.md — Standing Instructions

Lives at the repo root. CC reads this automatically at the start of every session. It contains everything CC needs to know that isn't in a specific PRD: platform constraints that never change, vocabulary rules, design system references, the DECISIONS.md protocol, session hygiene instructions, and explicit "never do this" guardrails.

Think of it as the constitution. PRDs are legislation — they change per feature. CLAUDE.md is the foundational law that governs all sessions regardless of what's being built.

**What belongs here:**
- Architectural decisions that apply everywhere (auth method, API patterns, encryption approach)
- Copy rules (words to use, words to avoid, the one-sentence principle for explanatory text)
- Phase 2 boundaries (what CC must never build, regardless of what a PRD seems to imply)
- The DECISIONS.md check protocol (when to read it, when to flag conflicts, when to append)
- Session start and end rituals

**What doesn't belong here:** Anything specific to one feature. That goes in the PRD.

### DECISIONS.md — The Decision Log

Lives at the repo root. Sequential numbered entries (D-01, D-02, ...) recording every architectural, copy, UX, and scope decision. Each entry includes the decision, the reasoning, and the date.

**Why this exists:** AI sessions forget. A decision made in Session 3 about campaign expansion language ("never say upgrade") will be violated in Session 12 unless it's written down where CC can find it. DECISIONS.md is the institutional memory that no single session can hold.

**The protocol:**
- Every CC session starts with `DECISIONS CHECK` — CC reads the full file and confirms the count
- Before CC implements anything touching architecture, data model, pricing, or user-facing copy, it checks DECISIONS.md for relevant entries
- When CC detects a conflict, it stops and surfaces it: "This contradicts D-14. Do you want to override?"
- When a new decision is made during a session, it's appended immediately — not batched at session end
- The PM layer watches for decision moments in conversation ("let's do X instead of Y") and tells the builder to have CC record them

**The discipline:** Decisions are append-only. You don't edit old entries — you add new ones that supersede them. The log is a timeline, not a wiki.

### CC_HANDOFF.md — Coding Agent Continuity

Lives at the repo root. Written by CC at the end of every session, overwriting the previous version. It's a structured note from the current CC session to the next one.

**What it contains:**
- What was completed this session (list of commits)
- What's in progress or partially done
- Gotchas, edge cases, or decisions made that the next session should know
- Files modified but not yet committed
- Any new DECISIONS.md entries added this session

**The protocol:**
- Before closing any CC session, the builder tells CC: "Write CC_HANDOFF.md before we close"
- The next CC session reads it immediately after DECISIONS.md: `DECISIONS CHECK — Read DECISIONS.md before proceeding. Then read CC_HANDOFF.md for context from the last session.`
- CC should confirm both: decision count and a summary of where things left off

**Why it matters:** Without this, every new CC session starts by re-reading the PRD and guessing what's been built. With it, CC knows exactly where the last session stopped, what's working, and what to watch out for.

### PM_HANDOFF.md — PM Layer Continuity

Lives outside the repo (in project knowledge, uploaded to new chats, or kept locally). Written by the PM layer at the end of each browser chat session.

**What it contains:**
1. Where we are in the build order — which phase, which step, which sub-step
2. What was completed since the last handoff
3. Active decisions or open questions the next session needs to pick up
4. The exact prompt to give CC next — ready to paste
5. Watch items — specific things being tracked (decision conflicts, copy issues, schema concerns)
6. DECISIONS.md status — current count, new entries this session, entries that may need revisiting

**Why it matters:** The PM layer has the same context degradation problem as CC. A new browser chat doesn't remember what the last one was tracking. PM_HANDOFF.md transfers the PM's working memory — priorities, concerns, judgment calls in progress — so the next instance picks up without the builder re-explaining anything.

### The PRD Files — One Per Feature

Live in a `docs/` directory. Each PRD is a complete, standalone spec for one feature area. CC reads exactly one PRD per build step — never multiple at once unless explicitly told to cross-reference.

**Key discipline:**
- PRDs are only added to CLAUDE.md's reference section when CC actually begins building that component
- The builder (or PM layer) feeds PRDs to CC at the right moment — too early creates noise, too late creates gaps
- If a PRD references another PRD, it should cite the specific section, not assume CC has read the other file

### Experience Principles — The Voice Document

Lives in `docs/`. Read by CC before writing any user-facing string — UI labels, error messages, email copy, status text, button text, helper text, everything.

**What it contains:** The product's emotional design. A vocabulary table (words to use, words to avoid). A framing shift table (how to reframe compliance constraints as developer empowerment). An emotional states map (what the user feels at each screen, and what the product's job is in response). The one-sentence principle (explanatory copy is one sentence maximum, never a paragraph).

**Why it's separate from CLAUDE.md:** CLAUDE.md is about constraints and protocol. Experience Principles is about voice and feeling. CC needs both, but they serve different purposes and change at different rates.

---

## Session Management: When and How to Rotate

### When to start a new CC session

**Hard triggers (always rotate):**
- A build step is complete and the next one begins
- CC starts giving vague or contradictory answers, or needs to be told the same thing twice
- The session exceeds ~60 back-and-forth exchanges
- A major sub-phase within a large build step completes

**Soft triggers (use judgment):**
- Switching from building components to writing copy-heavy screens
- CC has read multiple large files and you're about to feed it another
- The builder says "CC seems confused"

**The rotation ritual:**
1. CC commits everything that's working
2. CC reviews DECISIONS.md and appends any unrecorded decisions
3. CC writes CC_HANDOFF.md
4. Builder opens a fresh CC session
5. Builder pastes: `DECISIONS CHECK — Read DECISIONS.md before proceeding. Then read CC_HANDOFF.md for context from the last session.`
6. CC confirms decision count and handoff summary
7. Builder gives the next task prompt (provided by the PM layer)

### When to start a new PM chat

**Hard triggers:**
- A full build step is complete and the next one begins
- The chat crosses ~40–50 exchanges
- Starting a new work session (different day, long break)

**Soft triggers:**
- The PM starts repeating guidance it already gave
- The PM gives an answer that doesn't account for something discussed earlier
- The conversation has accumulated review output that's no longer relevant

**The rotation ritual:**
1. PM writes PM_HANDOFF.md
2. Builder uploads it to the new chat (or it's available in project knowledge)
3. New PM confirms where things are and gives the next CC prompt

### The typical session flow

1. Builder opens a new PM chat, uploads PM_HANDOFF.md
2. PM confirms where we are and gives the opening CC prompt
3. Builder opens a new CC session, pastes DECISIONS CHECK + CC_HANDOFF.md read
4. CC confirms, builder gives it the task prompt
5. Builder and CC work; builder checks in with PM for reviews, decisions, and guidance
6. When a rotation trigger hits, PM tells the builder — handoffs are written, sessions rotate, work continues

The handoffs are the connective tissue. Without them, every session starts cold. With them, every session starts warm. The five minutes spent writing a handoff saves thirty minutes of re-explaining context in the next session.

---

## What Makes This Work for Solo Builders

**Separation of concerns.** The PM layer handles ambiguity, judgment, and continuity. The coding agent handles implementation. You handle final decisions and visual review. Each role stays in its lane.

**Documentation as infrastructure.** PRDs, decisions logs, handoff notes, and standing instructions aren't overhead — they're the connective tissue that lets AI sessions start warm instead of cold. Every minute spent documenting saves five minutes of re-explaining.

**Building before designing.** You can only make good design decisions about something that exists. The raw build gives you the material to react to. The design phase is faster and more accurate because you're working with reality, not imagination.

**Prototyping before applying.** The prototype is cheap insurance. It proves the UX without risking production code. When it works, applying it to the real build is a reshuffling job, not a rebuild.

---

## The Anti-Patterns

**Designing first.** You'll design for data shapes and flows that turn out to be wrong. The correction is expensive.

**Building everything in one session.** Context degrades. Rotate sessions aggressively with handoff documents.

**Letting the coding agent make architectural decisions.** CC proposes. You (or the PM layer) approve. Every "I think we should..." from CC is a decision moment that needs to be caught and recorded.

**Skipping the audit.** Cross-document contradictions become confusing CC behavior. Catch them on paper.

**Batching commits.** One logical unit per commit. If you can't describe what changed in one sentence, it's too big.

**Treating documentation as a post-build activity.** Documentation is a pre-build and during-build activity. Post-build documentation is archaeology.
