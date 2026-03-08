import type { Metadata } from "next";
import { EmailOtpForm } from "@/components/auth/magic-link-form";

export const metadata: Metadata = {
  title: "Log in — RelayKit",
  description: "Access your RelayKit dashboard with a magic link.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-[400px]">
        <a
          href="/"
          className="mb-8 block text-center text-lg font-semibold text-primary"
        >
          RelayKit
        </a>

        <EmailOtpForm />
      </div>
    </div>
  );
}
