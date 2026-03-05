# PRD_01 ADDENDUM: DASHBOARD-TO-INTAKE WIZARD FLOW
## RelayKit — Conditional Wizard Variant for Dashboard-Originated Registration
### Version 1.0 — Mar 3, 2026

> **Parent document:** PRD_01_INTAKE_WIZARD.md (unchanged)
> **Depends on:** PRD_06_DASHBOARD_v3.md (Section 9: Go Live / Registration Flow)
> **Scope:** Defines a second path through the existing intake wizard screens when a developer enters from the dashboard. All existing PRD_01 behavior (Path 1) is preserved unchanged.

---

## 1. TWO PATHS THROUGH THE WIZARD

The intake wizard now supports two entry points. The screens are the same components; only their initial state and data sources differ.

### Path 1: Cold entry (PRD_01 as-is, unchanged)

Developer arrives from the landing page or a direct link. No prior context exists. All screens render in discovery mode — use case selection, expansion education, business details collection, template-engine-generated preview, and payment. This path is preserved exactly as specified in PRD_01 and will become the BYO Twilio registration entry point in Phase 2.

### Path 2: From dashboard (this addendum)

Developer clicks "Register now" on the dashboard (PRD_06 Section 9). They have already selected a use case, curated messages in the plan builder, and optionally toggled expansion messages. The wizard receives this context and adapts: Screen 1 is skipped, Screen 1b is confirmatory rather than exploratory, Screen 2 collects genuinely new business details, Screen 3 reflects the developer's own messages, and Screen 4 is unchanged.

---

## 2. DATA CONTRACT: DashboardToIntakeData

When the dashboard launches the wizard, it serializes the following to `sessionStorage` under the key `relaykit_intake_data`:

```typescript
interface DashboardToIntakeData {
  // From use case selection (PRD_06 Section 3)
  use_case: string;

  // From expansion message toggles in plan builder (PRD_06 Section 4)
  expansions: string[];

  // Computed from use_case + expansions (PRD_01 Section 2B campaign type logic)
  effective_campaign_type: 'standard' | 'mixed' | 'marketing';

  // From message plan builder — enabled messages only (PRD_06 Section 4)
  selected_messages: {
    template_id: string;
    category: string;
    text: string;        // edited_text if modified, original_template if not
    trigger: string;
    is_expansion: boolean;
    expansion_type?: string;  // 'marketing' | 'mixed' — for expansion messages
  }[];

  // From auth session
  email: string;

  // Optional — future use
  preferred_area_code?: string;
}
```

### Transport mechanism

**sessionStorage** — the dashboard serializes `DashboardToIntakeData` as JSON to `sessionStorage` before navigating to `/start`. The wizard reads it on mount. sessionStorage survives page refreshes within the same tab but not tab closure — this is intentional and acceptable.

**Why not URL params:** The `selected_messages` array is too large for URL encoding.

**Why not React context:** The wizard is a separate route. React context does not survive full-page navigation in Next.js App Router.

**Cleanup:** Clear `relaykit_intake_data` from sessionStorage after the wizard completes (successful Stripe redirect or explicit abandonment).

---

## 3. PATH DETECTION

On wizard mount (in the root `/start` layout or page component), check for dashboard context:

```typescript
const raw = sessionStorage.getItem('relaykit_intake_data');
const dashboardData: DashboardToIntakeData | null = raw ? JSON.parse(raw) : null;
```

If `dashboardData` is present and `dashboardData.use_case` is set → **Path 2**. Otherwise → **Path 1** (existing PRD_01 flow, no changes).

