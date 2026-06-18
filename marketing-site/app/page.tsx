import type { Metadata } from "next";
import { AiSection } from "@/components/home/ai-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Paperwork } from "@/components/home/paperwork";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
import { VariablesSection } from "@/components/home/variables-section";
import { NumbersSection } from "@/components/home/numbers-section";
import { MessagesSection } from "@/components/home/messages-section";
import { StatusBand } from "@/components/home/status-band";
import { Recognition } from "@/components/home/recognition";
import { Prove } from "@/components/home/prove";

export const metadata: Metadata = {
  title: "RelayKit — The easiest way to add text messaging to your app",
  description:
    "Pick the messages your app needs. RelayKit handles registration, opt-outs, and the carrier rules behind the scenes. Your AI tool wires up the rest.",
};

export default function MarketingHome() {
  return (
    <div>
      <Hero />
      <StatusBand />
      <Paperwork />

      <MessagesSection />

      <VariablesSection />
      <AiSection />
      <Prove />
      <HowItWorks />
      <NumbersSection />
      <Recognition />
      <Pricing />
      <FinalCta />
    </div>
  );
}
