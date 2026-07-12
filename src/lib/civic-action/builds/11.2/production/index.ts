/**
 * CAE-11.2-W8 — Production readiness facade
 */
import { nowIso } from "../../../utils";
import { validateObjectiveProductionConfiguration } from "./config-validation";
import { assessObjectiveMigrationBootstrap } from "./migration-bootstrap";
import { runObjectiveCertificationSuite } from "./certification-suite";
import { assessObjectiveOperationalReadiness } from "./operational-readiness";
import { buildObjectiveLaunchControl } from "./launch-control";
import { getObjectiveOperatorTrainingModules, getObjectiveSupportDocumentation } from "./operator-training";
import { getObjectiveVerificationSchedules } from "./continuous-verification";
import { evaluateObjectiveProductionCertifications, highestObjectiveAchievedLevel } from "./production-certification";
import { recordObjectiveExecutiveSignOff, listObjectiveExecutiveSignOffs } from "./sign-off-store";
import { OBJECTIVE_PRODUCTION_CONTRACT_VERSION } from "./contracts";

export const objectiveProductionService = {
  getReadinessOverview(institutionId: string) {
    return {
      contract_version: OBJECTIVE_PRODUCTION_CONTRACT_VERSION,
      institution_id: institutionId,
      configuration: validateObjectiveProductionConfiguration(),
      bootstrap: assessObjectiveMigrationBootstrap(),
      operations: assessObjectiveOperationalReadiness(),
      certification_suite: runObjectiveCertificationSuite(),
      generated_at: nowIso(),
    };
  },

  getCertification: runObjectiveCertificationSuite,
  getProductionLevels: evaluateObjectiveProductionCertifications,
  getHighestLevel: highestObjectiveAchievedLevel,
  getLaunchControl: buildObjectiveLaunchControl,
  getTraining: getObjectiveOperatorTrainingModules,
  getSupportDocs: getObjectiveSupportDocumentation,
  getVerificationSchedules: getObjectiveVerificationSchedules,
  recordSignOff: recordObjectiveExecutiveSignOff,
  listSignOffs: listObjectiveExecutiveSignOffs,

  getHealthSummary(institutionId: string) {
    const launch = buildObjectiveLaunchControl(institutionId);
    const cert = runObjectiveCertificationSuite();
    return {
      status: launch.decision === "go" ? "healthy" : launch.decision === "conditional_go" ? "attention" : "critical",
      launch_decision: launch.decision,
      checklist_complete_pct: launch.checklist_complete_pct,
      waves_certified: cert.waves.filter((w) => w.all_passed).length,
      waves_total: cert.waves.length,
      highest_certification: highestObjectiveAchievedLevel(institutionId),
      generated_at: nowIso(),
    };
  },
};

export type ObjectiveProductionService = typeof objectiveProductionService;
