# PRD_04: TWILIO SUBMISSION ENGINE
## RelayKit — Programmatic 10DLC Registration Pipeline
### Version 2.0 — Mar 1, 2026

> **Dependencies:** Requires generated artifacts from PRD_02, live compliance site from PRD_03, and customer data from PRD_01. Outputs feed PRD_05 (Deliverable), PRD_06 (Dashboard), and PRD_09 (Messaging Proxy — API key generation and webhook configuration).
>
> **CHANGE LOG (v2.0):** Architecture changed from #4 (shared account with Messaging Services) to #1 (subaccounts per customer). Post-registration now includes RelayKit API key generation and proxy webhook configuration. Required by the messaging proxy (PRD_09).

---

## 1. OVERVIEW

The Twilio submission engine programmatically registers the customer's brand, creates a messaging campaign, provisions a phone number, and monitors the entire process through approval. It operates as an ISV (Independent Software Vendor) using RelayKit's own Twilio account — customers never interact with Twilio directly.

### ISV model implications
- RelayKit has a single Twilio account with ISV status
- Each customer gets a dedicated Twilio subaccount for isolation
- Each customer is registered as a separate Brand under their subaccount
- Each customer gets one Campaign under their Brand
- Each customer gets one dedicated phone number added to a Messaging Service
- Messaging Service webhooks point to RelayKit's proxy API for message routing
- RelayKit is the Campaign Service Provider (CSP); customers are the end brands
- RelayKit is responsible for compliance of all campaigns under our account

### Why subaccounts (Architecture #1)
The messaging proxy (PRD_09) requires per-customer isolation. Subaccounts provide:
- Isolated credentials (subaccount SID + auth token) — the proxy uses these to forward messages
- Isolated opt-out lists at Twilio's level (defense-in-depth with RelayKit's own opt-out database)
- Isolated compliance enforcement — if one customer is flagged by Twilio, action targets their subaccount only
- Clean usage reporting per customer via Twilio's billing API

### Registration sequence (happy path)
```
0. Create Twilio Subaccount              (instant)
     ↓
1. Create Brand Registration             (async — 1-7 days for standard, minutes for sole prop)
     ↓ [wait for APPROVED status]
2. Request Secondary Vetting             (if standard brand — for higher trust score)
     ↓ [wait for VETTING_COMPLETE]
3. Create Messaging Service              (instant)
4. Create Campaign (Usa2p)               (async — 3-14 days)
     ↓ [wait for VERIFIED status]
5. Purchase Phone Number                 (instant)
6. Add Number to Messaging Service       (instant)
7. Generate RelayKit live API key        (instant)
8. Configure proxy webhook URLs          (instant)
9. Registration complete → trigger deliverable generation (PRD_05)
```

Total typical timeline: **3-14 days** (sole proprietor: 1-5 days, standard brand: 5-14 days)

---

## 2. ISV ACCOUNT SETUP (ONE-TIME)

Before the product can submit registrations, RelayKit's Twilio account needs ISV configuration.

### Prerequisites
- [x] Twilio account upgraded to production (not trial)
- [x] A2P 10DLC messaging enabled on account
- [x] ISV registration completed (RelayKit registered as a CSP with TCR)
- [x] Primary Customer Profile approved (BUbfecbab444122d133e92e81d7a57f056)
- [ ] Webhook URLs configured for status callbacks
- [ ] Sufficient Twilio account balance for registration fees + phone number purchases

### Twilio fee structure (pass-through costs per customer)
| Item | Cost | Frequency |
|------|------|-----------|
| Brand registration (sole prop) | $4.50 | One-time |
| Brand registration (low volume standard) | $4.50 | One-time |
| Brand registration (standard, includes vetting) | $46.00 | One-time |
| Campaign vetting | $15.00 | One-time |
| Phone number | ~$1.15/month | Recurring |
| Campaign fee | $1.50–$10.00/month | Recurring (varies by use case) |
| **Total initial (sole prop / low vol standard)** | **~$20.65** | — |
| **Total initial (standard)** | **~$62.15** | — |
| **Total recurring** | **~$2.65–$11.15/mo** | — |

> **Note:** Secondary vetting is now bundled into the $46 Standard Brand fee (as of Aug 2025). It is no longer a separate $41.50 charge.

---

## 3. STEP 0: CREATE SUBACCOUNT

