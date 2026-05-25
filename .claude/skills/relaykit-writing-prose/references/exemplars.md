# RelayKit External Writing — Prose Style — Exemplars

Worked examples of finished posts that embody the principles in `../SKILL.md`. Annotated to show which moves are doing the work.

## How to use this file

Read this file before drafting a post in any of the lanes or archetypes the exemplars cover. The exemplars are not templates — they are worked examples. Internalize the moves; don't copy the structure verbatim.

## How to add a new exemplar

When a finished post is captured here, append it with:

1. The post itself (verbatim, including title).
2. Surface: Indie Hackers, blog, partner pitch, social, etc.
3. Lane: supply / demand / retrospective.
4. Annotation: 3–6 callouts naming what each move is doing — the hook, the moment the strange world is sketched, the outward turn, where AI tells were dodged that a draft would have included, anything else worth flagging.

The annotation matters more than the post. Without it the post is just prose; with it the post is a teaching artifact.

## Exemplars

### Exemplar 1: Adding texts to your app is a month-long trap

**Surface:** Indie Hackers (mirrorable to blog)
**Lane:** Supply

> **Adding texts to your app is a month-long trap**
>
> If you've tried to add text messages to your app, you've hit this wall. There's a registration system. Page after page of confusing forms. Weeks of waiting, vague rejections, a subscription running.
>
> Worse than the bill is the not-knowing — a rejection comes back with one line that doesn't say what to fix, you guess, you resubmit, you wait another week. For an indie founder shipping to paying users, three to six weeks of that is the difference between a feature launching and customers canceling.
>
> You'd think the providers would help you with this but they don't. Twilio is the biggest; Plivo, Sinch, and Vonage are the alternatives. They sit between your code and the phone network — API, delivery, per-message billing.
>
> Underneath them are the US mobile carriers — AT&T, Verizon, T-Mobile — who read your forms and decide whether you get to send texts or not. Rejections come back through your provider with a one-line reason that doesn't say what to fix, and that's where things spiral out.
>
> The providers know this. They build for enterprise customers — Uber, Doordash, Stripe — who have compliance teams and legal departments. Indie builders showing up to Twilio get handed the same forms Uber's compliance team gets. They struggle alone and many give up.
>
> The difference between weeks and days isn't which provider you pick. It's whether the path through registration is mapped — what carriers approve, what they reject, which campaign type to file, what each form field really wants.
>
> That's RelayKit. You sign up, start building against a test environment that sends real texts to your phone, and we get you registered in 3-5 days while you're already shipping. No month-long wait before the first line of code.
>
> If you don't want a month of your life disappearing into carrier paperwork — relaykit.ai.

**Annotations:**

1. **Cold-reader bridge in sentence one.** "If you've tried to add text messages to your app, you've hit this wall." User-experience framing anyone who's attempted it has lived — no jargon, no prerequisite knowledge. The drop-in test passes from the first sentence.

2. **Title and hook frame the post around a trap, not a contest.** "Month-long trap" names a thing the reader fears without explaining the machinery yet. An earlier draft of this post used "Twilio's not slow. The carriers are." as the hook — rhetorically punchy but factually wrong, and it absolved the wrong party. The trap framing keeps the reader's outcome central instead of staging a fight between providers and carriers.

3. **The not-knowing beat is the real insight.** "Worse than the bill is the not-knowing — a rejection comes back with one line that doesn't say what to fix, you guess, you resubmit, you wait another week." The post locates the pain precisely: not the wait, not the cost, but the blind iteration. That's the thing the reader paid for by reading.

4. **Provider layer explained, then named as part of the problem.** First the cold-reader bridge: "Twilio is the biggest; Plivo, Sinch, and Vonage are the alternatives. They sit between your code and the phone network." Then the diagnosis: providers build for enterprise customers with compliance teams, and hand indie builders the same forms. If providers aren't part of the problem, RelayKit has no reason to exist — naming the provider failure directly is craft principle #3 (don't construct rhetorical scapegoats that absolve actual competitors).

5. **Tourist, not student.** The bureaucracy is sketched — "page after page of confusing forms," "a one-line reason that doesn't say what to fix" — without ever naming 10DLC, TCR, or carrier message classes. The reader leaves with the world's shape, not vocabulary to memorize.

