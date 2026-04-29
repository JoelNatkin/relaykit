import type { Metadata } from "next";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = {
  title: "Get a text when we go live — RelayKit",
  description:
    "Leave your number and we'll text you when RelayKit is cleared to send.",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">
        Get a text when we go live
      </h1>
      <p className="mt-3 text-base text-text-tertiary">
        Leave your number &mdash; we&apos;ll text you once we&apos;re cleared to send.
      </p>
      <div className="mt-8">
        <VerifyForm />
      </div>
    </div>
  );
}
