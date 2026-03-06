import { Nav } from "./nav";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { HowItWorks } from "./how-it-works";
import { WhatYouGet } from "./what-you-get";
import { BYOWaitlist } from "./byo-waitlist";
import { UseCases } from "./use-cases";
import { FAQ } from "./faq";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <WhatYouGet />
        <BYOWaitlist />
        <UseCases />
        <FAQ />
      </main>
    </div>
  );
}
