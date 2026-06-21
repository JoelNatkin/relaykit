## Sweepstakes / contest platforms
**Vertical:** Retail & hospitality
**Bucket:** Not yet maybe not ever
**URL slug:** /for/sweepstakes
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Software that runs prize promotions — text-to-win sweepstakes, skill-based contests, and prize-linked savings/raffle programs (e.g. credit-union "Save to Win") — where participants enter for a chance to win and the platform handles entry capture, randomized draws, winner selection, and official-rules administration. The builder is typically a marketing/promotions platform, a brand's campaign tool, or a fintech running prize-linked deposits. SMS is the entry channel and the winner channel, often via keyword-to-shortcode entry and automated draws.

### Why they need SMS
Entry happens on SMS (text a keyword to enter) and winners are notified on SMS, where a win is time-sensitive and a claim window can lapse if missed. A winner who doesn't see the notice forfeits the prize, which creates a fairness and dispute problem the operator must avoid. SMS is the only channel that reaches the entrant at the same identity they entered with, fast enough to beat the claim deadline.

### Message categories
1. waitlist — entry confirmation, draw-pending, "you won / claim by" claim-window mechanics map almost exactly onto the waitlist claim lifecycle
2. account-events — entry-account lifecycle and program status (suspended for rule violation, eligibility confirmed)
Excluded: marketing (the prize promotion itself is the regulated object — promotional offer bodies would compound the gambling-adjacency review, not the use case we'd register), order-updates (no fulfillment), appointments (no scheduling), team-alerts (no ops layer), customer-support (generic, not entry-specific), verification (entrant phone proof reuses the universal code — no vertical workflow), community (no membership layer)

### Workflows

**Entry confirmation**
Confirms a valid entry was received and counted, with no purchase implied.
Sequence:
1. waitlist:joined — "Entry received" — sent the moment a keyword entry or AMOE (alternate method of entry) entry is recorded; confirms the entry is counted and the entrant is in the draw

**Draw scheduled / reminder**
Tells entrants when the drawing happens so a winner is reachable at draw time.
Sequence:
1. waitlist:position-update — "Draw status" — STRETCH: communicates draw timing/standing without implying odds or purchase value
Variable aliases:
- queue_position: "entered — drawing {{draw_date}}"

**Winner notification + claim window**
Notifies the selected winner and opens the time-boxed claim window.
Sequence:
1. waitlist:your-turn — "You won — claim your prize" — sent when the entrant is drawn; links to the claim/verification step
2. waitlist:grace-expiring — "Claim window closing" — sent as the claim deadline approaches; restates time left to claim
3. waitlist:missed — "Claim window closed" — sent when the window lapses without a claim; an alternate winner may be drawn

**Non-winner / draw-closed notice**
Closes the loop for entrants who were not selected (optional, operator-configurable).
Sequence:
1. GAP:draw-result-not-selected — "Draw result" — sent after the draw to entrants not selected; factual close, no promotional content

**Eligibility / rule-violation status**
Communicates a change to an entry's standing — e.g. duplicate entries voided, eligibility not met, entry disqualified per official rules.
Sequence:
1. account-events:account-suspended — "Entry status" — sent when an entry or entrant account is disqualified or held under the official rules
Variable aliases:
- account_link: "{{rules_link}}"

**Prize-linked savings draw (fintech variant)**
For prize-linked savings / savings-promotion raffles, confirms a deposit earned a draw entry and notifies prize winners.
Sequence:
1. waitlist:joined — "Entries earned" — sent when a qualifying deposit credits draw entries for the period
2. waitlist:your-turn — "You won a savings prize" — sent when the account holder wins the periodic draw

### Message gaps

**GAP:draw-result-not-selected**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Draw result"
- **Why:** sweepstakes need a neutral, non-promotional "you were not selected" close that no existing category carries
- **Status:** FUTURE

**STRETCH:waitlist:position-update**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:position-update — fit gap: corpus body frames movement up a service queue; a draw "standing" is a count of entries / a draw date, not a literal position, so the body needs reframing to avoid implying improving odds
- **Proposed universal name:** Position update (display alias "Draw status")
- **Why:** reuses the queue-standing shape for draw timing without inventing a message, but must not imply purchasable advantage
- **Draft variants:**
  - Standard: `{{workspace_name}}: You're entered in the {{event_name}} draw. Winners are drawn {{event_time}}. We'll text you if you win. Reply STOP to opt out.`
  - Friendly: `You're in the {{event_name}} draw at {{workspace_name}}. Winners are picked {{event_time}} - we'll text if it's you. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: entered in {{event_name}}. Winners drawn {{event_time}}. STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Gated because sweepstakes are a TCR Special / restricted use case adjacent to gambling — TCR/CTIA treat sweepstakes, sports picks, and 50/50 raffles as prohibited or special-category content on 10DLC; many carriers reject sweepstakes campaigns outright, and others require an explicit attribute declaration and brand-level vetting.
- This is SHAFT-C proximity (the "G" — gambling — within the broader SHAFT-C prohibited set). The legitimacy of a given promotion turns on whether it is a lawful sweepstakes/contest or an unlawful lottery, and the carrier/aggregator cannot easily tell the two apart from message content — so the whole category draws scrutiny.
- The legal line is the three-element test: a lottery = prize + chance + consideration. Remove consideration (offer a free Alternate Method of Entry, no purchase necessary) → lawful sweepstakes. Remove chance (winner by skill) → lawful contest. If all three are present, it is an illegal lottery / gambling, which RelayKit must never carry.
- "No purchase necessary" and a working AMOE are legal safeguards, not copy — they must hold for every entry path, including the SMS path. Consideration can be more than money (a purchase requirement, or extensive required effort), so message-driven entry mechanics must not become consideration.
- State sweepstakes registration + bonding applies above prize-value thresholds: NY and FL require registration + surety bond + trust account when aggregate prize value exceeds $5,000 (filed in advance); RI requires registration above $500 for physical-outlet promotions (no bond). This is an operator obligation, but it sets the legal-review bar before RelayKit could carry the traffic.
- Any onboarding here would require legal review of the specific promotion's mechanics (consideration/chance/prize, AMOE, official rules) plus carrier attribute declaration — a per-customer burden, not a self-serve flow.
- No promotional/offer language in any entry or winner body; keep bodies factual and entry-status only. Winner bodies must not state cash-equivalent value or odds in-line.

### Disambiguation
A lawful sweepstakes (prize + chance, no consideration, with a free AMOE and "no purchase necessary") and a lawful contest (prize + skill, no chance) are legitimate, widely-run promotions — distinct from an illegal lottery, which has all three elements (prize + chance + consideration) and is gambling reserved to the states, and which RelayKit must never carry. The problem is that a carrier reading an SMS body cannot reliably tell a compliant sweepstakes from an out-of-compliance one: the line lives in the mechanics (is there real consideration? is the AMOE real?), not in the words, so TCR/CTIA gate the entire category as gambling-adjacent (SHAFT-C "G"). That puts the burden on RelayKit to verify each promotion's mechanics, official rules, AMOE, and any state registration/bonding before carrying a single message — a per-customer legal review, not a self-serve onboarding, which is why it sits in Not-yet-maybe-not-ever. What would move it: a carrier/TCR-blessed registration path for sweepstakes with an attribute declaration, plus an intake gate that confirms no-purchase-necessary + AMOE + official rules (and a clean separation from any prize-linked-deposit variant that touches financial-product scrutiny) — at which point it could move to Conditional.

### Sources
https://www.slicktext.com/features/text-to-win-contests
https://simpletexting.com/features/text-to-win/
https://sakari.io/use-cases/text-sweepstakes
https://thesocialmedialawfirm.com/blog/sweepstakes-law/the-three-elements-of-an-illegal-lottery-prize-chance-and-consideration/
https://ussweeps.com/about-us/blog/sweepstakes-law/sweepstakes-101/
https://www.10dlc.org/en/shaft
https://www.bandwidth.com/support/en/articles/12823087-10dlc-campaign-use-cases
https://help.twilio.com/articles/15778026827291-Why-Was-My-A2P-10DLC-Campaign-Registration-Rejected-
https://kleinmoynihan.com/sweepstakes-registration-and-bonding-requirements-2/
https://www.sweeppeasweeps.com/official-rules-center/which-states-require-sweepstakes-registration/
https://en.wikipedia.org/wiki/Prize-linked_savings_account
https://www.filene.org/be-a-part-of-something/labs-i3/prize-linked-savings
https://thefinancialbrand.com/news/checking-accounts/save-to-win-credit-union-sweepstakes-25435
