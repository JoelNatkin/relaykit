# Sinch / TCR Brand Registration — Field Reference
## Captured from Sinch dashboard, April 25, 2026 — Simplified registration path

This document captures the field structure of Sinch's 10DLC brand registration form
as observed during RelayKit's own brand registration (Experiment 3a). Used to ensure
RelayKit's customer-facing onboarding wizard collects everything Sinch will need
when we submit on the customer's behalf via the Sinch API.

**Sources:** Sinch dashboard (2026-04-25 brand registration session, Brand `BTTC6XS`), Sinch 10DLC OpenAPI spec.

## Field structure

### Bundle details (Sinch-internal, not submitted to TCR)
| Field | Type | Source | Notes |
|---|---|---|---|
| Bundle name | string | RelayKit-derived | Internal nickname for the brand in Sinch. Not customer-facing. RelayKit can auto-generate from customer's brand name. |
| Number type | enum | RelayKit-set | `10DLC` for all US customers at launch. |
| Country | enum | Customer | Default `United States`. International support is post-launch. |
| Registration type | enum | RelayKit-routed | `Simplified` or `Full`. Routing logic per BACKLOG entry on tier selection. |

### Company details (legal entity, submitted to TCR)
| Field | Type | Source | Notes |
|---|---|---|---|
| Company name | string | Customer | MUST match IRS EIN-on-file legal name exactly. Verification source of truth. |
| Company e-mail | email | Customer | Brand-level contact. Recommend public-facing support address, not personal. |
| Brand name | string | Customer | Customer-facing brand identity. Can differ from legal entity name. |
| Country | enum | Customer | Defaults to United States. |
| Street address | string | Customer | MUST match IRS-on-file address. PO boxes blocked for some entity types. |
| City | string | Customer | Same. |
| Postal code | string | Customer | Same. |
| State | enum | Customer | Same. |
| Website address | URL | Customer | Must be a live URL. Blank pages and "coming soon" land badly during vetting. |
| Business contact e-mail | email | Customer | Optional but advised. Used by carriers for compliance escalation. |

### Financial details (entity classification, submitted to TCR)
| Field | Type | Source | Notes |
|---|---|---|---|
| Entity type | enum | Customer | Sinch API `brandEntityType` enum: `PRIVATE` (Private Profit, dashboard label "Private Profit"), `PUBLIC` (publicly traded, dashboard label "Public Profit"), `CHARITY_NON_PROFIT` (non-profit, dashboard label "Non-Profit"). **No Sole Proprietor option in the API.** ~100% of RelayKit's EIN-bearing customers will be `PRIVATE`. |
| Vertical type | enum | Customer | Sinch API `brandVerticalType` enum (22 values — see §`brandVerticalType` enum mapping below). RelayKit can derive from use case selected, with override. |
| Country of tax ID | enum | Customer | Defaults US. |
| Corporate tax ID (EIN) | string | Customer | Required for all 3 supported entity types (`PRIVATE`, `PUBLIC`, `CHARITY_NON_PROFIT`). Sinch's 10DLC API does not have a no-EIN onboarding path. |
| Stock symbol | string | Customer (`PUBLIC` only) | Conditional field. Skip for `PRIVATE`. |
| Exchange | enum | Customer (`PUBLIC` only) | Same. |

_Note (2026-04-25): Earlier draft assumed Sole Proprietor was supported as a fourth entity type; Sinch's 10DLC API enum confirms it isn't. See BACKLOG entry on Sole Proprietor segment gap for product implications._

### Contact details (point person for the brand, submitted to TCR)
| Field | Type | Source | Notes |
|---|---|---|---|
| First name | string | Customer | Real human, not a role. |
| Last name | string | Customer | Same. |
| Phone number | E.164 | Customer | Mobile preferred. Used for Auth+ 2FA on `PUBLIC`; advisory contact for others. |
| E-mail address | email | Customer | Personal or brand address; recommend brand address for consistency. |

## `brandEntityType` enum (load-bearing)

Sinch's 10DLC API accepts exactly three values for `brandEntityType`:

| API enum | Dashboard label | EIN required | Notes |
|---|---|---|---|
| `PRIVATE` | Private Profit | Yes | Most RelayKit customers. |
| `PUBLIC` | Public Profit | Yes | Publicly traded. Adds Stock symbol + Exchange fields; Auth+ 2FA on contact phone. |
| `CHARITY_NON_PROFIT` | Non-Profit | Yes | Non-profit organizations. |

