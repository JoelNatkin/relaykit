"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { AlertTriangle, Mail01 } from "@untitledui/icons";

// ---------------------------------------------------------------------------
// OTP Verification Card (sole proprietor — awaiting_otp)
// ---------------------------------------------------------------------------

interface OtpActionCardProps {
  phone: string;
  registrationId: string;
}

function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const local = digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return e164;
}

export function OtpActionCard({ phone, registrationId }: OtpActionCardProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registrationId,
          otp_code: code,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Verification failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-warning bg-warning-primary p-5">
      <div className="flex items-start gap-4">
        <FeaturedIcon
          icon={AlertTriangle}
          size="md"
          color="warning"
          theme="light"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">
            Verify your identity
          </p>
          <p className="mt-1 text-sm text-secondary">
            We sent a 6-digit code to {formatPhone(phone)}. Enter it below to
            verify your identity — this is how TCR confirms you{"'"}re a real
            person behind this registration.
          </p>
          <p className="mt-2 text-xs text-tertiary">
            TCR limits phone number verifications to 3 per phone number
            lifetime, across all providers. This counts as one of yours.
          </p>

          {error && (
            <p className="mt-2 text-sm text-error-primary">{error}</p>
          )}

          <div className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs ring-1 ring-primary ring-inset placeholder:text-placeholder focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
            <Button
              size="sm"
              color="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              showTextWhileLoading
              isDisabled={code.length !== 6}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brand Auth Card (AWAITING_BRAND_AUTH — public companies, D-25)
// ---------------------------------------------------------------------------

interface BrandAuthCardProps {
  email: string;
}

export function BrandAuthCard({ email }: BrandAuthCardProps) {
  return (
    <div className="rounded-xl border border-warning bg-warning-primary p-5">
      <div className="flex items-start gap-4">
        <FeaturedIcon
          icon={Mail01}
          size="md"
          color="warning"
          theme="light"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">
            Check your email
          </p>
          <p className="mt-1 text-sm text-secondary">
            TCR sent a verification link to {email}. Click it within 7 days to
            continue your registration. If you don{"'"}t see it, check spam or
            contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rejection Debrief Card (rejected — PRD_06 Section 10.7)
// ---------------------------------------------------------------------------

export interface RejectionDetail {
  /** What was flagged — plain language */
  flagged: string;
  /** Why this triggers a flag — one sentence explaining carrier logic */
  reason: string;
  /** What we are doing — auto-fix status or manual review notice */
  action: string;
  /** What approved campaigns look like — one concrete example */
  example: string;
  /** CTA label — "We are resubmitting" or "Contact us" */
  ctaLabel: string;
  /** Whether we are auto-resubmitting */
  autoResubmit: boolean;
}

interface RejectionCardProps {
  detail: RejectionDetail | null;
}

export function RejectionCard({ detail }: RejectionCardProps) {
  if (!detail) {
    // Fallback if no structured detail is available
    return (
      <div className="rounded-xl border border-error bg-error-primary p-5">
        <div className="flex items-start gap-4">
          <FeaturedIcon
            icon={AlertTriangle}
            size="md"
            color="error"
            theme="light"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">
              Carriers flagged your registration
            </p>
            <p className="mt-1 text-sm text-secondary">
              We{"'"}re reviewing the carrier feedback and will update you with
              specific details and next steps. Your sandbox remains live.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-error bg-error-primary p-5">
      <div className="flex items-start gap-4">
        <FeaturedIcon
          icon={AlertTriangle}
          size="md"
          color="error"
          theme="light"
        />
        <div className="flex-1 space-y-3">
          <p className="text-sm font-semibold text-primary">
            Carriers flagged your registration
          </p>

          {/* What was flagged */}
          <p className="text-sm text-secondary">{detail.flagged}</p>

          {/* Why this triggers a flag */}
          <p className="text-sm text-tertiary">{detail.reason}</p>

          {/* What we are doing */}
          <p className="text-sm font-medium text-secondary">{detail.action}</p>

          {/* What approved campaigns look like */}
          <div className="rounded-lg border border-secondary bg-primary p-3">
            <p className="text-xs font-medium text-tertiary">
              Approved messages look like:
            </p>
            <p className="mt-1 text-sm text-secondary italic">
              {detail.example}
            </p>
          </div>

          {/* CTA */}
          <p className="text-sm text-secondary">
            {detail.autoResubmit
              ? "Most campaigns clear review in 2\u20133 weeks after resubmission."
              : null}
          </p>
        </div>
      </div>
    </div>
  );
}
