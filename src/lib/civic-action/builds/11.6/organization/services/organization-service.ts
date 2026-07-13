/**
 * CAE-11.6-W4 — Organization & federation services
 */
import { caeId, nowIso } from "../../../../utils";
import type { OpsInstitutionRecord, OrganizationUnitRecord } from "../data-model";
import {
  buildOrganizationTree,
  getOpsInstitution,
  getOrganizationHealth,
  listAuthorities,
  listCollaborations,
  listFederations,
  listGovernanceDecisions,
  listOpsInstitutions,
  listOrgMemberships,
  listOrganizationUnits,
  listSharedMissions,
  saveAuthority,
  saveCollaboration,
  saveFederation,
  saveGovernanceDecision,
  saveOpsInstitution,
  saveOrganizationHealth,
  saveOrganizationUnit,
  saveOrgMembership,
  saveSharedMission,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class OrganizationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const federationService = {
  list: listFederations,
  create(input: { name: string; description: string }) {
    const record = {
      federation_id: caeId("fed"),
      name: input.name,
      description: input.description,
      status: "active" as const,
      created_at: nowIso(),
    };
    saveFederation(record);
    return { federation: record, event: "federation.created" as const };
  },
  join(input: { federation_id: string; institution_id: string }) {
    const institution = getOpsInstitution(input.institution_id);
    if (!institution) throw new OrganizationError("INSTITUTION_NOT_FOUND", "Institution not found");
    const updated: OpsInstitutionRecord = { ...institution, federation_id: input.federation_id, updated_at: nowIso() };
    saveOpsInstitution(updated);
    return { institution: updated, event: "federation.joined" as const, autonomy_preserved: true };
  },
};

export const institutionService = {
  list: (federationId?: string) => listOpsInstitutions(federationId),
  get: (institutionId: string) => {
    const inst = getOpsInstitution(institutionId);
    if (!inst) throw new OrganizationError("INSTITUTION_NOT_FOUND", `Institution ${institutionId} not found`);
    return inst;
  },
  create(input: {
    legal_name: string;
    public_name: string;
    short_name: string;
    institution_type: OpsInstitutionRecord["institution_type"];
    governance_model: OpsInstitutionRecord["governance_model"];
    mission_statement: string;
    vision_statement: string;
    federation_id?: string | null;
  }) {
    const now = nowIso();
    const institution: OpsInstitutionRecord = {
      institution_id: caeId("ins"),
      federation_id: input.federation_id ?? null,
      legal_name: input.legal_name,
      public_name: input.public_name,
      short_name: input.short_name,
      institution_type: input.institution_type,
      status: "active",
      primary_language: "en",
      secondary_languages: [],
      time_zone: "America/Chicago",
      jurisdiction: "US",
      mission_statement: input.mission_statement,
      vision_statement: input.vision_statement,
      website: null,
      governance_model: input.governance_model,
      branding: { primary_color: "#1a365d", logo_uri: null },
      created_at: now,
      updated_at: now,
    };
    saveOpsInstitution(institution);
    return { institution, event: "institution.created" as const };
  },
};

export const organizationUnitService = {
  list: listOrganizationUnits,
  tree: buildOrganizationTree,
  create(input: {
    institution_id: string;
    parent_unit_id?: string | null;
    unit_type: OrganizationUnitRecord["unit_type"];
    name: string;
    description: string;
    manager_human_id?: string | null;
    executive_owner_human_id?: string | null;
  }) {
    const record: OrganizationUnitRecord = {
      organization_unit_id: caeId("org"),
      institution_id: input.institution_id,
      parent_unit_id: input.parent_unit_id ?? null,
      unit_type: input.unit_type,
      name: input.name,
      description: input.description,
      manager_human_id: input.manager_human_id ?? null,
      executive_owner_human_id: input.executive_owner_human_id ?? null,
      status: "active",
      visibility: "institution",
      created_at: nowIso(),
    };
    saveOrganizationUnit(record);
    return { unit: record, event: "organization.created" as const };
  },
};

export const governanceService = {
  listDecisions: listGovernanceDecisions,
  recordDecision(input: {
    institution_id: string;
    organization_unit_id: string;
    meeting_reference: string;
    proposal: string;
    vote_type: Parameters<typeof saveGovernanceDecision>[0]["vote_type"];
    decision: string;
    authority_id: string;
    effective_date: string;
    recorded_by: string;
  }) {
    const record = {
      decision_id: caeId("gov"),
      institution_id: input.institution_id,
      organization_unit_id: input.organization_unit_id,
      meeting_reference: input.meeting_reference,
      proposal: input.proposal,
      vote_type: input.vote_type,
      decision: input.decision,
      authority_id: input.authority_id,
      effective_date: input.effective_date,
      recorded_by: input.recorded_by,
      recorded_at: nowIso(),
    };
    saveGovernanceDecision(record);
    return { decision: record, event: "governance.decision_recorded" as const };
  },
};

export const authorityService = {
  list: listAuthorities,
  delegate(input: {
    institution_id: string;
    organization_unit_id: string;
    authority_scope: string;
    assigned_human_id: string;
    assigned_role: string;
    delegation_allowed?: boolean;
    approval_required?: boolean;
    expiration?: string | null;
  }) {
    const record = {
      authority_id: caeId("aut"),
      institution_id: input.institution_id,
      organization_unit_id: input.organization_unit_id,
      authority_scope: input.authority_scope,
      delegation_allowed: input.delegation_allowed ?? true,
      approval_required: input.approval_required ?? true,
      expiration: input.expiration ?? null,
      assigned_human_id: input.assigned_human_id,
      assigned_role: input.assigned_role,
    };
    saveAuthority(record);
    return { authority: record, event: "authority.delegated" as const };
  },
};

export const membershipService = {
  list: listOrgMemberships,
  join(input: {
    human_id: string;
    institution_id: string;
    organization_unit_id: string;
    role: string;
    primary_membership?: boolean;
    leadership_flag?: boolean;
  }) {
    const record = {
      membership_id: caeId("mem"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      organization_unit_id: input.organization_unit_id,
      role: input.role,
      start_date: nowIso(),
      end_date: null,
      status: "active" as const,
      primary_membership: input.primary_membership ?? false,
      leadership_flag: input.leadership_flag ?? false,
    };
    saveOrgMembership(record);
    return { membership: record, event: input.leadership_flag ? ("leadership.assigned" as const) : ("membership.created" as const) };
  },
  leave(membershipId: string) {
    const all = listOrgMemberships(DEFAULT_INSTITUTION);
    const membership = all.find((m) => m.membership_id === membershipId);
    if (!membership) throw new OrganizationError("MEMBERSHIP_NOT_FOUND", "Membership not found");
    const updated = { ...membership, status: "ended" as const, end_date: nowIso() };
    saveOrgMembership(updated);
    return { membership: updated, event: "membership.ended" as const };
  },
};

export const collaborationService = {
  list: listCollaborations,
  establish(input: {
    from_institution_id: string;
    to_institution_id: string;
    relationship_type: Parameters<typeof saveCollaboration>[0]["relationship_type"];
  }) {
    const record = {
      collaboration_id: caeId("col"),
      from_institution_id: input.from_institution_id,
      to_institution_id: input.to_institution_id,
      relationship_type: input.relationship_type,
      status: "active" as const,
      created_at: nowIso(),
    };
    saveCollaboration(record);
    return record;
  },
};

export const sharedMissionService = {
  list: listSharedMissions,
  create(input: {
    mission_id: string;
    primary_institution_id: string;
    supporting_institution_ids: string[];
    lead_organization_unit_id: string;
    funding_institution_id?: string | null;
    approval_institution_id?: string | null;
  }) {
    const record = {
      shared_mission_id: caeId("shm"),
      mission_id: input.mission_id,
      primary_institution_id: input.primary_institution_id,
      supporting_institution_ids: input.supporting_institution_ids,
      lead_organization_unit_id: input.lead_organization_unit_id,
      funding_institution_id: input.funding_institution_id ?? null,
      approval_institution_id: input.approval_institution_id ?? null,
    };
    saveSharedMission(record);
    return { shared_mission: record, event: "shared_mission.created" as const };
  },
};

export const organizationHealthService = {
  compute(institutionId: string) {
    const memberships = listOrgMemberships(institutionId);
    const units = listOrganizationUnits(institutionId);
    const leadership = memberships.filter((m) => m.leadership_flag && m.status === "active");
    const record = {
      health_id: caeId("oht"),
      institution_id: institutionId,
      leadership_coverage: units.length ? leadership.length / units.length : 1,
      vacancies: Math.max(0, units.length - leadership.length),
      mission_completion_rate: 0.75,
      volunteer_activity_score: 0.8,
      certification_coverage: 0.85,
      succession_readiness: 0.7,
      computed_at: nowIso(),
    };
    saveOrganizationHealth(record);
    return record;
  },
  get: getOrganizationHealth,
};

export const aiOrganizationAdvisorService = {
  analyze(institutionId: string) {
    const health = organizationHealthService.compute(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_change_structure: true,
      recommendations: [
        health.vacancies > 0 ? "Fill leadership vacancies in organization units" : null,
        health.succession_readiness < 0.8 ? "Strengthen succession planning pipeline" : null,
      ].filter(Boolean),
      governance_reminders: ["Review authority delegations quarterly"],
      collaboration_opportunities: listCollaborations(institutionId).length,
    };
  },
};

export const federationDashboardService = {
  build(federationId: string) {
    const institutions = listOpsInstitutions(federationId);
    return {
      federation_id: federationId,
      institution_count: institutions.length,
      institution_health: institutions.map((i) => organizationHealthService.compute(i.institution_id)),
      shared_missions: institutions.flatMap((i) => listSharedMissions(i.institution_id)),
      autonomy_preserved: true,
      advisory_only: true,
    };
  },
};

export const organizationService = {
  federation: federationService,
  institutions: institutionService,
  units: organizationUnitService,
  governance: governanceService,
  authority: authorityService,
  membership: membershipService,
  collaboration: collaborationService,
  sharedMissions: sharedMissionService,
  health: organizationHealthService,
  ai: aiOrganizationAdvisorService,
  federationDashboard: federationDashboardService,
};
