/**
 * CAE-11.7-W3 — Executive Assistant data model
 */
import type {
  BRIEFING_TYPES,
  COMMITMENT_STATUSES,
  DECISION_READINESS_STATES,
  EXECUTIVE_OUTPUT_STATES,
  EXECUTIVE_RISK_CLASSES,
  UNCERTAINTY_LABELS,
} from "./constitution";

export type BriefingType = (typeof BRIEFING_TYPES)[number];
export type ExecutiveOutputState = (typeof EXECUTIVE_OUTPUT_STATES)[number];
export type DecisionReadinessState = (typeof DECISION_READINESS_STATES)[number];
export type CommitmentStatus = (typeof COMMITMENT_STATUSES)[number];
export type ExecutiveRiskClass = (typeof EXECUTIVE_RISK_CLASSES)[number];
export type UncertaintyLabel = (typeof UNCERTAINTY_LABELS)[number];

export const EXECUTIVE_STORE_KEYS = {
  capabilities: "lix_executive_capabilities",
  roleContext: "lix_executive_role_context",
  briefings: "lix_executive_briefings",
  meetingPrep: "lix_executive_meeting_prep",
  decisions: "lix_executive_decisions",
  evidence: "lix_executive_evidence",
  dissent: "lix_executive_dissent",
  commitments: "lix_executive_commitments",
  drafts: "lix_executive_drafts",
  delegations: "lix_executive_delegations",
  handoffs: "lix_executive_handoffs",
  risks: "lix_executive_risks",
  opportunities: "lix_executive_opportunities",
  inquiries: "lix_executive_inquiries",
  responses: "lix_executive_responses",
  incidents: "lix_executive_incidents",
  voicePreferences: "lix_executive_voice_preferences",
} as const;

export interface ExecutiveCapabilityEntry {
  capability_id: string;
  capability_name: string;
  description: string;
  capability_class: string;
  risk_class: ExecutiveRiskClass;
  human_review_required: boolean;
  send_or_mutation_allowed: false;
  required_permissions: string[];
  status: "active" | "restricted";
}

export interface ExecutiveRoleContextRecord {
  executive_role_context_id: string;
  human_id: string;
  institution_id: string;
  role_id: string;
  role_title: string;
  authority_scope: string[];
  delegated_authority: string[];
  approval_limits: Record<string, number>;
  financial_limits: Record<string, number>;
  governance_scope: string[];
  mission_scope: string[];
  organization_scope: string[];
  effective_at: string;
  expires_at: string | null;
  source_reference: string;
  status: "active" | "expired";
}

export interface BriefingItemRecord {
  briefing_item_id: string;
  category: string;
  headline: string;
  summary: string;
  why_it_matters: string;
  source_references: string[];
  priority: string;
  confidence: number;
  uncertainty_label: UncertaintyLabel;
  decision_required: boolean;
  recommended_action: string | null;
  deadline: string | null;
}

export interface ExecutiveBriefingRecord {
  briefing_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  briefing_type: BriefingType;
  title: string;
  summary: string;
  items: BriefingItemRecord[];
  prepared_at: string;
  current_through: string;
  sources_synchronized_at: string;
  stale_sources: string[];
  output_state: ExecutiveOutputState;
  confidence: number;
  expires_at: string;
  status: "active" | "expired" | "refreshed";
}

export interface MeetingPreparationRecord {
  meeting_preparation_id: string;
  calendar_event_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  meeting_purpose: string;
  attendees: { human_id: string; role: string; organization: string }[];
  agenda: string[];
  desired_outcomes: string[];
  open_decisions: string[];
  prior_commitments: string[];
  related_missions: string[];
  relevant_documents: string[];
  recent_changes: string[];
  risks: string[];
  questions_to_ask: string[];
  talking_points: string[];
  authority_context: string;
  recording: false;
  unauthorized_invitation: false;
  prepared_at: string;
  expires_at: string;
}

export interface DecisionOptionRecord {
  option_id: string;
  title: string;
  description: string;
  benefits: string[];
  costs: string[];
  risks: string[];
  affected_groups: string[];
  evidence: string[];
  confidence: number;
  reversibility: string;
}

