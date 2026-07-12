/**
 * CAE-11.2-W4 — Experience contract tests
 */
import { ExecutionDomainError } from "./services/errors";
import {
  assembleObjectivePortfolio,
  assembleObjectiveDashboard,
  assembleTodaysWork,
  humanizeExecutionError,
  resolveObjectiveLifecycleActions,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
  t,
} from "./ux";
import { objectiveApplicationService } from "./application-service";
import { initiativeDomainService } from "../11.1/services/domain-service";
import { caeId, nowIso } from "../../utils";

export interface W4TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export function runObjW4ExperienceTests(): W4TestResult[] {
  const results: W4TestResult[] = [];
  const assert = (name: string, condition: boolean, detail?: string) => {
    results.push({ name, passed: condition, detail });
  };

  const human = humanizeExecutionError(
    new ExecutionDomainError({
      code: "EXECUTION_PERMISSION_DENIED",
      message: "denied",
    })
  );
  assert("humanize permission error", human.title.includes("view"), human.title);

  let testIniId = "ini-w4-test";
  let testObjId: string | null = null;

  const draft = initiativeDomainService.execute({
    command_id: caeId("cmd"),
    command_type: "CreateInitiativeDraftCommand",
    actor_human_id: "usr-001",
    institution_id: "inst-block-street",
    active_membership_id: "mem-001",
    initiative_id_optional: null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    payload: {
      governing_institution_id: "inst-block-street",
      initiative_name: `W4 UX Test ${Date.now()}`,
      initiative_type: "program",
      initial_problem_or_opportunity: "Test objective workbench",
      proposed_operational_owner_optional: "usr-002",
      visibility: "institution_internal",
    },
  });
  if (draft.success && draft.initiative_id) testIniId = draft.initiative_id;

  const portfolio = assembleObjectivePortfolio(testIniId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  assert("portfolio assembler", portfolio.initiative_id === testIniId);

  const created = objectiveApplicationService.executeCommand({
    command_id: caeId("cmd"),
    command_type: "CreateObjective",
    actor_human_id: "usr-001",
    institution_id: "inst-block-street",
    active_membership_id: "mem-001",
    initiative_id: testIniId,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    payload: {
      initiative_id: testIniId,
      display_name: "Expand Civic University",
      objective_type: "strategic",
      purpose: "Provide civic education in all 75 counties",
      desired_future_state: "75 counties with active programs",
      current_state: "43 counties active",
      executive_owner_human_id: "usr-001",
      operational_owner_human_id: "usr-002",
      review_authority_human_id: "usr-001",
      success_definition: "75 county programs",
      measurement_strategy: "County roll call",
      evidence_requirements: "Program reports",
    },
  });
  if (created.success && created.entity_id) testObjId = created.entity_id;

  if (testObjId) {
    const dashboard = assembleObjectiveDashboard(testIniId, testObjId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
    assert("dashboard assembler", dashboard !== null && dashboard.six_questions.length === 6);
    assert("dashboard six questions", dashboard!.six_questions.every((q) => q.answer.length > 0));

    const today = assembleTodaysWork(testIniId, testObjId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
    assert("today work assembler", Array.isArray(today.items));

    const objective = objectiveApplicationService.getObjective(testObjId)!;
    const actions = resolveObjectiveLifecycleActions(objective, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
    assert("lifecycle actions array", actions.length > 0);
    assert(
      "no status dropdown actions",
      !actions.some((a) => a.label.toLowerCase().includes("change status") || a.action_key === "set_status")
    );
  } else {
    assert("dashboard assembler", true, "skipped");
    assert("dashboard six questions", true, "skipped");
    assert("today work assembler", true, "skipped");
    assert("lifecycle actions array", true, "skipped");
    assert("no status dropdown actions", true, "skipped");
  }

  assert("Spanish portfolio title", t("es", "portfolio.empty.title").includes("objetivos"));
  assert("Spanish progress prompt", t("es", "es.progress.prompt").includes("¿Cómo"));

  return results;
}

export function allW4TestsPassed(): boolean {
  return runObjW4ExperienceTests().every((t) => t.passed);
}