```typescript
async function createSubaccount(customer: Customer): Promise<string> {
  const subaccount = await twilioClient.api.accounts.create({
    friendlyName: `RelayKit — ${customer.business_name} (${customer.id})`,
  });

  // Store encrypted credentials
  await supabase.from('customers').update({
    twilio_subaccount_sid: subaccount.sid,
    twilio_subaccount_auth: encrypt(subaccount.authToken), // Supabase Vault
  }).eq('id', customer.id);

  return subaccount.sid;
}
```

The subaccount is created immediately after payment. All subsequent Twilio operations (brand registration, campaign, phone number) happen under this subaccount. The parent account (RelayKit's) can manage all subaccounts.

> **NOTE:** Brand registration and Trust Hub operations are performed using the parent account's credentials but reference the subaccount. Phone number purchases and Messaging Service creation happen within the subaccount.

---

## 4. STEP 1: BRAND REGISTRATION

### Sole proprietor (has_ein = false)

```typescript
// POST https://messaging.twilio.com/v1/a2p/BrandRegistrations/SoleProprietors
const brand = await twilioClient.messaging.v1.a2p.brandRegistrations
  .soleProprietors.create({
    customerProfileBundleSid: customerProfileSid, // created first — see below
  });
```

**Before brand registration, create a Customer Profile Bundle:**
```typescript
// 1. Create Trust Product (Customer Profile)
const trustProduct = await twilioClient.trusthub.v1.customerProfiles.create({
  friendlyName: `${intake.business_name} - RelayKit`,
  email: intake.email,
  policySid: 'RN...', // Sole Proprietor policy SID
});

// 2. Add End User to Trust Product
const endUser = await twilioClient.trusthub.v1.endUsers.create({
  friendlyName: intake.contact_name,
  type: 'sole_proprietor',
  attributes: {
    first_name: intake.contact_name.split(' ')[0],
    last_name: intake.contact_name.split(' ').slice(1).join(' '),
    phone_number: `+1${intake.phone}`,
    email: intake.email,
    address: {
      street: intake.address_line1,
      city: intake.address_city,
      region: intake.address_state,
      postal_code: intake.address_zip,
      iso_country: 'US',
    },
  },
});

// 3. Attach End User to Trust Product
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .customerProfilesEntityAssignments.create({
    objectSid: endUser.sid,
  });

// 4. Submit Trust Product for evaluation
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .update({ status: 'pending-review' });
```

**OTP verification (sole proprietor only):**
After brand registration is created, Twilio sends an OTP code to the customer's phone number. The customer must enter this code to verify ownership.

```typescript
// Customer enters OTP code in our dashboard
// We submit it to Twilio
await twilioClient.messaging.v1.a2p.brandRegistrations(brandSid)
  .brandVettings.create({
    vettingProvider: 'campaign-verify',
    vettingId: otpCode, // The code the customer entered
  });
```

**Dashboard integration (PRD_06):** After payment, if sole proprietor, show a screen: "We sent a verification code to {formatted_phone}. Enter it below to continue your registration." Input field + submit button. This is the one human-in-the-loop step.

### Standard brand (has_ein = true)

```typescript
// 1. Create Trust Product (Business Profile)
const trustProduct = await twilioClient.trusthub.v1.customerProfiles.create({
  friendlyName: `${intake.business_name} - RelayKit`,
  email: intake.email,
  policySid: 'RN...', // A2P Messaging Profile policy SID
});

// 2. Create Business End User
const endUser = await twilioClient.trusthub.v1.endUsers.create({
  friendlyName: intake.business_name,
  type: 'customer_profile_business_information',
  attributes: {
    business_name: intake.business_name,
    business_type: mapBusinessType(intake.business_type),
    business_registration_identifier: intake.ein,
    business_identity: 'direct_customer',
    business_industry: 'TECHNOLOGY', // Default — refine if needed
    business_regions_of_operation: 'USA',
    website_url: artifacts.compliance_site_url,
    social_media_profile_urls: '',
  },
});

// 3. Create Authorized Representative
const authRep = await twilioClient.trusthub.v1.endUsers.create({
  friendlyName: intake.contact_name,
  type: 'authorized_representative_1',
  attributes: {
    first_name: intake.contact_name.split(' ')[0],
    last_name: intake.contact_name.split(' ').slice(1).join(' '),
    phone_number: `+1${intake.phone}`,
    email: intake.email,
    title: 'Owner',
  },
});

// 4. Create Address
const address = await twilioClient.addresses.create({
  friendlyName: `${intake.business_name} Address`,
  customerName: intake.business_name,
  street: intake.address_line1,
  city: intake.address_city,
  region: intake.address_state,
  postalCode: intake.address_zip,
  isoCountry: 'US',
});

// 5. Attach all to Trust Product
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .customerProfilesEntityAssignments.create({ objectSid: endUser.sid });
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .customerProfilesEntityAssignments.create({ objectSid: authRep.sid });
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .customerProfilesEntityAssignments.create({ objectSid: address.sid });

// 6. Submit for evaluation
await twilioClient.trusthub.v1.customerProfiles(trustProduct.sid)
  .update({ status: 'pending-review' });

// 7. Create Brand Registration
const brand = await twilioClient.messaging.v1
  .a2p.brandRegistrations.create({
    customerProfileBundleSid: trustProduct.sid,
    a2pProfileBundleSid: trustProduct.sid,
  });
```

### Brand status values
| Status | Meaning | Action |
|--------|---------|--------|
| `PENDING` | Submitted, awaiting review | Wait — poll every 30 minutes |
| `APPROVED` | Brand accepted by TCR | Proceed to vetting (standard) or campaign (sole prop) |
| `FAILED` | Brand rejected | Parse reason, attempt fix, resubmit or escalate |
| `IN_REVIEW` | Under manual review | Wait — poll every 30 minutes |
| `DELETED` | Brand was removed | Error state — investigate |

### Polling vs webhooks
Twilio supports Event Streams for status callbacks, but setup is complex. For v1, use polling:
```typescript
// Poll every 30 minutes until resolved
async function pollBrandStatus(brandSid: string): Promise<string> {
  const brand = await twilioClient.messaging.v1
    .a2p.brandRegistrations(brandSid).fetch();
  return brand.status;
}
```

Implement as a Cloudflare Worker cron trigger or Supabase Edge Function with pg_cron.

---

## 5. STEP 2: SECONDARY VETTING (Standard brands only)

After brand approval, request enhanced vetting for a higher trust score (affects message throughput).

```typescript
const vetting = await twilioClient.messaging.v1
  .a2p.brandRegistrations(brandSid)
  .brandVettings.create({
    vettingProvider: 'campaign-verify',
  });
```

This is now bundled in the $46 standard brand fee. The trust score result determines message throughput limits and is used by the proxy's rate limiter (PRD_09 Section 4).

### Skip vetting option
For sole proprietors, secondary vetting is not available. For standard brands, we always request it to maximize throughput.

---

## 6. STEP 3: CREATE MESSAGING SERVICE

```typescript
// Create Messaging Service within the subaccount
const subaccountClient = twilio(subaccountSid, subaccountAuth);

const messagingService = await subaccountClient.messaging.v1.services.create({
  friendlyName: `${intake.business_name} - SMS`,
  inboundRequestUrl: `https://api.relaykit.dev/webhooks/inbound/${registrationId}`,
  inboundMethod: 'POST',
  statusCallback: `https://api.relaykit.dev/webhooks/status/${registrationId}`,
  useInboundWebhookOnNumber: false, // Use service-level webhook
});

