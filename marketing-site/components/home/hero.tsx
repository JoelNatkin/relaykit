import { HeroConfiguratorGraphic } from "@/components/home/hero-configurator-graphic";
import { Eyebrow, GhostCta, PrimaryCta } from "@/components/home/section-ui";

// Decorative dot-grid texture behind the hero. Theme-neutral mid-gray at low
// alpha reads as a subtle texture on both the dark and light page (it is not a
// brand color), masked to fade toward the edges — focal point sits lower-right
// where the configurator card lives.
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
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-[72px] pb-20 sm:pb-24">
        {/* Two-column hero. Single column below the custom breakpoint (the mock
            is hidden); two columns above it. minmax tracks: the LEFT (copy)
            grows via 1fr; the RIGHT (mock) shrinks first toward its 360px min,
            then the left shrinks toward its 400px min. Breakpoint math: left
            400 + gutter 80 + mock 360 = 840 content → ~888px viewport at the
            absolute minimum; min-[1000px] adds buffer so the columns never
            render at their cramped edge. 80px gutter = gap-20. */}
        <div className="grid grid-cols-1 gap-12 min-[1000px]:grid-cols-[minmax(400px,1fr)_minmax(360px,420px)] min-[1000px]:items-start min-[1000px]:gap-20">
          {/* Left column — all hero copy (eyebrow, H1, subhead, CTAs, trust). */}
          <div>
            <Eyebrow>Free message templates — live now</Eyebrow>
            <h1 className="mt-5 text-balance text-5xl font-bold tracking-tight text-text-primary sm:text-6xl">
              The easiest way to{" "}
              <br className="hidden sm:block" />
              add text messaging{" "}
              <br className="hidden sm:block" />
              to your app.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
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

          {/* Right column — the SELF-CONTAINED configurator card. It sizes to
              this column and clips itself (no absolute window, no scale, no
              bleed). Pushed down so its top edge sits ~240px below the appbar:
              the appbar is h-14 (56px), the grid top is pt-[72px] (16px below
              the appbar), so +224px = 240px below the appbar. Hidden below the
              two-column breakpoint. pt is a visual tunable. */}
          <div className="hidden min-[1000px]:block min-[1000px]:pt-[224px]">
            <HeroConfiguratorGraphic />
          </div>
        </div>
      </div>
    </section>
  );
}
