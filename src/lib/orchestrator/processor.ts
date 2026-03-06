import { createServiceClient } from "@/lib/supabase";
import { createSubaccount } from "@/lib/twilio/subaccount";
import {
  submitSoleProprietorBrand,
  submitStandardBrand,
} from "@/lib/twilio/brand";
import type { CustomerData } from "@/lib/twilio/brand";
import { requestSecondaryVetting } from "@/lib/twilio/vetting";
import { createMessagingService } from "@/lib/twilio/messaging-service";
import { createCampaign } from "@/lib/twilio/campaign";
import {
  purchasePhoneNumber,
  assignToMessagingService,
} from "@/lib/twilio/phone-number";
import { generateArtifacts } from "@/lib/templates";
import type { IntakeData } from "@/lib/templates/types";
import { generateComplianceSite } from "@/lib/compliance-site/generator";
import { generateApiKey } from "@/lib/api-keys/generate";
import {
  updateStatus,
  type RegistrationStatus,
} from "@/lib/orchestrator/state-machine";
import {
  buildRegistrationContext,
  type RegistrationContext,
} from "@/lib/orchestrator/registration-context";
import { formatPhone } from "@/lib/intake/validation";
import { sendEmail } from "@/lib/emails/sender";
import { otpRequired, campaignApproved } from "@/lib/emails/templates";

// ---------------------------------------------------------------------------
// Logging prefix
// ---------------------------------------------------------------------------

const LOG_PREFIX = "[orchestrator/processor]";

// ---------------------------------------------------------------------------
// Helper: map a DB customer row to IntakeData
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

function customerToIntakeData(customer: Record<string, any>): IntakeData {
  return {
    use_case: customer.use_case as IntakeData["use_case"],
    business_name: customer.business_name,
    business_description: customer.business_description,
    email: customer.email,
    phone: customer.phone,
    contact_name: customer.contact_name,
    address_line1: customer.address_line1,
    address_city: customer.address_city,
    address_state: customer.address_state,
    address_zip: customer.address_zip,
    website_url: customer.website_url ?? null,
    service_type: customer.service_type ?? null,
    product_type: customer.product_type ?? null,
    app_name: customer.app_name ?? null,
    community_name: customer.community_name ?? null,
    venue_type: customer.venue_type ?? null,
    has_ein: customer.has_ein,
    ein: customer.ein ?? null,
    business_type: customer.business_type ?? null,
  };
}

// ---------------------------------------------------------------------------
// Helper: map a DB customer row to CustomerData (for brand submission)
// ---------------------------------------------------------------------------

