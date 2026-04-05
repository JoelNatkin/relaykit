"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { loadWizardData, VERTICAL_LABELS } from "@/lib/wizard-storage";

const MESSAGE_COUNT = 6;

export default function ReadyPage() {
  const { appId } = useParams<{ appId: string }>();
  const [verticalLabel, setVerticalLabel] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const data = loadWizardData();
    setVerticalLabel(VERTICAL_LABELS[data.vertical] || "Appointments");
    setBusinessName(data.businessName || "Your business");
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        You&apos;re ready to build
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Here&apos;s what we set up for you.
      </p>

      {/* Summary card */}
      <div className="mt-8 rounded-lg border border-border-secondary bg-bg-primary px-4 py-3.5">
        <dl className="divide-y divide-border-tertiary">
          <div className="flex items-center justify-between py-2">
            <dt className="text-sm text-text-tertiary">Vertical</dt>
            <dd className="text-sm font-medium text-text-primary">{verticalLabel}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-sm text-text-tertiary">Business</dt>
            <dd className="text-sm font-medium text-text-primary">{businessName}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-sm text-text-tertiary">Messages</dt>
            <dd className="text-sm font-medium text-text-primary">{MESSAGE_COUNT} messages ready</dd>
          </div>
        </dl>
      </div>

      {/* What you get */}
      <p className="mt-8 text-sm text-text-tertiary leading-relaxed">
        A sandbox API key, the RelayKit SDK, and a ready-to-paste prompt for your AI coding tool. Your app will have working SMS in minutes.
      </p>

      {/* Pricing */}
      <p className="mt-6 text-sm text-text-tertiary leading-relaxed">
        Free while you build and test. When you&apos;re ready for real delivery:{" "}
        <span className="font-semibold text-text-primary">$49</span>
        {" registration + "}
        <span className="font-semibold text-text-primary">$19/mo</span>
        .
      </p>

      {/* CTA */}
      <Link
        href={`/apps/${appId}/signup`}
        className="mt-10 block w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-center text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
      >
        Create account
      </Link>
    </div>
  );
}
