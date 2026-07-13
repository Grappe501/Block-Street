/**
 * CAE-11.6-W3 — Workforce tests
 */
import { workforceManagementService } from "./services/workforce-service";
import { seedWorkforceIfEmpty } from "./services/seed";
import { getWorkforceConstitution, OPS_WORKFORCE_PRINCIPLE, REQUIRED_WORKFORCE_SERVICES } from "./constitution";
import { checkOpsW3Invariants } from "./invariants";
import { validateAssignmentTraceability } from "./traceability";
import { WORKFORCE_EVENT_CATALOG } from "./events/catalog";

export type OpsW3TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW3WorkforceTests(): OpsW3TestResult[] {
  seedWorkforceIfEmpty();
  const results: OpsW3TestResult[] = [];
  const institutionId = "inst-block-street";
  const humanId = "usr-001";

  const constitution = getWorkforceConstitution();
  results.push({
    name: "workforce_principle",
    passed: constitution.governing_principle === OPS_WORKFORCE_PRINCIPLE,
  });

  results.push({
    name: "required_workforce_services",
    passed: REQUIRED_WORKFORCE_SERVICES.length === 15,
    detail: `${REQUIRED_WORKFORCE_SERVICES.length} services`,
  });

  results.push({
    name: "w3_invariants",
    passed: checkOpsW3Invariants().every((i) => i.passed),
  });

  const profile = workforceManagementService.workforce.getProfile(humanId);
  results.push({
    name: "work_profile_exists",
    passed: !!profile && profile.human_id === humanId,
    detail: profile.primary_role,
  });

  const assignments = workforceManagementService.assignments.list(institutionId, humanId);
  results.push({
    name: "mission_assignments",
    passed: assignments.length >= 1 && validateAssignmentTraceability(assignments[0]),
    detail: `${assignments.length} assignments`,
  });

  const capacity = workforceManagementService.capacity.compute(humanId, institutionId);
  results.push({
    name: "capacity_engine",
    passed: !!capacity.snapshot.workload_level,
    detail: capacity.snapshot.workload_level,
  });

  const personal = workforceManagementService.workforce.getPersonalWorkCenter(humanId, institutionId);
  results.push({
    name: "personal_work_center",
    passed: personal.question.includes("What should I work on next"),
    detail: `${personal.assigned_missions.length} missions`,
  });

  const team = workforceManagementService.teamDashboard.build("Field Operations", institutionId);
  results.push({
    name: "team_dashboard",
    passed: team.member_count >= 1,
    detail: `team=${team.team}`,
  });

  const executive = workforceManagementService.executiveDashboard.build(institutionId);
  results.push({
    name: "executive_workforce_dashboard",
    passed: executive.no_human_ranking === true,
    detail: `missions=${executive.mission_staffing}`,
  });

  const ai = workforceManagementService.ai.recommendAssignment({
    mission_id: "opm-volunteer-training-001",
    institution_id: institutionId,
    required_competencies: ["volunteer-training"],
    required_certifications: ["volunteer-orientation"],
  });
  results.push({
    name: "ai_advisory_recommendations",
    passed: ai.advisory_only === true && ai.requires_human_approval === true && ai.may_not_silently_assign === true,
    detail: `${ai.recommendations.length} recommendations`,
  });

  const burnout = workforceManagementService.burnout.evaluate(humanId, institutionId);
  results.push({
    name: "burnout_private_advisory",
    passed: burnout.advisory_only === true && burnout.private === true,
  });

  results.push({
    name: "workforce_event_catalog",
    passed: WORKFORCE_EVENT_CATALOG.length >= 10,
    detail: `${WORKFORCE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW3TestsPassed(): boolean {
  return runOpsW3WorkforceTests().every((t) => t.passed);
}
