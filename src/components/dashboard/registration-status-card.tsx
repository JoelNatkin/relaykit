"use client";

import { CheckCircle, Loading02 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/**
 * Maps registration statuses to the 4-step stepper.
 *
 * Step 1 — Submitted: initial setup, artifact generation, site deployment
 * Step 2 — Brand Review: brand submitted to TCR, awaiting approval
 * Step 3 — Campaign Review: brand approved, campaign submitted to carriers
 * Step 4 — Ready: provisioning, key generation, complete
 */

type StepState = "completed" | "active" | "upcoming";

interface StepperStep {
  label: string;
  state: StepState;
}

const STEP_1_STATUSES = new Set([
  "pending_payment",
  "creating_subaccount",
  "generating_artifacts",
  "deploying_site",
  "submitting_brand",
]);

const STEP_2_STATUSES = new Set([
  "awaiting_otp",
  "awaiting_brand_auth",
  "brand_pending",
]);

const STEP_3_STATUSES = new Set([
  "brand_approved",
  "vetting_in_progress",
  "creating_service",
  "submitting_campaign",
  "campaign_pending",
]);

const STEP_4_STATUSES = new Set([
  "provisioning_number",
  "generating_api_key",
  "complete",
]);

function getActiveStep(status: string): number {
  if (STEP_1_STATUSES.has(status)) return 1;
  if (STEP_2_STATUSES.has(status)) return 2;
  if (STEP_3_STATUSES.has(status)) return 3;
  if (STEP_4_STATUSES.has(status)) return 4;
  // needs_attention or rejected — show last known step as active
  return 1;
}

function buildSteps(activeStep: number): StepperStep[] {
  const labels = ["Submitted", "Brand review", "Campaign review", "Ready!"];
  return labels.map((label, i) => {
    const step = i + 1;
    let state: StepState;
    if (step < activeStep) state = "completed";
    else if (step === activeStep) state = "active";
    else state = "upcoming";
    return { label, state };
  });
}

/** Narrative copy for each active step — exact copy from PRD_06 Section 10.1 */
function getNarrative(status: string): string | null {
  if (STEP_1_STATUSES.has(status)) {
    return "Your registration is submitted. We\u2019re generating your compliance artifacts and setting up your Twilio account. This usually completes in a few minutes.";
  }

  if (STEP_2_STATUSES.has(status)) {
    return "Your brand is submitted to The Campaign Registry. Carriers are verifying your business identity \u2014 this is the step that establishes your trust score and determines your message throughput. Most brands clear in 1\u20135 business days.\n\nYour sandbox is live. Keep building \u2014 your app will be ready when your registration clears.";
  }

  if (STEP_3_STATUSES.has(status)) {
    return "Your brand is verified. Your campaign is submitted. Carriers are reviewing your traffic profile \u2014 this is the step that makes everything downstream trustworthy. Campaign reviews typically take 2\u20133 weeks.\n\nIn the meantime, your sandbox is live. Keep building.";
  }

  if (status === "complete") {
    return null; // Approval moment handled by a separate resources card
  }

  if (STEP_4_STATUSES.has(status)) {
    return "Your campaign is approved. We\u2019re provisioning your phone number and generating your live API key. Almost there.";
  }

  return null;
}

interface RegistrationStatusCardProps {
  status: string;
}

export function RegistrationStatusCard({ status }: RegistrationStatusCardProps) {
  // Don't render for rejected or complete — those get their own cards
  if (status === "rejected" || status === "complete") return null;

  const activeStep = getActiveStep(status);
  const steps = buildSteps(activeStep);
  const narrative = getNarrative(status);

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <h3 className="text-sm font-semibold text-primary">
        Registration progress
      </h3>

      {/* Stepper bar */}
      <div className="mt-4 flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cx(
                  "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                  step.state === "completed" &&
                    "bg-success-primary text-white",
                  step.state === "active" &&
                    "bg-brand-solid text-white",
                  step.state === "upcoming" &&
                    "bg-quaternary text-quaternary",
                )}
              >
                {step.state === "completed" ? (
                  <CheckCircle className="size-4" />
                ) : step.state === "active" ? (
                  <Loading02 className="size-4 animate-spin" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cx(
                  "mt-1.5 text-center text-xs font-medium whitespace-nowrap",
                  step.state === "completed" && "text-success-primary",
                  step.state === "active" && "text-brand-secondary",
                  step.state === "upcoming" && "text-quaternary",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {i < steps.length - 1 && (
              <div
                className={cx(
                  "mx-1 mb-5 h-0.5 flex-1",
                  i + 1 < activeStep ? "bg-success-primary" : "bg-quaternary",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Narrative copy — never leave a pending state without narrative (D-32) */}
      {narrative && (
        <div className="mt-4 rounded-lg bg-secondary p-4">
          {narrative.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className={cx(
                "text-sm text-secondary",
                i > 0 && "mt-3",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
