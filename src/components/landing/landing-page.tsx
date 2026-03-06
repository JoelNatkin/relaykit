import { Nav } from "./nav";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { HowItWorks } from "./how-it-works";
import { WhatYouGet } from "./what-you-get";
import { BYOWaitlist } from "./byo-waitlist";

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
      </main>
    </div>
  );
}
