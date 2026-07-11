export type NotificationPriority = "informational" | "normal" | "important" | "urgent" | "critical";
export type NotificationStatus =
  | "requested"
  | "validated"
  | "policy_evaluated"
  | "queued"
  | "processing"
  | "sent"
  | "delivered"
  | "opened"
  | "acted"
  | "archived"
  | "suppressed"
  | "grouped"
  | "failed"
  | "expired"
  | "cancelled"
  | "resolved";

export type DeliveryChannel = "in_app" | "email" | "sms" | "push" | "digest";
export type DeliveryStatus = "pending" | "queued" | "processing" | "sent" | "delivered" | "opened" | "clicked" | "failed" | "bounced" | "suppressed" | "expired" | "cancelled";

export interface Notification {
  id: string;
  public_id: string;
  notification_type: string;
  category: string;
  source_system: string;
  source_event_id: string;
  source_entity_type: string;
  source_entity_id: string;
  organization_id_optional: string | null;
  workspace_id_optional: string | null;
  recipient_user_id: string;
  priority: NotificationPriority | string;
  severity: string;
  title: string;
  body: string;
  summary: string;
  action_label_optional: string | null;
  action_url_optional: string | null;
  status: NotificationStatus | string;
  read: boolean;
  scheduled_at: string | null;
  created_at: string;
  expires_at_optional: string | null;
  sent_at_optional: string | null;
  delivered_at_optional: string | null;
  opened_at_optional: string | null;
  acted_at_optional: string | null;
  dismissed_at_optional: string | null;
  archived_at_optional: string | null;
  snoozed_until_optional: string | null;
  deduplication_key_optional: string | null;
  grouping_key_optional: string | null;
  group_count: number;
  template_id: string;
  template_version: number;
  correlation_id: string;
  resolved: boolean;
}

export interface NotificationDelivery {
  id: string;
  notification_id: string;
  channel: DeliveryChannel | string;
  provider: string;
  destination_reference: string;
  status: DeliveryStatus | string;
  attempt_count: number;
  queued_at: string;
  sent_at_optional: string | null;
  delivered_at_optional: string | null;
  opened_at_optional: string | null;
  clicked_at_optional: string | null;
  failed_at_optional: string | null;
  failure_code_optional: string | null;
  provider_message_id_optional: string | null;
  next_retry_at_optional?: string | null;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  category: string;
  notification_type_optional: string | null;
  channel: string;
  enabled: boolean;
  delivery_mode: string;
  quiet_hours_behavior: string;
  digest_frequency_optional: string | null;
  timezone: string;
  organization_id_optional: string | null;
  workspace_id_optional: string | null;
  updated_at: string;
}

export interface QuietHours {
  user_id: string;
  enabled: boolean;
  start_time: string;
  end_time: string;
  timezone: string;
  weekend_behavior: string;
  updated_at: string;
}

export interface CommunicationConsent {
  id: string;
  user_id: string;
  channel: string;
  category: string;
  status: string;
  source: string;
  granted_at: string | null;
  revoked_at: string | null;
  evidence_reference: string | null;
  organization_id_optional: string | null;
  legal_basis_optional: string | null;
}

export interface NotificationTemplate {
  id: string;
  key: string;
  name: string;
  category: string;
  channel: string;
  language: string;
  subject_template?: string;
  title_template: string;
  body_template: string;
  summary_template?: string;
  action_label_template?: string;
  default_priority: string;
  required_variables: string[];
  allowed_variables: string[];
  approval_status: string;
  version: number;
  status: string;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  organization_id: string;
  workspace_id_optional: string | null;
  category: string;
  audience_definition: Record<string, unknown>;
  estimated_recipient_count: number;
  channels: string[];
  template_ids: string[];
  template_variables: Record<string, string>;
  status: string;
  created_by: string;
  approved_by_optional: string | null;
  scheduled_at_optional: string | null;
  sent_at_optional: string | null;
  cancelled_at_optional: string | null;
  execution_key: string;
  executed: boolean;
  created_at: string;
}

export interface NotificationRequestInput {
  event_type: string;
  source_system: string;
  source_entity: { type: string; id: string };
  recipient_user_id: string;
  organization_id_optional?: string;
  workspace_id_optional?: string;
  priority?: string;
  severity?: string;
  recommended_channels?: string[];
  template_key: string;
  template_variables?: Record<string, string>;
  title?: string;
  body?: string;
  summary?: string;
  action_label?: string;
  action_url?: string;
  scheduled_at_optional?: string;
  expires_at_optional?: string;
  deduplication_key_optional?: string;
  grouping_key_optional?: string;
  source_event_id?: string;
}

export interface PolicyDecision {
  allowed_channels: string[];
  delivery_mode: string;
  suppressed: boolean;
  suppress_reason?: string;
  hold_until?: string;
  mandatory: boolean;
}

export interface CampaignPreview {
  audience_count: number;
  channels: string[];
  sms_eligible: number;
  suppressed: number;
  estimated_email: number;
  estimated_sms: number;
  quiet_hour_delayed: number;
  consent_issues: number;
  duplicate_suppression: number;
  approval_required: boolean;
}

export interface NotificationOverview {
  queued: number;
  sent_today: number;
  delivery_rate: number;
  failed: number;
  bounced: number;
  suppressed: number;
  pending_approvals: number;
  provider_health: string;
  average_queue_delay_seconds: number;
  dead_letter: number;
  critical_failures: number;
}
