/**
 * CAE-11.6-W16 — Evolution & CanonForge data model
 */
import type {
  CANON_REGISTRY_OBJECTS,
  CANON_VERSION_TYPES,
  CONSTITUTION_LAYERS,
  DRIFT_TYPES,
  FUTURE_BUILD_QUEUE_CATEGORIES,
} from "./constitution";

export type ConstitutionLayer = (typeof CONSTITUTION_LAYERS)[number];
export type CanonRegistryObject = (typeof CANON_REGISTRY_OBJECTS)[number];
export type DriftType = (typeof DRIFT_TYPES)[number];
export type CanonVersionType = (typeof CANON_VERSION_TYPES)[number];
export type FutureBuildCategory = (typeof FUTURE_BUILD_QUEUE_CATEGORIES)[number];

export interface EvolutionProposalRecord {
  evolution_id: string;
  institution_id: string;
  proposal: string;
  reason: string;
  supporting_evidence: string[];
  constitutional_impact: "none" | "policy" | "constitutional";
  affected_systems: string[];
  approval_status: "draft" | "pending" | "approved" | "rejected";
  reviewers: string[];
  implementation_plan: string;
  created_at: string;
  approved_at: string | null;
}

export interface CanonRecord {
  canon_id: string;
  institution_id: string;
  version: string;
  version_type: CanonVersionType;
  layer: ConstitutionLayer;
  subject: string;
  content_ref: string;
  status: "draft" | "review" | "published" | "archived";
  traceability_refs: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArchitectureReviewRecord {
  review_id: string;
  institution_id: string;
  evolution_id: string | null;
  complexity_score: number;
  duplication_score: number;
  coupling_score: number;
  scalability_score: number;
  maintainability_score: number;
  performance_score: number;
  security_score: number;
  accessibility_score: number;
  localization_score: number;
  overall_health: number;
  findings: string[];
  reviewed_by: string;
  reviewed_at: string;
}

export interface DriftDetectionRecord {
  drift_id: string;
  institution_id: string;
  drift_type: DriftType;
  subject: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  detected_at: string;
  resolved: boolean;
}

export interface BuildGenomeRecord {
  genome_id: string;
  institution_id: string;
  architecture: string[];
  schemas: string[];
  apis: string[];
  services: string[];
  events: string[];
  validation_rules: string[];
  ui_contracts: string[];
  integration_contracts: string[];
  build_history: string[];
  platform_dna: {
    purpose: string;
    serves: string;
    principles: string[];
    philosophy: string;
    trust_model: string;
  };
  updated_at: string;
}

export interface FactoryPackageRecord {
  package_id: string;
  institution_id: string;
  package_type: "download" | "installation" | "initialization" | "launch";
  artifacts: string[];
  birth_certificate: string;
  status: "generated" | "validated" | "certified";
  generated_at: string;
}

export interface InstitutionCloneRecord {
  clone_id: string;
  source_institution_id: string;
  target_type: "campaign" | "nonprofit" | "county" | "school" | "coalition" | "government" | "business" | "institution";
  target_name: string;
  canon_version: string;
  status: "proposed" | "generated" | "certified";
  generated_at: string | null;
}

export interface DocumentationSyncRecord {
  sync_id: string;
  institution_id: string;
  synced_artifacts: string[];
  schemas_synced: boolean;
  apis_synced: boolean;
  events_synced: boolean;
  services_synced: boolean;
  permissions_synced: boolean;
  synced_at: string;
}

export interface DigitalTwinRecord {
  twin_id: string;
  institution_id: string;
  simulation_type: "full" | "mission_load" | "growth" | "election" | "budget" | "volunteer" | "migration" | "restructure";
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  status: "running" | "completed" | "failed";
  completed_at: string | null;
  created_at: string;
}

export interface ResearchRecord {
  research_id: string;
  institution_id: string;
  category: "academic" | "community" | "industry" | "technology" | "election" | "legal" | "operational";
  title: string;
  summary: string;
  feeds_canon: boolean;
  recorded_at: string;
}

export interface FutureBuildRecord {
  build_id: string;
  institution_id: string;
  category: FutureBuildCategory;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "queued" | "approved" | "in_progress" | "completed";
  queued_at: string;
}

export interface TraceabilityLinkRecord {
  link_id: string;
  institution_id: string;
  object_type: string;
  object_id: string;
  backward_why: string;
  forward_dependents: string[];
  created_at: string;
}

export interface EvolutionAnalyticsRecord {
  analytics_id: string;
  institution_id: string;
  architecture_health: number;
  technical_debt: number;
  knowledge_growth: number;
  future_opportunities: number;
  research_items: number;
  canon_changes: number;
  build_queue_size: number;
  innovation_score: number;
  computed_at: string;
}

export const EVOLUTION_STORE_KEYS = {
  proposals: "ops_evolution_proposals",
  canon: "ops_evolution_canon",
  reviews: "ops_evolution_architecture_reviews",
  drift: "ops_evolution_drift",
  genome: "ops_evolution_build_genome",
  factory: "ops_evolution_factory",
  clones: "ops_evolution_clones",
  documentation: "ops_evolution_documentation",
  twins: "ops_evolution_digital_twins",
  research: "ops_evolution_research",
  futureBuilds: "ops_evolution_future_builds",
  traceability: "ops_evolution_traceability",
  analytics: "ops_evolution_analytics",
} as const;
