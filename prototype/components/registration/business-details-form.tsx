"use client";

import { useState, useCallback, useEffect } from "react";
import {
  businessDetailsSchema,
  type BusinessDetailsData,
  US_STATE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  USE_CASE_FIELDS,
  validateUseCaseFields,
  formatPhone,
  formatEin,
  normalizeWebsiteUrl,
} from "../../lib/intake/validation";
import type { UseCaseId } from "../../lib/intake/use-case-data";
import {
  detectIndustryGate,
  type IndustryGateResult,
} from "../../lib/intake/industry-gating";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DESCRIPTION_EXAMPLES: Record<UseCaseId, string> = {
  appointments: "A booking platform for pet groomers",
  orders: "An online store that ships handmade candles",
  verification: "A SaaS app with two-factor login",
  support: "A help desk for a home repair service",
  marketing: "A local bakery that runs weekly specials",
  internal: "A staffing agency coordinating shift schedules",
  community: "A running club with 200 local members",
  waitlist: "A restaurant with online reservations",
  exploring: "A new app that needs SMS — not sure which category yet",
};

// ---------------------------------------------------------------------------
// Shared Tailwind class strings
// ---------------------------------------------------------------------------

const INPUT_BASE =
  "w-full rounded-lg border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:outline-none focus:ring-1 transition duration-100 ease-linear";
const INPUT_VALID =
  "border-border-primary focus:border-purple-500 focus:ring-purple-500";
const INPUT_INVALID =
  "border-red-500 focus:border-red-500 focus:ring-red-500";

function inputClass(isInvalid: boolean) {
  return `${INPUT_BASE} ${isInvalid ? INPUT_INVALID : INPUT_VALID}`;
}

// ---------------------------------------------------------------------------
// Inline IndustryGateAlert
// ---------------------------------------------------------------------------

