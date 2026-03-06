import { Nav } from "./nav";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { HowItWorks } from "./how-it-works";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
      </main>
    </div>
  );
}
