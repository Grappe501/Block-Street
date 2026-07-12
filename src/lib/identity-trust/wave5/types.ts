export type SignalSeverity = "SI-1" | "SI-2" | "SI-3" | "SI-4" | "SI-5";
export type SignalConfidence = "low" | "moderate" | "high" | "very_high";

export type IntelligenceSignalStatus =
  | "generated"
  | "pending_triage"
  | "under_review"
  | "benign"
  | "explained"
  | "needs_more_information"
  | "security_referral"
  | "identity_governance_referral"
  | "operational_correction"
  | "false_positive"
  | "expired"
  | "closed";

export interface IdentityIntelligenceEvent {
  id: string;
  event_type: string;
  occurred_at: string;
  human_id: string | null;
  related_human_ids: string[];
  institution_id: string | null;
  source_system: string;
  source_event_id: string | null;
  event_features: Record<string, unknown>;
  privacy_classification: "standard" | "restricted" | "highly_restricted";
  ingested_at: string;
}

export interface IdentityIntelligenceSignal {
  id: string;
  signal_code: string;
  signal_type: string;
  subject_human_ids: string[];
  institution_ids: string[];
  severity: SignalSeverity;
  confidence: SignalConfidence;
  priority: number;
  summary: string;
  supporting_features: string[];
  countervailing_features: string[];
  known_limitations: string[];
  rule_id: string | null;
  rule_version: string | null;
  generated_at: string;
  expires_at: string | null;
  status: IntelligenceSignalStatus;
  prohibited_automatic_actions: string[];
}

export interface IdentityDetectionRule {
  id: string;
  rule_code: string;
  name: string;
  description: string;
  threat_type: string;
  default_severity: SignalSeverity;
  status: "draft" | "shadow" | "active" | "paused" | "retired";
  version: string;
  effective_at: string;
}

export interface IdentitySignalReferral {
  id: string;
  signal_id: string;
  referral_type: string;
  institution_id: string | null;
  priority: number;
  reason: string;
  recommended_actions: string[];
  prohibited_actions: string[];
  created_at: string;
  work_item_id: string | null;
  status: "open" | "closed";
}

export interface IdentitySignalFalsePositive {
  id: string;
  signal_id: string;
  review_outcome: string;
  false_positive_reason: string;
  reviewed_by: string;
  recorded_at: string;
}

export interface Wave5Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}