**There is no `SOLE_PROPRIETOR` value.** Customers without an EIN cannot be onboarded through Sinch's 10DLC API. See BACKLOG entry on Sole Proprietor segment gap for product responses (TFN routing, secondary carrier, ICP cut). This is **load-bearing for Phase 5 wizard design** — the wizard's no-EIN branch cannot route to a Sinch 10DLC Sole Prop path because no such path exists at the API level.

## `brandVerticalType` enum mapping

Sinch's `brandVerticalType` enum has 22 values. Dashboard display labels do not equal the API enum values — a translation layer is required between the customer-facing wizard and the API submission.

Observed mappings (filled in incrementally as future experiments and dashboard captures land):

| Dashboard label | API enum | Notes |
|---|---|---|
| Information Technology Services | `TECHNOLOGY` | Observed in Experiment 3a (2026-04-25). RelayKit's own registration vertical. |
| _(21 remaining values TBD)_ | _(TBD)_ | To be filled in as future experiments observe each label. |

**HEALTHCARE is a valid `brandVerticalType` value at the Sinch API level.** D-18's healthcare decline (`DECISIONS_ARCHIVE.md` L101) is a RelayKit policy choice, not a carrier-level constraint. The Phase 5 wizard's healthcare-decline logic should be implemented client-side in RelayKit's intake, not assumed enforced by Sinch.

## Brand state machine

**Two distinct state-tracking concepts exist at the Sinch level.** Phase 5 design must track both, since they map to different parts of the customer-facing wizard.

### `IdentityStatus` (TCR-level brand identity)
TCR's verification field for the brand identity itself. Observed terminal value in Experiment 3a: `VERIFIED`. Intermediate transitions were not visible from the dashboard event log; an API-level capture in a future experiment is needed to confirm the full transition sequence.

### `brandRegistrationStatus` / Bundle state (Sinch's bundle-level lifecycle)
Sinch API exposes 5 values; the dashboard exposes 7. Mapping:

| API state | Dashboard state | Notes |
|---|---|---|
| `DRAFT` | (unknown — possibly Queue?) | API enum value; dashboard mapping TBD. |
| `IN_PROGRESS` | In review | Observed in Experiment 3a as the initial visible state. |
| `REJECTED` | (likely Rejected) | Mapping unconfirmed. |
| `APPROVED` | Approved | Observed in Experiment 3a as the terminal state. |
| `UPGRADE` | (mapping unclear) | Possibly relates to Simplified → Full upgrade path. |
| _(unmapped)_ | Queue | Dashboard-only state; API equivalent unknown. To verify before Phase 2 Session B. |
| _(unmapped)_ | Archived | Dashboard-only state; API equivalent unknown. |

**The 5-vs-7 mismatch is one of three Sinch API/dashboard inconsistencies surfaced during Experiment 3a — to verify with Sinch BDR (Elizabeth Garner) before Phase 2 Session B kickoff.**

## Field constraints we learned the hard way

- **Legal name verification is strict.** Any DBA suffix or formatting drift from IRS records risks rejection. RelayKit's wizard should validate the customer's entered legal name against IRS EIN lookup before submitting (see BACKLOG: EIN verification and business identity pre-validation).
- **Address must match IRS.** Same source-of-truth principle. PO boxes blocked for some entity types.
- **Website must be a live URL.** Blank pages and "coming soon" placeholders land badly during vetting.
- **EIN is required for all 3 supported entity types.** Sinch's 10DLC API has no no-EIN path. Customers without an EIN cannot onboard through this surface — see BACKLOG entry on Sole Proprietor segment gap.
- **Free-provider emails (gmail, yahoo, etc.) are flagged for some entity types.** `PRIVATE` and `PUBLIC` prefer branded domains. RelayKit's wizard should warn customers against personal-email-as-business-contact.
- **No EIN ⇒ cannot onboard via Sinch's 10DLC API.** Route options: TFN (toll-free number) verification at a separate Sinch API surface, secondary carrier (Telnyx / Twilio both have working self-serve Sole Prop flows), or cut from ICP. Phase 5 design decision.
- **IRS records may have grace windows.** Joel's IRS name change letter was sent 2026-04-24 and not yet processed at submission 2026-04-25; registration succeeded anyway. Implication: do not assume IRS records update immediately when designing the wizard's name-mismatch handling — there may be cache windows or pre-processed states we can't predict.

## Field-to-wizard-step mapping (TBD in Phase 5 design)

RelayKit's onboarding wizard collects these fields incrementally. Mapping not yet
designed; this reference exists to ensure all fields are accounted for before
wizard design begins. **Phase 5 (Registration Pipeline on Sinch, MASTER_PLAN §9)** is the home for this design work.
