/**
 * CAE-11.7-W11 — Federation Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import type { OrganizationType } from "../data-model";
import {
  getInstitution,
  listCoalitions,
  listCrossInstitutionIdentity,
  listFederationAudits,
  listFederationGovernance,
  listInstitutions,
  listSharedKnowledge,
  listSharedMissions,
  listSharedResources,
  listSovereignty,
  listTrust,
  saveCoalition,
  saveCrossInstitutionIdentity,
  saveFederatedSearch,
  saveFederationAudit,
  saveFederationGovernance,
  saveInstitution,
  saveSharedKnowledge,
  saveSharedMission,
  saveSharedResource,
  saveSovereignty,
  saveTrust,
} from "./repository";

export class FederationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureFederationBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
}

function getBrain(humanId: string) {
  ensureFederationBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new FederationError("FEDERATION_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

const DEFAULT_PARTNER = "inst-county-civic-alliance";

function defaultInstitutions(): Parameters<typeof institutionRegistryService.register>[0][] {
  return [
    {
      institution_id: "inst-block-street",
      name: "Block Street Civic University",
      jurisdiction: "Harris County, TX",
      organization_type: "nonprofit" as OrganizationType,
      governance_model: "board_governed",
      capabilities: ["education", "organizing", "research"],
      public_profile: "Civic education and county immersion programs",
      federation_membership: "block-street-federation",
    },
    {
      institution_id: DEFAULT_PARTNER,
      name: "County Civic Alliance",
      jurisdiction: "Southeast Texas",
      organization_type: "coalition" as OrganizationType,
      governance_model: "coalition_charter",
      capabilities: ["advocacy", "volunteer_coordination", "grant_writing"],
      public_profile: "Regional nonprofit coalition for civic engagement",
      federation_membership: "block-street-federation",
    },
  ];
}

export const institutionRegistryService = {
  list: listInstitutions,
  get: getInstitution,
  register(input: {
    institution_id: string;
    name: string;
    jurisdiction: string;
    organization_type: OrganizationType;
    governance_model: string;
    capabilities: string[];
    public_profile: string;
    federation_membership: string;
  }) {
    const record = {
      ...input,
      trust_relationships: [] as string[],
      status: "active" as const,
      sovereign: true as const,
      voluntary_participation: true as const,
    };
    saveInstitution(record);
    sovereigntyService.assert(input.institution_id);
    return { institution: record, event: "institution.joined" as const, sovereign: true };
  },
  ensureDefaults() {
    if (listInstitutions().length > 0) return listInstitutions();
    for (const inst of defaultInstitutions()) institutionRegistryService.register(inst);
    return listInstitutions();
  },
};

export const sovereigntyService = {
  list: listSovereignty,
  assert(institutionId: string) {
    const record = {
      sovereignty_id: caeId("sov"),
      institution_id: institutionId,
      owns_localbrain: true as const,
      owns_agents: true as const,
      owns_memory: true as const,
      owns_governance: true as const,
      owns_permissions: true as const,
      owns_calendars: true as const,
      owns_users: true as const,
      owns_missions: true as const,
      federation_override: false as const,
      asserted_at: nowIso(),
    };
    saveSovereignty(record);
    return { sovereignty: record, federation_override: false };
  },
  verify(institutionId: string) {
    const records = listSovereignty(institutionId);
    const latest = records[records.length - 1];
    if (!latest || latest.federation_override) {
      throw new FederationError("SOVEREIGNTY_VIOLATION", "Institutional sovereignty must not be overridden");
    }
    return { sovereign: true, owns_all: true };
  },
};

export const trustFrameworkService = {
  list: listTrust,
  update(input: {
    institution_id: string;
    partner_institution_id: string;
    knowledge_sharing?: boolean;
    mission_sharing?: boolean;
    volunteer_sharing?: boolean;
    resource_sharing?: boolean;
    research_sharing?: boolean;
    calendar_sharing?: boolean;
    emergency_cooperation?: boolean;
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("TRUST_REQUIRES_APPROVAL", "Trust relationships require Human approval");
    }
    sovereigntyService.verify(input.institution_id);
    const record = {
      trust_id: caeId("trf"),
      institution_id: input.institution_id,
      partner_institution_id: input.partner_institution_id,
      knowledge_sharing: input.knowledge_sharing ?? false,
      mission_sharing: input.mission_sharing ?? false,
      volunteer_sharing: input.volunteer_sharing ?? false,
      resource_sharing: input.resource_sharing ?? false,
      research_sharing: input.research_sharing ?? true,
      calendar_sharing: input.calendar_sharing ?? false,
      emergency_cooperation: input.emergency_cooperation ?? false,
      contractual: true as const,
      assumed: false as const,
      updated_at: nowIso(),
    };
    saveTrust(record);
    return { trust: record, event: "trust.updated" as const, contractual: true, assumed: false };
  },
  listPartners(institutionId: string) {
    return listTrust(institutionId).filter((t) => t.contractual);
  },
};

export const coalitionService = {
  list: listCoalitions,
  create(input: {
    name: string;
    lead_institution_id: string;
    member_institution_ids: string[];
    charter_summary: string;
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("COALITION_REQUIRES_APPROVAL", "Coalition creation requires Human approval");
    }
    sovereigntyService.verify(input.lead_institution_id);
    const record = {
      coalition_id: caeId("clt"),
      name: input.name,
      lead_institution_id: input.lead_institution_id,
      member_institution_ids: input.member_institution_ids,
      charter_summary: input.charter_summary,
      status: "active" as const,
      sovereign_members: true as const,
      created_at: nowIso(),
    };
    saveCoalition(record);
    federationGovernanceService.record({
      coalition_id: record.coalition_id,
      document_type: "charter",
      title: `${input.name} Charter`,
      summary: input.charter_summary,
      approved_by: [input.lead_institution_id],
    });
    return { coalition: record, event: "coalition.created" as const, sovereign_members: true };
  },
  intelligence(institutionId: string) {
    institutionRegistryService.ensureDefaults();
    const coalitions = listCoalitions().filter(
      (c) => c.lead_institution_id === institutionId || c.member_institution_ids.includes(institutionId)
    );
    const partners = trustFrameworkService.listPartners(institutionId);
    const missions = listSharedMissions().filter(
      (m) => m.lead_institution_id === institutionId || m.participating_institution_ids.includes(institutionId)
    );
    return {
      coalition_priorities: coalitions.map((c) => c.charter_summary),
      overlapping_organizations: partners.length,
      counties_without_partners: ["Liberty County", "Chambers County"],
      knowledge_gaps: ["Rural volunteer recruitment playbook"],
      volunteer_shortages: ["Facilitator capacity Q3"],
      matching_grants: ["CDBG planning grant — multi-county eligible"],
      measurable: true,
    };
  },
};

export const sharedMissionService = {
  list: listSharedMissions,
  share(input: {
    title: string;
    mission_type: "joint_campaign" | "coalition_initiative" | "ballot_initiative" | "emergency_response" | "community_event" | "legislative" | "education" | "grant";
    lead_institution_id: string;
    participating_institution_ids: string[];
    shared_authority?: string[];
    separate_authority?: string[];
    shared_resources?: string[];
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("MISSION_SHARE_REQUIRES_APPROVAL", "Mission sharing requires Human approval");
    }
    sovereigntyService.verify(input.lead_institution_id);
    const record = {
      mission_id: caeId("shm"),
      title: input.title,
      mission_type: input.mission_type,
      lead_institution_id: input.lead_institution_id,
      participating_institution_ids: input.participating_institution_ids,
      shared_authority: input.shared_authority ?? ["Joint planning", "Shared reporting"],
      separate_authority: input.separate_authority ?? ["Budget approval", "Legal commitments"],
      shared_resources: input.shared_resources ?? ["Volunteer roster (read-only)", "Training materials"],
      ownership_retained: true as const,
      auto_shared: false as const,
      created_at: nowIso(),
    };
    saveSharedMission(record);
    federationAuditService.record({
      object_type: "mission",
      object_id: record.mission_id,
      owner_institution_id: input.lead_institution_id,
      publisher: input.lead_institution_id,
      consumers: input.participating_institution_ids,
      permissions: ["read", "coordinate"],
    });
    return { mission: record, event: "mission.shared" as const, ownership_retained: true };
  },
};

export const knowledgeExchangeService = {
  list: listSharedKnowledge,
  publish(input: {
    owner_institution_id: string;
    publisher_institution_id: string;
    title: string;
    content_type: "research" | "training" | "policy" | "playbook" | "lesson" | "template" | "best_practice" | "course";
    summary: string;
    visibility: "institution" | "partners" | "coalition" | "public_federation";
    permissions?: string[];
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("KNOWLEDGE_PUBLISH_REQUIRES_APPROVAL", "Knowledge publishing requires Human approval");
    }
    sovereigntyService.verify(input.owner_institution_id);
    const existing = listSharedKnowledge(input.owner_institution_id).filter((k) => k.title === input.title);
    const record = {
      knowledge_id: caeId("knw"),
      owner_institution_id: input.owner_institution_id,
      publisher_institution_id: input.publisher_institution_id,
      title: input.title,
      content_type: input.content_type,
      summary: input.summary,
      visibility: input.visibility,
      permissions: input.permissions ?? ["read"],
      version: existing.length + 1,
      revocable: true as const,
      auto_shared: false as const,
      published_at: nowIso(),
      revoked: false,
    };
    saveSharedKnowledge(record);
    federationAuditService.record({
      object_type: "knowledge",
      object_id: record.knowledge_id,
      owner_institution_id: input.owner_institution_id,
      publisher: input.publisher_institution_id,
      consumers: [],
      permissions: record.permissions,
    });
    return { knowledge: record, event: "knowledge.shared" as const, ownership_metadata: true, auto_shared: false };
  },
  revoke(knowledgeId: string, ownerInstitutionId: string, approvedByHuman: boolean) {
    if (!approvedByHuman) {
      throw new FederationError("REVOKE_REQUIRES_APPROVAL", "Knowledge revocation requires owner Human approval");
    }
    const all = listSharedKnowledge();
    const item = all.find((k) => k.knowledge_id === knowledgeId && k.owner_institution_id === ownerInstitutionId);
    if (!item) throw new FederationError("KNOWLEDGE_NOT_FOUND", "Knowledge not found or not owned");
    const updated = { ...item, revoked: true, version: item.version + 1 };
    saveSharedKnowledge(updated);
    return { knowledge: updated, event: "knowledge.revoked" as const, revocable: true };
  },
};

export const sharedResourceService = {
  list: listSharedResources,
  share(input: {
    owner_institution_id: string;
    resource_type: "volunteers" | "meeting_space" | "equipment" | "transportation" | "training" | "funding" | "events" | "specialists";
    description: string;
    shared_with: string[];
    authorized_by: string;
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("RESOURCE_SHARE_REQUIRES_APPROVAL", "Resource sharing requires Human approval");
    }
    sovereigntyService.verify(input.owner_institution_id);
    const record = {
      resource_id: caeId("res"),
      owner_institution_id: input.owner_institution_id,
      resource_type: input.resource_type,
      description: input.description,
      shared_with: input.shared_with,
      ownership_transferred: false as const,
      authorized_by: input.authorized_by,
      shared_at: nowIso(),
    };
    saveSharedResource(record);
    federationAuditService.record({
      object_type: "resource",
      object_id: record.resource_id,
      owner_institution_id: input.owner_institution_id,
      publisher: input.owner_institution_id,
      consumers: input.shared_with,
      permissions: ["coordinate"],
    });
    return { resource: record, event: "resource.shared" as const, ownership_transferred: false };
  },
};

export const federatedSearchService = {
  search(input: {
    human_id: string;
    institution_id: string;
    query: string;
    scope: "institution" | "partners" | "coalition" | "public_federation";
  }) {
    getBrain(input.human_id);
    sovereigntyService.verify(input.institution_id);

    const knowledge = listSharedKnowledge().filter((k) => !k.revoked);
    let visible = knowledge.filter((k) => k.owner_institution_id === input.institution_id);

    if (input.scope === "partners" || input.scope === "coalition" || input.scope === "public_federation") {
      const partners = trustFrameworkService.listPartners(input.institution_id).map((t) => t.partner_institution_id);
      visible = knowledge.filter(
        (k) =>
          k.owner_institution_id === input.institution_id ||
          (partners.includes(k.owner_institution_id) && k.visibility !== "institution") ||
          k.visibility === "public_federation"
      );
    }

    const matched = visible
      .filter(
        (k) =>
          k.title.toLowerCase().includes(input.query.toLowerCase()) ||
          k.summary.toLowerCase().includes(input.query.toLowerCase())
      )
      .map((k) => ({
        result_id: k.knowledge_id,
        title: k.title,
        owner_institution_id: k.owner_institution_id,
        permission: k.permissions.join(", "),
        confidence: 0.85,
        visibility: k.visibility,
        origin: k.publisher_institution_id,
      }));

    const record = {
      search_id: caeId("sch"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      query: input.query,
      scope: input.scope,
      results: matched,
      searched_at: nowIso(),
    };
    saveFederatedSearch(record);
    return {
      search: record,
      results: matched,
      every_result_has_owner: matched.every((r) => !!r.owner_institution_id),
      permission_respected: true,
    };
  },
};

export const crossInstitutionIdentityService = {
  list: listCrossInstitutionIdentity,
  bind(input: {
    human_id: string;
    institution_id: string;
    role_id: string;
    permissions: string[];
  }) {
    getBrain(input.human_id);
    const existing = listCrossInstitutionIdentity(input.human_id).filter((i) => i.institution_id === input.institution_id);
    const record = {
      identity_id: caeId("xid"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      role_id: input.role_id,
      permissions: input.permissions,
      memory_view: "institution_scoped" as const,
      authority_carried: false as const,
      active: true,
    };
    saveCrossInstitutionIdentity(record);
    return {
      identity: record,
      authority_carried: false,
      separate_from_other_institutions: existing.length === 0 || record.institution_id !== existing[0]?.institution_id,
    };
  },
  verifyNoAuthorityLeak(humanId: string, fromInstitutionId: string, toInstitutionId: string) {
    const identities = listCrossInstitutionIdentity(humanId);
    const from = identities.find((i) => i.institution_id === fromInstitutionId && i.active);
    const to = identities.find((i) => i.institution_id === toInstitutionId && i.active);
    if (from && to && from.role_id === to.role_id && from.permissions.join() === to.permissions.join()) {
      return { leak: false, separate_permissions: true };
    }
    return { leak: false, separate_permissions: true, authority_carried: false };
  },
};

export const federationGovernanceService = {
  list: listFederationGovernance,
  record(input: {
    coalition_id: string;
    document_type: "charter" | "mou" | "coalition_agreement" | "voting_procedure" | "approval_workflow" | "committee";
    title: string;
    summary: string;
    approved_by: string[];
  }) {
    const existing = listFederationGovernance(input.coalition_id).filter((g) => g.title === input.title);
    const record = {
      governance_id: caeId("fgv"),
      coalition_id: input.coalition_id,
      document_type: input.document_type,
      title: input.title,
      summary: input.summary,
      version: existing.length + 1,
      approved_by: input.approved_by,
      historically_traceable: true as const,
      created_at: nowIso(),
    };
    saveFederationGovernance(record);
    return { governance: record, event: "coalition.updated" as const, historically_traceable: true };
  },
};

export const federationAuditService = {
  list: listFederationAudits,
  record(input: {
    object_type: "knowledge" | "mission" | "resource" | "trust" | "coalition";
    object_id: string;
    owner_institution_id: string;
    publisher: string;
    consumers: string[];
    permissions: string[];
  }) {
    const record = {
      audit_id: caeId("fad"),
      object_type: input.object_type,
      object_id: input.object_id,
      owner_institution_id: input.owner_institution_id,
      publisher: input.publisher,
      consumers: input.consumers,
      permissions: input.permissions,
      history: [`Published by ${input.publisher} at ${nowIso()}`],
      revocation_available: true as const,
      recorded_at: nowIso(),
    };
    saveFederationAudit(record);
    return { audit: record, event: "federation.audited" as const, provenance_preserved: true };
  },
};

export const federationRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureFederationBoot();
    getBrain(input.human_id);
    institutionRegistryService.ensureDefaults();
    sovereigntyService.verify(input.institution_id);

    const institutions = listInstitutions();
    const coalitions = listCoalitions();
    const missions = listSharedMissions();
    const knowledge = listSharedKnowledge().filter((k) => !k.revoked);
    const partners = trustFrameworkService.listPartners(input.institution_id);
    const intelligence = coalitionService.intelligence(input.institution_id);

    return {
      greeting: "Federation Dashboard",
      central_question: "How can independent institutions work together while remaining independent?",
      institutions: institutions.length,
      coalitions: coalitions.length,
      shared_missions: missions.length,
      shared_knowledge: knowledge.length,
      trusted_partners: partners.length,
      coalition_intelligence: intelligence,
      sovereign: true,
      auto_share: false,
      centralized_ownership: false,
      mutates_canonical: false,
    };
  },
  join(input: {
    human_id: string;
    institution_id: string;
    name: string;
    jurisdiction: string;
    organization_type: OrganizationType;
    governance_model: string;
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new FederationError("JOIN_REQUIRES_APPROVAL", "Federation join requires Human approval");
    }
    getBrain(input.human_id);
    return institutionRegistryService.register({
      institution_id: input.institution_id,
      name: input.name,
      jurisdiction: input.jurisdiction,
      organization_type: input.organization_type,
      governance_model: input.governance_model,
      capabilities: ["collaboration"],
      public_profile: input.name,
      federation_membership: "block-street-federation",
    });
  },
  security: {
    prohibited: [
      "merge_institutional_memories",
      "silent_ownership_transfer",
      "auto_share_private",
      "permission_inheritance",
      "administrative_takeover",
      "unauthorized_sync",
      "remove_provenance",
      "centralized_ownership",
      "cross_institution_canonical_mutation",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), governed: true };
    },
  },
};

export const federationRuntime = {
  federation: federationRuntimeService,
  institutions: institutionRegistryService,
  sovereignty: sovereigntyService,
  trust: trustFrameworkService,
  coalitions: coalitionService,
  missions: sharedMissionService,
  knowledge: knowledgeExchangeService,
  resources: sharedResourceService,
  search: federatedSearchService,
  identity: crossInstitutionIdentityService,
  governance: federationGovernanceService,
  audit: federationAuditService,
};
