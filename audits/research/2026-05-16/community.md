# Community — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** ACCOUNT_NOTIFICATION
**Classification:** hybrid (5 discrete subs + 1 onboarding workflow) — validates VERTICAL_TAXONOMY_DRAFT §4 Redefine path
**Authored by:** PM (Session 92)

## 1. Industry pattern observations

Per VERTICAL_TAXONOMY_DRAFT §4, Community was redefined away from TCR's Social category (Special, vetted, off-limits at launch per §3 settled call) toward business-to-community messaging — a business sending SMS to its community members. The traffic shape is ACCOUNT_NOTIFICATION: confirmations of community-membership events that the recipient already opted into. This research validates that redefinition holds across observed patterns.

Reference apps observed:
- Community SaaS proper: Circle, Mighty Networks, Skool, Tribe
- Cohort/learning communities: Maven, Reforge (defunct but pattern persists in Maven-style platforms)
- Newsletter/creator communities: Substack chats, Beehiiv community features, Patreon
- Slack/Discord-with-SMS-bridge patterns: rare, integration-driven, not native to a SaaS product

Volume per recipient is generally low (1-2 messages per week max in healthy communities; daily SMS quickly trips opt-out). Messages cluster around recurring events (live cohort sessions, monthly meetups, weekly Q&As) and standalone moments (welcome, milestone, urgent moderation update).

Community SMS is most often paired with email — SMS reserved for "you should look at this now" moments, email for everything else. This constrains the message set: each Community sub should justify being SMS rather than email.

The §4 redefinition holds cleanly because the SMS we're authoring is always business-to-member (a business uses RelayKit to notify its community members), never peer-to-peer (which would land in TCR Social). The boundary is the business's outbound API call, not the community's internal chatter.

## 2. Subs / Stages identified

Five discrete subs plus one workflow sub (onboarding) — the hybrid shape, matching the same architectural pattern as Team alerts.

**Discrete subs:**

1. **Live event reminder** — "Cohort kickoff starts in 30 min" / "Q&A goes live at 2pm." Highest-frequency Community sub; the SMS arrival is the value. Includes join link.

2. **RSVP / event invitation** — "New event posted: Founder AMA next Thursday. RSVP at {{link}}." Lower frequency than reminder; sometimes paired with a follow-up reminder.

3. **Moderation / urgent update** — "We've paused new posts in #channel-name pending review. Update at {{link}}." Low frequency; high signal. Sent only when the community needs attention.

4. **Member milestone** — "🎉 You've been in the community for 1 year." Triggered on per-member anniversaries, post-count thresholds, role changes. Optional in most communities; resonates with engaged members, annoys casual members. RelayKit should ship this default-off.

5. **Community announcement** — "We've launched a new track for B2B founders — check it out." Mid-frequency standalone announcements. Adjacent to Marketing but distinct: announcement is community-housekeeping (new channel, new feature in the community itself), not promotional offer. The boundary is voice-discipline (see §5).

**Workflow sub:**

6. **Onboarding** — triggered by joining the community. Stages:
   - Welcome (immediate on join)
   - First-action prompt (24-48h after join — "introduce yourself in #intros")
   - Resource pointer (3-5 days after join — "here's the orientation guide")
   - Week-1 check-in (7 days after join — "how's it going?")

The hybrid shape (5 discrete + 1 workflow) maps cleanly to the type system's HybridCategory and validates community's planned move from TBD to hybrid.

## 3. Voice patterns observed

Community SMS reads as **insider-direct** — the recipient is already in the community, so the voice can assume context. "Cohort kickoff starts at 2pm" works because the recipient knows what "cohort" means. Outside-the-community framing fails ("[BUSINESS NAME] is hosting a kickoff for its cohort program").

Length: 60-140 characters typically. Live event reminders trend shortest (50-80); RSVP and onboarding stages trend longer.

The community's own voice usually bleeds into the SMS — Skool communities sound different from Circle communities, which sound different from Discord-bridged communities. RelayKit's defaults should be voice-neutral enough to suit varied community personalities while still demonstrating the principles.

Personalization tokens: first name often (community SMS is more personal than transactional), community name always, event title and link where applicable. Member-milestone subs use the member's join date and tenure data.

## 4. B2B vs B2C variations

Most paid community SaaS skews B2B (creator-led B2C communities are usually free or low-cost, often Discord-based with SMS bridging via integration). Voice register: B2B community SMS sounds professional-but-warm; B2C creator-community SMS sounds personal and high-energy.

Cohort/learning communities (Maven, the Reforge-style format) sit between B2B and B2C — paid by individuals but typically professional development context. Voice tilts founder-direct.

Open-source dev communities almost never use SMS (Discord/Slack-native); not a relevant audience segment for launch.

## 5. Compliance constraints / TCR considerations

ACCOUNT_NOTIFICATION mapping is correct per the §4 redefinition. The recipient joined the community → opted into membership-related notifications → SMS is the channel for the time-sensitive subset. Standard ACCOUNT_NOTIFICATION rules apply (STOP/START/HELP, frequency-perception thresholds, opt-in disclosure at join surface).

Critical compliance pressure point: **member milestone and community announcement subs sit adjacent to MARKETING territory.** A milestone message that includes a promotional offer ("you've been here 1 year — here's 20% off") crosses from ACCOUNT_NOTIFICATION into MARKETING and requires a separate campaign registration. RelayKit's authored templates must hold the line — milestones congratulate, announcements inform; neither sells.

Live-event reminder volume can spike if a community runs multiple events per week. Frequency disclosure at join time should set expectations ("we'll text you for live events and major community updates").

Onboarding workflow stages compound — a member joining and immediately receiving welcome + first-action + resource + week-1 within a week is 4 messages from one trigger. Stage-spacing matters; defaults should err toward sparse.

## 6. Open questions / followups

- **Should member milestone ship by default?** Engagement signal in mature communities, annoyance in new/casual ones. Lean: default-off, surface as an opt-in feature in the configurator.
- **Cohort-launch vs. ongoing community.** Cohort-based communities (Maven format) have a beginning-middle-end shape; ongoing communities (Circle, Skool) don't. The onboarding workflow fits both, but live-event reminder cadence differs — cohort communities cluster events into intensive weeks; ongoing communities space them. Worth surfacing in the configurator as two presets.
- **Community announcement vs. Marketing announcement boundary** needs explicit voice rules. Community announcement is "we built X within the community"; Marketing is "we built X, here's a discount." The line is real but easy for developers to blur. Voice guidance in §3 should make this explicit during authoring.
- **Cross-category overlap with Team alerts.** Community moderation alerts ("we paused #channel pending review") are sent by the business to community members, not to the team. Team alerts goes the other direction (business → team about ops). The distinction holds, but the line is fuzzy for community-managed-by-team scenarios. Worth noting in voice guidance.
- **SMS-bridge integrations.** A meaningful chunk of community SMS demand is actually "send a notification from my Discord/Slack to phone numbers." Out of scope for launch but worth tracking — could be a future integration vector.

## 7. Notable references

- Circle community SMS configuration UX
- Maven cohort kickoff and event reminder patterns
- Skool community notification settings
- Mighty Networks event reminder defaults
- TCR ACCOUNT_NOTIFICATION definition (use case classification rules)
- VERTICAL_TAXONOMY_DRAFT.md §4 Community redefinition rationale (validated by this research)
- RelayKit's own product positioning re: we serve community SaaS, we don't replace it
