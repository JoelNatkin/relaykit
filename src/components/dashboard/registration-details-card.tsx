"use client";

import { useEffect, useState } from "react";
import { ChevronDown, LinkExternal01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface RegistrationDetails {
  businessName: string;
  businessType: string | null;
  contactName: string;
  email: string;
  phone: string;
  complianceSiteUrl: string | null;
  twilioPhoneNumber: string | null;
  effectiveCampaignType: string;
  trustScore: number | null;
}

function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const local = digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return e164;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2">
      <span className="text-sm text-tertiary">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}

export function RegistrationDetailsCard() {
  const [details, setDetails] = useState<RegistrationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch("/api/registration-details");
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-tertiary" />
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-primary">
          Registration details
        </h3>
        <ChevronDown
          className={cx(
            "size-5 text-fg-quaternary transition duration-100 ease-linear",
            isExpanded && "-scale-y-100",
          )}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 divide-y divide-secondary">
          <DetailRow label="Business name" value={details.businessName} />
          <DetailRow label="Business type" value={details.businessType} />
          <DetailRow label="Contact" value={details.contactName} />
          <DetailRow label="Email" value={details.email} />
          <DetailRow
            label="Contact phone"
            value={details.phone ? formatPhone(details.phone) : null}
          />
          <DetailRow
            label="SMS phone number"
            value={
              details.twilioPhoneNumber
                ? formatPhone(details.twilioPhoneNumber)
                : null
            }
          />
          <DetailRow
            label="Campaign type"
            value={details.effectiveCampaignType}
          />
          <DetailRow
            label="Trust score"
            value={details.trustScore ? String(details.trustScore) : null}
          />

          {details.complianceSiteUrl && (
            <div className="flex justify-between py-2">
              <span className="text-sm text-tertiary">Compliance site</span>
              <a
                href={details.complianceSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
              >
                View site
                <LinkExternal01 className="size-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