function IndustryGateAlert({ gate }: { gate: IndustryGateResult }) {
  if (gate.tier === "advisory") {
    return (
      <div className="flex gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4">
        {/* Info icon */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100">
          <svg
            className="size-4 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-text-primary">
            {gate.label} industry detected
          </p>
          <p className="text-sm text-text-tertiary">{gate.message}</p>
        </div>
      </div>
    );
  }

  if (gate.tier === "hard_decline_waitlist") {
    return (
      <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        {/* Alert circle icon */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg
            className="size-4 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-text-primary">
            {gate.label} messaging isn&apos;t available yet
          </p>
          <p className="text-sm text-text-tertiary">{gate.message}</p>
          <div className="mt-2">
            <a
              href="mailto:hello@relaykit.com?subject=Healthcare%20waitlist&body=I%27d%20like%20to%20join%20the%20waitlist%20for%20healthcare%20messaging%20support."
              className="inline-flex items-center rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary"
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </div>
    );
  }

  // hard_decline_blocked
  return (
    <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      {/* Alert triangle icon */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100">
        <svg
          className="size-4 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text-primary">
          {gate.label} messaging can&apos;t be registered
        </p>
        <p className="text-sm text-text-tertiary">{gate.message}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props & types
// ---------------------------------------------------------------------------

interface BusinessDetailsFormProps {
  useCase: UseCaseId;
  initialValues?: Partial<Record<string, string>>;
  onValid: (data: BusinessDetailsData) => void;
  onInvalid: () => void;
}

type FieldErrors = Partial<Record<string, string>>;
type TouchedFields = Set<string>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BusinessDetailsForm({
  useCase,
  initialValues,
  onValid,
  onInvalid,
}: BusinessDetailsFormProps) {
  const EMPTY_FORM: Record<string, string> = {
    business_name: "",
    business_description: "",
    has_ein: "",
    ein: "",
    business_type: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_city: "",
    address_state: "",
    address_zip: "",
    website_url: "",
    service_type: "",
    product_type: "",
    app_name: "",
    community_name: "",
    venue_type: "",
  };

  function applyInitialValues(
    defaults: Record<string, string>,
    values?: Partial<Record<string, string>>,
  ) {
    if (!values) return defaults;
    const merged = { ...defaults };
    for (const [key, value] of Object.entries(values)) {
      if (key in merged && value) {
        merged[key] = value;
      }
    }
    return merged;
  }

  const [form, setForm] = useState<Record<string, string>>(() =>
    applyInitialValues(EMPTY_FORM, initialValues),
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>(new Set());
  const [appliedInitials, setAppliedInitials] = useState(!!initialValues);
  const [industryGate, setIndustryGate] = useState<IndustryGateResult | null>(
    null,
  );

  // When initialValues arrives late (sessionStorage hydration), apply it
  useEffect(() => {
    if (!initialValues || appliedInitials) return;
    const merged = applyInitialValues(EMPTY_FORM, initialValues);
    setForm(merged);
    setAppliedInitials(true);

    // Check industry gate on hydrated data
    const gate = detectIndustryGate(
      merged.business_description,
      merged.service_type || null,
    );
    setIndustryGate(gate);
    if (gate && gate.tier !== "advisory") {
      onInvalid();
      return;
    }

    // Validate the restored data
    const result = businessDetailsSchema.safeParse(merged);
    if (result.success) {
      const ucErrors = validateUseCaseFields(useCase, result.data);
      if (ucErrors.length === 0) {
        onValid(result.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, appliedInitials, useCase, onValid, onInvalid]);

  // Validate on mount when returning with pre-filled data (sync path)
  useEffect(() => {
    if (!initialValues) return;

    // Check industry gate on initial data
    const gate = detectIndustryGate(
      form.business_description,
      form.service_type || null,
    );
    setIndustryGate(gate);
    if (gate && gate.tier !== "advisory") {
      onInvalid();
      return;
    }

    const result = businessDetailsSchema.safeParse(form);
    if (result.success) {
      const ucErrors = validateUseCaseFields(useCase, result.data);
      if (ucErrors.length === 0) {
        onValid(result.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateField = useCallback(
    (field: string, data: Record<string, string>) => {
      const result = businessDetailsSchema.safeParse(data);
      if (result.success) {
        // Check use-case-specific fields too
        const ucErrors = validateUseCaseFields(useCase, result.data);
        const ucError = ucErrors.find((e) => e.field === field);
        setErrors((prev) => {
          const next = { ...prev };
          if (ucError) {
            next[field] = ucError.message;
          } else {
            delete next[field];
          }
          return next;
        });
      } else {
        const fieldError = result.error.issues.find((i) =>
          i.path.includes(field),
        );
        setErrors((prev) => {
          const next = { ...prev };
          if (fieldError) {
            next[field] = fieldError.message;
          } else {
            // Also check use-case-specific fields
            const ucErrors = validateUseCaseFields(
              useCase,
              data as unknown as BusinessDetailsData,
            );
            const ucError = ucErrors.find((e) => e.field === field);
            if (ucError) {
              next[field] = ucError.message;
            } else {
              delete next[field];
            }
          }
          return next;
        });
      }
    },
    [useCase],
  );

  const updateField = useCallback(
    (field: string, rawValue: string) => {
      // Auto-format specific fields
      let value = rawValue;
      if (field === "phone") value = formatPhone(rawValue);
      if (field === "ein") value = formatEin(rawValue);

      const next = { ...form, [field]: value };
      setForm(next);

      // Run industry gate detection when relevant fields change
      if (field === "business_description" || field === "service_type") {
        const gate = detectIndustryGate(
          field === "business_description" ? value : next.business_description,
          field === "service_type" ? value : next.service_type || null,
        );
        setIndustryGate(gate);
        // Block form if tier 2 or 3
        if (gate && gate.tier !== "advisory") {
          onInvalid();
          if (touched.has(field)) validateField(field, next);
          return;
        }
      }

      // Validate full form to update parent
      const result = businessDetailsSchema.safeParse(next);
      if (result.success) {
        const useCaseErrors = validateUseCaseFields(useCase, result.data);
        if (useCaseErrors.length === 0) {
          onValid(result.data);
        } else {
          onInvalid();
        }
      } else {
        onInvalid();
      }

      // Clear field error on change if it was touched
      if (touched.has(field)) {
        validateField(field, next);
      }
    },
    [form, touched, useCase, onValid, onInvalid, validateField],
  );

  const handleBlur = useCallback(
    (field: string) => {
      // Normalize website URL on blur
      if (field === "website_url" && form.website_url) {
        const normalized = normalizeWebsiteUrl(form.website_url);
        if (normalized !== form.website_url) {
          const next = { ...form, website_url: normalized };
          setForm(next);
          setTouched((prev) => new Set(prev).add(field));
          validateField(field, next);
          return;
        }
      }

      setTouched((prev) => new Set(prev).add(field));
      validateField(field, form);
    },
    [form, validateField],
  );

  const fieldError = (field: string) =>
    touched.has(field) ? errors[field] : undefined;

  const useCaseFields = USE_CASE_FIELDS[useCase] ?? [];
  const showEinFields = form.has_ein === "yes";
  const showSolePropNote = form.has_ein === "no";

  // ---------------------------------------------------------------------------
  // Reusable field renderers
  // ---------------------------------------------------------------------------

  function renderLabel(text: string, required?: boolean) {
    return (
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
        {text}
        {required && <span className="text-red-500"> *</span>}
      </label>
    );
  }

  function renderHint(error: string | undefined, hint?: string) {
    if (error) {
      return <p className="mt-1.5 text-sm text-red-600">{error}</p>;
    }
    if (hint) {
      return <p className="mt-1.5 text-sm text-text-tertiary">{hint}</p>;
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Address fields (DRY reuse)
  // ---------------------------------------------------------------------------

  const addressFields = (streetLabel: string) => (
    <>
      {/* Street address */}
      <div>
        {renderLabel(streetLabel, true)}
        <input
          className={inputClass(!!fieldError("address_line1"))}
          placeholder="123 Main St"
          name="street-address"
          autoComplete="address-line1"
          spellCheck={false}
          autoCorrect="off"
          value={form.address_line1}
          onChange={(e) => updateField("address_line1", e.target.value)}
          onBlur={() => handleBlur("address_line1")}
        />
        {renderHint(fieldError("address_line1"))}
      </div>

      {/* City / State / ZIP row */}
      <div className="flex gap-4">
        <div className="w-[40%]">
          {renderLabel("City", true)}
          <input
            className={inputClass(!!fieldError("address_city"))}
            placeholder="City"
            name="address-level2"
            autoComplete="address-level2"
            spellCheck={false}
            autoCorrect="off"
            value={form.address_city}
            onChange={(e) => updateField("address_city", e.target.value)}
            onBlur={() => handleBlur("address_city")}
          />
          {renderHint(fieldError("address_city"))}
        </div>

        <div className="w-[35%]">
          {renderLabel("State", true)}
          <select
            className={inputClass(!!fieldError("address_state"))}
            name="address-level1"
            value={form.address_state}
            onChange={(e) => updateField("address_state", e.target.value)}
            onBlur={() => handleBlur("address_state")}
          >
            <option value="">State</option>
            {US_STATE_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          {renderHint(fieldError("address_state"))}
        </div>

        <div className="w-[25%]">
          {renderLabel("ZIP code", true)}
          <input
            className={inputClass(!!fieldError("address_zip"))}
            placeholder="XXXXX"
            name="postal-code"
            autoComplete="postal-code"
            spellCheck={false}
            autoCorrect="off"
            value={form.address_zip}
            onChange={(e) => updateField("address_zip", e.target.value)}
            onBlur={() => handleBlur("address_zip")}
          />
          {renderHint(fieldError("address_zip"))}
        </div>
      </div>
    </>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-8">
      {/* ================================================================= */}
      {/* Section: Your business                                            */}
      {/* ================================================================= */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 text-lg font-semibold text-text-primary">
          Your business
        </legend>

        {/* Business / app name */}
        <div>
          {renderLabel("Business or app name", true)}
          <input
            className={inputClass(!!fieldError("business_name"))}
            placeholder="The name your customers will see on texts"
            maxLength={100}
            spellCheck={false}
            autoCorrect="off"
            value={form.business_name}
            onChange={(e) => updateField("business_name", e.target.value)}
            onBlur={() => handleBlur("business_name")}
          />
          {renderHint(
            fieldError("business_name"),
            showEinFields
              ? "Use your legal business name exactly as registered with the IRS"
              : undefined,
          )}
          <p className="mt-1 text-right text-xs text-text-quaternary">
            {form.business_name.length}/100
          </p>
        </div>

        {/* Business description */}
        <div>
          {renderLabel("What does your business/app do?", true)}
          <textarea
            className={inputClass(!!fieldError("business_description"))}
            placeholder={`Describe your app in a sentence or two. Example: '${DESCRIPTION_EXAMPLES[useCase]}'`}
            maxLength={500}
            rows={3}
            value={form.business_description}
            onChange={(e) =>
              updateField("business_description", e.target.value)
            }
            onBlur={() => handleBlur("business_description")}
          />
          {renderHint(fieldError("business_description"))}
          <p className="mt-1 text-right text-xs text-text-quaternary">
            {form.business_description.length}/500
          </p>
        </div>

        {/* Industry gate alert */}
        {industryGate && <IndustryGateAlert gate={industryGate} />}

        {/* Use-case-specific fields */}
        {useCaseFields.map(({ field, label, placeholder, maxLength }) => {
          const isOptional = field === "app_name";
          return (
            <div key={field}>
              {renderLabel(label, !isOptional)}
              <input
                className={inputClass(!!fieldError(field))}
                placeholder={placeholder}
                maxLength={maxLength}
                value={form[field] ?? ""}
                onChange={(e) => updateField(field, e.target.value)}
                onBlur={() => handleBlur(field)}
              />
              {renderHint(fieldError(field))}
              {maxLength && (
                <p className="mt-1 text-right text-xs text-text-quaternary">
                  {(form[field] ?? "").length}/{maxLength}
                </p>
              )}
            </div>
          );
        })}

        {/* Website URL */}
        <div>
          {renderLabel("Website")}
          <input
            className={inputClass(!!fieldError("website_url"))}
            placeholder="yourapp.com"
            spellCheck={false}
            autoCorrect="off"
            value={form.website_url}
            onChange={(e) => updateField("website_url", e.target.value)}
            onBlur={() => handleBlur("website_url")}
          />
          {renderHint(fieldError("website_url"))}
        </div>

        {/* EIN radio group */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-text-secondary">
            Do you have a US business tax ID (EIN)?
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-primary p-3 transition duration-100 ease-linear hover:bg-bg-secondary">
              <input
                type="radio"
                name="has_ein"
                value="yes"
                checked={form.has_ein === "yes"}
                onChange={(e) => updateField("has_ein", e.target.value)}
                className="size-4 accent-purple-600"
              />
              <span className="text-sm text-text-primary">Yes</span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border-primary p-3 transition duration-100 ease-linear hover:bg-bg-secondary">
              <input
                type="radio"
                name="has_ein"
                value="no"
                checked={form.has_ein === "no"}
                onChange={(e) => updateField("has_ein", e.target.value)}
                className="mt-0.5 size-4 accent-purple-600"
              />
              <div>
                <span className="text-sm text-text-primary">No</span>
                <p className="mt-0.5 text-sm text-text-tertiary">
                  If you&apos;re a sole proprietor or hobbyist without an EIN,
                  select No.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Sole proprietor reassurance note */}
        {showSolePropNote && (
          <p className="rounded-lg bg-bg-secondary p-3 text-sm text-text-tertiary">
            No problem! We&apos;ll register you as a sole proprietor.
            You&apos;re limited to one campaign and one phone number, which is
            plenty for most apps.
          </p>
        )}

        {/* EIN-conditional fields */}
        {showEinFields && (
          <>
            {/* EIN input */}
            <div>
              {renderLabel("EIN", true)}
              <input
                className={inputClass(!!fieldError("ein"))}
                placeholder="XX-XXXXXXX"
                spellCheck={false}
                autoCorrect="off"
                value={form.ein}
                onChange={(e) => updateField("ein", e.target.value)}
                onBlur={() => handleBlur("ein")}
              />
              {renderHint(
                fieldError("ein"),
                "Must match the name and address on your IRS filing",
              )}
            </div>

            {/* Business type select */}
            <div>
              {renderLabel("Business type", true)}
              <select
                className={inputClass(!!fieldError("business_type"))}
                value={form.business_type}
                onChange={(e) =>
                  updateField("business_type", e.target.value)
                }
                onBlur={() => handleBlur("business_type")}
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {renderHint(fieldError("business_type"))}
            </div>

            {/* Registered business address */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-text-secondary">
                Registered business address
              </p>
              <p className="text-sm text-text-tertiary">
                Use the address associated with your business registration.
                Mismatches can delay approval.
              </p>
            </div>
            {addressFields("Street address")}
          </>
        )}
      </fieldset>

      {/* Section divider */}
      <hr className="border-border-secondary" />

      {/* ================================================================= */}
      {/* Section: Contact information                                      */}
      {/* ================================================================= */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 text-lg font-semibold text-text-primary">
          Contact information
        </legend>

        {/* First / Last name row */}
        <div className="flex gap-4">
          <div className="flex-1">
            {renderLabel("First name", true)}
            <input
              className={inputClass(!!fieldError("first_name"))}
              placeholder="First name"
              name="given-name"
              autoComplete="given-name"
              spellCheck={false}
              autoCorrect="off"
              value={form.first_name}
              onChange={(e) => updateField("first_name", e.target.value)}
              onBlur={() => handleBlur("first_name")}
            />
            {renderHint(fieldError("first_name"))}
          </div>
          <div className="flex-1">
            {renderLabel("Last name", true)}
            <input
              className={inputClass(!!fieldError("last_name"))}
              placeholder="Last name"
              name="family-name"
              autoComplete="family-name"
              spellCheck={false}
              autoCorrect="off"
              value={form.last_name}
              onChange={(e) => updateField("last_name", e.target.value)}
              onBlur={() => handleBlur("last_name")}
            />
            {renderHint(fieldError("last_name"))}
          </div>
        </div>

        {/* Email */}
        <div>
          {renderLabel("Email address", true)}
          <input
            className={inputClass(!!fieldError("email"))}
            type="email"
            placeholder="you@example.com"
            name="email"
            autoComplete="email"
            spellCheck={false}
            autoCorrect="off"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {renderHint(
            fieldError("email"),
            "We'll send your registration updates and setup files here",
          )}
        </div>

        {/* Phone */}
        <div>
          {renderLabel("Mobile phone number", true)}
          <input
            className={inputClass(!!fieldError("phone"))}
            type="tel"
            placeholder="(555) 555-1234"
            name="tel"
            autoComplete="tel"
            spellCheck={false}
            autoCorrect="off"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          {renderHint(
            fieldError("phone"),
            "We may need to send a verification code to this number",
          )}
        </div>

        {/* Address fields for non-EIN path (sole prop) */}
        {!showEinFields && addressFields("Your address")}
      </fieldset>
    </div>
  );
}