// Store SID
await supabase.from('registrations').update({
  twilio_messaging_service_sid: messagingService.sid,
}).eq('id', registrationId);
```

The messaging service is the container that links the phone number, campaign, and webhook configuration. Webhook URLs point to RelayKit's proxy API so all inbound messages and status callbacks route through RelayKit for compliance monitoring and webhook forwarding to the customer.

---

## 7. STEP 4: CREATE CAMPAIGN

```typescript
const campaign = await subaccountClient.messaging.v1
  .services(messagingServiceSid)
  .usAppToPerson.create({
    brandRegistrationSid: brandSid,
    description: artifacts.campaign_description,
    messageFlow: artifacts.opt_in_description,
    messageSamples: artifacts.sample_messages,
    usAppToPersonUsecase: artifacts.tcr_use_case, // e.g., 'CUSTOMER_CARE'
    hasEmbeddedLinks: true,
    hasEmbeddedPhone: false,
    subscriberOptIn: true,
    subscriberOptOut: true,
    subscriberHelp: true,
    optInMessage: `You are now subscribed to ${intake.business_name} updates. Reply HELP for help. Reply STOP to unsubscribe.`,
    optOutMessage: `You have been unsubscribed from ${intake.business_name} messages. You will no longer receive texts. Reply START to re-subscribe.`,
    helpMessage: `${intake.business_name}: For help, contact ${intake.email}. Reply STOP to unsubscribe.`,
    optInKeywords: ['START', 'SUBSCRIBE', 'YES'],
    optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'],
    helpKeywords: ['HELP', 'INFO'],
  });

