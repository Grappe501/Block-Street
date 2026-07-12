/**
 * CAE-11.1-W8 — Production readiness tests
 */
import { existsSync } from "fs";
import { join } from "path";
import { institutionalProductionService } from "./production";
import { configurationReady } from "./production/config-validation";
import { runCertificationSuite } from "./production/certification-suite";
import { recordExecutiveSignOff } from "./production/sign-off-store";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

const ROOT = process.cwd();

export type W8TestResult = { name: string; passed: boolean; detail?: string };

export function runIniW8ProductionTests(): W8TestResult[] {
  const results: W8TestResult[] = [];
  const institutionId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.actor_human_id;

  results.push({
    name: "configuration_validation",
    passed: configurationReady(),
    detail: `${institutionalProductionService.getReadinessOverview(institutionId).configuration.length} checks`,
  });

  const cert = runCertificationSuite();
  results.push({
    name: "certification_suite_runs",
    passed: cert.waves.length === 7,
    detail: `${cert.waves.filter((w) => w.all_passed).length}/7 waves passed`,
  });

  const launch = institutionalProductionService.getLaunchControl(institutionId);
  results.push({
    name: "launch_control_generated",
    passed: !!launch.launch_id && launch.rollback_available === true,
    detail: `decision=${launch.decision}`,
  });

  const levels = institutionalProductionService.getProductionLevels(institutionId);
  results.push({
    name: "production_certification_levels",
    passed: levels.length === 4,
    detail: levels.filter((l) => l.achieved).map((l) => l.level).join(", ") || "none yet",
  });

  const health = institutionalProductionService.getHealthSummary(institutionId);
  results.push({
    name: "health_summary",
    passed: !!health.status && health.waves_total === 7,
  });

  const training = institutionalProductionService.getTraining();
  results.push({
    name: "operator_training_modules",
    passed: training.length >= 5,
    detail: `${training.length} modules`,
  });

  const schedules = institutionalProductionService.getVerificationSchedules();
  results.push({
    name: "continuous_verification",
    passed: schedules.length >= 5,
    detail: schedules.map((s) => s.cadence).join(", "),
  });

  recordExecutiveSignOff({
    sign_off_type: "release",
    actor_human_id: actorId,
    institution_id: institutionId,
    decision: "approved",
    notes_optional: "W8 test sign-off",
  });
  results.push({
    name: "executive_sign_off_recorded",
    passed: institutionalProductionService.listSignOffs(institutionId).length > 0,
  });

  const w8Docs = [
    "docs/phase-11/11.1-initiatives/08_PRODUCTION_READINESS.md",
    "docs/phase-11/11.1-initiatives/WAVE_8_CERTIFICATION.md",
    "docs/phase-11/11.1-initiatives/BUILD_11.1_COMPLETE.md",
  ];
  results.push({
    name: "w8_documentation",
    passed: w8Docs.every((p) => existsSync(join(ROOT, p))),
    detail: `${w8Docs.length} docs`,
  });

  results.push({
    name: "certification_suite_passed",
    passed: cert.suite_passed,
    detail: cert.suite_passed ? "W1–W7 suite passed" : "wave gaps remain",
  });

  return results;
}

export function allW8TestsPassed(): boolean {
  return runIniW8ProductionTests().every((t) => t.passed);
}
