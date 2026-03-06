// ---------------------------------------------------------------------------
// Compliance pipeline — orchestrates all inline checks (D-19)
// ---------------------------------------------------------------------------
// Runs before every message is forwarded to Twilio. Compliance enforcement
// is non-optional for all customers (D-19). Checks run in order and return
// at the first failure with a specific error code.

import type { AuthenticatedContext, SendMessageRequest, ComplianceResult } from "./types";
import { isOptedOut } from "./opt-out";
import { scanForShaftC } from "./content-scanner";
import { classifyMessageType, checkMarketingConsent } from "./marketing-consent";

/**
 * Run all inline compliance checks against a message.
 *
 * Check order (per PRD_09 Section 4):
 * 1. Opt-out check — $500–$1,500 TCPA fine per message
 * 2. Empty body — carrier rejection
 * 3. SHAFT-C content scan — carrier campaign suspension
 * 4. Marketing consent (MIXED tier only) — D-14
 */
export async function runCompliancePipeline(
  ctx: AuthenticatedContext,
  request: SendMessageRequest,
): Promise<ComplianceResult> {
  const checks: Record<string, boolean> = {};

  // 1. Opt-out check
  const optedOut = await isOptedOut(ctx.userId, request.to);
  checks.opt_out = !optedOut;

  if (optedOut) {
    return {
      passed: false,
      checks,
      errorCode: "recipient_opted_out",
      errorMessage:
        "Recipient has opted out of messages. Sending to opted-out recipients violates carrier rules and TCPA regulations.",
    };
  }

  // 2. Empty body check
  const bodyTrimmed = request.body.trim();
  checks.empty_body = bodyTrimmed.length > 0;

  if (bodyTrimmed.length === 0) {
    return {
      passed: false,
      checks,
      errorCode: "content_prohibited",
      errorMessage: "Message body cannot be empty.",
    };
  }

  // 3. SHAFT-C content scan
  const scanResult = scanForShaftC(request.body);
  checks.shaft_c = scanResult.passed;

  if (!scanResult.passed) {
    return {
      passed: false,
      checks,
      errorCode: "content_prohibited",
      errorMessage: `Message contains prohibited content (${scanResult.detectedCategories.join(", ")}). Carriers block this category to protect the messaging ecosystem.`,
    };
  }

  // 4. Marketing consent check (MIXED tier only, D-14)
  if (ctx.effectiveCampaignType === "mixed" && ctx.customerId) {
    const messageType = classifyMessageType(request.body);
    checks.marketing_consent = true; // default pass for transactional

    if (messageType === "marketing") {
      const hasConsent = await checkMarketingConsent(
        ctx.customerId,
        request.to,
      );
      checks.marketing_consent = hasConsent;

      if (!hasConsent) {
        return {
          passed: false,
          checks,
          errorCode: "marketing_consent_required",
          errorMessage:
            "This message contains promotional content but the recipient has not given explicit marketing consent. Register consent via POST /v1/consents before sending marketing messages.",
        };
      }
    }
  }

  // All checks passed
  return { passed: true, checks };
}
