import { CategoryRotor } from "@/components/home/category-rotor";
import { HeroConfiguratorGraphic } from "@/components/home/hero-configurator-graphic";
import { Eyebrow, GhostCta, PrimaryCta } from "@/components/home/section-ui";

// Decorative dot-grid texture behind the hero. Theme-neutral mid-gray at low
// alpha reads as a subtle texture on both the dark and light page (it is not a
// brand color), masked to fade toward the edges — focal point sits lower-right
// where the configurator peek now lives.
const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgb(128 128 128 / 0.07) 1px, transparent 1.5px)",
  backgroundSize: "26px 26px",
  WebkitMaskImage:
    "radial-gradient(ellipse 60% 70% at 76% 72%, #000, transparent 72%)",
  maskImage:
    "radial-gradient(ellipse 60% 70% at 76% 72%, #000, transparent 72%)",
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={DOT_GRID_STYLE}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-[72px] pb-20 sm:pb-24 lg:min-h-[560px]">
        {/* Two columns on lg: copy left, configurator peek right. items-start
            keeps both top-aligned; the peek is confined to the right column so
            it can NEVER overlap the copy at any width. */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Hero copy — upper-left (verbatim). */}
          <div className="max-w-xl">
            <Eyebrow>Shipping Summer 2026</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              The easiest way to add text messaging to your app.
            </h1>
            <CategoryRotor />
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">
              Pick the messages your app needs. RelayKit handles registration,
              opt-outs, and the carrier rules behind the scenes. Your AI tool
              wires up the rest.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryCta href="/messages">
                See the messages <span aria-hidden>→</span>
              </PrimaryCta>
              <GhostCta href="#join">Join the list</GhostCta>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-sm text-text-tertiary">
              <span>Free to build &amp; test</span>
              <span aria-hidden>·</span>
              <span>No credit card</span>
              <span aria-hidden>·</span>
              <span>US &amp; Canada</span>
            </div>
          </div>

          {/* Configurator product peek — desktop only. The graphic is absolute
              inside this right column (top-anchored, so the header + categories
              + Verification cards show and the rest of the card bleeds off the
              BOTTOM) and scaled down to read as a tasteful peek. It bleeds off
              the right edge into the gutter, clipped by the section's
              overflow-hidden. Confined to this column, so the copy is never
              overlapped. Width / scale / top offset are visual tunables. */}
          <div className="relative hidden lg:block">
            <div className="pointer-events-none absolute left-0 top-6 w-[860px] origin-top-left scale-[0.8]">
              <HeroConfiguratorGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
