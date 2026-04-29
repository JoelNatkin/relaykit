import type { Metadata } from "next";
import { GetStartedForm } from "./get-started-form";

export const metadata: Metadata = {
  title: "Get early access — RelayKit",
  description:
    "Join the RelayKit beta list. We'll be in touch when we open access.",
};

export default function GetStartedPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">
        Get early access
      </h1>
      <p className="mt-3 text-base text-text-tertiary">
        Drop your email &mdash; we&apos;ll be in touch when we open access.
      </p>
      <div className="mt-8">
        <GetStartedForm />
      </div>
    </div>
  );
}
