"use client";

import { Edit05 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface ReviewDetailsCardProps {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  useCaseLabel: string;
  editHref: string;
}

function formatPhone(digits: string): string {
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

export function ReviewDetailsCard({
  businessName,
  businessType,
  contactName,
  email,
  phone,
  address,
  useCaseLabel,
  editHref,
}: ReviewDetailsCardProps) {
  const rows = [
    { label: "Business", value: businessName },
    { label: "Type", value: businessType },
    { label: "Contact", value: contactName },
    { label: "Email", value: email },
    { label: "Phone", value: formatPhone(phone) },
    { label: "Address", value: address },
    { label: "Use case", value: useCaseLabel },
  ];

  return (
    <div className="rounded-xl border border-secondary">
      <div className="flex items-center justify-between border-b border-secondary px-5 py-3">
        <h3 className="text-lg font-semibold text-primary">Your details</h3>
        <Button
          href={editHref}
          color="link-gray"
          size="sm"
          iconLeading={Edit05}
        >
          Edit
        </Button>
      </div>
      <div className="flex flex-col divide-y divide-secondary">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex px-5 py-3">
            <span className="w-24 shrink-0 text-sm text-tertiary">
              {label}
            </span>
            <span className="text-sm font-medium text-primary">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
