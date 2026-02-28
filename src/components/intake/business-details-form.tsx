"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Select } from "@/components/base/select/select";
import { RadioGroup, RadioButton } from "@/components/base/radio-buttons/radio-buttons";
import {
  businessDetailsSchema,
  type BusinessDetailsData,
  US_STATE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  USE_CASE_FIELDS,
  validateUseCaseFields,
} from "@/lib/intake/validation";
import type { UseCaseId } from "@/lib/intake/use-case-data";

interface BusinessDetailsFormProps {
  useCase: UseCaseId;
  onValid: (data: BusinessDetailsData) => void;
  onInvalid: () => void;
}

type FieldErrors = Partial<Record<string, string>>;
type TouchedFields = Set<string>;

export function BusinessDetailsForm({
  useCase,
  onValid,
  onInvalid,
}: BusinessDetailsFormProps) {
  const [form, setForm] = useState<Record<string, string>>({
    business_name: "",
    business_description: "",
    has_ein: "",
    ein: "",
    business_type: "",
    contact_name: "",
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
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>(new Set());

  const updateField = useCallback(
    (field: string, value: string) => {
      const next = { ...form, [field]: value };
      setForm(next);

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
    [form, touched, useCase, onValid, onInvalid],
  );

  const validateField = useCallback(
    (field: string, data: Record<string, string>) => {
      const result = businessDetailsSchema.safeParse(data);
      if (result.success) {
        // Check use-case-specific fields too
        const ucErrors = validateUseCaseFields(
          useCase,
          result.data,
        );
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

  const handleBlur = useCallback(
    (field: string) => {
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

  return (
    <div className="flex flex-col gap-8">
      {/* Section: Your business */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-primary">
          Your business
        </legend>

        <Input
          label="Business or app name"
          placeholder="The name your customers will see on texts"
          isRequired
          value={form.business_name}
          onChange={(val) => updateField("business_name", val)}
          onBlur={() => handleBlur("business_name")}
          isInvalid={!!fieldError("business_name")}
          hint={fieldError("business_name")}
        />

        <TextArea
          label="What does your business/app do?"
          placeholder="Describe your app in a sentence or two. Example: 'A booking platform for pet groomers'"
          isRequired
          rows={3}
          value={form.business_description}
          onChange={(val) => updateField("business_description", val)}
          onBlur={() => handleBlur("business_description")}
          isInvalid={!!fieldError("business_description")}
          hint={fieldError("business_description")}
        />

        {/* Use-case-specific fields */}
        {useCaseFields.map(({ field, label, placeholder }) => {
          const isOptional = field === "app_name";
          return (
            <Input
              key={field}
              label={label}
              placeholder={placeholder}
              isRequired={!isOptional}
              value={form[field] ?? ""}
              onChange={(val) => updateField(field, val)}
              onBlur={() => handleBlur(field)}
              isInvalid={!!fieldError(field)}
              hint={fieldError(field)}
            />
          );
        })}

        <Input
          label="Website"
          placeholder="yourapp.com"
          value={form.website_url}
          onChange={(val) => updateField("website_url", val)}
          onBlur={() => handleBlur("website_url")}
          isInvalid={!!fieldError("website_url")}
          hint={fieldError("website_url")}
        />

        <div className="flex flex-col gap-1.5">
          <RadioGroup
            aria-label="Do you have a US business tax ID (EIN)?"
            value={form.has_ein}
            onChange={(val) => updateField("has_ein", val)}
          >
            <p className="text-sm font-medium text-secondary">
              Do you have a US business tax ID (EIN)?
            </p>
            <RadioButton value="yes" label="Yes" />
            <RadioButton
              value="no"
              label="No"
              hint="If you're a sole proprietor or hobbyist without an EIN, select No."
            />
          </RadioGroup>
        </div>

        {showSolePropNote && (
          <p className="rounded-lg bg-secondary p-3 text-sm text-tertiary">
            No problem! We&apos;ll register you as a sole proprietor.
            You&apos;re limited to one campaign and one phone number,
            which is plenty for most indie apps.
          </p>
        )}

        {showEinFields && (
          <>
            <Input
              label="EIN"
              placeholder="XX-XXXXXXX"
              isRequired
              value={form.ein}
              onChange={(val) => updateField("ein", val)}
              onBlur={() => handleBlur("ein")}
              isInvalid={!!fieldError("ein")}
              hint={fieldError("ein")}
            />

            <Select
              label="Business type"
              placeholder="Select business type"
              isRequired
              items={BUSINESS_TYPE_OPTIONS}
              selectedKey={form.business_type || null}
              onSelectionChange={(key) =>
                updateField("business_type", String(key))
              }
              onBlur={() => handleBlur("business_type")}
              isInvalid={!!fieldError("business_type")}
              hint={fieldError("business_type")}
            >
              {(item) => (
                <Select.Item id={item.id}>{item.label}</Select.Item>
              )}
            </Select>
          </>
        )}
      </fieldset>

      {/* Section divider */}
      <hr className="border-secondary" />

      {/* Section: Contact information */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-primary">
          Contact information
        </legend>

        <Input
          label="Your full name"
          placeholder="Full name"
          isRequired
          value={form.contact_name}
          onChange={(val) => updateField("contact_name", val)}
          onBlur={() => handleBlur("contact_name")}
          isInvalid={!!fieldError("contact_name")}
          hint={fieldError("contact_name")}
        />

        <Input
          label="Email address"
          placeholder="you@example.com"
          type="email"
          isRequired
          value={form.email}
          onChange={(val) => updateField("email", val)}
          onBlur={() => handleBlur("email")}
          isInvalid={!!fieldError("email")}
          hint={
            fieldError("email") ??
            "We'll send your registration updates and deliverable here"
          }
        />

        <Input
          label="Mobile phone number"
          placeholder="(555) 555-1234"
          type="tel"
          isRequired
          value={form.phone}
          onChange={(val) => updateField("phone", val)}
          onBlur={() => handleBlur("phone")}
          isInvalid={!!fieldError("phone")}
          hint={
            fieldError("phone") ??
            "Used for carrier verification — we'll send a code to this number"
          }
        />

        <Input
          label="Street address"
          placeholder="123 Main St"
          isRequired
          value={form.address_line1}
          onChange={(val) => updateField("address_line1", val)}
          onBlur={() => handleBlur("address_line1")}
          isInvalid={!!fieldError("address_line1")}
          hint={fieldError("address_line1")}
        />

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              label="City"
              placeholder="City"
              isRequired
              value={form.address_city}
              onChange={(val) => updateField("address_city", val)}
              onBlur={() => handleBlur("address_city")}
              isInvalid={!!fieldError("address_city")}
              hint={fieldError("address_city")}
            />
          </div>

          <div className="col-span-1">
            <Select
              label="State"
              placeholder="State"
              isRequired
              items={US_STATE_OPTIONS}
              selectedKey={form.address_state || null}
              onSelectionChange={(key) =>
                updateField("address_state", String(key))
              }
              onBlur={() => handleBlur("address_state")}
              isInvalid={!!fieldError("address_state")}
              hint={fieldError("address_state")}
            >
              {(item) => (
                <Select.Item id={item.id}>{item.label}</Select.Item>
              )}
            </Select>
          </div>

          <div className="col-span-1">
            <Input
              label="ZIP code"
              placeholder="XXXXX"
              isRequired
              value={form.address_zip}
              onChange={(val) => updateField("address_zip", val)}
              onBlur={() => handleBlur("address_zip")}
              isInvalid={!!fieldError("address_zip")}
              hint={fieldError("address_zip")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
