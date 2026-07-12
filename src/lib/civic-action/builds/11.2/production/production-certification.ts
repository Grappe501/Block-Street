/**
 * CAE-11.2-W8 — Production certification levels
 */
import type { ProductionCertificationLevel, ProductionCertificationView } from "./contracts";
import { objectiveConfigurationReady } from "./config-validation";
import { objectiveBootstrapReady } from "./migration-bootstrap";
import { runObjectiveCertificationSuite } from "./certification-suite";
import { objectiveOperationsReady } from "./operational-readiness";
import { hasObjectiveApprovedSignOff } from "./sign-off-store";

const LEVEL_META: Record<ProductionCertificationLevel, { label: string; min_waves: number }> = {
  ready_for_pilot: { label: "Ready for Pilot", min_waves: 4 },
  ready_for_organization: { label: "Ready for Organization", min_waves: 6 },
  ready_for_multi_organization: { label: "Ready for Multi-Organization", min_waves: 7 },
  ready_for_statewide_deployment: { label: "Ready for Statewide Deployment", min_waves: 8 },
};

export function evaluateObjectiveProductionCertifications(institutionId: string): ProductionCertificationView[] {
  const cert = runObjectiveCertificationSuite();
  const wavesPassed = cert.waves.filter((w) => w.all_passed).length;
  const configOk = objectiveConfigurationReady();
  const bootstrapOk = objectiveBootstrapReady();
  const opsOk = objectiveOperationsReady();
  const suiteOk = cert.suite_passed;

  const levels: ProductionCertificationLevel[] = [
    "ready_for_pilot",
    "ready_for_organization",
    "ready_for_multi_organization",
    "ready_for_statewide_deployment",
  ];

  return levels.map((level) => {
    const meta = LEVEL_META[level];
    const blockers: string[] = [];
    const evidence: string[] = [];

    if (wavesPassed < meta.min_waves) {
      blockers.push(`Requires Waves 1–${meta.min_waves} certified (${wavesPassed}/${meta.min_waves} passed)`);
    } else {
      evidence.push(`Waves 1–${meta.min_waves} certification gates passed`);
    }

    if (level === "ready_for_pilot") {
      if (!configOk) blockers.push("Configuration validation incomplete");
      else evidence.push("Configuration validated");
    }

    if (level === "ready_for_organization") {
      if (!bootstrapOk) blockers.push("Institution bootstrap incomplete");
      else evidence.push("Bootstrap artifacts ready");
      if (!cert.waves.find((w) => w.wave === "W5")?.all_passed) blockers.push("W5 API layer not certified");
    }

    if (level === "ready_for_multi_organization") {
      if (!cert.waves.find((w) => w.wave === "W7")?.all_passed) blockers.push("W7 optimization layer not certified");
      if (!opsOk) blockers.push("Operational readiness incomplete");
      else evidence.push("Operations checklist passed");
    }

    if (level === "ready_for_statewide_deployment") {
      if (!suiteOk) blockers.push("Full certification suite not passed");
      if (!hasObjectiveApprovedSignOff(institutionId, "statewide")) {
        blockers.push("Executive statewide sign-off required");
      } else {
        evidence.push("Executive statewide sign-off recorded");
      }
      if (!hasObjectiveApprovedSignOff(institutionId, "release")) {
        blockers.push("Release approval sign-off required");
      }
    }

    return {
      level,
      label: meta.label,
      achieved: blockers.length === 0,
      blockers,
      evidence,
    };
  });
}

export function highestObjectiveAchievedLevel(institutionId: string): ProductionCertificationLevel | null {
  const levels = evaluateObjectiveProductionCertifications(institutionId);
  const achieved = levels.filter((l) => l.achieved);
  return achieved.length ? achieved[achieved.length - 1].level : null;
}
