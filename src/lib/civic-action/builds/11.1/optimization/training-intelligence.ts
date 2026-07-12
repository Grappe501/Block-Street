/**
 * CAE-11.1-W7 — Training intelligence
 */
import { detectOperationalRisks } from "../intelligence/risk-intelligence";
import { analyzeInstitutionCapacity } from "../intelligence/capacity-intelligence";

export function identifyTrainingNeeds(institutionId: string): string[] {
  const needs: string[] = [];
  const risks = detectOperationalRisks(institutionId);

  if (risks.some((r) => r.risk_type === "charter_incomplete")) {
    needs.push("Charter authoring workshop for Initiative owners — repeated incomplete charters detected.");
  }
  if (risks.some((r) => r.risk_type === "owner_required")) {
    needs.push("Operational owner onboarding — owners required on active Initiatives.");
  }

  const overloaded = analyzeInstitutionCapacity(institutionId).filter((c) => c.overload_band === "high");
  if (overloaded.length > 0) {
    needs.push(`Delegation training for ${overloaded.map((o) => o.human_label).join(", ")} — elevated workload.`);
  }

  const approvalPending = risks.filter((r) => r.risk_type === "review_overdue");
  if (approvalPending.length > 0) {
    needs.push("Approver rhythm training — overdue reviews suggest calendar or authority confusion.");
  }

  if (needs.length === 0) {
    needs.push("No urgent training gaps detected — continue monitoring volunteer onboarding questions.");
  }

  return needs;
}