6. **Terminology discipline + harder close earned by the lane.** "Provider" and "carrier" are defined once and reused exactly — no creative variants ("gauntlet," "the system") for elegance's sake. The close is a concrete RelayKit description ("registered in 3-5 days while you're already shipping"), harder than a soft seed — permitted here because this is the supply lane, where the reader is already shopping and a direct mention is warranted.

### Exemplar 2: I almost built another SaaS app starter kit

**Surface:** Indie Hackers (mirrorable to blog)
**Lane:** Retrospective

> **I almost built another SaaS app starter kit**
>
> For about three weeks I thought I was going to build a starter kit for SaaS apps — a developer would pay once and get a pre-built shell of an app with signup, billing, a dashboard and messages already wired up, and skip weeks of setup. It would include verification codes, appointment reminders, order updates — all pre-wired. Drop it into a new project, ship in an afternoon.
>
> So of course I looked around and starter kits already exist. There's a whole category of them — ShipFast, Supastarter, MakerKit, the one Kolby Sisk maintains, Vercel's Supabase starter. All popular. All successful. Marc Lou's ShipFast alone clears tens of thousands of dollars a month and reaches 30,000-plus indie hackers through his newsletter. I'd just never heard of any of them, because I'd never gone looking.
>
> What none of them have, though, is text messages. Every single one is missing the piece I'd planned to put into mine.
>
> These starter kits each have audiences in the tens of thousands of indie founders — people who downloaded them, customized them, and are now building their SaaS apps on top. Those founders are exactly the people who'd eventually need to add text messages to their apps. And right now, every one of them is going to hit the wall on their own.
>
> The smart version of my idea wasn't to build a competing starter kit. It was to put my product inside, and let their audiences find me through tools they already trust.
>
> So I killed the starter kit before writing a line of code. The plan now is to ship RelayKit first, then approach them one by one with a working integration already built — a copy of their starter with my product wired in.
>
> Whether or not the formal integration gets picked up, I'll release the work as open source so anyone can use it. RelayKit users asking where to start will get pointed at these starters from our docs. We do better when they do better.
>
> I haven't started the conversations yet. I'm not sure how negotiations will go. But the alternative was a year of solo work to compete with people I'd rather be partnering with — for the same audience.
>
> I'll write up what happens.
>
> — Joel, building RelayKit (relaykit.ai)

**Annotations:**

1. **Title stops at the tension, doesn't telegraph the resolution.** "I almost built another SaaS app starter kit" makes the reader open the post to find out what stopped him. Earlier drafts added "The math killed it." to the title — that gave the resolution upfront and turned a curiosity hook into foreshadow.

2. **Premise built around honest ignorance.** The opening describes the planned product without claiming any knowledge of the existing market. The reveal that "starter kits already exist" lands as discovery, not as a framing the reader was supposed to share. "I'd just never heard of any of them, because I'd never gone looking" is the spine — it's why the post reads as honest, and it's what makes the partnership pivot earned rather than performative.

3. **Reference and money specificity.** "Starter kits already exist" (not "these already exist") names the referent directly. "Tens of thousands of dollars a month" (not "tens of thousands") closes a referent gap that would otherwise create AI-prose haze.

4. **Light-touch elevation of competitors.** "All popular. All successful." Positions the existing starter kits as real, valuable products. The partnership angle only lands if the reader takes the maintainers seriously, so the post does the elevation work without flattery.

5. **Pivot as direct conclusion, not performative reversal.** "The smart version of my idea wasn't to build a competing starter kit. It was to put my product inside..." No "for about an hour I felt smart" ego-detour. Earlier drafts inserted a self-aware reversal beat for rhetorical color — cut as theatrical.

6. **Generous ecosystem voice + uncertainty stated once.** The open-source paragraph names what RelayKit contributes regardless of reciprocity ("RelayKit users asking where to start will get pointed at these starters from our docs") — no "use it, link to it, or ignore it" transactional enumeration. The sign-off acknowledges uncertainty plainly once ("I'm not sure how negotiations will go") and ends. Earlier drafts added "Especially when it doesn't work" — cut as theatrical pessimism that read as defeatist rather than honest.
