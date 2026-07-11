export type InvitationStatus =
  | "draft"
  | "sent"
  | "delivered"
  | "viewed"
  | "accepted"
  | "expired"
  | "revoked"
  | "completed";

export type ReadinessState =
  | "invited"
  | "joining"
  | "learning"
  | "practicing"
  | "operational"
  | "advanced"
  | "leader"
  | "mentor";

export type JourneyStatus = "not_started" | "in_progress" | "paused" | "completed" | "abandoned";

export type ChecklistItemStatus = "pending" | "in_progress" | "completed" | "skipped" | "blocked";

export type MentorType = "human" | "organizational" | "ai_guide" | "documentation";

export interface OnboardingInvitation {
  id: string;
  institution_id: string;
  unit_id: string | null;
  email: string;
  role_key: string;
  invited_by: string;
  onboarding_package_id: string;
  invitation_token_hash: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
  user_id: string | null;
  message: string | null;
}

export interface OnboardingJourney {
  id: string;
  user_id: string;
  institution_id: string;
  unit_id: string | null;
  unit_name: string;
  institution_name: string;
  role_key: string;
  journey_template_id: string;
  status: JourneyStatus;
  readiness_state: ReadinessState;
  readiness_score: number;
  current_step_index: number;
  tour_completed: boolean;
  first_mission_id: string | null;
  first_mission_completed: boolean;
  mentor_assignment_id: string | null;
  unlocked_features: string[];
  started_at: string;
  completed_at: string | null;
  last_active_at: string;
}

export interface ChecklistItem {
  id: string;
  journey_id: string;
  key: string;
  label: string;
  description: string;
  order: number;
  required: boolean;
  status: ChecklistItemStatus;
  completed_at: string | null;
  unlocks_feature: string | null;
}

export interface TrainingRequirement {
  id: string;
  journey_id: string;
  training_key: string;
  title: string;
  required: boolean;
  status: "pending" | "in_progress" | "completed";
  certification_gate: string | null;
}

export interface MentorAssignment {
  id: string;
  journey_id: string;
  mentor_type: MentorType;
  mentor_user_id: string | null;
  mentor_label: string;
  assigned_at: string;
  status: "active" | "completed";
}

export interface ReadinessAssessment {
  id: string;
  journey_id: string;
  knowledge: number;
  confidence: number;
  navigation: number;
  mission_participation: number;
  training: number;
  certification: number;
  community_connection: number;
  operational_competence: number;
  overall: number;
  state: ReadinessState;
  assessed_at: string;
}

export interface OnboardingAuditEvent {
  id: string;
  institution_id: string;
  journey_id: string | null;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  previous_state: string;
  new_state: string;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure";
}

export interface OnboardingHealth {
  invited: number;
  in_progress: number;
  completed: number;
  blocked: number;
  average_completion: number;
  operational_ready: number;
  average_time_to_first_mission_hours: number;
}

export interface CreateInvitationInput {
  institution_id: string;
  unit_id?: string | null;
  email: string;
  role_key: string;
  invited_by: string;
  onboarding_package_id?: string;
  message?: string;
  expires_hours?: number;
}

export interface GenerateJourneyInput {
  user_id: string;
  institution_id: string;
  unit_id?: string | null;
  unit_name?: string;
  institution_name?: string;
  role_key: string;
  invitation_id?: string;
}
