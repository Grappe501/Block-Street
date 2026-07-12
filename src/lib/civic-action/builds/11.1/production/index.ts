/**
 * CAE-11.1-W8 — Production readiness facade
 */
import { nowIso } from "../../../utils";
import { validateProductionConfiguration } from "./config-validation";
import { assessMigrationBootstrap } from "./migration-bootstrap";
import { runCertificationSuite } from "./certification-suite";
import { assessOperationalReadiness } from "./operational-readiness";
import { buildLaunchControl } from "./launch-control";
import { getOperatorTrainingModules, getSupportDocumentation } from "./operator-training";
import { getVerificationSchedules } from "./continuous-verification";
import { evaluateProductionCertifications, highestAchievedLevel } from "./production-certification";
import { recordExecutiveSignOff, listExecutiveSignOffs } from "./sign-off-store";
import { PRODUCTION_CONTRACT_VERSION } from "./contracts";

export const institutionalProductionService = {
  getReadinessOverview(institutionId: string) {
    return {
      contract_version: PRODUCTION_CONTRACT_VERSION,
      institution_id: institutionId,
      configuration: validateProductionConfiguration(),
      bootstrap: assessMigrationBootstrap(),
      operations: assessOperationalReadiness(),
      certification_suite: runCertificationSuite(),
      generated_at: nowIso(),
    };
  },

  getCertification: runCertificationSuite,
  getProductionLevels: evaluateProductionCertifications,
  getHighestLevel: highestAchievedLevel,
  getLaunchControl: buildLaunchControl,
  getTraining: getOperatorTrainingModules,
  getSupportDocs: getSupportDocumentation,
  getVerificationSchedules,
  recordSignOff: recordExecutiveSignOff,
  listSignOffs: listExecutiveSignOffs,

  getHealthSummary(institutionId: string) {
    const launch = buildLaunchControl(institutionId);
    const cert = runCertificationSuite();
    return {
      status: launch.decision === "go" ? "healthy" : launch.decision === "conditional_go" ? "attention" : "critical",
      launch_decision: launch.decision,
      checklist_complete_pct: launch.checklist_complete_pct,
      waves_certified: cert.waves.filter((w) => w.all_passed).length,
      waves_total: cert.waves.length,
      highest_certification: highestAchievedLevel(institutionId),
      generated_at: nowIso(),
    };
  },
};

export type InstitutionalProductionService = typeof institutionalProductionService;
