import type { Metadata } from "next";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export const metadata: Metadata = {
  title: "Sign up — RelayKit",
  description: "Create your free RelayKit account. No credit card needed.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <a href="/" className="text-lg font-semibold text-primary">
            RelayKit
          </a>
          <h1 className="mt-6 text-2xl font-semibold text-primary">
            Start building with RelayKit
          </h1>
          <p className="mt-2 text-sm text-tertiary">
            Free sandbox, no credit card — just your email.
          </p>
        </div>

        <MagicLinkForm mode="signup" />

        <p className="mt-6 text-center text-sm text-tertiary">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
