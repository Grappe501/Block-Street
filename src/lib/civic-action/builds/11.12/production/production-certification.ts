/**
 * CAE-11.12-W8 — Production certification levels
 */
import type { ProductionCertificationLevel, ProductionCertificationView } from "./contracts";
import { knowledgeConfigurationReady } from "./config-validation";
import { knowledgeBootstrapReady } from "./migration-bootstrap";
import { runKnowledgeCertificationSuite } from "./certification-suite";
import { knowledgeOperationsReady } from "./operational-readiness";
import { criticalGatesPassed } from "./certification-registry";
import { hasKnowledgeApprovedSignOff } from "./sign-off-store";

const LEVEL_META: Record<ProductionCertificationLevel, { label: string; min_waves: number }> = {
  ready_for_pilot: { label: "Ready for Pilot", min_waves: 4 },
  ready_for_limited_production: { label: "Ready for Limited Production", min_waves: 7 },
  ready_for_organization: { label: "Ready for Organization", min_waves: 7 },
  ready_for_general_availability: { label: "Ready for General Availability", min_waves: 8 },
};

export function evaluateKnowledgeProductionCertifications(
  institutionId: string
): ProductionCertificationView[] {
  const cert = runKnowledgeCertificationSuite();
  const wavesPassed = cert.waves.filter((w) => w.all_passed).length;
  const configOk = knowledgeConfigurationReady();
  const bootstrapOk = knowledgeBootstrapReady();
  const opsOk = knowledgeOperationsReady();
  const suiteOk = cert.suite_passed;
  const gatesOk = criticalGatesPassed();

  const levels: ProductionCertificationLevel[] = [
    "ready_for_pilot",
    "ready_for_limited_production",
    "ready_for_organization",
    "ready_for_general_availability",
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

    if (level === "ready_for_limited_production") {
      if (!bootstrapOk) blockers.push("Institution bootstrap incomplete");
      else evidence.push("Bootstrap artifacts ready");
      if (!cert.waves.find((w) => w.wave === "W4")?.all_passed) blockers.push("W4 Human experience not certified");
      if (!hasKnowledgeApprovedSignOff(institutionId, "pilot")) {
        blockers.push("Pilot executive sign-off required");
      }
    }

    if (level === "ready_for_organization") {
      if (!cert.waves.find((w) => w.wave === "W7")?.all_passed) blockers.push("W7 evolution layer not certified");
      if (!opsOk) blockers.push("Operational readiness incomplete");
      else evidence.push("Operations checklist passed");
    }

    if (level === "ready_for_general_availability") {
      if (!suiteOk) blockers.push("Full certification suite not passed");
      if (!gatesOk) blockers.push("Critical certification gates not passed");
      if (!hasKnowledgeApprovedSignOff(institutionId, "general_availability")) {
        blockers.push("Executive general availability sign-off required");
      }
      if (!hasKnowledgeApprovedSignOff(institutionId, "release")) {
        blockers.push("Release approval sign-off required");
      }
    }

    return { level, label: meta.label, achieved: blockers.length === 0, blockers, evidence };
  });
}

export function highestKnowledgeAchievedLevel(institutionId: string): ProductionCertificationLevel | null {
  const levels = evaluateKnowledgeProductionCertifications(institutionId);
  const achieved = levels.filter((l) => l.achieved);
  return achieved.length ? achieved[achieved.length - 1].level : null;
}
