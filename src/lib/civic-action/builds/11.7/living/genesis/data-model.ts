/**
 * CAE-11.7-W16 — Genesis data model
 */
export const GENESIS_STORE_KEYS = {
  packages: "lix_genesis_packages",
  dna: "lix_genesis_dna",
  archives: "lix_genesis_archives",
  continuity: "lix_genesis_continuity",
  recoveries: "lix_genesis_recoveries",
  bootstraps: "lix_genesis_bootstraps",
  portability: "lix_genesis_portability",
  provenance: "lix_genesis_provenance",
  timeline: "lix_genesis_timeline",
  legacy: "lix_genesis_legacy",
  vault: "lix_genesis_vault",
  observatory: "lix_genesis_observatory",
  stewardship: "lix_genesis_stewardship",
} as const;

export interface GenesisPackageRecord {
  package_id: string;
  institution_id: string;
  owner: string;
  version: number;
  contents: string[];
  birth_certificate: true;
  governance_included: true;
  provenance_included: true;
  omit_governance: false;
  created_at: string;
}

export interface InstitutionDNARecord {
  dna_id: string;
  institution_id: string;
  identity: string;
  governance: string[];
  knowledge_domains: string[];
  capabilities: string[];
  policies: string[];
  culture: string[];
  decision_philosophy: string;
  platform_independent: true;
  updated_at: string;
}

export interface CanonicalArchiveRecord {
  archive_id: string;
  institution_id: string;
  category: "policy" | "research" | "conversation" | "engineering" | "learning" | "simulation" | "deployment" | "governance" | "mission" | "historical_state";
  title: string;
  version: number;
  immutable_provenance: true;
  silently_erasable: false;
  archived_at: string;
}

export interface ContinuityPlanRecord {
  continuity_id: string;
  institution_id: string;
  scenario: "leadership_transition" | "infrastructure_replacement" | "cloud_migration" | "vendor_migration" | "ai_model_replacement" | "modernization" | "merger" | "separation";
  readiness_score: number;
  tested: boolean;
  governance_preserved: true;
  tested_at: string | null;
  created_at: string;
}

export interface RecoveryRecord {
  recovery_id: string;
  institution_id: string;
  disaster_type: "cyber_attack" | "infrastructure_loss" | "data_corruption" | "cloud_failure" | "natural_disaster" | "leadership_loss" | "repository_loss" | "vendor_shutdown";
  source_package_id: string;
  authenticity_preserved: true;
  governance_bypassed: false;
  completed: boolean;
  recovered_at: string;
}

export interface BootstrapRecord {
  bootstrap_id: string;
  institution_id: string;
  package_id: string;
  recreated: string[];
  birth_certificate_valid: true;
  completed: boolean;
  bootstrapped_at: string;
}

export interface PortabilityRecord {
  portability_id: string;
  institution_id: string;
  target: "cloud" | "local" | "air_gapped" | "hybrid" | "country_migration" | "infrastructure" | "vendor_independent";
  vendor_captive: false;
  identity_preserved: true;
  validated_at: string;
}

export interface ProvenanceRecord {
  provenance_id: string;
  institution_id: string;
  artifact_id: string;
  origin: string;
  author: string;
  version: number;
  evidence: string[];
  digitally_signed: true;
  forgeable: false;
  verified: boolean;
  recorded_at: string;
}

export interface TimelineEventRecord {
  timeline_id: string;
  institution_id: string;
  event_type: "founding" | "leadership" | "policy" | "capability" | "mission" | "research" | "engineering" | "community";
  title: string;
  never_disappears: true;
  occurred_at: string;
  recorded_at: string;
}

export interface LegacyRecord {
  legacy_id: string;
  institution_id: string;
  succession_type: "leadership_onboarding" | "inheritance" | "mentorship" | "knowledge_transfer" | "retirement" | "succession_planning" | "stewardship";
  successor_id: string | null;
  teachable: true;
  recorded_at: string;
}

export interface VaultEntryRecord {
  vault_id: string;
  institution_id: string;
  category: "constitution" | "engineering" | "research" | "culture" | "learning" | "case_study" | "playbook" | "historical" | "operational_wisdom";
  title: string;
  provenance_retained: true;
  permissions_retained: true;
  stored_at: string;
}

export interface PreservationObservatoryRecord {
  observatory_id: string;
  institution_id: string;
  archive_integrity: number;
  continuity_readiness: number;
  recovery_readiness: number;
  knowledge_completeness: number;
  historical_coverage: number;
  institutional_resilience: number;
  measured_at: string;
}

export interface StewardshipRecord {
  stewardship_id: string;
  institution_id: string;
  change_type: "proposal" | "simulation" | "debate" | "approval" | "version" | "reason" | "rollback";
  description: string;
  human_steward: string;
  automated_authority: false;
  version: number;
  recorded_at: string;
}
