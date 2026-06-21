## Web3 / DAO governance & coordination tooling
**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/web3-dao
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A platform or app for decentralized-organization coordination: off-chain and on-chain proposal voting (Snapshot, Tally, Aragon), multisig treasury management (Safe / Gnosis Safe, KeeperHub), and delegation tooling. The software tracks proposals, votes, quorum progress, treasury movements, and signer thresholds, and surfaces them to token holders, delegates, and multisig signers. The builder is typically wiring governance events to a notification layer to fight the chronic problem that fewer than 1% of governance-token holders actually vote.

### Why they need SMS
Adoption is genuinely thin: web3 notifications today live almost entirely in Discord, Telegram, wallet push (Push Protocol), and email, not SMS. The one real SMS use case is escalation — Notifi pioneered "bug you to vote" flows on Solana Realms that start in Discord/Telegram and escalate to text or phone call when a proposal nears quorum or a multisig transaction is stuck waiting on a signer, because those are the moments where a missed message means a failed vote or frozen funds. SMS would win only at that last-mile escalation tier, and even there it is largely blocked at the carrier level (see Content constraints), which is the core reason this sub-vertical is gated.

### Message categories
1. team-alerts — closest fit for the action-required core: quorum-at-risk, a multisig transaction pending your signature, treasury-movement alerts. These behave like threshold/escalation pings, not community chatter.
2. community — governance announcements, proposal-passed/failed news, member-facing org updates map cleanly to community announcement/moderation/event-reminder shapes.
3. verification — sensitive-action confirmation codes (e.g. confirming a vote-delegation change or a multisig owner change) fit the Confirmation code carve-out.
Excluded: order-updates (no fulfillment), appointments (no scheduling), waitlist (no queue), marketing (no promo here, and crypto promo is carrier-prohibited), customer-support (a real but secondary surface, not governance-specific), account-events (SaaS billing lifecycle, not on-chain governance).

### Workflows

**Vote-open / proposal-live reminder**
Tells a token holder a new proposal is open and asks them to vote before it closes.
Sequence:
1. community:community-announcement — "New proposal live" — fires when a proposal goes on-chain or to Snapshot; links to the proposal page.
2. GAP:proposal-vote-deadline — "Voting closes soon" — fires when the window is near its end and the member has not yet voted.
Variable aliases (only where the default example would feel wrong):
- announcement_link: "the proposal on Snapshot"

**Quorum-at-risk escalation**
Warns active voters/delegates that a live proposal will fail for lack of quorum unless more votes land.
Sequence:
1. team-alerts:system-alert — "Quorum at risk" — severity-cued alert that turnout is below the threshold with time remaining.
2. team-alerts:escalation-ping — "Vote needed to reach quorum" — escalates to delegates if turnout stays short (this is the Notifi "escalate to text" moment).
Variable aliases (only where the default example would feel wrong):
- severity: "Quorum risk"
- alert_type: "Turnout below quorum"
- system_name: "Proposal {{proposal_id}}"
- escalation_to: "delegates"

**Proposal result (passed / failed)**
Notifies the org of the outcome once voting closes.
Sequence:
1. community:community-announcement — "Proposal result" — fires at close with pass/fail and the link to the result and any execution next steps.

**Multisig signature required**
Tells a Safe signer a treasury transaction is pending and waiting on their approval to reach the M-of-N threshold.
Sequence:
1. team-alerts:escalation-ping — "Signature needed" — a pending transaction lacks quorum of signers; reply/act to approve before it stalls.
Variable aliases (only where the default example would feel wrong):
- severity: "Action needed"
- system_name: "Treasury Safe"
- escalation_to: "the next signer"

**Treasury movement alert**
Notifies signers/stewards when funds leave (or a large transfer executes from) the treasury.
Sequence:
1. team-alerts:system-alert — "Treasury movement" — severity-cued alert that an outbound or threshold-crossing transaction executed, with a link to the explorer/Safe view.
Variable aliases (only where the default example would feel wrong):
- severity: "Treasury"
- alert_type: "Outbound transfer"
- system_name: "Treasury Safe"

