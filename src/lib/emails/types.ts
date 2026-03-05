/** Email template output — ready to pass to any email provider */
export interface EmailTemplate {
  subject: string;
  body: string;
}

/** Variables for registration-submitted email (Email 2) */
export interface RegistrationSubmittedVars {
  first_name: string;
  compliance_site_url: string;
}

/** Variables for OTP-required email (Email 3) */
export interface OtpRequiredVars {
  first_name: string;
  formatted_phone: string;
}

/** Variables for campaign-approved email (Email 4) */
export interface CampaignApprovedVars {
  first_name: string;
}

/** Variables for registration-rejected email (Email 5) */
export interface RegistrationRejectedVars {
  first_name: string;
  rejection_explanation: string;
  auto_fix_status: string;
}
