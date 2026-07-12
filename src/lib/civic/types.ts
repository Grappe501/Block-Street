export type ParticipationEventType =
  | "volunteer_shift"
  | "event_attendance"
  | "mission_completed"
  | "membership_joined"
  | "meeting_attended"
  | "training_completed"
  | "outreach_action"
  | "community_action";

export type EngagementStage = "dormant" | "emerging" | "active" | "committed" | "champion";

export interface ParticipationEvent {
  id: string;
  institution_id: string;
  community_id: string;
  user_id: string;
  event_type: ParticipationEventType;
  title: string;
  duration_minutes: number;
  participants_count: number;
  recorded_at: string;
}

export interface CivicParticipationScore {
  institution_id: string;
  community_id: string;
  score: number;
  volunteer_activity: number;
  attendance_rate: number;
  membership_growth: number;
  mission_completion: number;
  community_involvement: number;
  civic_habits: number;
  stage: EngagementStage;
  explainable_factors: string[];
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
}

export interface ParticipationHealthSummary {
  communities_tracked: number;
  average_participation_score: number;
  active_participants: number;
  volunteer_hours_month: number;
  membership_growth_rate: number;
  declining_communities: number;
  rising_communities: number;
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
