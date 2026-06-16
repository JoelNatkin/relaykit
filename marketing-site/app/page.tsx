import type { Metadata } from "next";
import { AiSection } from "@/components/home/ai-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Paperwork } from "@/components/home/paperwork";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
import { Eyebrow } from "@/components/home/section-ui";
import { VariablesSection } from "@/components/home/variables-section";
import { NumbersSection } from "@/components/home/numbers-section";
import { MessagesSection } from "@/components/home/messages-section";
import { PreviewListMock } from "@/components/preview-list-mock";
import { ChevronDown } from "@untitledui/icons";

export const metadata: Metadata = {
  title: "RelayKit — The easiest way to add text messaging to your app",
  description:
    "Pick the messages your app needs. RelayKit handles registration, opt-outs, and the carrier rules behind the scenes. Your AI tool wires up the rest.",
};

// Recognition — the requirements the developer didn't expect. Each is an
// error-red row in a single full-width card that expands (native <details>
// accordion, one open at a time via the shared name="requirements") to show
// what it entails. Red is a D-405 semantic color.
const DISCOVERED = [
  {
    title: "Registration",
    body: "Before anything sends, your business gets registered in a central registry that every US carrier checks — legal name, tax ID, website, and what you plan to send. Details have to match your IRS records exactly, or the application bounces.",
    relay:
      "RelayKit collects this during setup and files the registration for you.",
  },
  {
    title: "Carrier review",
    body: "Reviewers check your registration and your messages against carrier rules before you're allowed to send. Other providers typically take two to three weeks — and every rejection restarts the clock, with no guarantee the next round clears.",
    relay:
      "RelayKit submissions are prepared to pass the first time; approval typically takes a few days.",
  },
  {
    title: "Consent requirements",
    body: "You have to collect and keep proof that every recipient agreed to get texts from you — how they opted in, when, and which kinds of messages they agreed to. Someone who signed up for appointment reminders hasn't agreed to marketing.",
    relay:
      "RelayKit provides the opt-in language and keeps the consent records automatically.",
  },
  {
    title: "Build a compliance website",
    body: "Reviewers visit your website looking for a privacy policy with specific mobile-data language, posted terms, and a visible description of your texting program. A missing or half-finished site is the single most common reason registrations get rejected.",
    relay:
      "RelayKit generates and hosts a compliance site for you — privacy policy, terms, and opt-in page included.",
  },
  {
    title: "STOP and HELP handling",
    body: "A reply of STOP has to halt messages to that person immediately, and HELP has to get a real answer — automatically, every time. Getting it wrong is a fast way to get a number shut down.",
    relay:
      "RelayKit handles both at the delivery layer; when someone replies STOP, we stop.",
  },
  {
    title: "Message restrictions",
    body: "Carriers limit what businesses can say over text: entire content categories are banned, links get scrutinized, and messages outside your registered use case can get your number flagged. The rules live across multiple carrier policies, and they change.",
    relay:
      "RelayKit's templates already follow them, and custom messages are checked before they send — not just passed through.",
  },
];

function Recognition() {
  return (
    <section
      id="why"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>The problem</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          The rules show up after you start building.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          US carriers require these from every business that sends texts.
          Getting approved can take weeks if not done right.
        </p>
      </div>
      <div className="mt-12 rounded-2xl border border-border-secondary bg-surface-card p-7">
        <div>
          {DISCOVERED.map((item) => (
            <details
              key={item.title}
              name="requirements"
              className="group border-b border-border-secondary last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 py-3 text-base text-text-primary [&::-webkit-details-marker]:hidden">
                <span
                  className="size-1.5 flex-none rounded-full bg-fg-error-primary"
                  aria-hidden
                />
                <span className="flex-1">{item.title}</span>
                <ChevronDown
                  className="size-4 flex-none text-text-tertiary transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              {/* Rows/titles span the full card; only the open body is capped
                  for readable line length. */}
              <div className="max-w-[460px] space-y-2.5 pb-4 pl-[18px] text-sm leading-relaxed text-text-secondary">
                <p>{item.body}</p>
                <p>{item.relay}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Test() {
  return (
    <section
      id="test"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <Eyebrow>The test</Eyebrow>
      <div className="mt-8 grid items-start gap-14 md:mt-10 lg:grid-cols-2">
        <PreviewListMock />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Run test messages through real phones.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Add yourself, your team, your beta testers. Each person verifies
            once. After that, your app&apos;s messages work for them exactly the
            way they&apos;ll work for customers.
          </p>
          <p className="mt-3.5 text-base leading-relaxed text-text-secondary">
            Trigger your real flows — a booking, a code, a reminder — and see the
            whole loop land: sent, delivered, your database updated.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusBand() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-8 text-center">
      <p className="text-base text-text-primary">
        Our free message templates are live.
        <br />
        <span className="text-text-tertiary">Sending arrives Summer 2026.</span>
      </p>
    </section>
  );
}

export default function MarketingHome() {
  return (
    <div>
      <Hero />
      <StatusBand />
      <Paperwork />

      <MessagesSection />

      <VariablesSection />
      <AiSection />
      <Test />
      <HowItWorks />
      <NumbersSection />
      <Recognition />
      <Pricing />
      <FinalCta />
    </div>
  );
}