// Store SID
await supabase.from('registrations').update({
  twilio_campaign_sid: campaign.sid,
}).eq('id', registrationId);
```

### Campaign status values
| Status | Meaning | Action |
|--------|---------|--------|
| `PENDING` | Submitted to TCR | Wait — poll every 30 minutes |
| `IN_PROGRESS` | Under DCA review | Wait |
| `VERIFIED` | Approved by carriers | Proceed to phone number provisioning |
| `FAILED` | Rejected | Parse reason, fix, resubmit |

---

## 8. STEPS 5-6: PHONE NUMBER + MESSAGING SERVICE ASSIGNMENT

```typescript
// Purchase a local US number within the subaccount
const number = await subaccountClient.incomingPhoneNumbers.create({
  areaCode: intake.address_state ? getAreaCodeForState(intake.address_state) : undefined,
  smsEnabled: true,
  voiceEnabled: false,
});

// Add to messaging service
await subaccountClient.messaging.v1
  .services(messagingServiceSid)
  .phoneNumbers.create({
    phoneNumberSid: number.sid,
  });

// Store
await supabase.from('registrations').update({
  twilio_phone_number: number.phoneNumber,
}).eq('id', registrationId);
```

### Area code preference
Try to match the customer's state for a local feel. If unavailable, any US number works. Don't block on area code preference.

```typescript
const STATE_AREA_CODES: Record<string, string> = {
  'TX': '512', 'CA': '415', 'NY': '212', 'FL': '305',
  'IL': '312', 'WA': '206', 'CO': '303', 'GA': '404',
  // ... extend as needed, these are just preferences
};
```

---

## 9. STEPS 7-8: API KEY GENERATION + PROXY WEBHOOK CONFIGURATION

These are new steps added for the messaging proxy (PRD_09).

### Generate RelayKit live API key

```typescript
import { randomBytes, createHash } from 'crypto';

async function generateApiKey(customerId: string, environment: 'sandbox' | 'live'): Promise<string> {
  const prefix = environment === 'live' ? 'rk_live_' : 'rk_sandbox_';
  const random = randomBytes(24).toString('base64url'); // 32 chars
  const fullKey = `${prefix}${random}`;
  
  // Store hash only — never store the plaintext key
  const keyHash = createHash('sha256').update(fullKey).digest('hex');
  const keyPrefix = fullKey.substring(0, 12); // For dashboard display
  
  await supabase.from('api_keys').insert({
    customer_id: customerId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    environment,
    is_active: true,
  });
  
  // Return the full key ONCE — it can never be retrieved again
  return fullKey;
}
```

The live API key is generated at registration completion and displayed on the dashboard. The customer also receives it in the MESSAGING_SETUP.md deliverable (PRD_05).

### Verify proxy webhook URLs are configured

The Messaging Service webhooks were already set during Step 3 (Create Messaging Service). At this point, verify they're correctly pointing to the proxy:

```typescript
async function verifyProxyWebhooks(
  subaccountClient: any,
  messagingServiceSid: string,
  registrationId: string
): Promise<boolean> {
  const service = await subaccountClient.messaging.v1
    .services(messagingServiceSid).fetch();
  
  const expectedInbound = `https://api.relaykit.dev/webhooks/inbound/${registrationId}`;
  const expectedStatus = `https://api.relaykit.dev/webhooks/status/${registrationId}`;
  
  return (
    service.inboundRequestUrl === expectedInbound &&
    service.statusCallback === expectedStatus
  );
}
```

---

## 10. ORCHESTRATION STATE MACHINE

The registration process is asynchronous and multi-step. A state machine manages the flow.

### States
```typescript
enum RegistrationStatus {
  PENDING_PAYMENT = 'pending_payment',
  CREATING_SUBACCOUNT = 'creating_subaccount',
  GENERATING_ARTIFACTS = 'generating_artifacts',
  DEPLOYING_SITE = 'deploying_site',
  VERIFYING_SITE = 'verifying_site',
  SUBMITTING_BRAND = 'submitting_brand',
  AWAITING_OTP = 'awaiting_otp',           // Sole prop only
  AWAITING_BRAND_AUTH = 'awaiting_brand_auth', // Auth+ 2.0: public/for-profit brands must click email verification link from TCR within 7 days. Phase 2: will expand to all brand types per TCR's stated roadmap. Dashboard state card: "Check your email — TCR sent a verification link to {email}. Click it within 7 days to continue."
  BRAND_PENDING = 'brand_pending',
  BRAND_APPROVED = 'brand_approved',
  VETTING_IN_PROGRESS = 'vetting_in_progress', // Standard only
  CREATING_SERVICE = 'creating_service',
  SUBMITTING_CAMPAIGN = 'submitting_campaign',
  CAMPAIGN_PENDING = 'campaign_pending',
  PROVISIONING_NUMBER = 'provisioning_number',
  GENERATING_API_KEY = 'generating_api_key',
  COMPLETE = 'complete',
  REJECTED = 'rejected',
  NEEDS_ATTENTION = 'needs_attention',
}
```

### State transitions
```
PENDING_PAYMENT
  → (Stripe webhook) → CREATING_SUBACCOUNT
  → (subaccount created) → GENERATING_ARTIFACTS
  → (template engine completes) → DEPLOYING_SITE
  → (site deployed) → VERIFYING_SITE
  → (site verified) → SUBMITTING_BRAND
  → (sole prop?) → AWAITING_OTP → (OTP submitted) → BRAND_PENDING
  → (standard?) → BRAND_PENDING
  → (brand approved) → BRAND_APPROVED
  → (standard?) → VETTING_IN_PROGRESS → (vetting complete) → CREATING_SERVICE
  → (sole prop?) → CREATING_SERVICE
  → (service created) → SUBMITTING_CAMPAIGN
  → (campaign submitted) → CAMPAIGN_PENDING
  → (campaign verified) → PROVISIONING_NUMBER
  → (number provisioned) → GENERATING_API_KEY
  → (API key generated, webhooks verified) → COMPLETE

