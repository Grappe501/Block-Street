/**
 * CAE-11.7-W8 — Production readiness facade
 */
import { nowIso } from "../../../utils";
import { validateCommunicationProductionConfiguration } from "./config-validation";
import { assessCommunicationMigrationBootstrap } from "./migration-bootstrap";
import { runCommunicationCertificationSuite } from "./certification-suite";
import { assessCommunicationOperationalReadiness } from "./operational-readiness";
import { buildCommunicationLaunchControl } from "./launch-control";
import { getCommunicationOperatorTrainingModules, getCommunicationSupportDocumentation } from "./operator-training";
import { getCommunicationVerificationSchedules } from "./continuous-verification";
import {
  evaluateCommunicationProductionCertifications,
  highestCommunicationAchievedLevel,
} from "./production-certification";
import { recordCommunicationExecutiveSignOff, listCommunicationExecutiveSignOffs } from "./sign-off-store";
import { COMMUNICATION_PRODUCTION_CONTRACT_VERSION } from "./contracts";

export const communicationProductionService = {
  getReadinessOverview(institutionId: string) {
    return {
      contract_version: COMMUNICATION_PRODUCTION_CONTRACT_VERSION,
      institution_id: institutionId,
      configuration: validateCommunicationProductionConfiguration(),
      bootstrap: assessCommunicationMigrationBootstrap(),
      operations: assessCommunicationOperationalReadiness(),
      certification_suite: runCommunicationCertificationSuite(),
      generated_at: nowIso(),
    };
  },

  getCertification: runCommunicationCertificationSuite,
  getProductionLevels: evaluateCommunicationProductionCertifications,
  getHighestLevel: highestCommunicationAchievedLevel,
  getLaunchControl: buildCommunicationLaunchControl,
  getTraining: getCommunicationOperatorTrainingModules,
  getSupportDocs: getCommunicationSupportDocumentation,
  getVerificationSchedules: getCommunicationVerificationSchedules,
  recordSignOff: recordCommunicationExecutiveSignOff,
  listSignOffs: listCommunicationExecutiveSignOffs,

  getHealthSummary(institutionId: string) {
    const launch = buildCommunicationLaunchControl(institutionId);
    const cert = runCommunicationCertificationSuite();
    return {
      status: launch.decision === "go" ? "healthy" : launch.decision === "conditional_go" ? "attention" : "critical",
      launch_decision: launch.decision,
      checklist_complete_pct: launch.checklist_complete_pct,
      waves_certified: cert.waves.filter((w) => w.all_passed).length,
      waves_total: cert.waves.length,
      highest_certification: highestCommunicationAchievedLevel(institutionId),
      generated_at: nowIso(),
    };
  },
};

export type CommunicationProductionService = typeof communicationProductionService;
