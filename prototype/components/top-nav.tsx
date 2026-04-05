"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { RegistrationState } from "@/context/session-context";
import { SignInModal } from "@/components/sign-in-modal";
import { loadWizardData, VERTICAL_LABELS } from "@/lib/wizard-storage";

const USE_CASE_ITEMS = [
  { href: "/sms/appointments", label: "Appointments" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setLoggedIn, setRegistrationState } = useSession();
  const { isLoggedIn } = state;

  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!useCasesOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUseCasesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [useCasesOpen]);

  // Wizard context: on sandbox app messages or signup page, Default state
  const isAppRoute = pathname.startsWith("/apps/") && /\/apps\/[^/]+\/(messages|signup)$/.test(pathname);
  const isWizardNav = isAppRoute && state.registrationState === "default";

  // Wizard (Step 1+): wordmark only, no other nav items
  const isPickerRoute = pathname === "/start";
  const isStartStepRoute = pathname.startsWith("/start/");
  const isStartRoute = isPickerRoute || isStartStepRoute;

  // On /start/* (post-picker), show the selected vertical pill next to wordmark
  const [verticalPill, setVerticalPill] = useState<string | null>(null);
  useEffect(() => {
    if (!isStartStepRoute) {
      setVerticalPill(null);
      return;
    }
    const data = loadWizardData();
    setVerticalPill(VERTICAL_LABELS[data.vertical] || null);
  }, [isStartStepRoute, pathname]);

  if (isStartRoute) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border-secondary bg-bg-primary px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-text-primary">
            RelayKit
          </Link>
          {verticalPill && (
            <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
              {verticalPill}
            </span>
          )}
        </div>
      </nav>
    );
  }

  function handleSignOut() {
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary px-6">
        {/* Left: wordmark + context */}
        <div className="flex items-center gap-4">
          <Link href={isLoggedIn ? "/apps" : "/"} className="text-lg font-bold text-text-primary">
            RelayKit
          </Link>

          {isWizardNav ? (
            <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
              Appointments
            </span>
          ) : isLoggedIn ? (
            <Link
              href="/apps"
              className="ml-2 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
            >
              Your Apps
            </Link>
          ) : (
            <div className="ml-2 flex items-center gap-6">
              {/* Use Cases dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUseCasesOpen((prev) => !prev)}
                  className={`text-sm transition duration-100 ease-linear cursor-pointer ${
                    pathname.startsWith("/sms")
                      ? "text-text-secondary"
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  Use Cases
                  <svg
                    className={`inline-block ml-1 size-3 transition-transform duration-150 ease-linear ${useCasesOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {useCasesOpen && (
                  <div className="absolute top-full left-0 mt-1 min-w-[160px] rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg">
                    {USE_CASE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUseCasesOpen(false)}
                        className="block px-3 py-2 text-sm text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Compliance link */}
              <Link
                href="/compliance"
                className={`text-sm transition duration-100 ease-linear ${
                  pathname === "/compliance"
                    ? "text-text-secondary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Compliance
              </Link>
            </div>
          )}
        </div>

        {/* Right: state switcher (wizard only) + auth */}
        <div className="flex items-center gap-4">
          {isWizardNav && (
            <select
              value={state.registrationState}
              onChange={(e) => setRegistrationState(e.target.value as RegistrationState)}
              className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="changes_requested">Extended Review</option>
              <option value="rejected">Rejected</option>
            </select>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm text-text-secondary hover:text-text-primary transition duration-100 ease-linear cursor-pointer"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSignIn(true)}
              className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}
