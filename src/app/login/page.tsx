import type { Metadata } from "next";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export const metadata: Metadata = {
  title: "Log in — RelayKit",
  description: "Access your RelayKit dashboard with a magic link.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  return <LoginContent searchParams={searchParams} />;
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const hasAuthError = params.error === "auth";

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <a href="/" className="text-lg font-semibold text-primary">
            RelayKit
          </a>
          <h1 className="mt-6 text-2xl font-semibold text-primary">
            Enter your email to continue
          </h1>
          <p className="mt-2 text-sm text-tertiary">
            We&apos;ll send you a magic link — no password needed.
          </p>
        </div>

        {hasAuthError && (
          <div className="mb-4 rounded-lg border border-error bg-error-primary px-4 py-3 text-sm text-error-primary">
            That link didn&apos;t work. It may have expired — try again.
          </div>
        )}

        <MagicLinkForm />
      </div>
    </div>
  );
}
