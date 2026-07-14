/**
 * CAE-11.7-W14 — Digital Twin data model
 */
import type { SIMULATION_TYPES } from "./constitution";

export type SimulationType = (typeof SIMULATION_TYPES)[number];

export const TWIN_STORE_KEYS = {
  twins: "lix_twin_twins",
  models: "lix_twin_models",
  syncs: "lix_twin_syncs",
  simulations: "lix_twin_simulations",
  scenarios: "lix_twin_scenarios",
  stress_tests: "lix_twin_stress_tests",
  resources: "lix_twin_resources",
  policies: "lix_twin_policies",
  ai_sandboxes: "lix_twin_ai_sandboxes",
  training: "lix_twin_training",
  accuracy: "lix_twin_accuracy",
  experiments: "lix_twin_experiments",
  observatory: "lix_twin_observatory",
} as const;

export interface TwinRecord {
  twin_id: string;
  institution_id: string;
  owner: string;
  name: string;
  version: number;
  governance_mirrored: true;
  structure_mirrored: true;
  is_canonical: false;
  reality_authoritative: true;
  status: "active" | "syncing" | "retired";
  created_at: string;
  updated_at: string;
}

export interface InstitutionModelRecord {
  model_id: string;
  twin_id: string;
  institution_id: string;
  departments: string[];
  teams: string[];
  people_count: number;
  agents_count: number;
  projects: string[];
  workflows: string[];
  resources: string[];
  version: number;
  modeled_at: string;
}

export interface SyncRecord {
  sync_id: string;
  twin_id: string;
  institution_id: string;
  scope: string[];
  silent_production_mutation: false;
  configurable: true;
  status: "completed" | "failed";
  synced_at: string;
}

export interface SimulationRecord {
  simulation_id: string;
  twin_id: string;
  institution_id: string;
  human_id: string;
  simulation_type: SimulationType;
  hypothesis: string;
  status: "running" | "completed" | "failed";
  reproducible: true;
  isolated: true;
  affects_production: false;
  outcome_summary: string;
  started_at: string;
  completed_at: string | null;
}

export interface ScenarioRecord {
  scenario_id: string;
  twin_id: string;
  institution_id: string;
  human_id: string;
  title: string;
  category: "what_if" | "policy" | "budget" | "growth" | "emergency" | "strategic" | "redesign";
  isolated: true;
  inputs: string[];
  created_at: string;
}

export interface StressTestRecord {
  stress_id: string;
  twin_id: string;
  institution_id: string;
  stress_type: "staff_shortage" | "budget_reduction" | "volunteer_surge" | "infrastructure_failure" | "technology_outage" | "communication_failure" | "leadership_transition" | "legislation" | "high_demand";
  breaking_points: string[];
  resilience_score: number;
  completed_at: string;
}

export interface ResourceSimulationRecord {
  resource_id: string;
  twin_id: string;
  institution_id: string;
  resource_type: "personnel" | "meeting_rooms" | "equipment" | "vehicles" | "servers" | "ai_compute" | "funding" | "training" | "facilities" | "travel";
  projected_demand: number;
  available_capacity: number;
  shortage_risk: boolean;
  simulated_at: string;
}

export interface PolicySandboxRecord {
  policy_id: string;
  twin_id: string;
  institution_id: string;
  policy_name: string;
  impacts_measurable: true;
  production_adopted: false;
  impact_summary: string;
  evaluated_at: string;
}

export interface AISandboxRecord {
  sandbox_id: string;
  twin_id: string;
  institution_id: string;
  agent_name: string;
  experiment_type: "prompt" | "automation" | "decision_support" | "recommendation" | "safety" | "collaboration";
  reaches_production: false;
  certified: boolean;
  created_at: string;
}

export interface TrainingSimulationRecord {
  training_id: string;
  twin_id: string;
  institution_id: string;
  human_id: string;
  training_type: "leadership" | "volunteer_onboarding" | "emergency" | "campaign" | "board" | "media" | "operational" | "orientation";
  operational_risk: false;
  completed: boolean;
  trained_at: string;
}

export interface TwinAccuracyRecord {
  accuracy_id: string;
  twin_id: string;
  institution_id: string;
  predicted_outcome: string;
  actual_outcome: string;
  accuracy_score: number;
  assumes_guaranteed: false;
  measured_at: string;
}

export interface ExperimentRecord {
  experiment_id: string;
  twin_id: string;
  institution_id: string;
  owner: string;
  purpose: string;
  hypothesis: string;
  configuration: string[];
  results: string;
  lessons_learned: string[];
  versioned: true;
  reproducible: true;
  status: "created" | "running" | "completed";
  created_at: string;
  completed_at: string | null;
}

export interface TwinObservatoryRecord {
  observatory_id: string;
  institution_id: string;
  twin_id: string;
  simulation_health: number;
  twin_accuracy: number;
  forecast_quality: number;
  operational_resilience: number;
  institutional_maturity: number;
  measured_at: string;
}
