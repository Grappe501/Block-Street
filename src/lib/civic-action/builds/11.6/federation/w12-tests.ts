/**
 * CAE-11.6-W12 — Federation tests
 */
import { federationOpsService } from "./services/federation-ops-service";
import { seedFederationIfEmpty } from "./services/seed";
import { getFederationConstitution, OPS_FEDERATION_PRINCIPLE, REQUIRED_FEDERATION_SERVICES } from "./constitution";
import { checkOpsW12Invariants } from "./invariants";
import { explainFederationAction } from "./traceability";
import { FEDERATION_EVENT_CATALOG } from "./events/catalog";

export type OpsW12TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW12FederationTests(): OpsW12TestResult[] {
  seedFederationIfEmpty();
  const results: OpsW12TestResult[] = [];
  const institutionId = "inst-block-street";
  const federationId = "fed-block-street-001";

  const constitution = getFederationConstitution();
  results.push({ name: "federation_principle", passed: constitution.governing_principle === OPS_FEDERATION_PRINCIPLE });

  results.push({
    name: "required_federation_services",
    passed: REQUIRED_FEDERATION_SERVICES.length === 14,
    detail: `${REQUIRED_FEDERATION_SERVICES.length} services`,
  });

  results.push({ name: "w12_invariants", passed: checkOpsW12Invariants().every((i) => i.passed) });

  const federations = federationOpsService.federation.list();
  results.push({
    name: "federation_profiles",
    passed: federations.length >= 1,
    detail: `${federations.length} federations`,
  });

  const created = federationOpsService.federation.create({
    name: "Regional Volunteer Alliance",
    description: "Test federation for volunteer coordination",
    purpose: "Coordinate regional volunteer training",
    lead_institution_id: institutionId,
    federation_type: "alliance",
  });
  results.push({
    name: "create_federation",
    passed: created.event === "federation.created",
    detail: created.federation.federation_type,
  });

  const joined = federationOpsService.membership.join({
    federation_id: created.federation.federation_id,
    institution_id: institutionId,
    membership_type: "full",
  });
  results.push({
    name: "join_federation",
    passed: joined.event === "institution.joined" && joined.autonomy_preserved,
    detail: joined.membership.membership_type,
  });

  const agreement = federationOpsService.agreements.create({
    federation_id: federationId,
    agreement_type: "knowledge_sharing",
    title: "Training Materials Sharing Agreement",
    parties: [institutionId],
    terms: "Share training materials with federation members under CC license",
  });
  const signed = federationOpsService.agreements.approve(agreement.agreement.agreement_id, "usr-001");
  results.push({
    name: "federation_agreements",
    passed: signed.event === "agreement.signed",
    detail: signed.agreement.agreement_type,
  });

  const sharedMission = federationOpsService.sharedMissions.create({
    federation_id: federationId,
    title: "Joint Community Outreach",
    lead_institution_id: institutionId,
    supporting_institution_ids: [],
    mission_owners: ["usr-001"],
    shared_objectives: ["community_outreach"],
  });
  results.push({
    name: "shared_missions",
    passed: sharedMission.event === "shared.mission.created",
    detail: sharedMission.shared_mission.title,
  });

  const knowledge = federationOpsService.knowledge.share({
    federation_id: federationId,
    institution_id: institutionId,
    knowledge_type: "training",
    title: "Volunteer Training Playbook",
    permission_scope: ["federation_members"],
    shared_by: "usr-001",
  });
  results.push({
    name: "knowledge_sharing",
    passed: knowledge.event === "knowledge.shared",
    detail: knowledge.share.title,
  });

  const aid = federationOpsService.mutualAid.request({
    federation_id: federationId,
    requesting_institution_id: institutionId,
    aid_type: "personnel",
    description: "Request volunteer trainers for joint event",
    requested_by: "usr-001",
  });
  results.push({
    name: "federation_mutual_aid",
    passed: aid.event === "mutual.aid.activated",
    detail: aid.aid.aid_type,
  });

  const vote = federationOpsService.voting.conduct({
    federation_id: federationId,
    proposal: "Approve joint outreach calendar",
    votes_for: 3,
    votes_against: 1,
  });
  results.push({
    name: "federation_governance",
    passed: vote.event === "vote.completed",
    detail: vote.vote.outcome,
  });

  const identity = federationOpsService.identity.resolve("usr-001");
  results.push({
    name: "cross_institution_identity",
    passed: identity.canonical_identity && identity.one_identity_multiple_roles,
    detail: `${identity.institution_memberships.length} memberships`,
  });

  const analytics = federationOpsService.analytics.compute(federationId);
  results.push({
    name: "federation_analytics",
    passed: analytics.boundaries_respected && analytics.participation >= 1,
    detail: `participation ${analytics.participation}`,
  });

  const security = federationOpsService.security.verify(federationId);
  results.push({
    name: "federation_security",
    passed: security.trust_never_assumed && security.permission_mapping,
    detail: `${security.signed_agreements} agreements`,
  });

  const team = federationOpsService.teams.create({
    federation_id: federationId,
    name: "Outreach Coordination Team",
    members: [{ human_id: "usr-001", institution_id: institutionId, authority: "coordinator", mission_scope: "outreach", expires_at: null }],
  });
  results.push({
    name: "cross_institution_teams",
    passed: team.team.status === "active",
    detail: team.team.name,
  });

  const briefing = federationOpsService.ai.briefing(federationId);
  results.push({
    name: "ai_federation_advisor",
    passed: briefing.briefing.advisory_only && briefing.event === "federation.briefing.generated",
    detail: briefing.briefing.title,
  });

  const directory = federationOpsService.directory.build(federationId);
  results.push({
    name: "federation_directory",
    passed: directory.visibility_controlled && directory.institutions.length >= 1,
    detail: `${directory.institutions.length} institutions`,
  });

  const dashboard = federationOpsService.executiveDashboard(federationId);
  results.push({
    name: "executive_dashboard",
    passed: dashboard.advisory_only && !!dashboard.name,
    detail: dashboard.name,
  });

  const trace = explainFederationAction({
    federation_id: federationId,
    institution_id: institutionId,
    action_type: "join",
    agreement_id: signed.agreement.agreement_id,
    evidence_refs: ["charter-v1"],
  });
  results.push({
    name: "federation_traceability",
    passed: trace.includes(federationId) && trace.includes("Agreement"),
  });

  results.push({
    name: "federation_event_catalog",
    passed: FEDERATION_EVENT_CATALOG.length === 10,
    detail: `${FEDERATION_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW12TestsPassed(): boolean {
  return runOpsW12FederationTests().every((t) => t.passed);
}
