import Link from "next/link";

import { BottomEmailCapture } from "@/components/bottom-email-capture";
import { Eyebrow } from "@/components/home/section-ui";

export function FinalCta() {
  return (
    <section
      id="join"
      className="border-t border-border-secondary px-6 py-20 text-center sm:py-28"
    >
      <div className="mx-auto max-w-[616px]">
        <div className="flex justify-center">
          <Eyebrow>The start</Eyebrow>
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          The messages are ready now.{" "}
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">
            Sending arrives Summer 2026.
          </span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          You can{" "}
          <Link
            href="/messages"
            className="font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
          >
            start with the messages today
          </Link>
          . When sending launches, your AI tool wires up the integration, you
          test on real phones, and registration and opt-outs stay handled
          behind the scenes.
        </p>
        <div className="mt-8 flex justify-center">
          <BottomEmailCapture ctaSource="home-final" />
        </div>
      </div>
    </section>
  );
}
