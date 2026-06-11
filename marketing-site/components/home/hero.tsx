import { HeroConfiguratorGraphic } from "@/components/home/hero-configurator-graphic";
import { GhostCta, PrimaryCta } from "@/components/home/section-ui";

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

// Soft ambient glow behind the configurator card — brand warm-gray family
// (rgb 149 134 117), NOT gold — to set the card off from the page. Barely-
// there (~0.10 center) with a wide radial falloff to transparent so the card's
// border stays crisp against it. Sits above the dot-grid and below the card.
const HERO_GLOW_STYLE: React.CSSProperties = {
  background:
    "radial-gradient(ellipse at center, rgb(149 134 117 / 0.10) 0%, rgb(149 134 117 / 0.05) 45%, transparent 72%)",
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
        {/* Hero layout. STACKS below the side-by-side threshold (copy on top,
            mock card centered below) and goes side-by-side above it — the mock
            never disappears at any width. Side-by-side holds down to ~940px:
            left 400 + mock 360 + compressed 48px gutter = 808 content → ~856px
            viewport at the floor; min-[940px] keeps a little buffer. minmax
            tracks: LEFT (copy) grows via 1fr; RIGHT (mock) shrinks first toward
            its 360px min, then the left toward 400px. Gutter compresses: 48px
            (gap-x-12) through the tight range, 80px (gap-x-20) once wide. */}
        <div className="grid grid-cols-1 gap-12 min-[940px]:grid-cols-[minmax(400px,1fr)_minmax(360px,420px)] min-[940px]:items-start min-[940px]:gap-x-12 min-[1100px]:gap-x-20">
          {/* Left column — all hero copy (eyebrow, H1, subhead, CTAs, trust). */}
          <div>
            {/* No eyebrow here (removed) — mt-8 gives the H1 breathing room
                from the top in place of the old eyebrow block. */}
            <h1 className="mt-8 text-balance text-5xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-6xl lg:text-[64px]">
              The easiest way to add text messaging to your app.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
              Ready-made texts that cut no-shows,
              <br className="hidden sm:block" />
              support tickets, and missed codes.
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

          {/* Right column — the SELF-CONTAINED configurator card. Sizes to its
              column and clips itself (no absolute window, no scale, no bleed).
              STACKED (below 940px): centered, full width up to 560px, no top
              offset — it sits below the copy. SIDE-BY-SIDE (≥940px): fills the
              mock track and is pushed down so its top edge sits ~180px below the
              appbar. Offset chain: <main> has pt-14 (56px, clears the fixed
              h-14 nav) and the hero adds pt-[72px], so the grid top is 72px
              below the appbar; +108px = 180px below it. pt is a visual tunable. */}
          <div className="mx-auto w-full max-w-[560px] min-[940px]:mx-0 min-[940px]:max-w-none min-[940px]:pt-[108px]">
            {/* relative wrapper hugs the card so the glow sizes to it; the glow
                is -z-10 (behind the static card, above the section dot-grid)
                and -inset-16 so it spills a comfortable margin past the card
                edges as ambient light. */}
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-16 -z-10"
                style={HERO_GLOW_STYLE}
                aria-hidden
              />
              <HeroConfiguratorGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
