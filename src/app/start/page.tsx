"use client";

import { useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { UseCaseTile } from "@/components/intake/use-case-tile";
import { USE_CASE_LIST } from "@/lib/intake/use-case-data";
import {
  getIntakeSession,
  saveIntakeSession,
} from "@/lib/intake/session-storage";

export default function StartPage() {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(
    () => getIntakeSession().use_case ?? null,
  );

  function handleSelect(id: string) {
    setSelectedUseCase(id);
    saveIntakeSession({ use_case: id as Parameters<typeof saveIntakeSession>[0]["use_case"] });
  }

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-display-sm font-semibold text-primary sm:text-display-md">
            What does your app do?
          </h1>
          <p className="text-lg text-tertiary">
            Pick the closest match. This helps us write your registration for
            maximum approval odds.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {USE_CASE_LIST.map((useCase) => (
            <UseCaseTile
              key={useCase.id}
              id={useCase.id}
              label={useCase.label}
              description={useCase.description}
              icon={useCase.icon}
              isSelected={selectedUseCase === useCase.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            color="primary"
            iconTrailing={ArrowRight}
            isDisabled={!selectedUseCase}
            href={
              selectedUseCase
                ? `/start/scope?use_case=${selectedUseCase}`
                : undefined
            }
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
