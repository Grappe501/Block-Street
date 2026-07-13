/**
 * CAE-11.7-W2 — Context Intelligence data model
 */
import type {
  ATTENTION_CATEGORIES,
  ATTENTION_MODES,
  CONTEXT_AUTHORITY_LEVELS,
  CONTEXT_STATUSES,
  CONTEXT_TYPES,
  LOCATION_MODES,
} from "./constitution";

export type ContextType = (typeof CONTEXT_TYPES)[number];
export type ContextAuthorityLevel = (typeof CONTEXT_AUTHORITY_LEVELS)[number];
export type ContextStatus = (typeof CONTEXT_STATUSES)[number];
export type AttentionMode = (typeof ATTENTION_MODES)[number];
export type AttentionCategory = (typeof ATTENTION_CATEGORIES)[number];
export type LocationMode = (typeof LOCATION_MODES)[number];

export interface ContextTypeRegistryEntry {
  context_type: ContextType;
  description: string;
  authority_level: ContextAuthorityLevel;
  privacy_classification: "private" | "institution" | "federation";
  inference_allowed: boolean;
  human_confirmation_required: boolean;
  cross_institution_allowed: boolean;
  default_retention_hours: number;
}

export interface ContextSignalRecord {
  signal_id: string;
  localbrain_id: string;
  human_id: string;
  signal_type: string;
  source_system: string;
  source_reference: string;
  institution_id: string | null;
  observed_at: string;
  received_at: string;
  value: string;
  confidence: number;
  privacy_classification: "private" | "institution";
  retention_policy: "very_short" | "session" | "operational";
  expiration_at: string;
  processing_status: "pending" | "processed" | "expired";
}

export interface ActiveContextRecord {
  active_context_id: string;
  localbrain_id: string;
  human_id: string;
  stack_role: "primary" | "secondary" | "background" | "dormant";
  active_institution_id: string | null;
  active_organization_unit_id: string | null;
  active_role_id: string | null;
  active_mission_id: string | null;
  active_objective_id: string | null;
  active_task_id: string | null;
  active_calendar_event_id: string | null;
  active_meeting_id: string | null;
  active_conversation_id: string | null;
  active_learning_session_id: string | null;
  active_resource_id: string | null;
  active_location_context_id: string | null;
  active_device_session_id: string | null;
  attention_mode: AttentionMode;
  context_started_at: string;
  context_expires_at: string | null;
  confidence: number;
  authority_level: ContextAuthorityLevel;
  source_references: string[];
  last_confirmed_at: string | null;
  status: ContextStatus;
  created_at: string;
  updated_at: string;
}

export interface InstitutionContextRecord {
  institution_context_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  membership_id: string;
  active_role_id: string;
  organization_unit_id: string | null;
  permission_snapshot_reference: string;
  entered_at: string;
  exit_at: string | null;
  selection_method: "human_selected" | "restored" | "confirmed";
  confidence: number;
  status: ContextStatus;
}

export interface WorkContextRecord {
  work_context_id: string;
  localbrain_id: string;
  human_id: string;
  mission_id: string;
  assignment_id: string | null;
  task_id: string | null;
  strategic_objective_id: string | null;
  role_in_mission: string;
  current_status: string;
  priority: "low" | "medium" | "high" | "critical";
  due_at: string | null;
  blocked_by: string[];
  relevant_resources: string[];
  relevant_people: string[];
  relevant_knowledge: string[];
  context_confidence: number;
  started_at: string;
  expires_at: string | null;
}

export interface CalendarContextRecord {
  calendar_context_id: string;
  localbrain_id: string;
  human_id: string;
  event_id: string | null;
  event_type: string;
  start_at: string;
  end_at: string;
  time_zone: string;
  attendance_status: "scheduled" | "in_progress" | "completed";
  preparation_required: boolean;
  travel_required: boolean;
  linked_mission_id: string | null;
  context_state: "before" | "during" | "after";
  confidence: number;
}

export interface LocationContextRecord {
  location_context_id: string;
  localbrain_id: string;
  human_id: string;
  location_mode: LocationMode;
  general_area: string | null;
  precise_location: string | null;
  purpose: string;
  permission_reference: string | null;
  captured_at: string;
  expires_at: string;
  sharing_scope: "private" | "mission" | "emergency";
  confidence: number;
  status: ContextStatus;
}

export interface DeviceSessionRecord {
  device_session_id: string;
  localbrain_id: string;
  human_id: string;
  device_type: "phone" | "tablet" | "laptop" | "desktop" | "large_display" | "kiosk";
  application_surface: string;
  operating_mode: "online" | "offline";
  connectivity_state: string;
  accessibility_modes: string[];
  session_started_at: string;
  last_active_at: string;
  shared_device: boolean;
  status: "active" | "ended";
}

export interface FocusSessionRecord {
  focus_session_id: string;
  localbrain_id: string;
  human_id: string;
  purpose: string;
  linked_mission_id: string | null;
  linked_task_id: string | null;
  start_at: string;
  planned_end_at: string;
  interruption_policy: "critical_only" | "mission_critical" | "emergency_only";
  allowed_alert_levels: string[];
  status: "active" | "completed" | "cancelled";
}

export interface AttentionItemRecord {
  attention_item_id: string;
  localbrain_id: string;
  human_id: string;
  subject: string;
  category: AttentionCategory;
  recommended_priority: number;
  reason: string;
  deadline: string | null;
  affected_missions: string[];
  evidence: string[];
  confidence: number;
  estimated_effort: string;
  recommended_action: string;
  created_at: string;
}

export interface NextActionRecord {
  next_action_id: string;
  localbrain_id: string;
  human_id: string;
  context_reference: string;
  recommended_action: string;
  why_now: string;
  supporting_evidence: string[];
  estimated_effort: string;
  deadline: string | null;
  required_authority: string;
  confidence: number;
  expires_at: string;
  status: "recommended" | "accepted" | "dismissed" | "expired";
}

export interface ContextCorrectionRecord {
  correction_id: string;
  localbrain_id: string;
  human_id: string;
  field_corrected: string;
  previous_value: string;
  corrected_value: string;
  corrected_at: string;
}

export const CONTEXT_STORE_KEYS = {
  registry: "lix_context_registry",
  signals: "lix_context_signals",
  active: "lix_context_active",
  institution: "lix_context_institution",
  work: "lix_context_work",
  calendar: "lix_context_calendar",
  location: "lix_context_location",
  device: "lix_context_device",
  focus: "lix_context_focus",
  attention: "lix_context_attention",
  nextActions: "lix_context_next_actions",
  corrections: "lix_context_corrections",
  inferencePaused: "lix_context_inference_paused",
} as const;
