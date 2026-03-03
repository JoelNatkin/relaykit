import { createServiceClient } from "@/lib/supabase";
import {
  fetchBrandStatus,
  fetchVettingStatus,
  fetchCampaignStatus,
} from "@/lib/twilio/poll";
import { updateStatus } from "@/lib/orchestrator/state-machine";
import { processRegistration } from "@/lib/orchestrator/processor";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PollResult {
  brandPolled: number;
  brandAdvanced: number;
  vettingPolled: number;
  vettingAdvanced: number;
  campaignPolled: number;
  campaignAdvanced: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Logging prefix
// ---------------------------------------------------------------------------

const LOG_PREFIX = "[orchestrator/poller]";

// ---------------------------------------------------------------------------
// pollPendingRegistrations
// ---------------------------------------------------------------------------

/**
 * Polls all registrations that are waiting for external Twilio events.
 *
 * Checks three categories:
 * 1. `brand_pending` — polls brand registration status
 * 2. `vetting_in_progress` — polls secondary vetting status
 * 3. `campaign_pending` — polls campaign verification status
 *
 * For each registration that has advanced (approved/verified), the poller
 * transitions the status and invokes `processRegistration` to continue
 * the pipeline. Errors on individual registrations are caught and collected
 * without stopping the rest of the poll.
 *
 * @returns Summary of what was polled, advanced, and any errors encountered.
 */
export async function pollPendingRegistrations(): Promise<PollResult> {
  const supabase = createServiceClient();
  const result: PollResult = {
    brandPolled: 0,
    brandAdvanced: 0,
    vettingPolled: 0,
    vettingAdvanced: 0,
    campaignPolled: 0,
    campaignAdvanced: 0,
    errors: [],
  };

  // ====================================================================
  // 1. Poll brand_pending registrations
  // ====================================================================

  const { data: brandPending, error: brandQueryError } = await supabase
    .from("registrations")
    .select("id, twilio_brand_sid")
    .eq("status", "brand_pending");

  if (brandQueryError) {
    result.errors.push(
      `Failed to query brand_pending registrations: ${brandQueryError.message}`
    );
  } else if (brandPending && brandPending.length > 0) {
    console.log(
      `${LOG_PREFIX} Polling ${brandPending.length} brand_pending registrations`
    );

    for (const reg of brandPending) {
      result.brandPolled++;

      try {
        if (!reg.twilio_brand_sid) {
          result.errors.push(
            `Registration ${reg.id} is brand_pending but has no twilio_brand_sid`
          );
          continue;
        }

        const { status, failureReason } = await fetchBrandStatus(
          reg.twilio_brand_sid,
          reg.id
        );

        console.log(
          `${LOG_PREFIX} [${reg.id}] Brand status: ${status}`
        );

        if (status === "APPROVED") {
          await updateStatus(reg.id, "brand_pending", "brand_approved");
          result.brandAdvanced++;
          // Continue the pipeline
          await processRegistration(reg.id);
        } else if (status === "FAILED") {
          await updateStatus(reg.id, "brand_pending", "rejected", {
            rejection_reason: failureReason ?? "Brand registration failed",
            rejected_at: new Date().toISOString(),
          });

          // Also persist the rejection reason on the registration row
          await supabase
            .from("registrations")
            .update({ rejection_reason: failureReason ?? "Brand registration failed" })
            .eq("id", reg.id);

          result.brandAdvanced++;
          console.log(
            `${LOG_PREFIX} [${reg.id}] Brand REJECTED: ${failureReason}`
          );
        }
        // Other statuses (PENDING, IN_REVIEW, etc.) — no action, keep polling
      } catch (error) {
        const msg = `Brand poll error for ${reg.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`${LOG_PREFIX} ${msg}`);
        result.errors.push(msg);
      }
    }
  }

  // ====================================================================
  // 2. Poll vetting_in_progress registrations
  // ====================================================================

  const { data: vettingPending, error: vettingQueryError } = await supabase
    .from("registrations")
    .select("id, twilio_brand_sid, twilio_vetting_sid")
    .eq("status", "vetting_in_progress");

  if (vettingQueryError) {
    result.errors.push(
      `Failed to query vetting_in_progress registrations: ${vettingQueryError.message}`
    );
  } else if (vettingPending && vettingPending.length > 0) {
    console.log(
      `${LOG_PREFIX} Polling ${vettingPending.length} vetting_in_progress registrations`
    );

    for (const reg of vettingPending) {
      result.vettingPolled++;

      try {
        if (!reg.twilio_brand_sid || !reg.twilio_vetting_sid) {
          result.errors.push(
            `Registration ${reg.id} is vetting_in_progress but missing brand_sid or vetting_sid`
          );
          continue;
        }

        const { status, score } = await fetchVettingStatus(
          reg.twilio_brand_sid,
          reg.twilio_vetting_sid,
          reg.id
        );

        console.log(
          `${LOG_PREFIX} [${reg.id}] Vetting status: ${status}${score !== undefined ? ` (score: ${score})` : ""}`
        );

        if (status === "VETTING_COMPLETE" || status === "SCORED") {
          // Save trust score if present
          if (score !== undefined) {
            await supabase
              .from("registrations")
              .update({ trust_score: score })
              .eq("id", reg.id);
          }

          await updateStatus(
            reg.id,
            "vetting_in_progress",
            "creating_service"
          );
          result.vettingAdvanced++;
          // Continue the pipeline
          await processRegistration(reg.id);
        } else if (status === "FAILED") {
          await updateStatus(reg.id, "vetting_in_progress", "rejected", {
            rejection_reason: "Secondary vetting failed",
            rejected_at: new Date().toISOString(),
          });

          await supabase
            .from("registrations")
            .update({ rejection_reason: "Secondary vetting failed" })
            .eq("id", reg.id);

          result.vettingAdvanced++;
          console.log(
            `${LOG_PREFIX} [${reg.id}] Vetting FAILED`
          );
        }
        // Other statuses (PENDING, IN_PROGRESS, etc.) — no action, keep polling
      } catch (error) {
        const msg = `Vetting poll error for ${reg.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`${LOG_PREFIX} ${msg}`);
        result.errors.push(msg);
      }
    }
  }

  // ====================================================================
  // 3. Poll campaign_pending registrations
  // ====================================================================

  const { data: campaignPending, error: campaignQueryError } = await supabase
    .from("registrations")
    .select("id, twilio_messaging_service_sid, customer_id")
    .eq("status", "campaign_pending");

  if (campaignQueryError) {
    result.errors.push(
      `Failed to query campaign_pending registrations: ${campaignQueryError.message}`
    );
  } else if (campaignPending && campaignPending.length > 0) {
    console.log(
      `${LOG_PREFIX} Polling ${campaignPending.length} campaign_pending registrations`
    );

    for (const reg of campaignPending) {
      result.campaignPolled++;

      try {
        if (!reg.twilio_messaging_service_sid) {
          result.errors.push(
            `Registration ${reg.id} is campaign_pending but has no twilio_messaging_service_sid`
          );
          continue;
        }

        // Fetch customer's subaccount credentials
        const { data: cust, error: custError } = await supabase
          .from("customers")
          .select("twilio_subaccount_sid, twilio_subaccount_auth")
          .eq("id", reg.customer_id)
          .single();

        if (custError || !cust) {
          result.errors.push(
            `Failed to fetch customer for campaign poll ${reg.id}: ${custError?.message ?? "not found"}`
          );
          continue;
        }

        if (!cust.twilio_subaccount_sid || !cust.twilio_subaccount_auth) {
          result.errors.push(
            `Customer for ${reg.id} has no subaccount credentials`
          );
          continue;
        }

        const { status, failureReason } = await fetchCampaignStatus(
          reg.twilio_messaging_service_sid,
          reg.id,
          cust.twilio_subaccount_sid,
          cust.twilio_subaccount_auth
        );

        console.log(
          `${LOG_PREFIX} [${reg.id}] Campaign status: ${status}`
        );

        if (status === "VERIFIED") {
          await updateStatus(
            reg.id,
            "campaign_pending",
            "provisioning_number"
          );
          result.campaignAdvanced++;
          // Continue the pipeline
          await processRegistration(reg.id);
        } else if (status === "FAILED") {
          await updateStatus(reg.id, "campaign_pending", "rejected", {
            rejection_reason: failureReason ?? "Campaign verification failed",
            rejected_at: new Date().toISOString(),
          });

          await supabase
            .from("registrations")
            .update({
              rejection_reason: failureReason ?? "Campaign verification failed",
            })
            .eq("id", reg.id);

          result.campaignAdvanced++;
          console.log(
            `${LOG_PREFIX} [${reg.id}] Campaign REJECTED: ${failureReason}`
          );
        }
        // Other statuses (PENDING, IN_REVIEW, etc.) — no action, keep polling
      } catch (error) {
        const msg = `Campaign poll error for ${reg.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`${LOG_PREFIX} ${msg}`);
        result.errors.push(msg);
      }
    }
  }

  // ====================================================================
  // Summary
  // ====================================================================

  console.log(
    `${LOG_PREFIX} Poll complete — ` +
      `brands: ${result.brandPolled} polled / ${result.brandAdvanced} advanced, ` +
      `vetting: ${result.vettingPolled} polled / ${result.vettingAdvanced} advanced, ` +
      `campaigns: ${result.campaignPolled} polled / ${result.campaignAdvanced} advanced` +
      (result.errors.length > 0
        ? `, ${result.errors.length} error(s)`
        : "")
  );

  return result;
}
