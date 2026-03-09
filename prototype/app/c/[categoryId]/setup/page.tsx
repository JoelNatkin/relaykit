"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { useSession } from "@/context/session-context";
import type { PersonalizationField } from "@/data/categories";

type SessionFieldKey =
  | "appName"
  | "website"
  | "serviceType"
  | "productType"
  | "venueType"
  | "whatYouSell";

export default function SetupPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { state, setField } = useSession();

  const category = CATEGORIES.find((c) => c.id === params.categoryId);

  useEffect(() => {
    if (!category) router.replace("/choose");
  }, [category, router]);

  if (!category) return null;

  const Icon = category.icon;

  function handleContinue() {
    router.push(`/c/${params.categoryId}/plan`);
  }

  function handleSkip() {
    router.push(`/c/${params.categoryId}/plan`);
  }

  return (
    <div className="mx-auto mt-12 max-w-lg px-4">
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border-secondary bg-bg-primary shadow-xs">
            <Icon className="size-6 text-fg-quaternary" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-text-primary">
            Tell us about your app
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">
            This personalizes every message preview. Takes ten seconds.
          </p>
        </div>

        <div className="space-y-5">
          {category.personalizationFields.map((field: PersonalizationField) => (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                type="text"
                placeholder={field.placeholder}
                value={state[field.key as SessionFieldKey] || ""}
                onChange={(e) => setField(field.key, e.target.value)}
                className="w-full rounded-lg border border-border-primary px-3.5 py-2.5 text-sm text-text-primary shadow-xs placeholder:text-text-placeholder focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-focus-ring"
              />
              <p className="mt-1.5 text-xs text-text-tertiary">{field.helperText}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-lg bg-bg-brand-solid py-2.5 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Continue &rarr;
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 w-full cursor-pointer text-center text-sm text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
        >
          Skip for now &rarr;
        </button>
      </div>
    </div>
  );
}
