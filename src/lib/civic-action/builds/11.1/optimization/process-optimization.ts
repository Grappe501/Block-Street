/**
 * CAE-11.1-W7 — Process optimization recommendations
 */
import type { OptimizationEvidence, ProcessOptimizationView } from "./contracts";
import { initiativeApplicationService } from "../services/application-service";

const BASELINE_PROCESSES: Omit<ProcessOptimizationView, "evidence">[] = [
  {
    process_id: "volunteer-onboarding",
    process_name: "Volunteer onboarding",
    current_steps: 14,
    current_avg_days: 17,
    suggested_steps: 8,
    suggested_avg_days: 5,
    confidence: "emerging",
  },
  {
    process_id: "initiative-approval",
    process_name: "Initiative approval",
    current_steps: 9,
    current_avg_days: 21,
    suggested_steps: 6,
    suggested_avg_days: 10,
    confidence: "observed",
  },
];

export function analyzeProcessOptimization(institutionId: string): ProcessOptimizationView[] {
  const pending = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((a) => a && a.initiative.institution_id === institutionId && a.initiative.status === "approval_pending").length;

  return BASELINE_PROCESSES.map((p) => {
    const evidence: OptimizationEvidence[] = [
      { signal_id: p.process_id, source: "process_baseline", summary: `Current ${p.current_steps} steps, ~${p.current_avg_days} days` },
    ];
    if (p.process_id === "initiative-approval" && pending >= 2) {
      evidence.push({
        signal_id: "approval-queue",
        source: "initiative_portfolio",
        summary: `${pending} Initiatives awaiting approval`,
      });
    }
    return { ...p, evidence };
  });
}
