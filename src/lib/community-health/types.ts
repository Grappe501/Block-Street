export type ResilienceState =
  | "fragile"
  | "developing"
  | "stable"
  | "resilient"
  | "highly_resilient"
  | "model_community";

export type HealthTrend = "growing" | "stable" | "declining";

export type RiskSeverity = "info" | "warning" | "critical";

export type InfrastructureType =
  | "nonprofit"
  | "school"
  | "university"
  | "community_center"
  | "library"
  | "faith_community"
  | "volunteer_organization"
  | "neighborhood_association"
  | "coalition";

export type ProjectCategory =
  | "beautification"
  | "food_security"
  | "education"
  | "public_event"
  | "civic_education"
  | "disaster_response"
  | "service_project"
  | "community_initiative";

export interface HealthDomainScores {
  participation: number;
  leadership: number;
  volunteer_capacity: number;
  relationship_density: number;
  organizational_health: number;
  community_collaboration: number;
  education: number;
  mentorship: number;
  community_projects: number;
  institutional_stability: number;
  resilience: number;
}

export interface CommunityHealthProfile {
  id: string;
  community_id: string;
  county_id: string;
  region_id: string | null;
  institution_count: number;
  active_population: number;
  health_score: number;
  resilience_score: number;
  health_breakdown: HealthDomainScores;
  resilience_state: ResilienceState;
  trend: HealthTrend;
  last_updated: string;
}

export interface CommunityCapacityMetrics {
  community_id: string;
  active_volunteers: number;
  available_leaders: number;
  mentor_availability_percent: number;
  organizational_readiness: number;
  collaboration_index: number;
  training_completion_percent: number;
  capacity_score: number;
  updated_at: string;
}

export interface CivicInfrastructureAsset {
  id: string;
  community_id: string;
  county_id: string;
  asset_type: InfrastructureType;
  name: string;
  status: "active" | "inactive";
  institution_id: string | null;
}

export interface CommunityProject {
  id: string;
  community_id: string;
  county_id: string;
  title: string;
  category: ProjectCategory;
  organizations_involved: string[];
  status: "planned" | "active" | "completed";
  started_at: string;
  completed_at: string | null;
}

export interface CommunityRisk {
  id: string;
  community_id: string;
  severity: RiskSeverity;
  risk_type:
    | "leadership_shortage"
    | "volunteer_burnout"
    | "organizational_isolation"
    | "weak_collaboration"
    | "declining_participation"
    | "mentor_shortage"
    | "aging_leadership"
    | "succession_gap";
  title: string;
  message: string;
  suggested_action: string;
  detected_at: string;
}

export interface CommunityOpportunity {
  id: string;
  community_id: string;
  opportunity_type:
    | "expansion"
    | "partnership"
    | "emerging_leader"
    | "volunteer_growth"
    | "civic_education"
    | "organizational_support";
  title: string;
  reason: string;
  confidence_percent: number;
  advisory_only: true;
  generated_at: string;
}

export interface GeographicHealthPoint {
  geo_id: string;
  geo_type: "neighborhood" | "city" | "county" | "region";
  label: string;
  health_score: number;
  resilience_score: number;
  participation_score: number;
  leadership_score: number;
  capacity_score: number;
  trend: HealthTrend;
}

export interface HealthTrendPoint {
  period: string;
  health_score: number;
  resilience_score: number;
  participation_score: number;
  leadership_score: number;
}

export interface CommunityBenchmark {
  community_id: string;
  peer_group: string;
  community_health_score: number;
  peer_average_score: number;
  percentile: number;
  anonymous: true;
  compared_at: string;
}

export interface CommunityHealthDashboard {
  community_id: string;
  community_health_percent: number;
  leadership_capacity_percent: number;
  volunteer_capacity_percent: number;
  organizations: number;
  mentorship_status: "healthy" | "monitor" | "at_risk";
  community_trend: HealthTrend;
  resilience_label: string;
}

export interface ExecutiveCommunityDashboard {
  county_id: string;
  county_health_percent: number;
  communities_tracked: number;
  leadership_shortages: number;
  volunteer_trend: HealthTrend;
  opportunities_count: number;
  resilience_map_summary: string;
  at_risk_communities: number;
}

export interface CommunityHealthReport {
  id: string;
  report_type: "annual" | "county" | "regional" | "leadership_capacity" | "volunteer_capacity";
  community_id: string | null;
  county_id: string | null;
  title: string;
  period_start: string;
  period_end: string;
  summary: string;
  aggregated_only: true;
  generated_at: string;
  sections: { heading: string; content: string }[];
}

export interface FederationHealthAnalytics {
  aggregate_health_index: number;
  growth_trend: HealthTrend;
  organizational_diversity_index: number;
  leadership_development_index: number;
  civic_resilience_index: number;
  privacy_note: string;
}

export interface CommunityHealthInsight {
  insight_type: "capacity" | "resilience" | "mentorship" | "partnership" | "education";
  title: string;
  message: string;
  advisory_only: true;
  generated_at: string;
}

export interface CommunityHealthAuditEvent {
  id: string;
  community_id: string | null;
  county_id: string | null;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: "success" | "failure";
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface OrganizationalEcosystemHealth {
  community_id: string;
  organization_count: number;
  healthy_organizations: number;
  shared_volunteer_overlap: number;
  shared_leader_overlap: number;
  collaboration_density: number;
  partnership_strength: number;
}
