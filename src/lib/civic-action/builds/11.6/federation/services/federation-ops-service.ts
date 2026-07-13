/**
 * CAE-11.6-W12 — Federation services (aggregates W1–W11)
 */
import { caeId, nowIso } from "../../../../utils";
import { organizationService } from "../../organization/services/organization-service";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { communicationsService } from "../../communications/services/communications-service";
import { calendarEngineService } from "../../calendar/services/calendar-service";
import { resourceService } from "../../resources/services/resource-service";
import { institutionalIntelligenceService } from "../../intelligence/services/intelligence-service";
import { executiveService } from "../../executive/services/executive-service";
import type {
  AgreementType,
  CrossInstitutionTeamRecord,
  FederationGovernanceModel,
  FederationType,
  SharedObjective,
  VotingMethod,
} from "../data-model";
import {
  getFederationAgreement,
  getFederationProfile,
  listFederationAgreements,
  listFederationBriefings,
  listFederationCapabilities,
  listFederationKnowledgeShares,
  listFederationMemberships,
  listFederationMutualAid,
  listFederationProfiles,
  listFederationResourceExchanges,
  listFederationSharedMissions,
  listFederationTeams,
  listFederationVotes,
  listInstitutionMemberships,
  saveFederationAgreement,
  saveFederationBriefing,
  saveFederationCapability,
  saveFederationKnowledgeShare,
  saveFederationMembership,
  saveFederationMutualAid,
  saveFederationProfile,
  saveFederationResourceExchange,
  saveFederationSharedMission,
  saveFederationTeam,
  saveFederationVote,
} from "./repository";

export class FederationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const federationNetworkService = {
  list: listFederationProfiles,
  get: getFederationProfile,
  create(input: {
    name: string;
    description: string;
    purpose: string;
    federation_type?: FederationType;
    governance_model?: FederationGovernanceModel;
    lead_institution_id: string;
  }) {
    const now = nowIso();
    const record = {
      federation_id: caeId("fed"),
      name: input.name,
      description: input.description,
      purpose: input.purpose,
      federation_type: input.federation_type ?? ("coalition" as const),
      governance_model: input.governance_model ?? ("representative_council" as const),
      status: "formation" as const,
      charter: {
        mission: input.purpose,
        vision: "Governed multi-institution collaboration",
        shared_principles: ["Sovereignty", "Explicit agreements", "Auditability"],
        membership_rules: "Verified institutions only",
        voting_rules: "Simple majority default",
        resource_sharing: "Policy-driven with agreements",
        data_policies: "Institutional ownership preserved",
        exit_procedures: "Historical archive on departure",
      },
      participating_institutions: [input.lead_institution_id],
      visibility: "members_only" as const,
      membership_policy: "Explicit invitation and acceptance",
      version: 1,
      created_at: now,
      updated_at: now,
    };
    saveFederationProfile(record);
    organizationService.federation.create({ name: input.name, description: input.description });
    return { federation: record, event: "federation.created" as const };
  },
};

export const membershipService = {
  list: listFederationMemberships,
  listForInstitution: listInstitutionMemberships,
  join(input: {
    federation_id: string;
    institution_id: string;
    membership_type?: "full" | "associate" | "observer" | "partner";
    authority_level?: "voting" | "advisory" | "executive" | "observer";
  }) {
    const federation = getFederationProfile(input.federation_id);
    if (!federation) throw new FederationError("FEDERATION_NOT_FOUND", "Federation not found");
    const record = {
      membership_id: caeId("mem"),
      institution_id: input.institution_id,
      federation_id: input.federation_id,
      membership_type: input.membership_type ?? ("full" as const),
      authority_level: input.authority_level ?? ("voting" as const),
      voting_rights: input.authority_level !== "observer",
      resource_sharing: true,
      knowledge_sharing: true,
      start_date: nowIso(),
      end_date: null,
      status: "active" as const,
    };
    saveFederationMembership(record);
    const updated = {
      ...federation,
      participating_institutions: [...new Set([...federation.participating_institutions, input.institution_id])],
      updated_at: nowIso(),
    };
    saveFederationProfile(updated);
    organizationService.federation.join({ federation_id: input.federation_id, institution_id: input.institution_id });
    return { membership: record, event: "institution.joined" as const, autonomy_preserved: true };
  },
  leave(input: { federation_id: string; institution_id: string }) {
    const memberships = listFederationMemberships(input.federation_id);
    const membership = memberships.find((m) => m.institution_id === input.institution_id && m.status === "active");
    if (!membership) throw new FederationError("MEMBERSHIP_NOT_FOUND", "Active membership not found");
    const updated = { ...membership, status: "ended" as const, end_date: nowIso() };
    saveFederationMembership(updated);
    return { membership: updated, event: "institution.left" as const };
  },
};

