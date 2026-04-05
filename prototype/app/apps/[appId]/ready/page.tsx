"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle } from "@untitledui/icons";

interface Benefit {
  lead: string;
  detail: string;
}

const BENEFITS: Benefit[] = [
  {
    lead: "One prompt gets you started.",
    detail: "Your business details, your messages, ready to paste into your AI tool.",
  },
  {
    lead: "Test with real people, real phones.",
    detail:
      "Send to up to 5 people — your team, your co-founder, a client you want to impress.",
  },
  {
    lead: "An expert in your corner.",
    detail:
      "A full AI assistant that knows your business, your messages, and how SMS works.",
  },
  {
    lead: "Change a message here, your app updates automatically.",
    detail: "Edit copy on the website. No code changes, no redeployment.",
  },
  {
    lead: "You never think about compliance.",
    detail: "Opt-in forms, carrier rules, message formatting — all handled.",
  },
];

export default function ReadyPage() {
  const { appId } = useParams<{ appId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Skip the hard part
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Create a free account and start building.
      </p>

      {/* Benefits */}
      <ul className="mt-10 space-y-7">
        {BENEFITS.map((benefit) => (
          <li key={benefit.lead} className="flex items-start gap-3">
            <CheckCircle className="size-5 shrink-0 text-fg-success-primary mt-0.5" />
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-text-primary">{benefit.lead}</span>{" "}
              <span className="font-normal text-text-tertiary">{benefit.detail}</span>
            </p>
          </li>
        ))}
      </ul>

      {/* Pricing */}
      <div className="mt-12">
        <p className="text-lg font-semibold text-text-primary">
          Free while you build and test.
        </p>
        <p className="mt-1 text-base text-text-tertiary">
          When you&apos;re ready for real delivery:{" "}
          <span className="font-semibold text-text-primary">$49</span>
          {" registration + "}
          <span className="font-semibold text-text-primary">$19/mo</span>
          .
        </p>
      </div>

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
