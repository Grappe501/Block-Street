export type ParticipationEventType =
  | "volunteer_shift"
  | "event_attendance"
  | "event_leadership"
  | "mission_completed"
  | "membership_joined"
  | "meeting_attended"
  | "training_completed"
  | "mentoring"
  | "recruitment"
  | "content_created"
  | "research"
  | "planning"
  | "public_comment"
  | "community_project"
  | "campaign_activity"
  | "coalition_activity"
  | "outreach_action"
  | "community_action";

export type EventCategory =
  | "volunteer"
  | "meeting"
  | "training"
  | "mission"
  | "event_attendance"
  | "event_leadership"
  | "mentoring"
  | "recruitment"
  | "content"
  | "research"
  | "planning"
  | "public_comment"
  | "community_project"
  | "campaign_activity"
  | "coalition_activity";

export type VerificationStatus =
  | "self_reported"
  | "peer_verified"
  | "leader_verified"
  | "system_verified"
  | "automatically_recorded";

export type PrivacyLevel = "private" | "institution" | "community" | "public";

export type CivicJourneyStage =
  | "interested"
  | "participant"
  | "regular_contributor"
  | "reliable_volunteer"
  | "leader"
  | "community_builder"
  | "mentor"
  | "institution_builder"
  | "civic_champion";

export type ParticipationMomentum = "growing" | "stable" | "declining" | "dormant" | "reactivated";

export type EngagementStage = CivicJourneyStage;

export interface ParticipationEvent {
  id: string;
  user_id: string;
  institution_id: string;
  organization_id: string | null;
  community_id: string;
  county_id: string | null;
  event_type: ParticipationEventType;
  category: EventCategory;
  source_system: string;
  title: string;
  timestamp: string;
  duration_minutes: number | null;
  location_optional: string | null;
  impact_weight: number;
  verification_status: VerificationStatus;
  evidence_reference: string | null;
  privacy_level: PrivacyLevel;
  participants_count: number;
  /** @deprecated use timestamp */
  recorded_at: string;
}

export interface CivicParticipationScore {
  institution_id: string;
  community_id: string;
  user_id?: string;
  score: number;
  participation_frequency: number;
  volunteer_activity: number;
  mission_completion: number;
  leadership: number;
  learning: number;
  mentoring: number;
  community_projects: number;
  /** legacy fields */
  attendance_rate: number;
  membership_growth: number;
  community_involvement: number;
  civic_habits: number;
  stage: CivicJourneyStage;
  momentum: ParticipationMomentum;
  explainable_factors: string[];
  score_breakdown: Record<string, number>;
  updated_at: string;
}

export interface EngagementTrend {
  institution_id: string;
  community_id: string;
  period: string;
  participation_index: number;
  volunteer_hours: number;
  active_participants: number;
  retention_rate: number;
  direction: "rising" | "stable" | "declining";
  updated_at: string;
}

export interface ParticipationForecast {
  institution_id: string;
  community_id: string;
  horizon_days: number;
  projected_participants: number;
  projected_volunteer_hours: number;
  confidence: number;
  risk_factors: string[];
  opportunities: string[];
  burnout_risk: "low" | "moderate" | "elevated";
  leadership_readiness: boolean;
  generated_at: string;
}

export interface CivicHabitRecord {
  id: string;
  institution_id: string;
  user_id: string;
  habit_type: string;
  streak_weeks: number;
  last_action_at: string;
  consistency_score: number;
  return_rate: number;
  recovery_after_absence: boolean;
}

export interface CivicTimelineEntry {
  id: string;
  user_id: string;
  institution_id: string;
  entry_type: string;
  title: string;
  description: string;
  event_id: string | null;
  milestone_id: string | null;
  timestamp: string;
  visibility: PrivacyLevel;
}

export interface CivicMilestone {
  id: string;
  user_id: string;
  institution_id: string;
  milestone_key: string;
  title: string;
  description: string;
  awarded_at: string;
  visibility: PrivacyLevel;
}

export interface VolunteerRecord {
  user_id: string;
  institution_id: string;
  total_hours: number;
  verified_hours: number;
  projects: string[];
  skills_used: string[];
  organizations_served: string[];
  leadership_roles: number;
  updated_at: string;
}

export interface ParticipationPrivacySettings {
  user_id: string;
  institution_id: string;
  public_achievements: boolean;
  volunteer_history_visible: boolean;
  leaderboards_enabled: boolean;
  community_profile_visibility: PrivacyLevel;
  milestone_badges_only: boolean;
  updated_at: string;
}

export interface UserParticipationDashboard {
  user_id: string;
  volunteer_hours: number;
  meetings: number;
  missions: number;
  training_completed: number;
  leadership_roles: number;
  current_streak_weeks: number;
  participation_trend: ParticipationMomentum;
  journey_stage: CivicJourneyStage;
  score: number;
  score_breakdown: Record<string, number>;
}

export interface OrganizationParticipationDashboard {
  institution_id: string;
  participation_trend: ParticipationMomentum;
  volunteer_growth_percent: number;
  leadership_pipeline: number;
  mission_completion_rate: number;
  new_member_activation: number;
  retention_rate: number;
  active_members: number;
}

export interface CountyParticipationDashboard {
  county_id: string;
  active_organizations: number;
  volunteer_hours: number;
  civic_participation_index: number;
  community_events: number;
  leadership_development: number;
  engagement_index: number;
}

export interface FederationParticipationAnalytics {
  aggregate_participation_index: number;
  anonymous_trend: ParticipationMomentum;
  community_growth_percent: number;
  institutions_contributing: number;
  privacy_preserved: boolean;
}

export interface ParticipationInsight {
  user_id: string;
  insight_type: "opportunity" | "intervention" | "forecast" | "milestone_progress";
  title: string;
  message: string;
  advisory_only: boolean;
  generated_at: string;
}

export interface EngagementIntervention {
  user_id: string;
  institution_id: string;
  reason: string;
  suggestions: string[];
  tone: "supportive";
  generated_at: string;
}

export interface ParticipationHealthSummary {
  communities_tracked: number;
  average_participation_score: number;
  active_participants: number;
  volunteer_hours_month: number;
  membership_growth_rate: number;
  declining_communities: number;
  rising_communities: number;
  counties_tracked: number;
  updated_at: string;
}

export interface CivicAuditEvent {
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
