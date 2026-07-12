/**
 * CAE-11.2-W6 — Execution risk intelligence (alerts only)
 */
import { caeId } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { ExecutionRiskSignal } from "./contracts";
import { scoreToConfidence } from "./utils";

export function detectExecutionRisks(institutionId: string, initiativeId?: string): ExecutionRiskSignal[] {
  const risks: ExecutionRiskSignal[] = [];
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  for (const objective of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(objective.canonical_id);
    if (!bundle) continue;

    if (objective.lifecycle_state === "at_risk" || objective.lifecycle_state === "needs_attention") {
      risks.push(
        makeRisk(
          objective,
          "objective_at_risk",
          "high",
          "Objective needs attention",
          `Objective "${objective.display_name}" is in ${objective.lifecycle_state} state.`,
          [{ signal_id: "lifecycle", source: "objective_record", summary: objective.lifecycle_state }],
          0.92,
          ["Schedule a review with operational and executive owners."]
        )
      );
    }

    if (!objective.operational_owner_human_id) {
      risks.push(
        makeRisk(
          objective,
          "owner_missing",
          "high",
          "Operational owner not assigned",
          "Execution cannot be sustainably managed without an operational owner.",
          [{ signal_id: "owner", source: "objective_record", summary: "operational_owner missing" }],
          0.95,
          ["Assign an operational owner in Objective settings."]
        )
      );
    }

    const blockedMissions = bundle.missions.filter((m) => m.lifecycle_state === "paused").length;
    if (blockedMissions > 0) {
      risks.push(
        makeRisk(
          objective,
          "blocked_missions",
          "medium",
          `${blockedMissions} mission(s) paused or blocked`,
          "Paused missions may indicate dependency or capacity issues.",
          [{ signal_id: "missions_paused", source: "mission_records", summary: `${blockedMissions} paused` }],
          0.75,
          ["Review workstream board and unblock or reassign missions."]
        )
      );
    }

    const activeNoLead = bundle.missions.filter(
      (m) => m.lifecycle_state === "active" && !m.operational_lead_human_id
    ).length;
    if (activeNoLead > 0) {
      risks.push(
        makeRisk(
          objective,
          "mission_lead_missing",
          "medium",
          "Active missions without operational lead",
          `${activeNoLead} active mission(s) lack an assigned lead.`,
          [{ signal_id: "mission_lead", source: "mission_records", summary: `${activeNoLead} without lead` }],
          0.8,
          ["Assign mission leads through governed commands."]
        )
      );
    }

    const incompleteKr = bundle.key_results.filter(
      (kr) => (kr.current_value ?? 0) < (kr.target ?? 1) * 0.25 && objective.lifecycle_state === "active"
    ).length;
    if (incompleteKr === bundle.key_results.length && bundle.key_results.length > 0) {
      risks.push(
        makeRisk(
          objective,
          "weak_progress",
          "medium",
          "Key results show limited progress",
          "All key results remain below 25% of target while Objective is active.",
          [{ signal_id: "key_results", source: "key_result_records", summary: "low KR progress" }],
          0.7,
          ["Review measurement strategy and evidence collection."]
        )
      );
    }
  }

  return risks.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function severityRank(s: ExecutionRiskSignal["severity"]) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[s];
}

function makeRisk(
  objective: { canonical_id: string; initiative_id: string; display_name: string },
  riskType: string,
  severity: ExecutionRiskSignal["severity"],
  title: string,
  explanation: string,
  evidence: ExecutionRiskSignal["evidence"],
  score: number,
  recommended_actions: string[]
): ExecutionRiskSignal {
  return {
    risk_id: caeId("rsk"),
    risk_type: riskType,
    severity,
    title,
    explanation,
    objective_id: objective.canonical_id,
    initiative_id: objective.initiative_id,
    evidence,
    confidence: scoreToConfidence(score),
    recommended_actions,
  };
}

export function risksForObjective(objectiveId: string, institutionId: string) {
  return detectExecutionRisks(institutionId).filter((r) => r.objective_id === objectiveId);
}
