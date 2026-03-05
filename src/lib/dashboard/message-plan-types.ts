/** Shape of a single message entry in the plan (matches message_plans.messages JSONB) */
export interface MessagePlanEntry {
  template_id: string;
  category: string;
  original_template: string;
  edited_text: string | null;
  trigger: string;
  variables: string[];
  is_expansion: boolean;
  expansion_type: string | null;
  enabled: boolean;
}

export interface ComplianceWarning {
  element: string;
  label: string;
  present: boolean;
}
