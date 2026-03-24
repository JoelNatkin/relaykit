"use client";

import { useEffect, useState } from "react";

/**
 * Dev-only route: /dev/intake
 *
 * Seeds sessionStorage with mock intake data, then links to each
 * wizard screen so you can jump directly to any step.
 * Bypasses middleware (excluded in matcher). No auth required.
 */

const MOCK_BUSINESS_DETAILS: Record<string, string> = {
  business_name: "Sarah's Dog Grooming",
  business_description: "A pet grooming salon with 5 locations in Seattle",
  has_ein: "yes",
  ein: "12-3456789",
  business_type: "LLC",
  first_name: "Sarah",
  last_name: "Johnson",
  email: "sarah@dogspa.com",
  phone: "(206) 555-1234",
  address_line1: "123 Main St",
  address_city: "Seattle",
  address_state: "WA",
  address_zip: "98101",
  website_url: "https://dogspa.com",
  service_type: "Full grooming packages",
};

const MOCK_SESSION = {
  use_case: "appointments",
  expansions: [] as string[],
  campaign_type: "CUSTOMER_CARE",
  business_details: MOCK_BUSINESS_DETAILS,
};

const SCREENS = [
  {
    label: "Screen 1 — Use Case Selection",
    href: "/start",
    description: "Pick what your app does. 10 use case tiles in a grid.",
  },
  {
    label: "Screen 2 — Scope & Expansions",
    href: "/start/scope?use_case=appointments",
    description:
      "What's included vs. available expansions. Shows messaging scope.",
  },
  {
    label: "Screen 3 — Business Details",
    href: "/start/details?use_case=appointments",
    description:
      "Full business + contact form. Industry gating, EIN fields, validation.",
  },
  {
    label: "Screen 4 — Review & Payment",
    href: "/start/review?use_case=appointments&campaign_type=CUSTOMER_CARE",
    description:
      "Summary cards, generated templates, pricing, Stripe checkout CTA.",
  },
];

export default function DevIntakePage() {
  const [seeded, setSeeded] = useState(false);

  function seedSession() {
    try {
      sessionStorage.setItem("relaykit_intake", JSON.stringify(MOCK_SESSION));
      setSeeded(true);
    } catch {
      // sessionStorage unavailable
    }
  }

  function clearSession() {
    try {
      sessionStorage.removeItem("relaykit_intake");
      sessionStorage.removeItem("relaykit_intake_data");
      setSeeded(false);
    } catch {
      // sessionStorage unavailable
    }
  }

  useEffect(() => {
    try {
      const existing = sessionStorage.getItem("relaykit_intake");
      if (existing) setSeeded(true);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Intake Wizard — Dev Preview
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Jump to any wizard screen. Seed mock data first so screens 2–4 have
          something to render.
        </p>

        {/* Seed controls */}
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={seedSession}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
          >
            {seeded ? "Re-seed mock data" : "Seed mock data"}
          </button>
          {seeded && (
            <button
              type="button"
              onClick={clearSession}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Clear session
            </button>
          )}
          {seeded && (
            <span className="text-sm text-green-600 font-medium">
              sessionStorage seeded
            </span>
          )}
        </div>

        {/* Screen links */}
        <div className="space-y-3">
          {SCREENS.map((screen) => (
            <a
              key={screen.href}
              href={screen.href}
              className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-purple-300 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  {screen.label}
                </h2>
                <span className="text-sm text-purple-600">→</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {screen.description}
              </p>
            </a>
          ))}
        </div>

        {/* Mock data preview */}
        <details className="mt-8">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
            View mock data shape
          </summary>
          <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
            {JSON.stringify(MOCK_SESSION, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