**Delegation change confirmation**
Confirms a sensitive governance action — a member delegated or re-delegated their voting power, or a multisig owner set changed.
Sequence:
1. verification:confirmation-code — "Confirm delegation change" — sent before the delegation/owner change is finalized.

### Message gaps

**GAP:proposal-vote-deadline**
- **Classification:** Vertical-specific
- **Proposed corpus home:** community
- **Proposed universal name:** (vertical-specific — no universal name)
- **Why:** a "your window to act closes soon, and you haven't acted" nudge tied to a governance voting deadline has no clean corpus equivalent (waitlist:grace-expiring is queue-shaped, not vote-shaped).
- **Status:** FUTURE

### Content constraints
- US and Canadian carriers blanket-block cryptocurrency-related SMS content from A2P sender numbers (the change took effect August 2024); Twilio and other providers stopped delivering crypto alerts to US/CA numbers as a result. This is the central reason the sub-vertical is gated.
- "Cryptocurrency" is an explicit disallowed category for toll-free number verification (Twilio error 30464) and a high-risk financial-services category under 10DLC; campaigns mentioning crypto are blanket-prohibited or require special vetting and rarely clear carrier review.
- TCR treats crypto/high-risk financial content as a Special / heavily-scrutinized category; even governance-only messaging risks being filtered (error 30007) if the brand or content reads as crypto-adjacent.
- SHAFT (sex, hate, alcohol, firearms, tobacco) does not apply to governance content, but crypto is its own separately-enforced high-risk content lane — passing SHAFT does not clear the crypto block.
- No token-price, trading, investment, airdrop, or financial-advice content in any body. No wallet seed phrases, private keys, or credentials in any body.
- International SMS and voice are unaffected by the US/CA crypto block, so any near-term viability is non-US — which deepens the gating for a US-carrier-first product.

### Disambiguation
DAO tooling looks like a blend of team-alerts (action-required threshold/escalation pings on quorum, signatures, and treasury) and community (governance announcements and results), but it is gated separately from both because of the content domain, not the message shape. A general team-alerts customer running ordinary on-call or infra alerts clears carriers fine; the identical message shape carrying governance-of-a-crypto-treasury context can be filtered or blocked because US/CA carriers treat cryptocurrency as a disallowed/high-risk SMS category as of August 2024. That carrier-level crypto block — not any RelayKit policy — is why this stays "Not yet, maybe not ever": the workflows are real and the message shapes already exist in the corpus, but the channel itself is largely closed for crypto content on US carriers. If the carrier landscape changes, the right move is to reclassify, not to rebuild — the workflows above port directly onto team-alerts, community, and verification.

### Sources
https://blog.sablier.com/dao-governance-voting-tools-the-ultimate-guide-2024
https://www.dextools.io/tutorials/what-is-snapshot-dao-governance-voting-guide-2026
https://daodigest.com/top-5-governance-token-voting-platforms-compared/
https://yellow.com/learn/what-are-dao-tools-and-how-to-choose-2025-platform-guide-for-governance-and-treasury-management
https://cointelegraph.com/news/solana-daos-can-now-bug-you-to-vote-with-phone-calls-and-texts
https://onchaintreasury.org/2025/09/19/best-practices-for-multisig-wallets-in-dao-treasury-management/
https://keeperhub.com/daos
https://safe.global/
https://zenao.io/blog/multi-signature-wallets-improve-dao-governance
https://cryptocurrencyalerting.com/guide/sms-alert-warning.html
https://www.twilio.com/docs/api/errors/30464
https://help.twilio.com/articles/360045004974-Forbidden-Message-Categories-in-the-US-and-Canada-Short-Code-Toll-Free-and-Long-Code
https://www.twilio.com/docs/api/errors/30007
https://www.10dlc.org/en/TFNDisallowedContent
https://textbolt.com/blog/10dlc-compliance/