At any step:
  → (error/rejection) → REJECTED or NEEDS_ATTENTION
```

### Orchestrator implementation

```typescript
async function processRegistration(registrationId: string) {
  const reg = await getRegistration(registrationId);
  
  switch (reg.status) {
    case 'creating_subaccount':
      const subaccountSid = await createSubaccount(reg.customer);
      await updateStatus(reg.id, 'generating_artifacts');
      return processRegistration(registrationId);

    case 'generating_artifacts':
      const artifacts = generateArtifacts(reg.customer);
      await saveArtifacts(reg.id, artifacts);
      await updateStatus(reg.id, 'deploying_site');
      return processRegistration(registrationId);
      
    case 'deploying_site':
      const siteUrl = await deployComplianceSite(reg.slug, artifacts, reg.customer);
      await updateSiteUrl(reg.id, siteUrl);
      await updateStatus(reg.id, 'verifying_site');
      return processRegistration(registrationId);
      
    case 'verifying_site':
      const verification = await verifySite(siteUrl);
      if (!verification.passed) {
        await updateStatus(reg.id, 'needs_attention');
        await notifyAdmin('Site verification failed', reg.id, verification);
        return;
      }
      await updateStatus(reg.id, 'submitting_brand');
      return processRegistration(registrationId);
      
    case 'submitting_brand':
      const brandSid = await submitBrandRegistration(reg);
      await updateBrandSid(reg.id, brandSid);
      if (!reg.customer.has_ein) {
        await updateStatus(reg.id, 'awaiting_otp');
        await sendOtpNotificationEmail(reg.customer.email);
        return; // Wait for customer to enter OTP
      }
      await updateStatus(reg.id, 'brand_pending');
      return; // Wait for polling to detect approval
      
    case 'brand_approved':
      if (reg.customer.has_ein) {
        await requestSecondaryVetting(reg.twilio_brand_sid);
        await updateStatus(reg.id, 'vetting_in_progress');
        return; // Wait for polling
      }
      await updateStatus(reg.id, 'creating_service');
      return processRegistration(registrationId);
      
    case 'creating_service':
      const serviceSid = await createMessagingService(reg);
      await updateServiceSid(reg.id, serviceSid);
      await updateStatus(reg.id, 'submitting_campaign');
      return processRegistration(registrationId);
      
    case 'submitting_campaign':
      const campaignSid = await submitCampaign(reg);
      await updateCampaignSid(reg.id, campaignSid);
      await updateStatus(reg.id, 'campaign_pending');
      return; // Wait for polling
      
    case 'provisioning_number':
      const phoneNumber = await provisionPhoneNumber(reg);
      await updatePhoneNumber(reg.id, phoneNumber);
      await updateStatus(reg.id, 'generating_api_key');
      return processRegistration(registrationId);

    case 'generating_api_key':
      // Generate live API key for the customer
      const apiKey = await generateApiKey(reg.customer_id, 'live');
      // Verify proxy webhooks are configured correctly
      await verifyProxyWebhooks(subaccountClient, reg.twilio_messaging_service_sid, reg.id);
      // Mark customer as live
      await supabase.from('customers').update({ live_active: true }).eq('id', reg.customer_id);
      await updateStatus(reg.id, 'complete');
      // Generate deliverable with the API key (PRD_05)
      await triggerDeliverableGeneration(reg.id, apiKey);
      await sendApprovalEmail(reg.customer.email, reg.id);
      return;
  }
}
```

### Polling worker

```typescript
// Runs every 30 minutes via cron
async function pollPendingRegistrations() {
  // Check brand statuses
  const brandPending = await supabase
    .from('registrations')
    .select('*')
    .in('status', ['brand_pending', 'vetting_in_progress']);
  
  for (const reg of brandPending.data) {
    const brand = await twilioClient.messaging.v1
      .a2p.brandRegistrations(reg.twilio_brand_sid).fetch();
    
    if (brand.status === 'APPROVED' && reg.status === 'brand_pending') {
      await updateStatus(reg.id, 'brand_approved');
      await processRegistration(reg.id);
    } else if (brand.status === 'FAILED') {
      await handleBrandRejection(reg, brand);
    }
  }
  
  // Check campaign statuses
  const campaignPending = await supabase
    .from('registrations')
    .select('*')
    .eq('status', 'campaign_pending');
  
  for (const reg of campaignPending.data) {
    const subaccountClient = twilio(reg.twilio_subaccount_sid, decrypt(reg.twilio_subaccount_auth));
    const campaigns = await subaccountClient.messaging.v1
      .services(reg.twilio_messaging_service_sid)
      .usAppToPerson.list();
    
    const campaign = campaigns[0]; // One campaign per customer
    if (campaign.campaignStatus === 'VERIFIED') {
      await updateStatus(reg.id, 'provisioning_number');
      await processRegistration(reg.id);
    } else if (campaign.campaignStatus === 'FAILED') {
      await handleCampaignRejection(reg, campaign);
    }
  }
}
```

---

## 11. REJECTION HANDLING

### Brand rejection
```typescript
async function handleBrandRejection(reg: Registration, brand: any) {
  const reason = brand.failureReason || 'Unknown';
  
  await supabase.from('registrations').update({
    status: 'rejected',
    rejection_reason: reason,
    rejection_code: brand.errors?.[0]?.code || null,
  }).eq('id', reg.id);
  
  await logRejection(reg.id, 'brand', reason);
  await notifyAdmin('Brand rejected', reg.id, reason);
  
  await sendRejectionEmail(reg.customer.email, {
    type: 'brand',
    message: 'Your business registration needs attention. Our team is reviewing and will update you within 24 hours.',
  });
}
```

### Campaign rejection
```typescript
async function handleCampaignRejection(reg: Registration, campaign: any) {
  const reason = campaign.errors?.map(e => e.description).join('; ') || 'Unknown';
  const codes = campaign.errors?.map(e => e.code) || [];
  
  await supabase.from('registrations').update({
    status: 'rejected',
    rejection_reason: reason,
    rejection_code: codes.join(','),
  }).eq('id', reg.id);
  
  await logRejection(reg.id, 'campaign', reason, codes);
  await notifyAdmin('Campaign rejected', reg.id, reason);
  
  const autoFixResult = await attemptAutoFix(reg, codes, reason);
  
  if (autoFixResult.fixed) {
    await resubmitCampaign(reg, autoFixResult.updatedArtifacts);
  } else {
    await sendRejectionEmail(reg.customer.email, {
      type: 'campaign',
      message: 'Your messaging campaign needs attention. Our team is reviewing and will update you within 24 hours.',
    });
  }
}
```

### Known rejection patterns and auto-fixes

> **Re-vetting fee policy:** Each resubmission incurs a non-refundable $15 campaign vetting fee charged by Twilio/TCR. RelayKit **absorbs this cost** as part of the rejection handling service — do not pass it to the customer. Track resubmission counts per registration; flag registrations with 3+ rejections for manual review as a margin risk signal.

> **Developer-facing rejection copy:** When surfacing rejection information to the developer, do NOT show raw error codes or "our team is reviewing" language. Each rejection code must map to: (1) plain-language explanation of what carriers flagged, (2) why that thing triggers a flag, (3) the exact fix needed. See PRD_06 dashboard rejection card spec for the UI treatment. The rejection email subject line must be: `"Carriers flagged your registration — here's what to do"`.

| Rejection code | Meaning | Auto-fix possible? | Fix | Developer-facing explanation |
|---------------|---------|-------------------|-----|------------------------------|
| 805 | Missing privacy policy on website | Check site → if live, resubmit | Verify and resubmit | "Carriers checked your compliance site and couldn't find a privacy policy. We're verifying the site and resubmitting." |
| 806 | Missing terms on website | Check site → if live, resubmit | Verify and resubmit | "Your compliance site needs a Terms of Service page. We're verifying and resubmitting." |
| 810 | Sample messages don't match use case | No — needs manual review | Escalate | "Carriers flagged your sample messages as not matching your registered use case. Our team will review and contact you within 24 hours." |
| 811 | Missing opt-out in sample messages | Yes — append opt-out to samples | Auto-fix and resubmit | "Your sample messages were missing required opt-out language. We've added it automatically and resubmitted." |
| 812 | Missing brand name in sample messages | Yes — prepend brand name | Auto-fix and resubmit | "Carriers require your business name in sample messages. We've added it and resubmitted." |
| 820 | Website not accessible | Check site → redeploy if needed | Redeploy and resubmit | "Carriers couldn't reach your compliance site. We're redeploying it and resubmitting." |
| 830 | Opt-in mechanism not found | Check site → verify form exists | Verify and resubmit | "Carriers need to see an opt-in form on your compliance site. We're verifying it exists and resubmitting." |

> **NOTE:** These codes are illustrative. Actual Twilio/TCR rejection codes should be documented as encountered in production.

### Resubmission
```typescript
async function resubmitCampaign(reg: Registration, updatedArtifacts: any) {
  await supabase.from('generated_artifacts').update({
    campaign_description: updatedArtifacts.campaign_description,
    sample_messages: updatedArtifacts.sample_messages,
  }).eq('registration_id', reg.id);
  
  const subaccountClient = twilio(reg.twilio_subaccount_sid, decrypt(reg.twilio_subaccount_auth));
  
  await subaccountClient.messaging.v1
    .services(reg.twilio_messaging_service_sid)
    .usAppToPerson(reg.twilio_campaign_sid)
    .update({
      description: updatedArtifacts.campaign_description,
      messageSamples: updatedArtifacts.sample_messages,
    });
  
  await supabase.from('registrations').update({
    status: 'campaign_pending',
    rejection_reason: null,
    rejection_code: null,
  }).eq('id', reg.id);
}
```

---

## 12. WEBHOOK ENDPOINTS

### Inbound messages
```
POST /api/webhooks/inbound/{registrationId}
```
Receives incoming SMS from Twilio. In the proxy model, these are forwarded to the customer's configured webhook endpoint (PRD_09 Section 5). RelayKit processes STOP/START/HELP keywords for opt-out management before forwarding.

### Message status callbacks
```
POST /api/webhooks/status/{registrationId}
```
Receives delivery status updates (sent, delivered, failed, undelivered). Updates the messages table and fires status webhook events to the customer's endpoint.

### Stripe webhook
```
POST /api/webhooks/stripe
```
Already defined in PRD_01. Triggers the registration pipeline. Now also creates the Twilio subaccount as the first step.

---

## 13. ERROR HANDLING & RELIABILITY

### Retry strategy
- Twilio API calls: retry 3 times with exponential backoff (1s, 4s, 16s)
- Transient errors (429, 500, 503): retry automatically
- Permanent errors (400, 404): fail immediately, log, escalate

### Idempotency
- Store Twilio SIDs at each step before proceeding to next
- If the process crashes mid-step, it can resume from the last recorded state
- The state machine's `processRegistration` function checks current state and only advances forward

### Monitoring
- Log every state transition with timestamp
- Alert on registrations stuck in any state for >48 hours
- Alert on any registration entering `rejected` or `needs_attention` state
- Daily summary: registrations in each state, approval rate, average time to completion

### Rate limits
- Twilio registration API: 1 request/second
- Implement a queue if processing multiple registrations simultaneously
- For v1, sequential processing is fine

---

## 14. DATABASE ADDITIONS

```sql
-- Add subaccount fields to customers table
ALTER TABLE customers ADD COLUMN twilio_subaccount_sid TEXT;
ALTER TABLE customers ADD COLUMN twilio_subaccount_auth TEXT; -- encrypted via Supabase Vault

