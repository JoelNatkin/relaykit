"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@untitledui/icons";
import { ReviewConfirm } from "@/components/registration/review-confirm";
import type { UseCaseId } from "@/lib/intake/use-case-data";

export default function RegisterReviewPage() {
  const { appId } = useParams<{ appId: string }>();
  const router = useRouter();
  const [businessDetails, setBusinessDetails] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("relaykit_registration");
    if (stored) {
      setBusinessDetails(JSON.parse(stored));
    }
  }, []);

  if (!businessDetails) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/apps/${appId}/register`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
        >
          <ArrowLeft className="size-4" />
          Back to registration form
        </Link>
        <p className="mt-8 text-sm text-text-tertiary">
          No registration data found. Please fill out the business details form first.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back link */}
      <Link
        href={`/apps/${appId}/register`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
      >
        <ArrowLeft className="size-4" />
        Back to business details
      </Link>

      <div className="mt-6">
        <ReviewConfirm
          businessDetails={businessDetails}
          useCaseId={"appointments" as UseCaseId}
          selectedExpansions={[]}
          onEditDetails={() => router.push(`/apps/${appId}/register`)}
        />
      </div>
    </div>
  );
}
