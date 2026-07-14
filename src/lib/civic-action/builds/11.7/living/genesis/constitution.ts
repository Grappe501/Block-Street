/**
 * CAE-11.7-W16 — Genesis Constitution (LIX-016)
 */
export const LIX_GENESIS_PRINCIPLE =
  "Institutions should outlive the individuals who build them.";

export const GENESIS_PACKAGE_CONTENTS = [
  "purpose",
  "mission",
  "vision",
  "values",
  "constitution",
  "governance",
  "identity",
  "founding_principles",
  "historical_amendments",
  "institutional_dna",
  "capabilities",
  "knowledge",
  "provenance",
] as const;

export const GENESIS_MAY = [
  "export_genesis_packages",
  "preserve_institutional_dna",
  "archive_with_provenance",
  "plan_continuity",
  "recover_from_disaster",
  "bootstrap_from_genesis",
  "migrate_across_platforms",
  "verify_authenticity",
  "maintain_historical_timeline",
  "support_succession",
  "steward_constitution_history",
] as const;

export const GENESIS_MAY_NOT = [
  "rewrite_institutional_history",
  "delete_constitutional_records",
  "allow_unverifiable_provenance",
  "bind_permanently_to_one_vendor",
  "bypass_governance_in_recovery",
  "modify_archives_without_version_history",
  "replace_human_stewardship",
  "omit_governance_from_genesis",
  "destroy_rollback_capability",
  "permit_silent_memory_loss",
] as const;

export const REQUIRED_GENESIS_SERVICES = [
  "GenesisService",
  "InstitutionDNAService",
  "CanonicalArchiveService",
  "ContinuityService",
  "RecoveryService",
  "BootstrapService",
  "PortabilityService",
  "ProvenanceService",
  "HistoricalTimelineService",
  "LegacyService",
  "KnowledgeVaultService",
  "PreservationObservatoryService",
  "ConstitutionalStewardshipService",
] as const;

export function getGenesisConstitution() {
  return {
    protocol_id: "CAE-11.7-W16",
    governing_principle: LIX_GENESIS_PRINCIPLE,
    package_contents: GENESIS_PACKAGE_CONTENTS,
    may: GENESIS_MAY,
    may_not: GENESIS_MAY_NOT,
    required_services: REQUIRED_GENESIS_SERVICES,
    final_wave: true,
    human_stewardship: true,
  };
}
