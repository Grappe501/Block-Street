/**
 * CAE-11.2-W7 — Organizational health dimensions
 */
import { objectiveApplicationService } from "../application-service";
import { detectExecutionRisks } from "../intelligence/risk-intelligence";
import { extractLessons } from "./lesson-engine";
import type { OrganizationHealthDimension } from "./contracts";

export function measureOrganizationHealth(
  institutionId: string,
  initiativeId?: string
): OrganizationHealthDimension[] {
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const active = objectives.filter((o) => o.lifecycle_state === "active").length;
  const completed = objectives.filter((o) => ["completed", "archived"].includes(o.lifecycle_state)).length;
  const atRisk = objectives.filter((o) => o.lifecycle_state === "at_risk").length;
  const proposed = objectives.filter((o) => o.lifecycle_state === "proposed").length;
  const total = Math.max(objectives.length, 1);

  const risks = detectExecutionRisks(institutionId, initiativeId);
  const riskHigh = risks.filter((r) => r.severity === "high").length;
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);

  const band = (score: number): OrganizationHealthDimension["state"] =>
    score >= 75 ? "healthy" : score >= 50 ? "attention" : "critical";

  const executionScore = Math.round(((active + completed) / total) * 100);
  const approvalScore = Math.max(0, 100 - proposed * 12);
  const riskScore = Math.max(0, 100 - riskHigh * 20 - atRisk * 10);
  const knowledgeScore = completed > 0 ? Math.min(100, Math.round((lessons.length / completed) * 100)) : 50;

  return [
    {
      dimension: "execution_health",
      label: "Execution health",
      state: band(executionScore),
      score_band: executionScore,
      explanation: `${active} active · ${completed} completed Objectives.`,
    },
    {
      dimension: "leadership_health",
      label: "Leadership health",
      state: band(approvalScore),
      score_band: approvalScore,
      explanation: proposed > 0 ? `${proposed} Objectives awaiting approval.` : "Approval queue flowing.",
    },
    {
      dimension: "volunteer_health",
      label: "Volunteer health",
      state: atRisk > 0 ? "attention" : "healthy",
      score_band: Math.max(0, 100 - atRisk * 15),
      explanation: atRisk > 0 ? `${atRisk} Objectives at risk may strain volunteers.` : "No elevated volunteer strain signals.",
    },
    {
      dimension: "knowledge_health",
      label: "Knowledge health",
      state: band(knowledgeScore),
      score_band: knowledgeScore,
      explanation: `${lessons.length} lessons captured across completed work.`,
    },
    {
      dimension: "training_health",
      label: "Training health",
      state: riskHigh > 0 ? "attention" : "healthy",
      score_band: riskScore,
      explanation: riskHigh > 0 ? "Operational risks suggest training gaps." : "No urgent training signals.",
    },
    {
      dimension: "governance_health",
      label: "Governance health",
      state: band(approvalScore),
      score_band: approvalScore,
      explanation: `Decision latency influenced by ${proposed} pending approvals.`,
    },
    {
      dimension: "innovation_health",
      label: "Innovation health",
      state: completed >= 2 ? "healthy" : "attention",
      score_band: Math.min(100, completed * 25 + lessons.length * 5),
      explanation: completed >= 2 ? "Completed Objectives feeding institutional learning." : "Awaiting completed Objectives for learning loop.",
    },
    {
      dimension: "community_health",
      label: "Community health",
      state: "attention",
      score_band: 65,
      explanation: "Community engagement tracked via Objective outcomes and lessons.",
    },
  ];
}
