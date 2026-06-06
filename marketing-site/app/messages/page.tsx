import type { Metadata } from "next";
import { ConfiguratorSection } from "@/components/configurator-section";

export const metadata: Metadata = {
  title: "Message configurator — RelayKit",
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
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Your app&apos;s text messages, ready to copy.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-tertiary">
          Pick the ones you need, make the wording yours, and paste them into
          your app — free, no account.
        </p>
      </div>
      <ConfiguratorSection />
    </div>
  );
}
