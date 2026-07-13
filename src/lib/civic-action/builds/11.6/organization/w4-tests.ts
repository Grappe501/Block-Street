/**
 * CAE-11.6-W4 — Organization tests
 */
import { organizationService } from "./services/organization-service";
import { seedOrganizationIfEmpty } from "./services/seed";
import { getOrganizationConstitution, OPS_ORGANIZATION_PRINCIPLE, REQUIRED_ORGANIZATION_SERVICES } from "./constitution";
import { checkOpsW4Invariants } from "./invariants";
import { explainHumanPlaceInInstitution } from "./traceability";
import { ORGANIZATION_EVENT_CATALOG } from "./events/catalog";

export type OpsW4TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW4OrganizationTests(): OpsW4TestResult[] {
  seedOrganizationIfEmpty();
  const results: OpsW4TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getOrganizationConstitution();
  results.push({
    name: "organization_principle",
    passed: constitution.governing_principle === OPS_ORGANIZATION_PRINCIPLE,
  });

  results.push({
    name: "required_organization_services",
    passed: REQUIRED_ORGANIZATION_SERVICES.length === 14,
    detail: `${REQUIRED_ORGANIZATION_SERVICES.length} services`,
  });

  results.push({
    name: "w4_invariants",
    passed: checkOpsW4Invariants().every((i) => i.passed),
  });

  const institution = organizationService.institutions.get(institutionId);
  results.push({
    name: "seeded_institution",
    passed: !!institution && institution.institution_id === institutionId,
    detail: institution.public_name,
  });

  const tree = organizationService.units.tree(institutionId);
  results.push({
    name: "organization_tree",
    passed: Array.isArray(tree.tree) && tree.tree.length >= 1,
    detail: `${tree.tree.length} root units`,
  });

  const memberships = organizationService.membership.list(institutionId);
  results.push({
    name: "organizational_membership",
    passed: memberships.length >= 1,
    detail: `${memberships.length} members`,
  });

  const authorities = organizationService.authority.list(institutionId);
  results.push({
    name: "authority_registry",
    passed: authorities.length >= 1 && authorities.every((a) => !!a.authority_scope),
    detail: `${authorities.length} authorities`,
  });

  const health = organizationService.health.compute(institutionId);
  results.push({
    name: "organization_health",
    passed: health.leadership_coverage >= 0,
    detail: `vacancies=${health.vacancies}`,
  });

  const trace = explainHumanPlaceInInstitution({
    human_id: "usr-001",
    institution_id: institutionId,
    organization_unit_id: "org-field-team",
    federation_id: institution.federation_id,
  });
  results.push({
    name: "human_place_traceability",
    passed: trace.includes("Federation") && trace.includes("Institution"),
    detail: trace.slice(0, 60),
  });

  const ai = organizationService.ai.analyze(institutionId);
  results.push({
    name: "ai_organization_advisory",
    passed: ai.advisory_only === true && ai.may_not_change_structure === true,
  });

  const fed = organizationService.federationDashboard.build(institution.federation_id!);
  results.push({
    name: "federation_dashboard",
    passed: fed.autonomy_preserved === true,
    detail: `${fed.institution_count} institutions`,
  });

  results.push({
    name: "organization_event_catalog",
    passed: ORGANIZATION_EVENT_CATALOG.length >= 11,
    detail: `${ORGANIZATION_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW4TestsPassed(): boolean {
  return runOpsW4OrganizationTests().every((t) => t.passed);
}
