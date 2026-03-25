"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@untitledui/icons";
import { BusinessDetailsForm } from "@/components/registration/business-details-form";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { BusinessDetailsData } from "@/lib/intake/validation";

const MOCK_DATA: Record<string, string> = {
  business_name: "GlowStudio",
  business_description:
    "Manages appointments and sends reminders for a hair salon in downtown Portland. Customers book online, get confirmation texts, and receive reminders 24 hours before their appointment.",
  service_type: "Hair salon",
  website: "glowstudio.com",
  has_ein: "yes",
  ein: "12-3456789",
  business_type: "LLC",
  address_line1: "456 Oak Street",
  address_city: "Portland",
  address_state: "Oregon",
  address_zip: "97201",
  first_name: "Sarah",
  last_name: "Chen",
  email: "dev@glowstudio.com",
  phone: "(503) 555-0142",
};

export default function RegisterPage() {
  const { appId } = useParams<{ appId: string }>();
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<Record<string, string>>({});
  const [prefill, setPrefill] = useState<"empty" | "filled">("empty");
  const touchAllRef = useRef<(() => void) | null>(null);

  const handleValid = useCallback((data: BusinessDetailsData) => {
    const details: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        details[key] = String(value);
      }
    }
    setBusinessDetails(details);
    setIsFormValid(true);
  }, []);

  const handleInvalid = useCallback(() => {
    setIsFormValid(false);
  }, []);

  const handleContinue = () => {
    // Store form data for the review page
    sessionStorage.setItem("relaykit_registration", JSON.stringify(businessDetails));
    router.push(`/apps/${appId}/register/review`);
  };

  const initialValues = prefill === "filled" ? MOCK_DATA : { email: "dev@glowstudio.com" };

  return (
    <div className="max-w-[640px]">
      {/* Back link + state switcher */}
      <div className="flex items-center justify-between">
        <Link
          href={`/apps/${appId}/overview`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
        >
          <ArrowLeft className="size-4" />
          Back to Overview
        </Link>
        <select
          value={prefill}
          onChange={(e) => setPrefill(e.target.value as "empty" | "filled")}
          className="text-sm text-text-tertiary bg-transparent border-none cursor-pointer focus:outline-none"
        >
          <option value="empty">Empty</option>
          <option value="filled">Pre-filled</option>
        </select>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-text-primary">Register your app</h2>
        <p className="mt-1 text-sm text-text-tertiary">
          We use these details to register your app with carriers. The more accurate this is, the faster you get approved.
        </p>
      </div>

      {/* Info callout */}
      <div className="mt-5 flex gap-3 rounded-lg bg-indigo-50 p-4">
        <svg className="size-5 shrink-0 text-indigo-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-sm text-text-secondary leading-relaxed">
          Carriers compare your registration against the messages your app actually sends. Descriptions that match what you&apos;re building get approved fastest — vague or generic answers are the #1 reason registrations get sent back.
        </p>
      </div>

      <div className="mt-8">
        <BusinessDetailsForm
          key={prefill}
          useCase={"appointments" as UseCaseId}
          initialValues={initialValues}
          onValid={handleValid}
          onInvalid={handleInvalid}
          touchAllRef={touchAllRef}
        />
      </div>

      {/* Continue button */}
      <div className="mt-8 flex justify-end pb-8">
        <button
          type="button"
          onClick={() => {
            if (isFormValid) {
              handleContinue();
            } else {
              touchAllRef.current?.();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="rounded-lg bg-bg-brand-solid px-6 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
        >
          Continue to review
        </button>
      </div>
    </div>
  );
}
