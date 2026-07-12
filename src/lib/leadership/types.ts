export type LeadershipStage =
  | "participant"
  | "reliable_contributor"
  | "emerging_leader"
  | "team_leader"
  | "program_leader"
  | "institution_leader"
  | "mentor"
  | "strategic_leader"
  | "legacy_builder";

export type ReadinessLevel =
  | "not_ready"
  | "developing"
  | "nearly_ready"
  | "ready"
  | "ready_with_mentoring"
  | "ready_for_advancement";

export type CompetencyLevel = "learning" | "practicing" | "independent" | "advanced" | "mentor" | "master";

export type SuccessionRisk = "healthy" | "monitor" | "needs_development" | "high_risk" | "critical";

export type VerificationLevel = "self_reported" | "peer_verified" | "leader_verified" | "system_verified";

export interface LeadershipProfile {
  id: string;
  user_id: string;
  institution_id: string;
  leadership_stage: LeadershipStage;
  leadership_score: number;
  readiness_level: ReadinessLevel;
  mentor_id: string | null;
  development_plan_id: string | null;
  succession_candidates: string[];
  strengths: string[];
  growth_areas: string[];
  score_breakdown: Record<string, number>;
  updated_at: string;
}

export interface LeadershipEvidence {
  id: string;
  user_id: string;
  institution_id: string;
  competency: string;
  activity_type: string;
  evidence_reference: string | null;
  verification_level: VerificationLevel;
  impact_score: number;
  date: string;
}

export interface CompetencyRecord {
  id: string;
  user_id: string;
  institution_id: string;
  competency: string;
  level: CompetencyLevel;
  evidence_count: number;
  updated_at: string;
}

export interface LeadershipDevelopmentPlan {
  id: string;
  user_id: string;
  institution_id: string;
  mentor_id: string | null;
  target_stage: LeadershipStage;
  competencies: string[];
  recommended_training: string[];
  recommended_missions: string[];
  target_date: string | null;
  status: "draft" | "active" | "completed";
  created_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  institution_id: string;
  experience_years: number;
  competencies: string[];
  expertise_areas: string[];
  availability: "available" | "limited" | "unavailable";
  active_mentees: string[];
  mentorship_history_count: number;
}

export interface MentorshipRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  institution_id: string;
  relationship_type: "one_on_one" | "group" | "peer" | "leadership_circle";
  status: "active" | "completed" | "paused";
  started_at: string;
}

export interface LeadershipCohort {
  id: string;
  institution_id: string;
  name: string;
  cohort_type: "student" | "county" | "executive" | "community_organizer";
  curriculum: string[];
  mentor_ids: string[];
  member_ids: string[];
  status: "forming" | "active" | "completed";
  created_at: string;
}

export interface SuccessionPlan {
  id: string;
  institution_id: string;
  role: string;
  current_leader_id: string;
  candidate_list: Array<{ user_id: string; readiness_level: ReadinessLevel }>;
  risk_level: SuccessionRisk;
  development_actions: string[];
  review_date: string;
  updated_at: string;
}

export interface LeadershipOpportunity {
  id: string;
  institution_id: string;
  title: string;
  opportunity_type: string;
  target_stage: LeadershipStage;
  recommended_for_user_id: string | null;
  status: "open" | "recommended" | "filled";
}

export interface LeadershipHealthSummary {
  pipeline_depth: number;
  emerging_leaders: number;
  mentor_capacity_percent: number;
  succession_ready_percent: number;
  average_leadership_score: number;
  high_risk_roles: number;
  cohorts_active: number;
  updated_at: string;
}

export interface ExecutiveLeadershipDashboard {
  institution_id: string;
  pipeline_health: "healthy" | "monitor" | "at_risk";
  emerging_leaders: number;
  succession_health: SuccessionRisk;
  cohort_progress_percent: number;
  mentor_availability: number;
  leadership_gaps: string[];
}

export interface LeadershipInsight {
  user_id: string;
  insight_type: "coaching" | "opportunity" | "training" | "succession";
  title: string;
  message: string;
  advisory_only: boolean;
  generated_at: string;
}

export interface LeadershipPrivacySettings {
  user_id: string;
  institution_id: string;
  public_leadership_profile: boolean;
  mentoring_visibility: boolean;
  achievement_sharing: boolean;
  evaluations_private: boolean;
  updated_at: string;
}

export interface LeadershipAuditEvent {
  id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: "success" | "failure";
  timestamp: string;
  metadata?: Record<string, unknown>;
}
