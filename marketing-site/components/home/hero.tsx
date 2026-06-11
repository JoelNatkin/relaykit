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
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-[72px] pb-20 sm:pb-24 lg:min-h-[820px]">
        {/* Full-width headline band — three lines with hard breaks at sm+
            (after "to" and "messaging"); natural balanced wrap below sm. The
            two-column split starts BELOW this band. */}
        <div className="max-w-4xl">
          <Eyebrow>Free message templates — live now</Eyebrow>
          <h1 className="mt-5 text-balance text-5xl font-bold tracking-tight text-text-primary sm:text-6xl">
            The easiest way to{" "}
            <br className="hidden sm:block" />
            add text messaging{" "}
            <br className="hidden sm:block" />
            to your app.
          </h1>
        </div>

        {/* Two columns on lg: copy left, configurator peek right. items-start
            keeps both top-aligned; the peek is confined to the right column so
            it can NEVER overlap the copy at any width. */}
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Hero copy — left column (verbatim). */}
          <div className="max-w-xl">
            <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
              Ready-made texts that cut no-shows, support tickets, and missed
              codes.
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

          {/* Configurator product peek — desktop only. The WINDOW spans the
              right column (w-full) and clips its inner card at the column's
              right edge, so nothing bleeds past the content width. The inner
              stays at its natural ~920px width — the card's right side is what
              crops. Height is sized to show ~2½ message cards (the 3rd clipped
              mid-card by the bottom edge). Confined to this column → never
              overlaps the copy. The rail inside is interactive, so NO
              pointer-events-none here. top / height / scale are visual
              tunables. */}
          <div className="relative hidden lg:block">
            <div className="absolute left-0 top-[40px] h-[560px] w-full overflow-hidden rounded-[22px] shadow-2xl">
              <div className="w-[920px] origin-top-left scale-[0.85]">
                <HeroConfiguratorGraphic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
