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
    detail:
      "Paste it into your AI tool and it builds your SMS feature — tailored to your app, your customers, your messages.",
  },
  {
    lead: "Test with real people, real phones.",
    detail:
      "Send messages to up to 5 people — your team, your co-founder, a client you're trying to impress.",
  },
  {
    lead: "An expert in your corner.",
    detail:
      "Not a chatbot — a full AI assistant that knows your business, your messages, and how SMS works. It helps you troubleshoot and get your app just right.",
  },
  {
    lead: "Change a message here, your app updates automatically.",
    detail:
      "No code changes, no prompts. Your app picks up the new version on the next send.",
  },
  {
    lead: "You never think about compliance.",
    detail:
      "Opt-in forms, opt-out handling, message formatting — things that sink SMS features at other companies. We handle all of it.",
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
        <p className="mt-1 text-sm text-text-tertiary">
          500 messages included. Additional messages{" "}
          <span className="font-semibold text-text-primary">$8</span>
          {" per 500."}
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
