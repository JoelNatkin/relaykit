import { BottomEmailCapture } from "@/components/bottom-email-capture";
import { Eyebrow, PrimaryCta } from "@/components/home/section-ui";

export function FinalCta() {
  return (
    <section
      id="join"
      className="border-t border-border-secondary px-6 py-20 text-center sm:py-28"
    >
      <div className="mx-auto max-w-[616px]">
        <div className="flex justify-center">
          <Eyebrow>Start now</Eyebrow>
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          The messages are ready now.{" "}
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">
            Sending arrives Summer 2026.
          </span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          You can start with the messages today. When RelayKit launches,
          we&apos;ll take care of registration, opt-outs, delivery, and the
          carrier requirements behind the scenes.
        </p>
        <div className="mt-7 flex justify-center">
          <PrimaryCta href="/messages">
            Open Messages <span aria-hidden>→</span>
          </PrimaryCta>
        </div>
        <p className="mt-8 text-sm text-text-tertiary">
          Or get an email when sending launches:
        </p>
        <div className="flex justify-center">
          <BottomEmailCapture ctaSource="home-final" />
        </div>
      </div>
    </section>
  );
}
