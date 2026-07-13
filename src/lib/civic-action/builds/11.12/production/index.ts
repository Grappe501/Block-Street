/**
 * CAE-11.12-W8 — Production readiness facade
 */
import { nowIso } from "../../../utils";
import { validateKnowledgeProductionConfiguration } from "./config-validation";
import { assessKnowledgeMigrationBootstrap } from "./migration-bootstrap";
import { runKnowledgeCertificationSuite } from "./certification-suite";
import { assessKnowledgeOperationalReadiness } from "./operational-readiness";
import { buildKnowledgeLaunchControl } from "./launch-control";
import { getKnowledgeOperatorTrainingModules, getKnowledgeSupportDocumentation } from "./operator-training";
import { getKnowledgeVerificationSchedules, runContinuousVerification } from "./continuous-verification";
import {
  evaluateKnowledgeProductionCertifications,
  highestKnowledgeAchievedLevel,
} from "./production-certification";
import { recordKnowledgeExecutiveSignOff, listKnowledgeExecutiveSignOffs } from "./sign-off-store";
import { KNOWLEDGE_PRODUCTION_CONTRACT_VERSION } from "./contracts";
import { getCertificationStatus, createCertificationRun, startCertificationRun, recordCertificationGateResults, completeCertificationRun, listCertificationRuns, getCertificationRun, getEvidenceBundle } from "./certification-run";
import { buildGoNoGoDashboard, issueProductionCertificate } from "./go-no-go";
import { buildKnowledgeReleaseIdentity } from "./release-identity";
import { runKnowledgeCertificationGates } from "./certification-registry";
import { runKnowledgeTraceabilityCertification } from "./traceability-certification";

export const knowledgeProductionService = {
  getReadinessOverview(institutionId: string) {
    return {
      contract_version: KNOWLEDGE_PRODUCTION_CONTRACT_VERSION,
      institution_id: institutionId,
      configuration: validateKnowledgeProductionConfiguration(),
      bootstrap: assessKnowledgeMigrationBootstrap(),
      operations: assessKnowledgeOperationalReadiness(),
      certification_suite: runKnowledgeCertificationSuite(),
      traceability: runKnowledgeTraceabilityCertification(),
      gates: runKnowledgeCertificationGates(),
      generated_at: nowIso(),
    };
  },

  getCertification: runKnowledgeCertificationSuite,
  getCertificationStatus,
  getProductionLevels: evaluateKnowledgeProductionCertifications,
  getHighestLevel: highestKnowledgeAchievedLevel,
  getLaunchControl: buildKnowledgeLaunchControl,
  getGoNoGo: buildGoNoGoDashboard,
  getTraining: getKnowledgeOperatorTrainingModules,
  getSupportDocs: getKnowledgeSupportDocumentation,
  getVerificationSchedules: getKnowledgeVerificationSchedules,
  runContinuousVerification,
  recordSignOff: recordKnowledgeExecutiveSignOff,
  listSignOffs: listKnowledgeExecutiveSignOffs,
  getReleaseIdentity: buildKnowledgeReleaseIdentity,
  createCertificationRun,
  startCertificationRun,
  recordCertificationGateResults,
  completeCertificationRun,
  listCertificationRuns,
  getCertificationRun,
  getEvidenceBundle,
  issueProductionCertificate,

  getHealthSummary(institutionId: string) {
    const launch = buildKnowledgeLaunchControl(institutionId);
    const cert = runKnowledgeCertificationSuite();
    return {
      status: launch.decision === "go" ? "healthy" : launch.decision === "conditional_go" ? "attention" : "critical",
      launch_decision: launch.decision,
      launch_recommendation: launch.launch_recommendation,
      checklist_complete_pct: launch.checklist_complete_pct,
      waves_certified: cert.waves.filter((w) => w.all_passed).length,
      waves_total: cert.waves.length,
      highest_certification: highestKnowledgeAchievedLevel(institutionId),
      generated_at: nowIso(),
    };
  },
};

export type KnowledgeProductionService = typeof knowledgeProductionService;
