import { z } from "zod";
import type { UseCaseId } from "./use-case-data";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
  "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
  "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
  "WY",
] as const;

export const US_STATE_OPTIONS = [
  { id: "AL", label: "Alabama" },
  { id: "AK", label: "Alaska" },
  { id: "AZ", label: "Arizona" },
  { id: "AR", label: "Arkansas" },
  { id: "CA", label: "California" },
  { id: "CO", label: "Colorado" },
  { id: "CT", label: "Connecticut" },
  { id: "DE", label: "Delaware" },
  { id: "DC", label: "District of Columbia" },
  { id: "FL", label: "Florida" },
  { id: "GA", label: "Georgia" },
  { id: "HI", label: "Hawaii" },
  { id: "ID", label: "Idaho" },
  { id: "IL", label: "Illinois" },
  { id: "IN", label: "Indiana" },
  { id: "IA", label: "Iowa" },
  { id: "KS", label: "Kansas" },
  { id: "KY", label: "Kentucky" },
  { id: "LA", label: "Louisiana" },
  { id: "ME", label: "Maine" },
  { id: "MD", label: "Maryland" },
  { id: "MA", label: "Massachusetts" },
  { id: "MI", label: "Michigan" },
  { id: "MN", label: "Minnesota" },
  { id: "MS", label: "Mississippi" },
  { id: "MO", label: "Missouri" },
  { id: "MT", label: "Montana" },
  { id: "NE", label: "Nebraska" },
  { id: "NV", label: "Nevada" },
  { id: "NH", label: "New Hampshire" },
  { id: "NJ", label: "New Jersey" },
  { id: "NM", label: "New Mexico" },
  { id: "NY", label: "New York" },
  { id: "NC", label: "North Carolina" },
  { id: "ND", label: "North Dakota" },
  { id: "OH", label: "Ohio" },
  { id: "OK", label: "Oklahoma" },
  { id: "OR", label: "Oregon" },
  { id: "PA", label: "Pennsylvania" },
  { id: "RI", label: "Rhode Island" },
  { id: "SC", label: "South Carolina" },
  { id: "SD", label: "South Dakota" },
  { id: "TN", label: "Tennessee" },
  { id: "TX", label: "Texas" },
  { id: "UT", label: "Utah" },
  { id: "VT", label: "Vermont" },
  { id: "VA", label: "Virginia" },
  { id: "WA", label: "Washington" },
  { id: "WV", label: "West Virginia" },
  { id: "WI", label: "Wisconsin" },
  { id: "WY", label: "Wyoming" },
];

export const BUSINESS_TYPE_OPTIONS = [
  { id: "LLC", label: "LLC" },
  { id: "Corporation", label: "Corporation" },
  { id: "Partnership", label: "Partnership" },
  { id: "Non-profit", label: "Non-profit" },
];

const phoneDigits = (val: string) => val.replace(/\D/g, "");
const einDigits = (val: string) => val.replace(/\D/g, "");

export const businessDetailsSchema = z
  .object({
    // Business
    business_name: z
      .string()
      .min(2, "Required field")
      .max(100, "Required field"),
    business_description: z
      .string()
      .min(20, "Required field")
      .max(500, "Required field"),
    has_ein: z.enum(["yes", "no"], {
      message: "Required field",
    }),
    ein: z.string().optional(),
    business_type: z.string().optional(),

    // Contact
    contact_name: z
      .string()
      .min(2, "Required field"),
    email: z
      .string()
      .email("Required field"),
    phone: z
      .string()
      .min(1, "Required field")
      .refine(
        (val) => phoneDigits(val).length === 10,
        "Required field",
      ),
    address_line1: z
      .string()
      .min(1, "Required field"),
    address_city: z
      .string()
      .min(2, "Required field"),
    address_state: z
      .string()
      .refine(
        (val) => (US_STATES as readonly string[]).includes(val),
        "Required field",
      ),
    address_zip: z
      .string()
      .regex(/^\d{5}$/, "Required field"),

    // App-specific (all optional at base level, conditionally required below)
    website_url: z.string().optional(),
    service_type: z.string().optional(),
    product_type: z.string().optional(),
    app_name: z.string().optional(),
    community_name: z.string().optional(),
    venue_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // EIN conditional validation
    if (data.has_ein === "yes") {
      if (!data.ein || einDigits(data.ein).length !== 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required field",
          path: ["ein"],
        });
      }
      if (!data.business_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required field",
          path: ["business_type"],
        });
      }
    }
  });

export type BusinessDetailsData = z.infer<typeof businessDetailsSchema>;

/** Use-case-specific required fields */
export const USE_CASE_FIELDS: Partial<
  Record<UseCaseId, { field: keyof BusinessDetailsData; label: string; placeholder: string }[]>
> = {
  appointments: [
    {
      field: "service_type",
      label: "What type of service do your customers book?",
      placeholder: "e.g., dental, hair salon, consulting, auto repair",
    },
  ],
  orders: [
    {
      field: "product_type",
      label: "What do you sell/deliver?",
      placeholder: "e.g., clothing, food delivery, handmade goods",
    },
  ],
  verification: [
    {
      field: "app_name",
      label: "App name (if different from business)",
      placeholder: "The name users see when they get a code",
    },
  ],
  community: [
    {
      field: "community_name",
      label: "Community or group name",
      placeholder: "e.g., Local Runners Club, Beta Testers",
    },
  ],
  waitlist: [
    {
      field: "venue_type",
      label: "Type of venue/business",
      placeholder: "e.g., restaurant, barbershop, clinic",
    },
  ],
};

/** Validate use-case-specific required fields */
export function validateUseCaseFields(
  useCase: UseCaseId,
  data: BusinessDetailsData,
): { field: string; message: string }[] {
  const fields = USE_CASE_FIELDS[useCase];
  if (!fields) return [];

  const errors: { field: string; message: string }[] = [];
  for (const { field, label } of fields) {
    // verification app_name is optional per PRD
    if (field === "app_name") continue;
    const val = data[field];
    if (!val || (typeof val === "string" && val.trim().length < 2)) {
      errors.push({ field, message: "Required field" });
    }
  }
  return errors;
}
