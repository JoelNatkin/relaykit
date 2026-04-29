import type { Metadata } from "next";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = {
  title: "Verify your phone number — RelayKit",
  description: "Enter your number to get a one-time code.",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">
        Verify your phone number
      </h1>
      <p className="mt-3 text-base text-text-tertiary">
        Enter your number to get a one-time code.
      </p>
      <div className="mt-8">
        <VerifyForm />
      </div>
    </div>
  );
}
