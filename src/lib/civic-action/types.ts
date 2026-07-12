export type InitiativeType =
  | "program"
  | "campaign"
  | "project"
  | "operation"
  | "community_response"
  | "educational_initiative"
  | "leadership_initiative"
  | "research_initiative"
  | "coalition_initiative"
  | "institutional_change"
  | "pilot"
  | "emergency_operation";

export type InitiativeStatus =
  | "concept"
  | "discovery"
  | "design"
  | "approval"
  | "preparation"
  | "active"
  | "paused"
  | "at_risk"
  | "closing"
  | "completed"
  | "cancelled"
  | "archived";

export type MissionStatus =
  | "draft"
  | "ready"
  | "available"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "blocked"
  | "submitted"
  | "under_review"
  | "completed"
  | "rejected"
  | "cancelled";

export type ResponsibilityType =
  | "owner"
  | "lead"
  | "contributor"
  | "approver"
  | "reviewer"
  | "advisor"
  | "informed"
  | "backup";

export type DecisionStatus = "pending" | "approved" | "rejected" | "escalated" | "expired";

export interface LegacyInitiative {
  id: string;
  institution_id: string;
  name: string;
  public_name_optional: string | null;
  description: string;
  initiative_type: InitiativeType;
  problem_statement: string;
  purpose: string;
  target_population: string;
  geographic_scope: string;
  organizational_scope: string;
  executive_owner_human_id: string;
  operational_owner_human_id: string;
  start_at: string;
  target_end_at: string;
  status: InitiativeStatus;
  risk_level: "low" | "medium" | "high" | "critical";
  privacy_level: "public" | "internal" | "restricted";
}

/** MVP store shape — canonical model is InitiativeRecord in builds/11.1/data-model.ts (W3 migrates store) */
export type Initiative = LegacyInitiative;

export type {
  InitiativeRecord,
  InitiativeCharterRecord,
  InitiativeScopeRecord,
  InitiativeTimelineRecord,
  InitiativeMembershipRecord,
  InitiativeVersionRecord,
  InitiativeDependencyRecord,
  InitiativeReviewRecord,
  InitiativeHistoryEvent,
  InitiativeCloseoutRecord,
  InitiativeAggregate,
  CanonicalInitiativeStatus,
  CanonicalInitiativeType,
} from "./builds/11.1/data-model";

export interface StrategicObjective {
  id: string;
  initiative_id: string;
  title: string;
  description: string;
  objective_type: string;
  baseline: number;
  target: number;
  current_value: number;
  measurement_method: string;
  owner_human_id: string;
  start_at: string;
  due_at: string;
  status: "on_track" | "at_risk" | "off_track" | "completed";
  confidence: "low" | "medium" | "high";
  metric_class: "activity" | "output" | "outcome" | "impact";
}

export interface KeyResult {
  id: string;
  objective_id: string;
  metric: string;
  baseline_value: number;
  target_value: number;
  current_value: number;
  measurement_frequency: string;
  data_source: string;
  owner_human_id: string;
  status: string;
}

export interface Workstream {
  id: string;
  initiative_id: string;
  name: string;
  description: string;
  owner_human_id: string;
  status: "active" | "paused" | "completed" | "at_risk";
  priority: number;
  start_at: string;
  target_end_at: string;
  dependency_ids: string[];
}

export interface ExecutionMission {
  id: string;
  workstream_id: string;
  initiative_id: string;
  title: string;
  purpose: string;
  instructions: string;
  target_role: string;
  required_skills: string[];
  estimated_effort: string;
  location_scope: string;
  owner_human_id: string;
  assigned_human_id: string | null;
  start_at: string;
  due_at: string;
  completion_standard: string;
  verification_method: string;
  status: MissionStatus;
  blocker_reason: string | null;
}

export interface InitiativeResponsibility {
  id: string;
  initiative_id: string;
  workstream_id: string | null;
  mission_id: string | null;
  human_id: string;
  institution_membership_id: string;
  responsibility_type: ResponsibilityType;
  scope: string;
  starts_at: string;
  ends_at: string | null;
  status: "active" | "ended";
}

export interface OperationalEvent {
  id: string;
  institution_id: string;
  initiative_id: string | null;
  workstream_id: string | null;
  mission_id: string | null;
  calendar_scope: string;
  title: string;
  event_type: string;
  start_at: string;
  end_at: string;
  timezone: string;
  location: string | null;
  virtual_location: string | null;
  owner_human_id: string;
  visibility: "public" | "internal" | "team";
  status: "scheduled" | "completed" | "cancelled";
}