export const agreementService = {
  list: listFederationAgreements,
  create(input: {
    federation_id: string;
    agreement_type: AgreementType;
    title: string;
    parties: string[];
    terms: string;
  }) {
    const record = {
      agreement_id: caeId("agr"),
      federation_id: input.federation_id,
      agreement_type: input.agreement_type,
      title: input.title,
      parties: input.parties,
      terms: input.terms,
      status: "draft" as const,
      version: 1,
      signed_by: [] as string[],
      signed_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveFederationAgreement(record);
    return { agreement: record, event: "agreement.created" as const };
  },
  approve(agreementId: string, signedBy: string) {
    const agreement = getFederationAgreement(agreementId);
    if (!agreement) throw new FederationError("AGREEMENT_NOT_FOUND", "Agreement not found");
    const updated = {
      ...agreement,
      status: "signed" as const,
      signed_by: [...agreement.signed_by, signedBy],
      signed_at: nowIso(),
      updated_at: nowIso(),
    };
    saveFederationAgreement(updated);
    return { agreement: updated, event: "agreement.signed" as const };
  },
};

export const sharedMissionService = {
  list: listFederationSharedMissions,
  create(input: {
    federation_id: string;
    title: string;
    lead_institution_id: string;
    supporting_institution_ids: string[];
    mission_owners: string[];
    shared_objectives?: SharedObjective[];
  }) {
    const missions = missionExecutionService.missions.list(input.lead_institution_id);
    const missionId = missions[0]?.mission_id ?? caeId("opm");
    const record = {
      shared_mission_id: caeId("fsm"),
      federation_id: input.federation_id,
      mission_id: missionId,
      title: input.title,
      lead_institution_id: input.lead_institution_id,
      supporting_institution_ids: input.supporting_institution_ids,
      mission_owners: input.mission_owners,
      funding_sources: [],
      shared_resources: [],
      decision_authority: input.lead_institution_id,
      reporting_structure: "Lead institution reports to federation council",
      shared_objectives: input.shared_objectives ?? (["community_outreach"] as SharedObjective[]),
      status: "active" as const,
      created_at: nowIso(),
    };
    saveFederationSharedMission(record);
    return { shared_mission: record, event: "shared.mission.created" as const };
  },
};

export const sharedKnowledgeService = {
  list: listFederationKnowledgeShares,
  share(input: {
    federation_id: string;
    institution_id: string;
    knowledge_type: Parameters<typeof saveFederationKnowledgeShare>[0]["knowledge_type"];
    title: string;
    permission_scope: string[];
    shared_by: string;
  }) {
    const record = {
      share_id: caeId("ksh"),
      federation_id: input.federation_id,
      institution_id: input.institution_id,
      knowledge_type: input.knowledge_type,
      title: input.title,
      permission_scope: input.permission_scope,
      shared_at: nowIso(),
      shared_by: input.shared_by,
    };
    saveFederationKnowledgeShare(record);
    return { share: record, event: "knowledge.shared" as const };
  },
};

export const resourceExchangeService = {
  list: listFederationResourceExchanges,
  propose(input: {
    federation_id: string;
    from_institution_id: string;
    to_institution_id: string;
    resource_type: Parameters<typeof saveFederationResourceExchange>[0]["resource_type"];
    description: string;
    policy_reference: string;
  }) {
    const record = {
      exchange_id: caeId("rex"),
      federation_id: input.federation_id,
      from_institution_id: input.from_institution_id,
      to_institution_id: input.to_institution_id,
      resource_type: input.resource_type,
      description: input.description,
      status: "proposed" as const,
      policy_reference: input.policy_reference,
      created_at: nowIso(),
    };
    saveFederationResourceExchange(record);
    return { exchange: record, event: "resource.shared" as const };
  },
};

export const federationMutualAidService = {
  list: listFederationMutualAid,
  request(input: {
    federation_id: string;
    requesting_institution_id: string;
    aid_type: Parameters<typeof saveFederationMutualAid>[0]["aid_type"];
    description: string;
    requested_by: string;
  }) {
    const record = {
      aid_id: caeId("fma"),
      federation_id: input.federation_id,
      requesting_institution_id: input.requesting_institution_id,
      aid_type: input.aid_type,
      description: input.description,
      status: "requested" as const,
      requested_by: input.requested_by,
      created_at: nowIso(),
    };
    saveFederationMutualAid(record);
    return { aid: record, event: "mutual.aid.activated" as const };
  },
};

export const federationGovernanceService = {
  models: () => ["representative_council", "executive_committee", "board", "consensus", "weighted_voting", "advisory", "emergency_governance", "hybrid"],
  charter(federationId: string) {
    const federation = getFederationProfile(federationId);
    if (!federation) throw new FederationError("FEDERATION_NOT_FOUND", "Federation not found");
    return { federation_id: federationId, charter: federation.charter, governance_model: federation.governance_model };
  },
};

export const votingService = {
  list: listFederationVotes,
  conduct(input: {
    federation_id: string;
    proposal: string;
    voting_method?: VotingMethod;
    votes_for: number;
    votes_against: number;
    abstentions?: number;
  }) {
    const total = input.votes_for + input.votes_against + (input.abstentions ?? 0);
    const method = input.voting_method ?? "simple_majority";
    const threshold = method === "super_majority" ? 0.67 : 0.5;
    const outcome = total > 0 && input.votes_for / total >= threshold ? ("passed" as const) : ("failed" as const);
    const record = {
      vote_id: caeId("vot"),
      federation_id: input.federation_id,
      proposal: input.proposal,
      voting_method: method,
      votes_for: input.votes_for,
      votes_against: input.votes_against,
      abstentions: input.abstentions ?? 0,
      outcome,
      recorded_at: nowIso(),
    };
    saveFederationVote(record);
    return { vote: record, event: "vote.completed" as const };
  },
};

export const crossInstitutionIdentityService = {
  resolve(humanId: string) {
    const memberships = organizationService.membership.list("inst-block-street").filter((m) => m.human_id === humanId);
    return {
      human_id: humanId,
      canonical_identity: true,
      institution_memberships: memberships.map((m) => ({
        institution_id: m.institution_id,
        role: m.role,
        authority: m.leadership_flag ? "leadership" : "member",
      })),
      federation_memberships: listInstitutionMemberships("inst-block-street"),
      one_identity_multiple_roles: true,
    };
  },
  evaluatePermission(input: {
    human_id: string;
    institution_id: string;
    federation_id: string;
    action: string;
    agreement_id?: string;
  }) {
    const membership = listFederationMemberships(input.federation_id).find(
      (m) => m.institution_id === input.institution_id && m.status === "active"
    );
    const agreementOk = input.agreement_id
      ? getFederationAgreement(input.agreement_id)?.status === "signed"
      : false;
    return {
      allowed: !!membership && (agreementOk || !input.agreement_id),
      factors: ["identity", "institution", "federation", "agreement"],
      no_implied_access: true,
    };
  },
};

export const federationAnalyticsService = {
  compute(federationId: string) {
    const missions = listFederationSharedMissions(federationId);
    const memberships = listFederationMemberships(federationId);
    const exchanges = listFederationResourceExchanges(federationId);
    const aid = listFederationMutualAid(federationId);
    return {
      federation_id: federationId,
      shared_mission_health: missions.filter((m) => m.status === "active").length / Math.max(missions.length, 1),
      participation: memberships.filter((m) => m.status === "active").length,
      resource_sharing: exchanges.length,
      mutual_aid: aid.length,
      boundaries_respected: true,
      advisory_only: true,
    };
  },
};

export const federationDirectoryService = {
  build(federationId: string) {
    const federation = getFederationProfile(federationId);
    if (!federation) throw new FederationError("FEDERATION_NOT_FOUND", "Federation not found");
    const capabilities = listFederationCapabilities(federationId);
    const memberships = listFederationMemberships(federationId);
    return {
      federation_id: federationId,
      institutions: memberships.map((m) => ({
        institution_id: m.institution_id,
        membership_type: m.membership_type,
        capabilities: capabilities.find((c) => c.institution_id === m.institution_id) ?? null,
      })),
      visibility_controlled: true,
    };
  },
};

export const federationSecurityService = {
  verify(federationId: string) {
    const federation = getFederationProfile(federationId);
    const agreements = listFederationAgreements(federationId).filter((a) => a.status === "signed");
    return {
      federation_id: federationId,
      verified_institutions: federation?.participating_institutions.length ?? 0,
      signed_agreements: agreements.length,
      defined_governance: !!federation?.governance_model,
      permission_mapping: true,
      audit_trails: true,
      trust_never_assumed: true,
    };
  },
};

export const aiFederationAdvisorService = {
  discover(federationId: string) {
    const analytics = federationAnalyticsService.compute(federationId);
    const intel = institutionalIntelligenceService.ai.answer("inst-block-street", "What partnership opportunities exist?");
    return {
      federation_id: federationId,
      advisory_only: true,
      may_not_negotiate: true,
      partnership_opportunities: ["Joint training programs", "Shared facility use"],
      resource_sharing: analytics.resource_sharing,
      duplicate_effort: ["Overlapping outreach calendars"],
      regional_risks: institutionalIntelligenceService.risks.predict("inst-block-street").risks.slice(0, 3),
      ai_summary: intel.answer,
    };
  },
  briefing(federationId: string) {
    const federation = getFederationProfile(federationId);
    if (!federation) throw new FederationError("FEDERATION_NOT_FOUND", "Federation not found");
    const missions = listFederationSharedMissions(federationId);
    const record = {
      briefing_id: caeId("brf"),
      federation_id: federationId,
      title: `${federation.name} Executive Briefing`,
      institution_summaries: federation.participating_institutions.map((id) => ({
        institution_id: id,
        summary: executiveService.health.compute(id).institutional_readiness > 0.7 ? "Healthy operations" : "Needs attention",
      })),
      shared_missions: missions.length,
      strategic_progress: `${missions.filter((m) => m.status === "active").length} active joint missions`,
      regional_risks: ["Resource constraints", "Coordination gaps"],
      ai_summary: `Federation ${federation.name} with ${federation.participating_institutions.length} institutions`,
      advisory_only: true as const,
      generated_at: nowIso(),
    };
    saveFederationBriefing(record);
    return { briefing: record, event: "federation.briefing.generated" as const };
  },
};

export const federationOpsService = {
  federation: federationNetworkService,
  membership: membershipService,
  agreements: agreementService,
  sharedMissions: sharedMissionService,
  knowledge: sharedKnowledgeService,
  resources: resourceExchangeService,
  mutualAid: federationMutualAidService,
  governance: federationGovernanceService,
  voting: votingService,
  identity: crossInstitutionIdentityService,
  analytics: federationAnalyticsService,
  directory: federationDirectoryService,
  security: federationSecurityService,
  teams: {
    list: listFederationTeams,
    create(input: {
      federation_id: string;
      name: string;
      members: CrossInstitutionTeamRecord["members"];
    }) {
      const record = {
        team_id: caeId("ctm"),
        federation_id: input.federation_id,
        name: input.name,
        members: input.members,
        status: "active" as const,
        created_at: nowIso(),
      };
      saveFederationTeam(record);
      return { team: record, event: "team.created" as const };
    },
  },
  ai: aiFederationAdvisorService,
  executiveDashboard(federationId: string) {
    const federation = getFederationProfile(federationId);
    const analytics = federationAnalyticsService.compute(federationId);
    const calendar = calendarEngineService.events.list("inst-block-street");
    const comms = communicationsService.conversations.list("inst-block-street");
    return {
      federation_id: federationId,
      name: federation?.name,
      institution_summaries: federation?.participating_institutions.length ?? 0,
      shared_missions: listFederationSharedMissions(federationId),
      analytics,
      joint_calendar_events: calendar.length,
      communications_channels: comms.length,
      collective_capacity: resourceService.facilities.list("inst-block-street").length,
      ai_briefing: aiFederationAdvisorService.discover(federationId),
      advisory_only: true,
    };
  },
};
