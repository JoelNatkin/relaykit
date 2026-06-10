import type { Metadata } from "next";
import { ConfiguratorSection } from "@/components/configurator-section";
import { MessagesQuickstart } from "@/components/messages-quickstart";
import { GhostCta } from "@/components/home/section-ui";
import { BottomEmailCapture } from "@/components/bottom-email-capture";

export const metadata: Metadata = {
  title: "Messages — RelayKit",
  description:
    "Pick the text messages your app sends, make the wording yours, and copy them into your code. Free, no account.",
};

// Standalone free configurator tool (D-416/MD-21). Thin demand-voice header +
// the real ConfiguratorSection (its own go-live/forward CTA stays). No
// marketing/support sections are duplicated here — the home (/) owns those.
export default function MessagesPage() {
  return (
    <div>
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-text-primary">
          Text messages for{" "}
          <br className="hidden sm:block" />
          your app. <span className="text-text-headline-muted">Ready to copy.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-tertiary">
          Free and live right now. Pick your messages and copy them into your code today — RelayKit&apos;s own sending launches Summer 2026.
        </p>
        <div className="mt-6">
          <GhostCta href="#join">Join the waitlist</GhostCta>
        </div>
      </div>
      <MessagesQuickstart />
      <ConfiguratorSection />
      <section
        id="join"
        className="mx-auto mt-20 max-w-5xl border-t border-border-secondary px-6 py-20 text-center sm:py-28"
      >
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Want RelayKit to send these for you?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Sending launches Summer 2026 — get an email when it&apos;s live.
          </p>
          <div className="flex justify-center">
            <BottomEmailCapture ctaSource="messages-final" />
          </div>
        </div>
      </section>
    </div>
  );
}
