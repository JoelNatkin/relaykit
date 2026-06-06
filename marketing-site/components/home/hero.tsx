import { CategoryRotor } from "@/components/home/category-rotor";
import { Eyebrow, GhostCta, PrimaryCta } from "@/components/home/section-ui";

// Decorative dot-grid texture behind the hero. Theme-neutral mid-gray at low
// alpha reads as a subtle texture on both the dark and light page (it is not a
// brand color), masked to fade toward the edges. The v10 gold glow is dropped
// per the locked monochrome rule.
const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgb(128 128 128 / 0.07) 1px, transparent 1.5px)",
  backgroundSize: "26px 26px",
  WebkitMaskImage:
    "radial-gradient(ellipse 60% 70% at 72% 46%, #000, transparent 72%)",
  maskImage:
    "radial-gradient(ellipse 60% 70% at 72% 46%, #000, transparent 72%)",
};

function PhoneMock() {
  return (
    <div className="flex justify-center">
      <div className="w-[280px] rounded-[2.5rem] border border-border-primary bg-bg-secondary p-3 shadow-2xl">
        <div className="flex h-[520px] flex-col gap-3 overflow-hidden rounded-[2rem] bg-bg-primary p-4">
          <div className="flex justify-between font-mono text-[0.7rem] text-text-quaternary">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <div className="border-b border-border-secondary pb-2 text-center">
            <div className="text-sm font-semibold text-text-primary">
              Acme Studio
            </div>
            <div className="text-xs text-text-quaternary">
              +1 (843) 555-0182
            </div>
          </div>
          <div className="max-w-[86%] self-start rounded-2xl rounded-bl-sm border border-border-secondary bg-bg-secondary px-3 py-2.5 text-sm leading-snug text-text-secondary">
            Your appointment is confirmed for 2:00 PM Friday. See you then!
            <br />
            <span className="text-xs text-text-tertiary">
              Reply STOP to opt out.
            </span>
          </div>
          <div className="flex items-center gap-1.5 self-start pl-1 text-[0.7rem] text-text-tertiary">
            <span className="size-1.5 rounded-full bg-fg-quaternary" aria-hidden />
            Delivered
          </div>
          <div className="max-w-[86%] self-start rounded-2xl rounded-bl-sm border border-border-secondary bg-bg-secondary px-3 py-2.5 text-sm leading-snug text-text-secondary">
            Heads up — your appointment is in 1 hour. Reply C to confirm.
          </div>
          <div className="flex items-center gap-1.5 self-start pl-1 text-[0.7rem] text-text-tertiary">
            <span className="size-1.5 rounded-full bg-fg-quaternary" aria-hidden />
            Delivered
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={DOT_GRID_STYLE}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>Shipping Summer 2026</Eyebrow>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              The easiest way to ship SMS in your app.
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
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
