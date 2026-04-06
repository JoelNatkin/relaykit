"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { RegistrationState } from "@/context/session-context";

const APP_ID = "glowstudio";

interface NavItem {
  label: string;
  href: string;
  state: RegistrationState;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Messages (onboarding)", href: `/apps/${APP_ID}/messages`, state: "onboarding" },
  { label: "Opt-in (onboarding)", href: `/apps/${APP_ID}/opt-in`, state: "onboarding" },
  { label: "Overview (building)", href: `/apps/${APP_ID}/overview`, state: "building" },
  { label: "Messages (building)", href: `/apps/${APP_ID}/messages`, state: "building" },
  { label: "Settings (building)", href: `/apps/${APP_ID}/settings`, state: "building" },
  { label: "Overview (pending)", href: `/apps/${APP_ID}/overview`, state: "pending" },
  { label: "Messages (pending)", href: `/apps/${APP_ID}/messages`, state: "pending" },
  { label: "Settings (pending)", href: `/apps/${APP_ID}/settings`, state: "pending" },
  { label: "Overview (registered)", href: `/apps/${APP_ID}/overview`, state: "registered" },
  { label: "Messages (registered)", href: `/apps/${APP_ID}/messages`, state: "registered" },
  { label: "Settings (registered)", href: `/apps/${APP_ID}/settings`, state: "registered" },
  { label: "Overview (ext. review)", href: `/apps/${APP_ID}/overview`, state: "changes_requested" },
  { label: "Overview (rejected)", href: `/apps/${APP_ID}/overview`, state: "rejected" },
  { label: "Register", href: `/apps/${APP_ID}/register`, state: "building" },
  { label: "Register review", href: `/apps/${APP_ID}/register/review`, state: "building" },
];

export function ProtoNavHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { state, setRegistrationState } = useSession();

  // Only show on /apps/ routes
  if (!pathname.startsWith("/apps/")) return null;

  function handleJump(item: NavItem) {
    setRegistrationState(item.state);
    router.push(item.href);
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-4 left-4 z-[200]">
      {isOpen && (
        <div className="mb-2 rounded-xl border border-border-secondary bg-bg-primary shadow-xl p-3 min-w-[220px] max-h-[70vh] overflow-y-auto">
          <p className="text-xs font-semibold text-text-quaternary uppercase tracking-wide mb-2 px-1">
            Jump to page
          </p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item, i) => {
              const isCurrent =
                pathname === item.href && state.registrationState === item.state;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleJump(item)}
                  className={`block w-full text-left rounded-md px-2 py-1.5 text-xs transition duration-100 ease-linear cursor-pointer ${
                    isCurrent
                      ? "bg-bg-brand-secondary text-text-brand-secondary font-medium"
                      : "text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-bg-tertiary border border-border-secondary px-3 py-1.5 text-xs font-medium text-text-tertiary shadow-md hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
      >
        {isOpen ? "Close" : "Nav ↑"}
      </button>
    </div>
  );
}
