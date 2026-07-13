/**
 * CAE-11.7-W11 — Federation data model
 */
import type { ORGANIZATION_TYPES } from "./constitution";

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const FEDERATION_STORE_KEYS = {
  institutions: "lix_federation_institutions",
  sovereignty: "lix_federation_sovereignty",
  trust: "lix_federation_trust",
  coalitions: "lix_federation_coalitions",
  missions: "lix_federation_missions",
  knowledge: "lix_federation_knowledge",
  resources: "lix_federation_resources",
  search: "lix_federation_search",
  identity: "lix_federation_identity",
  governance: "lix_federation_governance",
  audit: "lix_federation_audit",
} as const;

export interface FederationInstitutionRecord {
  institution_id: string;
  name: string;
  jurisdiction: string;
  organization_type: OrganizationType;
  governance_model: string;
  capabilities: string[];
  public_profile: string;
  federation_membership: string;
  trust_relationships: string[];
  status: "active" | "pending" | "suspended" | "left";
  sovereign: true;
  voluntary_participation: true;
}

export interface SovereigntyRecord {
  sovereignty_id: string;
  institution_id: string;
  owns_localbrain: true;
  owns_agents: true;
  owns_memory: true;
  owns_governance: true;
  owns_permissions: true;
  owns_calendars: true;
  owns_users: true;
  owns_missions: true;
  federation_override: false;
  asserted_at: string;
}

export interface TrustRelationshipRecord {
  trust_id: string;
  institution_id: string;
  partner_institution_id: string;
  knowledge_sharing: boolean;
  mission_sharing: boolean;
  volunteer_sharing: boolean;
  resource_sharing: boolean;
  research_sharing: boolean;
  calendar_sharing: boolean;
  emergency_cooperation: boolean;
  contractual: true;
  assumed: false;
  updated_at: string;
}

export interface CoalitionRecord {
  coalition_id: string;
  name: string;
  lead_institution_id: string;
  member_institution_ids: string[];
  charter_summary: string;
  status: "active" | "forming" | "dissolved";
  sovereign_members: true;
  created_at: string;
}

export interface SharedMissionRecord {
  mission_id: string;
  title: string;
  mission_type: "joint_campaign" | "coalition_initiative" | "ballot_initiative" | "emergency_response" | "community_event" | "legislative" | "education" | "grant";
  lead_institution_id: string;
  participating_institution_ids: string[];
  shared_authority: string[];
  separate_authority: string[];
  shared_resources: string[];
  ownership_retained: true;
  auto_shared: false;
  created_at: string;
}

export interface SharedKnowledgeRecord {
  knowledge_id: string;
  owner_institution_id: string;
  publisher_institution_id: string;
  title: string;
  content_type: "research" | "training" | "policy" | "playbook" | "lesson" | "template" | "best_practice" | "course";
  summary: string;
  visibility: "institution" | "partners" | "coalition" | "public_federation";
  permissions: string[];
  version: number;
  revocable: true;
  auto_shared: false;
  published_at: string;
  revoked: boolean;
}

export interface SharedResourceRecord {
  resource_id: string;
  owner_institution_id: string;
  resource_type: "volunteers" | "meeting_space" | "equipment" | "transportation" | "training" | "funding" | "events" | "specialists";
  description: string;
  shared_with: string[];
  ownership_transferred: false;
  authorized_by: string;
  shared_at: string;
}

export interface FederatedSearchRecord {
  search_id: string;
  human_id: string;
  institution_id: string;
  query: string;
  scope: "institution" | "partners" | "coalition" | "public_federation";
  results: {
    result_id: string;
    title: string;
    owner_institution_id: string;
    permission: string;
    confidence: number;
    visibility: string;
    origin: string;
  }[];
  searched_at: string;
}

export interface CrossInstitutionIdentityRecord {
  identity_id: string;
  human_id: string;
  institution_id: string;
  role_id: string;
  permissions: string[];
  memory_view: "institution_scoped";
  authority_carried: false;
  active: boolean;
}

export interface FederationGovernanceRecord {
  governance_id: string;
  coalition_id: string;
  document_type: "charter" | "mou" | "coalition_agreement" | "voting_procedure" | "approval_workflow" | "committee";
  title: string;
  summary: string;
  version: number;
  approved_by: string[];
  historically_traceable: true;
  created_at: string;
}

export interface FederationAuditRecord {
  audit_id: string;
  object_type: "knowledge" | "mission" | "resource" | "trust" | "coalition";
  object_id: string;
  owner_institution_id: string;
  publisher: string;
  consumers: string[];
  permissions: string[];
  history: string[];
  revocation_available: true;
  recorded_at: string;
}