export interface OperationalResource {
  id: string;
  institution_id: string;
  resource_type: string;
  name: string;
  description: string;
  owner_human_id: string;
  quantity: number;
  availability: number;
  location: string | null;
  restriction: string | null;
  status: "available" | "allocated" | "unavailable";
}

export interface ResourceAllocation {
  id: string;
  resource_id: string;
  initiative_id: string;
  workstream_id: string | null;
  mission_id: string | null;
  quantity: number;
  starts_at: string;
  ends_at: string;
  approved_by: string;
  status: "pending" | "approved" | "released";
}

export interface CommunicationsPlan {
  id: string;
  initiative_id: string;
  audience: string;
  objective: string;
  message: string;
  messenger_human_id: string;
  channels: string[];
  schedule: string;
  approval_required: boolean;
  owner_human_id: string;
  status: "draft" | "pending_approval" | "approved" | "sent";
  ai_drafted: boolean;
}

export interface FieldOperation {
  id: string;
  initiative_id: string;
  geographic_scope: string;
  operation_type: string;
  field_lead_human_id: string;
  team_id: string | null;
  start_at: string;
  end_at: string;
  target: string;
  status: "planned" | "active" | "completed" | "cancelled";
}

export interface CoalitionInitiative {
  id: string;
  host_institution_id: string;
  participating_institution_ids: string[];
  name: string;
  purpose: string;
  governance_agreement_id: string;
  shared_objectives: string[];
  data_scope: string;
  start_at: string;
  end_at: string;
  status: "active" | "completed" | "dissolved";
}

export interface OperationalDecision {
  id: string;
  institution_id: string;
  initiative_id: string | null;
  decision_type: string;
  question: string;
  options: string[];
  recommendation: string;
  evidence: string;
  decision_authority_human_id: string;
  required_approvers: string[];
  due_at: string;
  status: DecisionStatus;
  decision: string | null;
  decided_at: string | null;
  ai_recommended: boolean;
}

export interface ExecutionAdaptation {
  id: string;
  initiative_id: string;
  trigger: string;
  observed_condition: string;
  original_assumption: string;
  new_evidence: string;
  recommended_change: string;
  approved_change: string | null;
  approved_by: string | null;
  effective_at: string | null;
  outcome: string | null;
  status: "proposed" | "approved" | "rejected";
}

export interface ActionEvidence {
  id: string;
  initiative_id: string;
  workstream_id: string | null;
  mission_id: string | null;
  submitted_by_human_id: string;
  evidence_type: string;
  description: string;
  artifact_reference: string;
  occurred_at: string;
  location_scope: string | null;
  verification_status: "pending" | "verified" | "rejected";
  reviewed_by: string | null;
}

export interface ActionOutcomeLink {
  id: string;
  action_evidence_id: string;
  outcome_record_id: string;
  relationship_type: "supports" | "contributes_to" | "likely_influenced" | "directly_produced" | "contradicts" | "insufficient_evidence";
  confidence: "low" | "medium" | "high";
  explanation: string;
  reviewed_by: string;
}

export interface ExecutionPlaybook {
  id: string;
  name: string;
  initiative_type: InitiativeType;
  problem_addressed: string;
  required_conditions: string[];
  steps: string[];
  roles: string[];
  timeline: string;
  resources: string[];
  risks: string[];
  success_metrics: string[];
  source_initiative_id: string;
  version: string;
  status: "draft" | "published" | "archived";
}

export interface OperationalRisk {
  id: string;
  initiative_id: string;
  risk_type: string;
  description: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
  owner_human_id: string;
  trigger: string;
  status: "open" | "mitigated" | "accepted";
}

export interface OperationalIncident {
  id: string;
  institution_id: string;
  initiative_id: string | null;
  incident_type: string;
  severity: "low" | "medium" | "high" | "critical";
  reported_by_human_id: string;
  occurred_at: string;
  description: string;
  containment: string;
  status: "open" | "contained" | "resolved";
  owner_human_id: string;
}

export interface InitiativeAuditEvent {
  id: string;
  initiative_id: string | null;
  institution_id: string;
  actor_human_id: string;
  event_type: string;
  summary: string;
  correlation_id: string | null;
  timestamp: string;
}

export interface CommandCenterView {
  today: {
    active_initiatives: number;
    current_missions: number;
    events_today: number;
    pending_approvals: number;
    open_incidents: number;
    blocked_missions: number;
  };
  at_risk: {
    blocked_missions: ExecutionMission[];
    overdue_decisions: OperationalDecision[];
    at_risk_initiatives: Initiative[];
    under_resourced: Workstream[];
  };
  outcomes: {
    objectives: StrategicObjective[];
    on_track: number;
    at_risk: number;
  };
}

export interface CaeCertification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}
