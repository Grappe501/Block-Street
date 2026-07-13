/**
 * CAE-11.7-W11 — Federation Constitution (LIX-011)
 */
export const LIX_FEDERATION_PRINCIPLE =
  "Federation without centralization. Collaboration without loss of sovereignty.";

export const FEDERATION_ARCHITECTURE = [
  "sovereign_institution",
  "localbrain",
  "federation_registry",
  "trust_framework",
  "shared_missions",
  "knowledge_exchange",
  "coalition_intelligence",
  "federated_search",
] as const;

export const ORGANIZATION_TYPES = [
  "campaign",
  "nonprofit",
  "coalition",
  "political_party",
  "school",
  "church",
  "labor",
  "advocacy",
  "municipal_government",
  "county",
  "state",
  "university",
  "business",
] as const;

export const FEDERATION_MAY = [
  "voluntary_participation",
  "explicit_sharing",
  "contractual_trust",
  "shared_missions",
  "knowledge_publish",
  "resource_coordination",
  "coalition_intelligence",
  "cross_institution_ai",
  "federated_search",
] as const;

export const FEDERATION_MAY_NOT = [
  "merge_institutional_memories",
  "silent_ownership_transfer",
  "auto_share_private",
  "permission_inheritance",
  "administrative_takeover",
  "unauthorized_sync",
  "remove_provenance",
  "centralized_ownership",
  "cross_institution_canonical_mutation",
  "shadow_organizations",
] as const;

export const REQUIRED_FEDERATION_SERVICES = [
  "FederationService",
  "InstitutionRegistryService",
  "SovereigntyService",
  "TrustFrameworkService",
  "CoalitionService",
  "SharedMissionService",
  "KnowledgeExchangeService",
  "SharedResourceService",
  "FederatedSearchService",
  "CrossInstitutionIdentityService",
  "FederationGovernanceService",
  "FederationAuditService",
] as const;

export function getFederationConstitution() {
  return {
    protocol_id: "CAE-11.7-W11",
    governing_principle: LIX_FEDERATION_PRINCIPLE,
    architecture: FEDERATION_ARCHITECTURE,
    organization_types: ORGANIZATION_TYPES,
    may: FEDERATION_MAY,
    may_not: FEDERATION_MAY_NOT,
    required_services: REQUIRED_FEDERATION_SERVICES,
  };
}
