/**
 * CAE-11.1-W7 — Organizational health dimensions
 */
import { initiativeApplicationService } from "../services/application-service";
import { detectOperationalRisks } from "../intelligence/risk-intelligence";
import type { OrganizationHealthDimension } from "./contracts";

export function measureOrganizationHealth(institutionId: string): OrganizationHealthDimension[] {
  const ids = initiativeApplicationService.listInitiativeIds();
  let active = 0;
  let completed = 0;
  let blocked = 0;

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (agg.initiative.status === "active") active++;
    if (agg.initiative.status === "completed") completed++;
    if (["owner_required", "approval_pending", "charter_required"].includes(agg.initiative.status)) blocked++;
  }

  const risks = detectOperationalRisks(institutionId);
  const riskHigh = risks.filter((r) => r.severity === "high").length;

  const band = (score: number): OrganizationHealthDimension["state"] =>
    score >= 75 ? "healthy" : score >= 50 ? "attention" : "critical";

  const total = Math.max(ids.length, 1);
  const executionScore = Math.round(((active + completed) / total) * 100);
  const approvalScore = Math.max(0, 100 - blocked * 15);
  const riskScore = Math.max(0, 100 - riskHigh * 25);

  return [
    {
      dimension: "leadership_health",
      label: "Leadership health",
      state: band(approvalScore),
      score_band: approvalScore,
      explanation: blocked > 0 ? `${blocked} Initiatives blocked on governance gates.` : "Governance gates flowing.",
    },
    {
      dimension: "volunteer_health",
      label: "Volunteer health",
      state: "attention",
      score_band: 65,
      explanation: "Volunteer onboarding process under optimization review.",
    },
    {
      dimension: "approval_health",
      label: "Approval health",
      state: band(approvalScore),
      score_band: approvalScore,
      explanation: `Approval queue pressure from ${blocked} blocked Initiatives.`,
    },
    {
      dimension: "training_health",
      label: "Training health",
      state: riskHigh > 0 ? "attention" : "healthy",
      score_band: riskScore,
      explanation: riskHigh > 0 ? "Operational risks suggest training gaps." : "No urgent training signals.",
    },
    {
      dimension: "knowledge_health",
      label: "Knowledge health",
      state: completed > 0 ? "healthy" : "attention",
      score_band: completed > 0 ? 80 : 55,
      explanation: completed > 0 ? `${completed} completed Initiatives feed institutional memory.` : "Awaiting completed Initiatives for memory.",
    },
    {
      dimension: "innovation_health",
      label: "Innovation health",
      state: band(executionScore),
      score_band: executionScore,
      explanation: `${active} active Initiatives in execution.`,
    },
    {
      dimension: "community_trust",
      label: "Community trust",
      state: "attention",
      score_band: 70,
      explanation: "Community intelligence signals monitored — see community panel.",
    },
    {
      dimension: "institution_growth",
      label: "Institution growth",
      state: total >= 5 ? "healthy" : "attention",
      score_band: Math.min(100, total * 15),
      explanation: `${total} Initiatives in portfolio.`,
    },
  ];
}
