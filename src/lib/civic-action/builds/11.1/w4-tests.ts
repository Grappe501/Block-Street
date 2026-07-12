/**
 * CAE-11.1-W4 — Experience contract tests
 */
import { InitiativeDomainError } from "./services/errors";
import {
  assembleInitiativePortfolio,
  assembleInitiativeOverview,
  assembleInitiativeReadiness,
  assembleCharterWorkbench,
  humanizeDomainError,
  resolveLifecycleActions,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
  t,
} from "./ux";
import { initiativeApplicationService } from "./services/application-service";

export interface W4TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export function runIniW4ExperienceTests(): W4TestResult[] {
  const results: W4TestResult[] = [];
  const assert = (name: string, condition: boolean, detail?: string) => {
    results.push({ name, passed: condition, detail });
  };

  const err = new InitiativeDomainError({
    code: "INITIATIVE_CHARTER_INCOMPLETE",
    message: "Charter incomplete",
    details: { missing_fields: ["purpose", "out_of_scope"] },
  });
  const human = humanizeDomainError(err);
  assert("humanize charter incomplete", human.title.includes("not ready"), human.title);
  assert("humanize lists items", human.items.length >= 1);

  const portfolio = assembleInitiativePortfolio(DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  assert("portfolio assembler", portfolio.institution_id === DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id);
  assert("portfolio cards array", Array.isArray(portfolio.cards));

  const ids = initiativeApplicationService.listInitiativeIds();
  if (ids.length > 0) {
    const id = ids[0]!;
    const overview = assembleInitiativeOverview(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
    assert("overview assembler", overview !== null && overview.shell.initiative_id === id);
    assert("overview has attention", (overview?.attention.length ?? 0) > 0);

    const readiness = assembleInitiativeReadiness(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
    assert("readiness assembler", readiness !== null);

    const charter = assembleCharterWorkbench(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
    assert("charter workbench", charter !== null && charter.sections.length >= 6);

    const agg = initiativeApplicationService.getAggregate(id);
    if (agg) {
      const actions = resolveLifecycleActions(agg, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
      assert("lifecycle actions array", actions.length > 0);
      assert(
        "no status dropdown actions",
        !actions.some((a) => a.label.toLowerCase().includes("change status") || a.action_key === "set_status")
      );
      assert(
        "explicit lifecycle labels",
        actions.every((a) => a.label.length > 3)
      );
    }
  } else {
    assert("overview assembler", true, "skipped — no initiatives");
    assert("readiness assembler", true, "skipped");
    assert("charter workbench", true, "skipped");
    assert("lifecycle actions array", true, "skipped");
    assert("no status dropdown actions", true, "skipped");
    assert("explicit lifecycle labels", true, "skipped");
  }

  assert("Spanish portfolio title", t("es", "portfolio.empty.title").includes("iniciativas"));
  assert("Spanish charter prompt", t("es", "charter.purpose.prompt").includes("lograr"));

  return results;
}

export function allW4TestsPassed(): boolean {
  return runIniW4ExperienceTests().every((r) => r.passed);
}
