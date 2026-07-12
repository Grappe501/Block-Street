export type RelationshipNodeType =
  | "person"
  | "team"
  | "organization"
  | "institution"
  | "community"
  | "event"
  | "mission"
  | "committee"
  | "coalition"
  | "county"
  | "region";

export type RelationshipType =
  | "volunteer_together"
  | "mentor"
  | "mentee"
  | "supervisor"
  | "team_member"
  | "committee_member"
  | "partner_organization"
  | "project_collaborator"
  | "trainer"
  | "student"
  | "advisor"
  | "coalition_partner"
  | "community_contact"
  | "neighbor_organization";

export type RelationshipStatus =
  | "new"
  | "growing"
  | "active"
  | "strong"
  | "dormant"
  | "inactive"
  | "historical";

export type VerificationLevel =
  | "self_declared"
  | "mutually_confirmed"
  | "institution_verified"
  | "automatically_derived"
  | "administrator_verified";

export type PrivacyLevel = "public" | "institution" | "private" | "federation_aggregate_only";

export type RelationshipLifecycleStage =
  | "introduced"
  | "first_collaboration"
  | "regular_interaction"
  | "trusted_working_relationship"
  | "leadership_partnership"
  | "mentorship"
  | "legacy_relationship";

export type EventCategory =
  | "volunteer"
  | "training"
  | "meeting"
  | "project"
  | "mission"
  | "mentorship"
  | "leadership"
  | "committee"
  | "research"
  | "planning"
  | "community_event"
  | "coalition"
  | "communication";

export interface RelationshipNode {
  id: string;
  node_type: RelationshipNodeType;
  reference_id: string;
  label: string;
  institution_id: string;
  county?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface StrengthFactors {
  frequency: number;
  duration_months: number;
  collaboration_count: number;
  shared_projects: number;
  mentoring_sessions: number;
  participation_score: number;
}

export interface RelationshipEdge {
  id: string;
  from_node: string;
  to_node: string;
  relationship_type: RelationshipType;
  strength: number;
  strength_factors: StrengthFactors;
  status: RelationshipStatus;
  lifecycle_stage: RelationshipLifecycleStage;
  first_interaction: string;
  last_interaction: string;
  verification_level: VerificationLevel;
  privacy_level: PrivacyLevel;
  institution_id: string;
  created_at: string;
}

export interface RelationshipEvent {
  id: string;
  relationship_edge_id: string;
  event_type: string;
  category: EventCategory;
  date: string;
  source: string;
  verification: VerificationLevel;
  duration_minutes?: number;
  notes?: string;
  institution_id: string;
  created_at: string;
}

export interface RelationshipPrivacySettings {
  user_id: string;
  institution_id: string;
  public_connections: boolean;
  mentorship_visibility: boolean;
  collaboration_history_visible: boolean;
  partnership_visibility: boolean;
  updated_at: string;
}

export interface CommunityConnector {
  node_id: string;
  label: string;
  connector_type: "mentor" | "organizer" | "coalition_builder" | "trainer" | "multi_org_volunteer";
  organizations_connected: number;
  communities_bridged: string[];
  collaboration_score: number;
}

export interface IsolationAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  target_type: RelationshipNodeType;
  target_id: string;
  label: string;
  reason: string;
  suggested_action: string;
}

export interface NetworkResilienceMetrics {
  redundancy_score: number;
  connector_concentration_percent: number;
  single_point_dependencies: string[];
  leadership_overlap_count: number;
  collaboration_continuity_percent: number;
  trend: "improving" | "stable" | "declining";
}

export interface RelationshipRecommendation {
  id: string;
  recommendation_type: "mentorship" | "partnership" | "collaboration" | "introduction" | "community_bridge";
  title: string;
  reason: string;
  evidence: string[];
  confidence_percent: number;
  advisory_only: true;
  target_node_ids: string[];
  generated_at: string;
}

export interface UserRelationshipDashboard {
  user_id: string;
  active_collaborators: number;
  mentors: number;
  mentees: number;
  organizations_connected: number;
  community_projects: number;
  relationship_trend: "growing" | "stable" | "declining";
}

export interface ExecutiveRelationshipDashboard {
  institution_id: string;
  collaboration_health: "healthy" | "monitor" | "at_risk";
  partnership_growth_percent: number;
  relationship_density: number;
  community_bridges: number;
  isolated_groups: number;
  mentorship_health: "healthy" | "monitor" | "at_risk";
  network_resilience: NetworkResilienceMetrics;
}

export interface FederationRelationshipAnalytics {
  cross_institution_collaboration_trend: "rising" | "stable" | "declining";
  shared_playbook_adoptions: number;
  leadership_exchange_events: number;
  curriculum_sharing_count: number;
  aggregated_collaboration_index: number;
  privacy_note: string;
}

export interface RelationshipHealthSummary {
  total_nodes: number;
  total_edges: number;
  active_relationships: number;
  mentorship_pairs: number;
  community_connectors: number;
  isolated_nodes: number;
  average_strength: number;
  updated_at: string;
}

export interface RelationshipInsight {
  insight_type: "mentorship" | "partnership" | "isolation" | "bridge" | "resilience";
  title: string;
  message: string;
  advisory_only: true;
  generated_at: string;
}

export interface RelationshipAuditEvent {
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
