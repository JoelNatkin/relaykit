import { Eyebrow } from "@/components/home/section-ui";
import { PreviewListMock } from "@/components/preview-list-mock";

// Prove ("The test") — run test messages through real phones. Mobile leads with
// the copy (order-last/order-first), desktop keeps mock-left/text-right.
// Extracted from app/page.tsx (Session 139) so landing pages can reuse it as-is.
export function Prove() {
  return (
    <section
      id="test"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <Eyebrow>The test</Eyebrow>
      <div className="mt-8 grid items-start gap-14 md:mt-10 lg:grid-cols-2">
        <div className="order-last lg:order-first">
          <PreviewListMock />
        </div>
        <div className="order-first lg:order-last">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Run test messages through real phones.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Add yourself, your team, your beta testers. Each person verifies
            once. After that, your app&apos;s messages work for them exactly the
            way they&apos;ll work for customers.
          </p>
          <p className="mt-3.5 text-base leading-relaxed text-text-secondary">
            Trigger your real flows — a booking, a code, a reminder — and see the
            whole loop land: sent, delivered, your database updated.
          </p>
        </div>
      </div>
    </section>
  );
}