-- Add Twilio-specific fields to registrations table
ALTER TABLE registrations ADD COLUMN twilio_trust_product_sid TEXT;
ALTER TABLE registrations ADD COLUMN twilio_end_user_sid TEXT;
ALTER TABLE registrations ADD COLUMN twilio_address_sid TEXT;
ALTER TABLE registrations ADD COLUMN twilio_vetting_sid TEXT;
ALTER TABLE registrations ADD COLUMN trust_score INTEGER;

-- Track all Twilio API interactions for debugging
CREATE TABLE twilio_api_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_body JSONB,
  response_status INTEGER,
  response_body JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track state transitions
CREATE TABLE registration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  from_status TEXT,
  to_status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 15. IMPLEMENTATION NOTES FOR CLAUDE CODE

### File structure
```
lib/
  twilio/
    client.ts              # Twilio client initialization (parent + subaccount)
    subaccount.ts          # Subaccount creation and management
    brand.ts               # Brand registration (sole prop + standard)
    campaign.ts            # Campaign creation and submission
    messaging-service.ts   # Messaging service creation with proxy webhooks
    phone-number.ts        # Number purchase and assignment
    vetting.ts             # Secondary vetting
    otp.ts                 # OTP verification handling
    
  orchestrator/
    state-machine.ts       # Registration state machine
    processor.ts           # processRegistration() function
    poller.ts              # Polling worker for pending statuses
    
  rejection/
    handler.ts             # Rejection parsing and routing
    auto-fix.ts            # Known pattern auto-fixes

  api-keys/
    generate.ts            # Key generation (rk_sandbox_ / rk_live_)
    verify.ts              # Key hash lookup + validation
    
app/
  api/
    webhooks/
      inbound/
        [registrationId]/
          route.ts         # Inbound SMS webhook → proxy forwarding
      status/
        [registrationId]/
          route.ts         # Message status webhook
      stripe/
        route.ts           # Stripe payment webhook (from PRD_01)
    
    otp/
      route.ts             # POST — customer submits OTP code
```

