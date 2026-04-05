"use client";

import { useEffect, useState } from "react";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

interface Industry {
  value: string;
  label: string;
  placeholder: string;
}

const INDUSTRIES: Industry[] = [
  { value: "salon", label: "Salon & beauty", placeholder: "e.g., nail appointments, haircuts" },
  { value: "dental", label: "Dental", placeholder: "e.g., dental cleanings, checkups" },
  { value: "medical", label: "Medical", placeholder: "e.g., consultations, physicals" },
  { value: "fitness", label: "Fitness & wellness", placeholder: "e.g., personal training, yoga classes" },
  { value: "tutoring", label: "Tutoring & education", placeholder: "e.g., math tutoring, SAT prep" },
  { value: "consulting", label: "Consulting", placeholder: "e.g., strategy sessions, consultations" },
  { value: "auto", label: "Auto service", placeholder: "e.g., oil changes, inspections" },
  { value: "home", label: "Home services", placeholder: "e.g., house cleaning, plumbing" },
  { value: "pet", label: "Pet care", placeholder: "e.g., grooming, vet visits" },
  { value: "photography", label: "Photography", placeholder: "e.g., portrait sessions, event shoots" },
  { value: "other", label: "Other", placeholder: "e.g., appointments, sessions" },
];

export default function DetailsPage() {
  const [industry, setIndustry] = useState("");
  const [serviceType, setServiceType] = useState("");

  useEffect(() => {
    const data = loadWizardData();
    if (data.industry) setIndustry(data.industry);
    if (data.serviceType) setServiceType(data.serviceType);
  }, []);

  const selectedIndustry = INDUSTRIES.find((i) => i.value === industry);
  const placeholder = selectedIndustry?.placeholder || "e.g., appointments, sessions";

  const trimmedService = serviceType.trim();
  const canContinue = industry !== "" && trimmedService.length > 0;

  return (
    <WizardStepShell
      backHref="/start/business"
      continueHref="/start/website"
      canContinue={canContinue}
      onBeforeContinue={() =>
        saveWizardData({ industry, serviceType: trimmedService })
      }
    >
      <h1 className="text-2xl font-bold text-text-primary">
        Tell us about your business
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        This helps us write messages that sound like they&apos;re from you.
      </p>

      <div className="mt-8 space-y-5">
        {/* Industry dropdown */}
        <div>
          <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-text-secondary">
            What kind of business?
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className={`w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 cursor-pointer ${
              industry === "" ? "text-text-placeholder" : "text-text-primary"
            }`}
          >
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        {/* Service type — appears after industry is selected */}
        {industry !== "" && (
          <div style={{ animation: "wizardFadeIn 180ms ease-out" }}>
            <label htmlFor="service-type" className="mb-1.5 block text-sm font-medium text-text-secondary">
              What do people book with you?
            </label>
            <input
              id="service-type"
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20"
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes wizardFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </WizardStepShell>
  );
}
