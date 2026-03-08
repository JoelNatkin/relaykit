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
        <a href="/" className="mb-8 block text-center text-lg font-semibold text-primary">
          RelayKit
        </a>

        <MagicLinkForm authError={hasAuthError} />
      </div>
    </div>
  );
}
