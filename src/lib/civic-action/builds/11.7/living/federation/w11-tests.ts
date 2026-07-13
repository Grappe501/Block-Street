/**
 * CAE-11.7-W11 — Federation tests
 */
import { federationRuntime } from "./services/federation-service";
import { seedFederationIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getFederationConstitution, LIX_FEDERATION_PRINCIPLE, REQUIRED_FEDERATION_SERVICES } from "./constitution";
import { checkLixW11Invariants } from "./invariants";
import { explainFederationAction } from "./traceability";
import { FEDERATION_EVENT_CATALOG } from "./events/catalog";

export type LixW11TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW11CertificationTests(): LixW11TestResult[] {
  seedFederationIfEmpty();
  const results: LixW11TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";
  const partnerId = "inst-county-civic-alliance";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getFederationConstitution();
  results.push({ name: "federation_principle", passed: constitution.governing_principle === LIX_FEDERATION_PRINCIPLE });

  results.push({
    name: "required_federation_services",
    passed: REQUIRED_FEDERATION_SERVICES.length === 12,
    detail: `${REQUIRED_FEDERATION_SERVICES.length} services`,
  });

  results.push({ name: "w11_invariants", passed: checkLixW11Invariants().every((i) => i.passed) });

  results.push({
    name: "federation_event_catalog",
    passed: FEDERATION_EVENT_CATALOG.length >= 9,
    detail: `${FEDERATION_EVENT_CATALOG.length} events`,
  });

  const dashboard = federationRuntime.federation.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "federation_dashboard",
    passed: dashboard.sovereign === true && dashboard.auto_share === false && dashboard.centralized_ownership === false,
    detail: dashboard.central_question,
  });

  const institutions = federationRuntime.institutions.ensureDefaults();
  results.push({
    name: "institution_registry",
    passed: institutions.length >= 2 && institutions.every((i) => i.sovereign === true),
    detail: `${institutions.length} institutions`,
  });

  const sovereignty = federationRuntime.sovereignty.verify(institutionId);
  results.push({
    name: "institutional_sovereignty",
    passed: sovereignty.sovereign === true && sovereignty.owns_all === true,
    detail: "sovereign",
  });

  const trust = federationRuntime.trust.update({
    institution_id: institutionId,
    partner_institution_id: partnerId,
    knowledge_sharing: true,
    mission_sharing: true,
    approved_by_human: true,
  });
  results.push({
    name: "trust_framework",
    passed: trust.contractual === true && trust.assumed === false,
    detail: trust.trust.trust_id,
  });

  let trustBlocked = false;
  try {
    federationRuntime.trust.update({
      institution_id: institutionId,
      partner_institution_id: "inst-untrusted",
      approved_by_human: false,
    });
  } catch {
    trustBlocked = true;
  }
  results.push({ name: "trust_requires_approval", passed: trustBlocked, detail: "approval required" });

  const coalition = federationRuntime.coalitions.create({
    name: "Regional Education Coalition",
    lead_institution_id: institutionId,
    member_institution_ids: [institutionId, partnerId],
    charter_summary: "Coordinate civic education across partner counties.",
    approved_by_human: true,
  });
  results.push({
    name: "coalition_creation",
    passed: coalition.sovereign_members === true,
    detail: coalition.coalition.coalition_id,
  });

  const intelligence = federationRuntime.coalitions.intelligence(institutionId);
  results.push({
    name: "coalition_intelligence",
    passed: intelligence.measurable === true && intelligence.overlapping_organizations >= 0,
    detail: `${intelligence.matching_grants.length} grants`,
  });

  const mission = federationRuntime.missions.share({
    title: "Ballot Education Initiative",
    mission_type: "ballot_initiative",
    lead_institution_id: institutionId,
    participating_institution_ids: [institutionId, partnerId],
    approved_by_human: true,
  });
  results.push({
    name: "shared_mission",
    passed: mission.ownership_retained === true && mission.mission.auto_shared === false,
    detail: mission.mission.mission_id,
  });

  const knowledge = federationRuntime.knowledge.publish({
    owner_institution_id: institutionId,
    publisher_institution_id: institutionId,
    title: "Volunteer Training Template",
    content_type: "template",
    summary: "Reusable volunteer facilitator training template for coalition partners.",
    visibility: "partners",
    approved_by_human: true,
  });
  results.push({
    name: "knowledge_publish",
    passed: knowledge.ownership_metadata === true && knowledge.auto_shared === false,
    detail: knowledge.knowledge.knowledge_id,
  });

  const revoked = federationRuntime.knowledge.revoke(knowledge.knowledge.knowledge_id, institutionId, true);
  results.push({
    name: "knowledge_revocation",
    passed: revoked.knowledge.revoked === true && revoked.revocable === true,
    detail: "revoked",
  });

  const resource = federationRuntime.resources.share({
    owner_institution_id: institutionId,
    resource_type: "training",
    description: "Shared facilitator training sessions for coalition partners",
    shared_with: [partnerId],
    authorized_by: humanId,
    approved_by_human: true,
  });
  results.push({
    name: "shared_resources",
    passed: resource.ownership_transferred === false,
    detail: resource.resource.resource_id,
  });

  const search = federationRuntime.search.search({
    human_id: humanId,
    institution_id: institutionId,
    query: "county",
    scope: "partners",
  });
  results.push({
    name: "federated_search",
    passed: search.every_result_has_owner && search.permission_respected,
    detail: `${search.results.length} results`,
  });

  const identity = federationRuntime.identity.bind({
    human_id: humanId,
    institution_id: partnerId,
    role_id: "role-advisor",
    permissions: ["federation.view"],
  });
  const leakCheck = federationRuntime.identity.verifyNoAuthorityLeak(humanId, institutionId, partnerId);
  results.push({
    name: "cross_institution_identity",
    passed: identity.authority_carried === false && leakCheck.authority_carried === false,
    detail: identity.identity.identity_id,
  });

  const governance = federationRuntime.governance.record({
    coalition_id: coalition.coalition.coalition_id,
    document_type: "mou",
    title: "Data Sharing MOU",
    summary: "Governed knowledge sharing between partner institutions.",
    approved_by: [institutionId, partnerId],
  });
  results.push({
    name: "federation_governance",
    passed: governance.historically_traceable === true,
    detail: governance.governance.governance_id,
  });

  const audit = federationRuntime.audit.record({
    object_type: "knowledge",
    object_id: knowledge.knowledge.knowledge_id,
    owner_institution_id: institutionId,
    publisher: institutionId,
    consumers: [partnerId],
    permissions: ["read"],
  });
  results.push({
    name: "federation_audit",
    passed: audit.provenance_preserved === true && audit.audit.revocation_available === true,
    detail: audit.audit.audit_id,
  });

  const security = federationRuntime.federation.security.check("auto_share_private");
  results.push({ name: "federation_security", passed: security.allowed === false, detail: "auto share blocked" });

  const trace = explainFederationAction({
    human_id: humanId,
    action_type: "knowledge_publish",
    institution_id: institutionId,
    owner_institution_id: institutionId,
  });
  results.push({
    name: "federation_traceability",
    passed: trace.includes("independent"),
    detail: "explainable",
  });

  results.push({
    name: "no_canonical_mutation",
    passed: dashboard.mutates_canonical === false,
    detail: "sovereignty preserved",
  });

  return results;
}

export function allLixW11TestsPassed(): boolean {
  return runLixW11CertificationTests().every((t) => t.passed);
}
