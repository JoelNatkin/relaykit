"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import { Mail01, Phone01, Code01, ArrowRight, CheckCircle } from "@untitledui/icons";

type Step = "email" | "magic-link-sent" | "app-name" | "phone" | "download";

export default function AuthGate() {
  const router = useRouter();
  const { state, setField, setLoggedIn } = useSession();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setField("email" as never, email);
    setStep("magic-link-sent");
  }

  function handleMagicLinkClick() {
    setStep("app-name");
  }

  function handleAppNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.appName) return;
    setStep("phone");
  }

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    setStep("download");
  }

  function handleDownload() {
    setLoggedIn(true);
    router.push("/apps/radarlove/messages");
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
              <Mail01 className="size-6 text-fg-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Sign in to RelayKit</h1>
            <p className="text-sm text-text-tertiary">
              We&rsquo;ll send you a magic link — no password needed.
            </p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourapp.com"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-border-brand"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Send magic link
            </button>
          </form>
        )}

        {/* Step 2: Magic link sent (mock) */}
        {step === "magic-link-sent" && (
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-success-secondary">
              <Mail01 className="size-6 text-fg-success-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
            <p className="text-sm text-text-tertiary">
              We sent a magic link to <span className="font-medium text-text-primary">{email}</span>.
              Click it to sign in.
            </p>
            <button
              type="button"
              onClick={handleMagicLinkClick}
              className="w-full rounded-lg border border-border-brand bg-bg-brand-primary px-4 py-2.5 text-sm font-semibold text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-brand-secondary"
            >
              Simulate clicking magic link →
            </button>
            <p className="text-center text-[11px] text-text-quaternary">
              (In production, this would be in the email)
            </p>
          </div>
        )}

        {/* Step 3: App name */}
        {step === "app-name" && (
          <form onSubmit={handleAppNameSubmit} className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
              <Code01 className="size-6 text-fg-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">What&rsquo;s your app called?</h1>
            <p className="text-sm text-text-tertiary">
              This appears in every text your customers receive.
            </p>
            <div>
              <label htmlFor="appName" className="block text-sm font-medium text-text-secondary mb-1.5">
                App name
              </label>
              <input
                id="appName"
                type="text"
                value={state.appName}
                onChange={(e) => setField("appName", e.target.value)}
                placeholder="RadarLove"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-border-brand"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 4: Phone — framed as dev tooling (D-96) */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
              <Phone01 className="size-6 text-fg-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">What number should we text?</h1>
            <p className="text-sm text-text-tertiary">
              Your sandbox sends real messages to this number so you can test as you build.
            </p>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1.5">
                Your phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (512) 555-0147"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-border-brand"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Verify &amp; get my Blueprint
            </button>
          </form>
        )}

        {/* Step 5: Blueprint download moment */}
        {step === "download" && (
          <div className="space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-success-secondary">
              <CheckCircle className="size-6 text-fg-success-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Your {state.appName || "app"} SMS Blueprint is ready
            </h1>
            <p className="text-sm text-text-tertiary">
              Everything your AI coding tool needs to build your messaging feature — messages, API key, and setup instructions.
            </p>

            {/* Platform instructions (D-92) */}
            <div className="rounded-xl border border-border-secondary bg-bg-secondary p-4 space-y-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Quick start
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-brand-solid text-[10px] font-bold text-text-white">1</span>
                  <p className="text-sm text-text-tertiary">
                    Download <span className="font-medium text-text-primary">{state.appName?.toLowerCase().replace(/\s+/g, "_") || "your_app"}_sms_blueprint.md</span> to your project root
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-brand-solid text-[10px] font-bold text-text-white">2</span>
                  <p className="text-sm text-text-tertiary">
                    Open your AI coding tool and say: <span className="font-mono text-xs text-text-primary">&ldquo;Build the SMS feature using the Blueprint&rdquo;</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-brand-solid text-[10px] font-bold text-text-white">3</span>
                  <p className="text-sm text-text-tertiary">
                    Test with your sandbox — messages go to <span className="font-medium text-text-primary">{phone || "+1 (512) 555-0147"}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full rounded-lg bg-bg-brand-solid px-4 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover flex items-center justify-center gap-2"
            >
              Download SMS Blueprint
              <ArrowRight className="size-4" />
            </button>
            <p className="text-center text-[11px] text-text-quaternary">
              Your sandbox API key is embedded in the Blueprint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