If `dashboardData` is present but `use_case` is missing or empty (shouldn't happen) → fall back to **Path 1**.

---

## 4. SCREEN-BY-SCREEN PATH 2 BEHAVIOR

### 4.1 Screen 1: Use Case Selection — SKIPPED

**PRD_01 reference:** Section 2

**Path 2 behavior:** Skip entirely. The wizard navigates directly to Screen 1b (`/start/scope`). The use case tile grid never renders. The use case value comes from `dashboardData.use_case`.

**Implementation:** In the `/start` page component, if Path 2 is detected, redirect to `/start/scope` immediately (client-side `router.push` or server-side redirect). No flash of Screen 1 content.

---

### 4.2 Screen 1b: Use Case Advisory — CONFIRMATORY MODE

**PRD_01 reference:** Section 2B

**What changes:**

| Element | Path 1 (PRD_01) | Path 2 (this addendum) |
|---------|-----------------|----------------------|
| Header | "Let's make sure your registration covers everything you need" | "Here's what your registration will cover" |
| Subhead | "Your use case determines what messages carriers will allow..." | "Based on your message plan, here's what we'll register. Confirm or adjust before we proceed." |
| Section 1 (included) | Rendered from use case defaults | Same — rendered from `dashboardData.use_case` |
| Section 2 (not included) | Rendered from use case defaults | Same — rendered from `dashboardData.use_case` |
| Section 3 (expansions) | All checkboxes unchecked | **Pre-populated:** checkboxes reflect `dashboardData.expansions` |
| Campaign type upgrade logic | Triggers on first check | Already computed — `dashboardData.effective_campaign_type` is the initial state |
| Back link | Returns to Screen 1 (`/start`) | Returns to dashboard (`/dashboard`) |

**Expansion toggles:** Pre-checked based on `dashboardData.expansions`. The developer can still change them. If they do, `effective_campaign_type` recalculates using the same logic from PRD_01 Section 2B. The advisory notes ("Adding promotional messaging means...") display normally if triggered.

**Auto-advance option:** If `dashboardData.expansions` is empty (no expansion messages were toggled in the plan builder), this screen can be auto-advanced — the developer has no expansion decisions to confirm. Implementation note: if auto-advancing, still set the confirmatory state in the wizard's internal data so Screen 3 has the correct campaign type. Flag this as a CC design decision: auto-advance vs. always show for explicit confirmation.

---

### 4.3 Screen 2: Business Details — MINIMAL CHANGE

**PRD_01 reference:** Section 3

**What changes:** One field pre-filled. Everything else is new.

| Element | Path 1 (PRD_01) | Path 2 (this addendum) |
|---------|-----------------|----------------------|
| `email` field | Empty | Pre-filled from `dashboardData.email` |
| All other fields | Empty | Empty — genuinely new data |
| Back link | Returns to Screen 1b (`/start/scope`) | Same |

The dashboard deliberately does not collect business details. That is intake wizard territory. This separation keeps dashboard onboarding fast (product design focus) and isolates business registration into a dedicated flow.

The `email` field should be pre-filled but editable — the developer may want to use a different email for registration than for their sandbox account.

---

### 4.4 Screen 3: Review & Confirm — KEY CHANGES

**PRD_01 reference:** Section 4

This screen has the most significant differences between paths.

#### Left column: Your details

**Unchanged.** Displays all business details from Screen 2 in a read-only summary card with "Edit" link back to Screen 2. Identical to PRD_01 Section 4.

#### Right column: Generated preview

| Element | Path 1 (PRD_01) | Path 2 (this addendum) |
|---------|-----------------|----------------------|
| **Sample messages** | Generated fresh by template engine (`GET /api/preview`) | Sourced from `dashboardData.selected_messages` — the developer's own curated messages |
| **Campaign description** | Generated by template engine | Generated by template engine from `use_case` + business details (Screen 2). Same as Path 1 — this is genuinely new content the developer hasn't seen. |
| **Compliance site preview** | Shows generated slug | Same |
| **Editability of sample messages** | Editable inline (PRD_01 spec) | **Read-only.** Messages are the developer's curated plan builder output. Editing here would create divergence between the plan builder and the registration. If changes are needed, developer should return to the dashboard plan builder. |
| **Editability of campaign description** | Editable inline (PRD_01 spec) | **Read-only.** Same as PRD_01's existing design principle: compliance artifacts generated for carrier review are not editable to prevent carrier rejections. |

**Sample message display:** For each entry in `dashboardData.selected_messages`, show:

```
{category}
"{text}"
Trigger: {trigger}
```

If an expansion message is included (`is_expansion: true`), display it with the same expansion indicator (star icon) used in the plan builder.

**Campaign description generation:** On Path 2, the campaign description is still generated server-side by the template engine. Call `GET /api/preview` with the use case, business details, expansions, and effective campaign type. The template engine returns the campaign description. Sample messages are NOT taken from this response — they come from `dashboardData.selected_messages` instead.

#### Area code selection (NEW — both paths)

Added to Screen 3 below the compliance site preview:

```
Your phone number

We'll assign you a local number based on your business location.
Your business is in {city}, {state} — we'll look for a ({area_code}) number.

[That's perfect]  [Different area code]
```

**Default area code:** Derived from `address_state` (Screen 2). Use the most common area code for the state. If the address is in a metro area with a well-known area code (e.g., Austin → 512, NYC → 212/646), prefer that.

**"Different area code":** Expands to a 3-digit input field. Single entry. No dropdown, no number browsing, no toll-free option. One selection, then collapse.

**"That's perfect":** Default action. Most developers accept the default.

**Data captured:** `preferred_area_code: string | null` — null if they accepted the default. Stored with the intake session and passed to PRD_04 for provisioning.

**Fallback handling:** Not this screen's concern. If the preferred area code has no inventory, PRD_04 picks the nearest available and the developer sees the result on their dashboard.

---

### 4.5 Screen 4: Payment — UNCHANGED

**PRD_01 reference:** Section 5

No changes. Stripe Checkout at $199 setup + $19/month. Identical for both paths.

---

## 5. POST-PAYMENT REDIRECT

### Path 1 (existing)

Redirects to `/dashboard?session_id={CHECKOUT_SESSION_ID}`. Dashboard detects new customer creation and renders accordingly.

### Path 2

Same redirect: `/dashboard?session_id={CHECKOUT_SESSION_ID}`. Dashboard detects that registration has started and transitions to Stage 5 (registration in progress). Registration status card appears at the top of the Overview tab. Sandbox continues to work.

`relaykit_intake_data` is cleared from sessionStorage at this point (in the Stripe success redirect handler).

---

## 6. API CHANGES

### `POST /api/checkout` — extended request body

Add optional fields to the existing endpoint (PRD_01 Section 7):

```typescript
{
  // ... all existing PRD_01 fields, plus:
  source: 'cold' | 'dashboard',               // identifies the entry path
  selected_messages?: {                         // Path 2 only
    template_id: string;
    category: string;
    text: string;
    trigger: string;
    is_expansion: boolean;
    expansion_type?: string;
  }[];
  preferred_area_code?: string | null;          // from area code selector
}
```

When `source` is `'dashboard'`, the webhook handler (PRD_01 Section 7, `POST /api/webhooks/stripe`) uses `selected_messages` as the basis for canon messages in the registration record, rather than generating fresh samples from the template engine. The template engine still generates the campaign description and compliance artifacts.

### `GET /api/preview` — unchanged

Path 2 still calls this endpoint to generate the campaign description. It ignores the returned `sample_messages` and uses `dashboardData.selected_messages` instead.

---

## 7. sessionStorage BEHAVIOR

| Scenario | Result |
|----------|--------|
| Developer refreshes mid-wizard (Path 2) | sessionStorage persists. Pre-populated data survives. Path 2 continues. |
| Developer closes tab, reopens `/start` | sessionStorage is gone. Path 1 (cold entry) begins. Acceptable — Path 1 still works, developer re-selects use case. |
| Developer completes payment | sessionStorage cleared in success redirect handler. |
| Developer clicks "Cancel" on Stripe Checkout | Returns to `/start/review`. sessionStorage still present. Path 2 continues. |
| Developer navigates away from wizard mid-flow | sessionStorage persists until tab close. If they return to `/start` in the same tab, Path 2 resumes. |

---

## 8. IMPLEMENTATION NOTES FOR CLAUDE CODE

### Minimal footprint

This addendum is implementable as conditional logic within existing components, not a rebuild:

1. **Path detection utility** — a shared function or hook:
   ```typescript
   // lib/intake/use-dashboard-data.ts
   export function getDashboardIntakeData(): DashboardToIntakeData | null {
     if (typeof window === 'undefined') return null;
     const raw = sessionStorage.getItem('relaykit_intake_data');
     if (!raw) return null;
     try { return JSON.parse(raw); } catch { return null; }
   }
   ```

2. **Screen 1 (`/start/page.tsx`)** — add redirect check on mount. If `getDashboardIntakeData()` returns data with a valid `use_case`, redirect to `/start/scope`.

3. **Screen 1b (`/start/scope/page.tsx` or equivalent)** — accept initial expansion state from dashboard data. Adjust header/subhead text. Change back link target.

4. **Screen 2** — pre-fill email field from dashboard data. No other changes.

5. **Screen 3** — conditional message source: if Path 2, render from `dashboardData.selected_messages` instead of calling template engine for samples. Still call template engine for campaign description. Add area code selector component (new, both paths).

6. **Stripe success handler** — clear `relaykit_intake_data` from sessionStorage.

### New component

`AreaCodeSelector.tsx` — simple component with two states: default acceptance ("That's perfect") and override (3-digit input). Used on Screen 3 for both paths. Derives default from `address_state`.

### No changes to

- Template engine (PRD_02)
- Compliance site generator (PRD_03)
- Stripe webhook handler logic (beyond accepting the new `source` and `selected_messages` fields)
- Any existing Screen 1-4 visual design or layout

---

## 9. PHASE 2 NOTE

Path 1 (cold entry) is preserved for the BYO Twilio registration-only flow. When BYO launches, Path 1 will need additional fields (Twilio Account SID, Auth Token, existing phone number option) but the core screen sequence is the same. Those BYO-specific fields are **not specified in this addendum** — they are a Phase 2 task.

---

## 10. TRAPS TO AVOID (FOR CC)

1. **Do not rewrite PRD_01 screens.** Add conditional branches within existing components.
2. **Do not collect business details on the dashboard.** Dashboard = product design. Wizard = business registration. This boundary is intentional.
3. **Do not make area code selection complex.** Default or different. If different, one 3-digit input. No browsing, no toll-free, no vanity.
4. **Do not generate new sample messages for Path 2 Screen 3.** The developer's plan builder messages are the source of truth. Template engine generates the campaign description only.
5. **Do not forget to clear sessionStorage.** Clear after successful payment redirect. Do not clear on cancel (developer may retry).
6. **Do not make sample messages editable on Path 2 Screen 3.** Edits happen in the plan builder. The review screen confirms, it doesn't create a second editing surface.