function customerToCustomerData(customer: Record<string, any>): CustomerData {
  return {
    business_name: customer.business_name,
    business_description: customer.business_description,
    contact_name: customer.contact_name,
    email: customer.email,
    phone: customer.phone,
    address_line1: customer.address_line1,
    address_city: customer.address_city,
    address_state: customer.address_state,
    address_zip: customer.address_zip,
    has_ein: customer.has_ein,
    ein: customer.ein ?? null,
    business_type: customer.business_type ?? null,
    website_url: customer.website_url ?? null,
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// processRegistration
// ---------------------------------------------------------------------------

/**
 * Processes a registration through the pipeline state machine.
 *
 * This is the core orchestrator function. It fetches the current registration
 * and customer data, then switches on the registration status to determine
 * the next action. For statuses that complete synchronously (e.g. creating
 * a subaccount), it recurses to continue through the pipeline. For statuses
 * that require external events (e.g. brand review, OTP entry), it returns
 * and waits for a poller or webhook to re-invoke processing.
 *
 * On any error, the registration is moved to `needs_attention` with error
 * details in the metadata.
 */
export async function processRegistration(
  registrationId: string
): Promise<void> {
  const supabase = createServiceClient();

  // ---- Fetch registration ----
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", registrationId)
    .single();

  if (regError || !registration) {
    console.error(
      `${LOG_PREFIX} Failed to fetch registration ${registrationId}:`,
      regError?.message ?? "not found"
    );
    return;
  }

  // ---- Fetch customer ----
  const { data: customer, error: custError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", registration.customer_id)
    .single();

  if (custError || !customer) {
    console.error(
      `${LOG_PREFIX} Failed to fetch customer for registration ${registrationId}:`,
      custError?.message ?? "not found"
    );
    return;
  }

  // ---- Build registration context (Phase 2: projectId will be populated) ----
  const _ctx: RegistrationContext = buildRegistrationContext(
    customer.id,
    registrationId
  );

  const currentStatus = registration.status as RegistrationStatus;

  try {
    switch (currentStatus) {
      // ----------------------------------------------------------------
      // CREATING_SUBACCOUNT
      // ----------------------------------------------------------------
      case "creating_subaccount": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Creating subaccount for ${customer.business_name}`
        );

        await createSubaccount(
          customer.id,
          customer.business_name,
          registrationId
        );

        await updateStatus(
          registrationId,
          "creating_subaccount",
          "generating_artifacts"
        );

        return processRegistration(registrationId);
      }

      // ----------------------------------------------------------------
      // GENERATING_ARTIFACTS
      // ----------------------------------------------------------------
      case "generating_artifacts": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Generating artifacts and compliance site`
        );

        const intake = customerToIntakeData(customer);
        generateArtifacts(intake);
        const site = generateComplianceSite(intake);

        // Save compliance site URL to registration
        const complianceSiteUrl = `https://${site.slug}.${process.env.COMPLIANCE_SITE_DOMAIN ?? "msgverified.com"}`;
        const { error: updateError } = await supabase
          .from("registrations")
          .update({ compliance_site_url: complianceSiteUrl })
          .eq("id", registrationId);

        if (updateError) {
          throw new Error(
            `Failed to save compliance_site_url: ${updateError.message}`
          );
        }

        await updateStatus(
          registrationId,
          "generating_artifacts",
          "deploying_site"
        );

        return processRegistration(registrationId);
      }

      // ----------------------------------------------------------------
      // DEPLOYING_SITE (STUB)
      // ----------------------------------------------------------------
      case "deploying_site": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Deploying compliance site (stub — skipping)`
        );

        // TODO: deploy to Cloudflare Pages
        await updateStatus(
          registrationId,
          "deploying_site",
          "submitting_brand"
        );

        return processRegistration(registrationId);
      }

      // ----------------------------------------------------------------
      // SUBMITTING_BRAND
      // ----------------------------------------------------------------
      case "submitting_brand": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Submitting brand registration`
        );

        const customerData = customerToCustomerData(customer);

        if (customer.has_ein) {
          // Standard brand (EIN-based) — requires compliance site URL
          const result = await submitStandardBrand(
            registrationId,
            customerData,
            registration.compliance_site_url!
          );

          // Save brand SID to registration
          const { error: brandUpdateError } = await supabase
            .from("registrations")
            .update({ twilio_brand_sid: result.brandSid })
            .eq("id", registrationId);

          if (brandUpdateError) {
            throw new Error(
              `Failed to save twilio_brand_sid: ${brandUpdateError.message}`
            );
          }

          // Standard brands go to brand_pending (wait for Twilio review)
          await updateStatus(
            registrationId,
            "submitting_brand",
            "brand_pending"
          );

          console.log(
            `${LOG_PREFIX} [${registrationId}] Standard brand submitted — awaiting Twilio review`
          );
          return;
        } else {
          // Sole proprietor brand
          const result = await submitSoleProprietorBrand(
            registrationId,
            customerData
          );

          // Save brand SID to registration
          const { error: brandUpdateError } = await supabase
            .from("registrations")
            .update({ twilio_brand_sid: result.brandSid })
            .eq("id", registrationId);

          if (brandUpdateError) {
            throw new Error(
              `Failed to save twilio_brand_sid: ${brandUpdateError.message}`
            );
          }

          // Sole props go to awaiting_otp (wait for human to enter OTP)
          await updateStatus(
            registrationId,
            "submitting_brand",
            "awaiting_otp"
          );

          // Email 3: OTP required
          const otpFirstName = (customer.contact_name as string).split(" ")[0] ?? customer.contact_name;
          const tplOtp = otpRequired({
            first_name: otpFirstName,
            formatted_phone: formatPhone(customer.phone),
          });
          void sendEmail({ to: customer.email, subject: tplOtp.subject, body: tplOtp.body });

          console.log(
            `${LOG_PREFIX} [${registrationId}] Sole prop brand submitted — awaiting OTP`
          );
          return;
        }
      }

      // ----------------------------------------------------------------
      // BRAND_APPROVED
      // ----------------------------------------------------------------
      case "brand_approved": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Brand approved — determining next step`
        );

        if (customer.has_ein) {
          // Standard brands: request secondary vetting for higher trust score
          const vettingSid = await requestSecondaryVetting(
            registration.twilio_brand_sid!,
            registrationId
          );

          // Save vetting SID to registration
          const { error: vettingUpdateError } = await supabase
            .from("registrations")
            .update({ twilio_vetting_sid: vettingSid })
            .eq("id", registrationId);

          if (vettingUpdateError) {
            throw new Error(
              `Failed to save twilio_vetting_sid: ${vettingUpdateError.message}`
            );
          }

          await updateStatus(
            registrationId,
            "brand_approved",
            "vetting_in_progress"
          );

          console.log(
            `${LOG_PREFIX} [${registrationId}] Secondary vetting requested — awaiting results`
          );
          return;
        } else {
          // Sole props: skip vetting, go straight to messaging service
          await updateStatus(
            registrationId,
            "brand_approved",
            "creating_service"
          );

          return processRegistration(registrationId);
        }
      }

      // ----------------------------------------------------------------
      // CREATING_SERVICE
      // ----------------------------------------------------------------
      case "creating_service": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Creating messaging service`
        );

        const messagingServiceSid = await createMessagingService(
          registrationId,
          customer.business_name,
          customer.twilio_subaccount_sid!,
          customer.twilio_subaccount_auth!
        );

        // Save messaging service SID to registration
        const { error: msUpdateError } = await supabase
          .from("registrations")
          .update({ twilio_messaging_service_sid: messagingServiceSid })
          .eq("id", registrationId);

        if (msUpdateError) {
          throw new Error(
            `Failed to save twilio_messaging_service_sid: ${msUpdateError.message}`
          );
        }

        await updateStatus(
          registrationId,
          "creating_service",
          "submitting_campaign"
        );

        return processRegistration(registrationId);
      }

      // ----------------------------------------------------------------
      // SUBMITTING_CAMPAIGN
      // ----------------------------------------------------------------
      case "submitting_campaign": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Submitting campaign`
        );

        // Re-fetch registration to get the messaging service SID we just saved
        const { data: freshReg, error: freshRegError } = await supabase
          .from("registrations")
          .select("twilio_messaging_service_sid, twilio_brand_sid")
          .eq("id", registrationId)
          .single();

        if (freshRegError || !freshReg) {
          throw new Error(
            `Failed to re-fetch registration for campaign: ${freshRegError?.message ?? "not found"}`
          );
        }

        // Generate artifacts from customer data
        const intake = customerToIntakeData(customer);
        const artifacts = generateArtifacts(intake);

        const campaignSid = await createCampaign(
          registrationId,
          freshReg.twilio_messaging_service_sid!,
          freshReg.twilio_brand_sid!,
          customer.business_name,
          customer.email,
          artifacts,
          customer.twilio_subaccount_sid!,
          customer.twilio_subaccount_auth!
        );

        // Save campaign SID to registration
        const { error: campaignUpdateError } = await supabase
          .from("registrations")
          .update({ twilio_campaign_sid: campaignSid })
          .eq("id", registrationId);

        if (campaignUpdateError) {
          throw new Error(
            `Failed to save twilio_campaign_sid: ${campaignUpdateError.message}`
          );
        }

        await updateStatus(
          registrationId,
          "submitting_campaign",
          "campaign_pending"
        );

        console.log(
          `${LOG_PREFIX} [${registrationId}] Campaign submitted — awaiting verification`
        );
        return;
      }

      // ----------------------------------------------------------------
      // PROVISIONING_NUMBER
      // ----------------------------------------------------------------
      case "provisioning_number": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Provisioning phone number`
        );

        const { phoneNumberSid, phoneNumber } = await purchasePhoneNumber(
          registrationId,
          customer.address_state,
          customer.twilio_subaccount_sid!,
          customer.twilio_subaccount_auth!
        );

        // Re-fetch registration to get messaging service SID
        const { data: freshReg, error: freshRegError } = await supabase
          .from("registrations")
          .select("twilio_messaging_service_sid")
          .eq("id", registrationId)
          .single();

        if (freshRegError || !freshReg) {
          throw new Error(
            `Failed to re-fetch registration for number assignment: ${freshRegError?.message ?? "not found"}`
          );
        }

        await assignToMessagingService(
          registrationId,
          freshReg.twilio_messaging_service_sid!,
          phoneNumberSid,
          customer.twilio_subaccount_sid!,
          customer.twilio_subaccount_auth!
        );

        // Save phone number to registration
        const { error: phoneUpdateError } = await supabase
          .from("registrations")
          .update({ twilio_phone_number: phoneNumber })
          .eq("id", registrationId);

        if (phoneUpdateError) {
          throw new Error(
            `Failed to save twilio_phone_number: ${phoneUpdateError.message}`
          );
        }

        await updateStatus(
          registrationId,
          "provisioning_number",
          "generating_api_key"
        );

        return processRegistration(registrationId);
      }

      // ----------------------------------------------------------------
      // GENERATING_API_KEY
      // ----------------------------------------------------------------
      case "generating_api_key": {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Generating live API key`
        );

        await generateApiKey(customer.id, "live");

        // Mark customer as live-active
        const { error: liveError } = await supabase
          .from("customers")
          .update({ live_active: true })
          .eq("id", customer.id);

        if (liveError) {
          throw new Error(
            `Failed to set live_active on customer: ${liveError.message}`
          );
        }

        await updateStatus(
          registrationId,
          "generating_api_key",
          "complete"
        );

        // Email 4: campaign approved
        const approvedFirstName = (customer.contact_name as string).split(" ")[0] ?? customer.contact_name;
        const tplApproved = campaignApproved({ first_name: approvedFirstName });
        void sendEmail({ to: customer.email, subject: tplApproved.subject, body: tplApproved.body });

        console.log(
          `${LOG_PREFIX} [${registrationId}] Registration complete for ${customer.business_name}`
        );
        return;
      }

      // ----------------------------------------------------------------
      // DEFAULT — statuses that wait for external events
      // ----------------------------------------------------------------
      default: {
        console.log(
          `${LOG_PREFIX} [${registrationId}] Status "${currentStatus}" — no action (waiting for external event)`
        );
        return;
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack =
      error instanceof Error ? error.stack : undefined;

    console.error(
      `${LOG_PREFIX} [${registrationId}] Error during "${currentStatus}":`,
      errorMessage
    );

    try {
      await updateStatus(registrationId, currentStatus, "needs_attention", {
        error: errorMessage,
        stack: errorStack,
        failed_at_status: currentStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (statusError) {
      // If we can't even update status, log the catastrophic failure
      console.error(
        `${LOG_PREFIX} [${registrationId}] CRITICAL: Failed to set needs_attention:`,
        statusError instanceof Error ? statusError.message : String(statusError)
      );
    }
  }
}