### Environment variables
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_ISV_PROFILE_SID=BU...
RELAYKIT_API_DOMAIN=api.relaykit.dev
```

### Testing
Twilio provides mock brand and campaign creation for testing:
```typescript
const mockBrand = await twilioClient.messaging.v1
  .a2p.brandRegistrations.create({
    customerProfileBundleSid: 'MOCK_PROFILE_SID',
    mock: true,
  });
```

Use mock mode during development and integration testing. Switch to production for real submissions.

---

## 14. PHASE 2 TODOS — DO NOT BUILD IN V1

These are confirmed future additions. They are flagged here so they are not forgotten when PRD_04 is next touched.

### TODO-P2-01: Brand re-use for second projects
When a returning customer registers a second project with the same EIN, the existing approved brand SID can be reused — only a new campaign, Messaging Service, and phone number are needed. This skips brand review entirely (saving 1–7 days) and avoids the $46 brand registration fee.

- Store `twilio_brand_sid` on the `customers` table (not just `registrations`) so it persists across projects
- Pipeline branches at `SUBMITTING_BRAND`: `hasExistingApprovedBrand ? skipToStep_CREATING_SERVICE : startFromStep_SUBMITTING_BRAND`
- Dashboard copy for returning customer: "Your brand is already verified — we'll link this project to your existing record. This campaign should move faster."

### TODO-P2-02: Second campaign registration pathway
When a customer who registered as transactional wants to add marketing capability post-approval, a second campaign must be registered on their existing subaccount. The existing approved campaign is NOT modified.

- Implement `registerSecondCampaign(registrationId, newCampaignType)` function
- New campaign uses same subaccount SID and Messaging Service
- Dashboard expansion flow triggers this, not the intake wizard
- Dashboard copy: "We'll register an additional campaign that covers marketing messages. Your transactional messages keep running without interruption."

### TODO-P2-03: EIN 5-brand limit detection
TCR allows a maximum of 5 Standard Brands per EIN. Before submitting a brand registration, check `registration_count_by_ein`. If this would be the 6th, block submission and surface: "You have 5 active brand registrations under your EIN. TCR has a 5-brand limit per business — please contact us before registering another project."

### TODO-P2-04: Authentication+ 2.0 expansion
TCR has stated intent to expand Authentication+ (email verification step) to all brand types, not just public companies. When that happens, `AWAITING_BRAND_AUTH` becomes a state for all registrations. Architect the OTP flow (already built) as a model for this step.