export interface DecisionPackageRecord {
  decision_package_id: string;
  institution_id: string;
  human_id: string;
  localbrain_id: string;
  decision_subject: string;
  decision_question: string;
  decision_owner: string;
  authority_required: string[];
  human_may_approve: boolean;
  deadline: string | null;
  options: DecisionOptionRecord[];
  recommended_option_id: string | null;
  supporting_evidence: string[];
  contradictory_evidence: string[];
  dissent_visible: boolean;
  readiness_state: DecisionReadinessState;
  confidence: number;
  assumptions: string[];
  limitations: string[];
  prepared_at: string;
  status: "draft" | "ready" | "expired";
}

export interface EvidenceLedgerEntry {
  evidence_ledger_id: string;
  executive_output_id: string;
  source_type: string;
  source_id: string;
  source_version: string;
  claim_supported: string;
  authority_level: string;
  freshness: string;
  confidence: number;
  uncertainty_label: UncertaintyLabel;
  access_scope: string;
  included_at: string;
}

export interface DissentItemRecord {
  dissent_item_id: string;
  decision_package_id: string;
  position: string;
  supporting_evidence: string[];
  raised_by: string | null;
  affected_groups: string[];
  resolution_status: "open" | "addressed" | "unresolved";
}

export interface ExecutiveCommitmentRecord {
  commitment_id: string;
  human_id: string;
  institution_id: string;
  localbrain_id: string;
  source_type: string;
  source_id: string;
  commitment_text: string;
  commitment_type: string;
  made_to: string | null;
  linked_mission_id: string | null;
  due_at: string | null;
  evidence_reference: string;
  confirmation_status: CommitmentStatus;
  status: CommitmentStatus;
  reliability_score: null;
  created_at: string;
  updated_at: string;
}

export interface ExecutiveDraftRecord {
  executive_draft_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  draft_type: string;
  purpose: string;
  audience: string;
  draft_content: string;
  evidence_references: string[];
  claims_requiring_review: string[];
  tone: string;
  language: string;
  sensitivity: string;
  ai_prepared: true;
  send_status: "not_sent";
  human_review_required: true;
  approval_requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface DelegationRecommendationRecord {
  delegation_recommendation_id: string;
  human_id: string;
  institution_id: string;
  work_item: string;
  recommended_recipient: string;
  reason: string;
  recipient_authority: boolean;
  recipient_capacity: boolean;
  confidence: number;
  assignment_allowed: false;
  status: "recommended";
}

export interface HandoffPackageRecord {
  handoff_package_id: string;
  human_id: string;
  institution_id: string;
  subject: string;
  purpose: string;
  current_state: string;
  work_completed: string[];
  work_remaining: string[];
  decisions_made: string[];
  open_questions: string[];
  documents: string[];
  deadline: string | null;
  authority_scope: string;
  next_action: string;
  prepared_by: string;
  prepared_at: string;
}

export interface RiskBriefRecord {
  risk_brief_id: string;
  human_id: string;
  institution_id: string;
  summary: string;
  why_now: string;
  likelihood: string;
  impact: string;
  confidence: number;
  affected_missions: string[];
  mitigation_options: string[];
  decision_required: boolean;
  source_references: string[];
  artificial_urgency: false;
}

export interface OpportunityBriefRecord {
  opportunity_brief_id: string;
  human_id: string;
  institution_id: string;
  opportunity: string;
  strategic_alignment: string;
  evidence: string[];
  time_window: string;
  confidence: number;
  decision_required: boolean;
}

export interface ExecutiveInquiryRecord {
  executive_inquiry_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  question: string;
  interpreted_intent: string;
  answer: string;
  evidence_sources: string[];
  confidence: number;
  limitations: string[];
  follow_up_questions: string[];
  unconfirmed_items: string[];
  created_at: string;
}

export interface ExecutiveResponseRecord {
  executive_response_id: string;
  request_type: string;
  title: string;
  summary: string;
  human_id: string;
  institution_id: string;
  role_id: string;
  purpose: string;
  evidence_references: string[];
  decisions_required: string[];
  recommendations: string[];
  alternatives: string[];
  confidence: number;
  limitations: string[];
  human_action_required: true;
  output_state: ExecutiveOutputState;
  generated_at: string;
  expires_at: string | null;
}

export interface ExecutiveOutputIncidentRecord {
  incident_id: string;
  executive_output_id: string;
  human_id: string;
  report: string;
  context_snapshot: Record<string, unknown>;
  reported_at: string;
}

export interface VoicePreferenceRecord {
  human_id: string;
  tone: string;
  formality: string;
  language: string;
  adaptation_paused: boolean;
  learned_from_drafts: string[];
}
