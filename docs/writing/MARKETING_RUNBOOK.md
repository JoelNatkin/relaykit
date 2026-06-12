# Marketing Runbook — weekly blocks

> **Purpose:** The exact steps for each recurring marketing block, so no block requires rethinking. Joel opens a block by typing its trigger to PM; PM walks it one step at a time from this file.
>
> Belongs here: block steps, triggers, definitions of done. Doesn't belong: strategy (MARKETING_STRATEGY.md), voice rules (VOICE_AND_PRODUCT_PRINCIPLES_v2.md §3 STP), post ideas (PM_HANDOFF / BACKLOG).
>
> Updated: June 12, 2026

## Triggers

| Joel types | Block | Cadence |
|---|---|---|
| `mk: replies` | Intent replies | Mon–Fri, 20 min |
| `mk: post` | Weekly post | Tuesday |
| `mk: makerkit` | Makerkit presence | Thursday |
| `mk: beta` | Beta pipeline | Thursday |
| `mk: invites` | Beta invites | One-time, T-2 weeks before beta |

All writing in every block follows STP (VPP v2.1 §3). In communities: answer the actual question first; mention RelayKit only when it genuinely answers what was asked.

## mk: replies (daily, 20 min)

1. Open the F5Bot Gmail folder.
2. Scan every alert. Discard non-fits (archive the email).
3. Pick at most 2 threads worth answering.
4. Draft the reply with PM — answer the question asked, concrete, no pitch unless the free tool genuinely answers it.
5. Post it. Log any beta-worthy author to the Airtable candidate list (paste the thread link to PM; PM logs it).
6. Archive remaining emails.

**Done = the folder is empty.** Hard stop at 20 minutes — unfinished threads wait for tomorrow.

## mk: post (Tuesday)

1. Tell PM `mk: post`. PM brings the week's candidate topics (from PM_HANDOFF watch items, recent replies-block threads, build progress).
2. Pick one. Draft with PM in STP voice — capability-first, product as punchline.
3. Publish on Indie Hackers (Building in Public or SaaS Marketing — never Show IH before launch).
4. Mirror to relaykit.ai/blog 3–7 days later: add a calendar reminder or hand CC the MDX at the next session.
5. Drop the IH link in PM_HANDOFF (PM logs).

**Done = published on IH.** Mirror is a follow-up, not part of the block.

## mk: makerkit (Thursday, first half)

1. Open the Makerkit shell project; continue building RelayKit's app shell on it (real work, Phase 5/6 prep).
2. When you hit friction or a question — ask it in the Makerkit Discord as a user. When you can answer someone else's question, answer it.
3. No RelayKit promotion. Identity: a developer building a real product on Makerkit. The solution-provider reveal happens only when someone raises SMS/texting.

**Done = one commit on the shell project OR one genuine Discord interaction.**

## mk: beta (Thursday, second half)

1. Open the Airtable Beta candidates table (PM reads it on request).
2. Update statuses — anyone replied? Any thread worth a follow-up comment?
3. Add candidates surfaced during the week that weren't logged.
4. If under ~15 candidates: spend the remainder in r/SaaS / r/SideProject looking for SMS-pain threads (same rules as mk: replies).

**Done = every row's status is current.**

## mk: invites (one-time, T-2 weeks)

1. PM pulls the candidate list, sorted by warmth.
2. Draft one personal invite per person with PM — reference their actual thread/pain, plain ask, no template smell.
3. Send via the venue you met them in (Reddit DM, IH comment, Discord). Track status → `invited` in Airtable.

**Done = every warm candidate invited.**
