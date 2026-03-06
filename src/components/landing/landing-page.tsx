import { Nav } from "./nav";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { HowItWorks } from "./how-it-works";
import { WhatYouGet } from "./what-you-get";
import { BYOWaitlist } from "./byo-waitlist";
import { UseCases } from "./use-cases";
import { FAQ } from "./faq";
import { ClosingCTA } from "./closing-cta";
import { Footer } from "./footer";

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
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
