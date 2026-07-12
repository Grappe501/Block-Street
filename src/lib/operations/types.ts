export type LaunchStatus =
  | "planned"
  | "approved"
  | "ready"
  | "launching"
  | "monitoring"
  | "stabilizing"
  | "operational"
  | "paused"
  | "rolled_back"
  | "completed";

export type LaunchStrategy =
  | "single_campus"
  | "single_county"
  | "department"
  | "regional"
  | "institution_wide"
  | "feature_by_feature"
  | "role_by_role";

export type MaturityLevel =
  | "foundation"
  | "operational"
  | "growing"
  | "integrated"
  | "optimized"
  | "institutional_excellence";

export type SupportTier = "tier_0" | "tier_1" | "tier_2" | "tier_3" | "tier_4";

export interface OperationalLaunchPlan {
  id: string;
  institution_id: string;
  name: string;
  strategy: LaunchStrategy;
  target_scope: string;
  success_metrics: string[];
  rollback_strategy: string;
  support_model: string;
  approval_status: string;
  launch_window: string | null;
  status: LaunchStatus;
  rollout_percent: number;
  created_at: string;
  approved_at: string | null;
  launched_at: string | null;
}

export interface HealthDomainScore {
  domain: string;
  score: number;
  explainable_factors: string[];
}

export interface OperationalHealth {
  institution_id: string;
  domains: HealthDomainScore[];
  overall_score: number;
  updated_at: string;
}

export interface AdoptionMetrics {
  institution_id: string;
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  first_week_retention: number;
  thirty_day_retention: number;
  mission_participation_rate: number;
  training_participation_rate: number;
  adoption_stage: string;
  updated_at: string;
}

export interface SupportRequest {
  id: string;
  institution_id: string;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  tier: SupportTier;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

export interface FeedbackItem {
  id: string;
  institution_id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  backlog_mapping: string;
  status: string;
  created_at: string;
}

export interface OperationalRelease {
  id: string;
  institution_id: string;
  version: string;
  release_type: string;
  features: string[];
  risks: string[];
  status: string;
  deployed_at: string | null;
  rolled_back_at: string | null;
}

export interface MaturityScore {
  institution_id: string;
  level: MaturityLevel;
  score: number;
  dimensions: Record<string, number>;
  updated_at: string;
}

export interface ExecutiveDashboard {
  health: OperationalHealth;
  adoption: AdoptionMetrics;
  maturity: MaturityScore;
  open_support_requests: number;
  active_launches: number;
  pending_feedback: number;
  latest_release: OperationalRelease | null;
}

export interface OperationsHealthSummary {
  active_launch_plans: number;
  operational_institutions: number;
  average_health_score: number;
  open_support_tickets: number;
  pending_feedback: number;
  releases_this_month: number;
  institutions_at_operational_maturity: number;
}

export interface OperationsAuditEvent {
  id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  previous_state: string;
  new_state: string;
  reason: string | null;
  timestamp: string;
  correlation_id: string;
  result: string;
}
