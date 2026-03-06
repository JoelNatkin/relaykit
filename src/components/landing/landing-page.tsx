import { Nav } from "./nav";
import { Hero } from "./hero";
import { Problem } from "./problem";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Nav />
      <main>
        <Hero />
        <Problem />
      </main>
    </div>
  );
}
