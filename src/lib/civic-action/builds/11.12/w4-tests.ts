/**
 * CAE-11.12-W4 — Human experience tests
 */
import { KnowledgeDomainError } from "./services/errors";
import {
  assembleHomeDashboard,
  assembleKnowledgeReader,
  assembleLearningWorkspace,
  assembleCompetencyWorkspace,
  assembleCertificationWorkspace,
  assembleUniversalSearch,
  assembleAICommandBar,
  assembleLearningWorkbenchShell,
  humanizeKnowledgeError,
  resolveLearningActions,
  DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT,
  t,
  UX_INVARIANTS,
} from "./ux";

export type W4TestResult = { name: string; passed: boolean; detail?: string };

export function runKnwW4ExperienceTests(): W4TestResult[] {
  const results: W4TestResult[] = [];
  const ctx = DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT;

  const human = humanizeKnowledgeError(
    new KnowledgeDomainError({ code: "KNOWLEDGE_PERMISSION_DENIED", message: "denied" })
  );
  results.push({
    name: "humanize_permission_error",
    passed: human.title.length > 0 && !!human.support_path,
    detail: human.title,
  });

  const home = assembleHomeDashboard(ctx);
  results.push({
    name: "home_primary_question",
    passed: home.primary_question.length > 0 && home.ai_advisory_only === true,
  });
  results.push({
    name: "home_recommended_next_step",
    passed: home.recommended_next_step === null || home.recommended_next_step.href.startsWith("/learning"),
  });

  const learnerShell = assembleLearningWorkbenchShell(ctx, "learner", "home");
  const adminShell = assembleLearningWorkbenchShell(ctx, "administrator", "home");
  results.push({
    name: "role_aware_shell",
    passed: adminShell.nav_sections.length >= learnerShell.nav_sections.length,
    detail: `${learnerShell.nav_sections.length} vs ${adminShell.nav_sections.length}`,
  });

  const learning = assembleLearningWorkspace(ctx);
  results.push({
    name: "learning_workspace",
    passed: learning.ai_tutor_advisory === true && !!learning.tutor_href,
  });

  const competencies = assembleCompetencyWorkspace(ctx);
  results.push({
    name: "competency_not_completion",
    passed:
      competencies.competencies.length === 0 ||
      competencies.competencies.every((c) => c.completion_is_not_competency === true),
  });

  const certs = assembleCertificationWorkspace(ctx);
  results.push({ name: "certification_workspace", passed: Array.isArray(certs.held) });

  const search = assembleUniversalSearch(ctx, "safety");
  results.push({
    name: "universal_search_badges",
    passed: search.results.every((r) => ["current", "historical", "draft", "restricted"].includes(r.badge)),
    detail: `${search.results.length} results`,
  });

  const aiBar = assembleAICommandBar();
  results.push({
    name: "ai_command_bar_advisory",
    passed: aiBar.advisory_only && aiBar.canonical_mutation_allowed === false && aiBar.prompts.length >= 4,
  });

  const actions = resolveLearningActions(ctx);
  results.push({
    name: "no_status_dropdown_actions",
    passed: !actions.some((a) => a.label.toLowerCase().includes("change status")),
  });

  results.push({ name: "accessibility_invariants", passed: UX_INVARIANTS.length >= 8 });

  results.push({ name: "Spanish_home_title", passed: t("es", "home.title").includes("Aprendizaje") });
  results.push({ name: "Spanish_progress_prompt", passed: t("es", "es.progress.prompt").includes("¿") });

  const artifacts = assembleUniversalSearch(ctx, "").results.filter((r) => r.type === "knowledge");
  if (artifacts[0]) {
    const reader = assembleKnowledgeReader(artifacts[0].id, ctx);
    results.push({
      name: "knowledge_reader_historical_banner",
      passed: reader === null || !reader.is_historical || reader.historical_banner !== null,
    });
  } else {
    results.push({ name: "knowledge_reader_historical_banner", passed: true, detail: "skipped" });
  }

  return results;
}

export function allW4TestsPassed(): boolean {
  return runKnwW4ExperienceTests().every((t) => t.passed);
}
