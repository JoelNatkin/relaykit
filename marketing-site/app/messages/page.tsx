import type { Metadata } from "next";
import { ConfiguratorSection } from "@/components/configurator-section";
import { MessagesQuickstart } from "@/components/messages-quickstart";

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
    <div className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-text-primary">
          Text messages for{" "}
          <br className="hidden sm:block" />
          your app. <span className="text-text-headline-muted">Ready to copy.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-text-tertiary">
          Pick the ones you need, make the wording yours,{" "}
          <br className="hidden sm:block" />
          and use them in your app — free, no account.
        </p>
      </div>
      <MessagesQuickstart />
      <ConfiguratorSection />
    </div>
  );
}
